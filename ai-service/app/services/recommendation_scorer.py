"""Deterministic Scoring Engine for Student-Project Compatibility."""

import re
from typing import Dict, List, Optional, Set, Tuple
from uuid import UUID

from app.schemas.recommendations import (
    RecommendationCandidateProject,
    RecommendationStudentProfile,
)

# Controlled skill alias mapping (normalized lowercase to canonical form)
CONTROLLED_ALIASES: Dict[str, str] = {
    "js": "javascript",
    "javascript": "javascript",
    "ts": "typescript",
    "typescript": "typescript",
    "py": "python",
    "python": "python",
    "react": "react",
    "reactjs": "react",
    "react.js": "react",
    "node": "nodejs",
    "nodejs": "nodejs",
    "node.js": "nodejs",
    "next": "nextjs",
    "nextjs": "nextjs",
    "next.js": "nextjs",
    "vue": "vuejs",
    "vuejs": "vuejs",
    "vue.js": "vuejs",
    "pwa": "progressive web app",
    "progressive web app": "progressive web app",
    "progressive web apps": "progressive web app",
    "html": "html",
    "html5": "html",
    "css": "css",
    "css3": "css",
    "tailwind": "tailwindcss",
    "tailwindcss": "tailwindcss",
    "tailwind css": "tailwindcss",
    "postgres": "postgresql",
    "postgresql": "postgresql",
    "mongo": "mongodb",
    "mongodb": "mongodb",
    "indexeddb": "indexeddb",
    "docker": "docker",
    "git": "git",
    "github": "github",
    "rest": "rest api",
    "rest api": "rest api",
    "restful api": "rest api",
    "graphql": "graphql",
    "ml": "machine learning",
    "machine learning": "machine learning",
    "ai": "artificial intelligence",
    "artificial intelligence": "artificial intelligence",
    "java": "java",  # Explicitly distinct from javascript
}


def normalize_skill(skill: str) -> str:
    """Normalize a skill name with lowercase, stripped punctuation, and alias resolution."""
    if not skill:
        return ""
    # Strip whitespace, lowercase, remove leading/trailing special chars
    cleaned = skill.strip().lower()
    # Normalize common punct (e.g. react.js -> reactjs, c++ -> c++)
    cleaned = re.sub(r"\s+", " ", cleaned)
    # Check alias dictionary
    return CONTROLLED_ALIASES.get(cleaned, cleaned)


class ScoredProject:
    """Intermediate scoring container for a candidate project."""

    def __init__(
        self,
        project: RecommendationCandidateProject,
        match_score: float,
        skill_score: float,
        evidence_score: float,
        interest_score: float,
        availability_score: float,
        work_mode_score: float,
        matching_skills: List[str],
        missing_skills: List[str],
        evidence_ratio: float,
        availability_headroom: float,
    ) -> None:
        self.project = project
        self.match_score = match_score
        self.skill_score = skill_score
        self.evidence_score = evidence_score
        self.interest_score = interest_score
        self.availability_score = availability_score
        self.work_mode_score = work_mode_score
        self.matching_skills = matching_skills
        self.missing_skills = missing_skills
        self.evidence_ratio = evidence_ratio
        self.availability_headroom = availability_headroom


class RecommendationScorer:
    """Pure deterministic scoring engine without LLM dependencies."""

    WEIGHT_SKILLS = 0.40
    WEIGHT_EVIDENCE = 0.20
    WEIGHT_INTEREST = 0.15
    WEIGHT_AVAILABILITY = 0.15
    WEIGHT_WORK_MODE = 0.10

    def __init__(self, student: RecommendationStudentProfile) -> None:
        self.student = student
        self._build_student_indices()

    def _build_student_indices(self) -> None:
        """Index student skills, evidence sources, and portfolio technologies."""
        self.student_skill_map: Dict[str, str] = {}  # norm_skill -> evidence_source
        self.student_portfolio_set: Set[str] = set()

        for s in self.student.skills:
            norm = normalize_skill(s.skill_name)
            if norm:
                # Retain the highest quality evidence source if duplicate
                source = s.evidence_source or "self_reported"
                existing = self.student_skill_map.get(norm)
                if not existing or (source != "self_reported" and existing == "self_reported"):
                    self.student_skill_map[norm] = source

        for tech in self.student.portfolio_technologies:
            norm = normalize_skill(tech)
            if norm:
                self.student_portfolio_set.add(norm)
                # If technology is in portfolio, ensure it has at least portfolio_item evidence
                if norm not in self.student_skill_map or self.student_skill_map[norm] == "self_reported":
                    self.student_skill_map[norm] = "portfolio_item"

        self.student_interests_norm: Set[str] = {
            s.strip().lower() for s in self.student.interests if s and s.strip()
        }

    def calculate_skill_and_evidence(
        self,
        required_skills: List[str],
    ) -> Tuple[float, float, List[str], List[str], float]:
        """Compute skill compatibility (40%) and evidence quality (20%)."""
        if not required_skills:
            return 1.0, 0.0, [], [], 0.0

        matching: List[str] = []
        missing: List[str] = []
        demonstrated_count = 0

        for req in required_skills:
            norm_req = normalize_skill(req)
            if not norm_req:
                continue

            if norm_req in self.student_skill_map or norm_req in self.student_portfolio_set:
                matching.append(req)
                source = self.student_skill_map.get(norm_req, "portfolio_item")
                if source in ("portfolio_item", "experience", "certification"):
                    demonstrated_count += 1
            else:
                missing.append(req)

        total_req = len(required_skills)
        skill_score = len(matching) / total_req if total_req > 0 else 1.0
        # If no skills match, evidence score must be 0.0
        evidence_ratio = demonstrated_count / len(matching) if matching else 0.0
        evidence_score = evidence_ratio  # Quality of matched skills only (0.0 when no skills match)

        return skill_score, evidence_score, matching, missing, evidence_ratio

    def calculate_interest_alignment(
        self,
        category: str,
        title: str,
    ) -> float:
        """Compute interest alignment score (15%).
        - Empty interests: 0.5 (neutral, no penalty).
        - One or more matches against project category or title keywords: 1.0.
        - Supplied interests without a match: 0.2.
        """
        if not self.student_interests_norm:
            return 0.5

        # Check for overlap against project category or title keywords deterministically
        target_corpus = f"{category} {title}".lower()
        has_match = any(interest in target_corpus for interest in self.student_interests_norm)

        return 1.0 if has_match else 0.2

    def calculate_availability_compatibility(
        self,
        required_hours: Optional[float],
    ) -> Tuple[float, float]:
        """Compute availability compatibility (15%) and headroom.
        - Positive commitment and known availability: min(1.0, max(0.0, available/required)).
        - Missing student availability: 0.7 neutral.
        - Null or zero project commitment: 1.0.
        """
        if required_hours is None or required_hours <= 0:
            headroom = self.student.weekly_availability_hours if self.student.weekly_availability_hours is not None else 0.0
            return 1.0, headroom

        if self.student.weekly_availability_hours is None:
            # Missing student availability gets neutral 0.7 score
            return 0.7, 0.0

        avail = self.student.weekly_availability_hours
        ratio = avail / required_hours
        score = min(1.0, max(0.0, ratio))
        headroom = avail - required_hours
        return score, headroom

    def calculate_work_mode_compatibility(
        self,
        project_work_mode: Optional[str],
    ) -> float:
        """Compute work-mode compatibility score (10%).
        - Exact match: 1.0.
        - Either side hybrid: 0.7.
        - Either side missing: 0.7.
        - Remote versus onsite: 0.0.
        """
        student_mode = self.student.preferred_work_mode

        if not student_mode or not project_work_mode:
            return 0.7

        student_mode_str = student_mode.strip().lower()
        project_mode_str = project_work_mode.strip().lower()

        if student_mode_str == project_mode_str:
            return 1.0
        if student_mode_str == "hybrid" or project_mode_str == "hybrid":
            return 0.7

        # Remote vs onsite
        return 0.0

    def score_project(self, project: RecommendationCandidateProject) -> ScoredProject:
        """Evaluate a single candidate project and compute normalized total score."""
        skill_score, evidence_score, matching, missing, evidence_ratio = (
            self.calculate_skill_and_evidence(project.required_skills)
        )
        interest_score = self.calculate_interest_alignment(
            project.category, project.title
        )
        avail_score, headroom = self.calculate_availability_compatibility(
            project.weekly_commitment_hours
        )
        work_mode_score = self.calculate_work_mode_compatibility(project.work_mode)

        # Total normalized score
        total_score = (
            self.WEIGHT_SKILLS * skill_score
            + self.WEIGHT_EVIDENCE * evidence_score
            + self.WEIGHT_INTEREST * interest_score
            + self.WEIGHT_AVAILABILITY * avail_score
            + self.WEIGHT_WORK_MODE * work_mode_score
        )
        total_score = round(min(1.0, max(0.0, total_score)), 4)

        return ScoredProject(
            project=project,
            match_score=total_score,
            skill_score=skill_score,
            evidence_score=evidence_score,
            interest_score=interest_score,
            availability_score=avail_score,
            work_mode_score=work_mode_score,
            matching_skills=matching,
            missing_skills=missing,
            evidence_ratio=evidence_ratio,
            availability_headroom=headroom,
        )

    def rank_projects(
        self,
        candidate_projects: List[RecommendationCandidateProject],
        limit: int = 10,
    ) -> List[ScoredProject]:
        """Score and deterministically rank projects with contract-mandated tie-breaking:
        1. Composite match_score (descending)
        2. Evidence ratio (descending)
        3. Availability headroom (descending)
        4. Project title alphabetical (ascending)
        5. Project UUID (ascending)
        """
        scored = [self.score_project(p) for p in candidate_projects]

        scored.sort(
            key=lambda sp: (
                -sp.match_score,
                -sp.evidence_ratio,
                -sp.availability_headroom,
                sp.project.title.lower(),
                str(sp.project.id),
            )
        )

        return scored[:limit]
