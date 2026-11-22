"""Pydantic schemas for Project Recommendations."""

from typing import List, Literal, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class RecommendationStudentSkill(BaseModel):
    """Student skill with optional proficiency and evidence source."""

    model_config = ConfigDict(extra="ignore")

    skill_name: str = Field(..., max_length=80, description="Name of the skill or technology")
    proficiency: Optional[Literal["beginner", "intermediate", "advanced", "expert"]] = Field(
        None,
        description="Self-reported proficiency level",
    )
    evidence_source: Optional[Literal["self_reported", "portfolio_item", "experience", "certification"]] = Field(
        "self_reported",
        description="Source documenting the skill. Distinguishes claims from documented evidence.",
    )


class RecommendationStudentProfile(BaseModel):
    """Pre-authorized student profile data supplied by the Edge Function."""

    model_config = ConfigDict(extra="ignore")

    skills: List[RecommendationStudentSkill] = Field(
        default_factory=list,
        description="List of student skills",
    )
    portfolio_technologies: List[str] = Field(
        default_factory=list,
        description="Technologies demonstrated through concrete portfolio project repositories",
    )
    interests: List[str] = Field(
        default_factory=list,
        description="Explicitly supplied student interests only. Never inferred. Defaults to empty list.",
    )
    weekly_availability_hours: Optional[float] = Field(
        None,
        ge=0.0,
        le=80.0,
        description="Authorized weekly commitment hours",
    )
    preferred_work_mode: Optional[Literal["remote", "onsite", "hybrid"]] = Field(
        None,
        description="Student's preferred work mode",
    )
    study_year: Optional[int] = Field(
        None,
        ge=1,
        le=12,
        description="Student year of study",
    )


class RecommendationCandidateProject(BaseModel):
    """Pre-filtered published project passed by the Edge Function."""

    model_config = ConfigDict(extra="ignore")

    id: UUID = Field(..., description="Project unique identifier")
    title: str = Field(..., max_length=180, description="Project title")
    category: str = Field(..., max_length=80, description="Project category / domain")
    short_description: str = Field(..., max_length=500, description="Short project overview")
    required_skills: List[str] = Field(
        default_factory=list,
        description="Required technical or practical skills",
    )
    weekly_commitment_hours: Optional[float] = Field(
        None,
        ge=0.0,
        le=80.0,
        description="Required weekly hours commitment",
    )
    work_mode: Optional[Literal["remote", "onsite", "hybrid"]] = Field(
        None,
        description="Project work mode",
    )
    duration_weeks: Optional[int] = Field(
        None,
        ge=1,
        le=104,
        description="Project duration in weeks",
    )
    constraints: Optional[str] = Field(
        None,
        max_length=5000,
        description="Project constraints or ground realities",
    )


class AiProjectRecommendationsRequest(BaseModel):
    """Request payload for internal project recommendations."""

    model_config = ConfigDict(extra="forbid")

    student: RecommendationStudentProfile = Field(
        ...,
        description="Pre-authorized student profile data",
    )
    candidate_projects: List[RecommendationCandidateProject] = Field(
        ...,
        description="List of published candidate projects to score and rank",
    )
    limit: int = Field(
        default=10,
        ge=1,
        le=20,
        description="Maximum number of recommendations to return",
    )


class ProjectRecommendationItem(BaseModel):
    """Ranked project recommendation item."""

    model_config = ConfigDict(extra="forbid")

    project_id: UUID = Field(..., description="Project unique identifier")
    match_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Deterministic compatibility score (0.0 to 1.0) owned by scorer",
    )
    match_explanation: str = Field(
        ...,
        max_length=1000,
        description="Clear, evidence-grounded explanation for why this project was recommended",
    )
    matching_skills: List[str] = Field(
        ...,
        description="Required project skills matching student skills or portfolio",
    )
    missing_skills: List[str] = Field(
        ...,
        description="Required project skills not present in student profile",
    )
    suitability_reasoning: str = Field(
        ...,
        max_length=1000,
        description="Analysis of availability, work-mode, and domain interest fit",
    )
    limitations_or_concerns: List[str] = Field(
        ...,
        description="Specific cautions, missing prerequisites, or workload concerns",
    )


class AiProjectRecommendationsResponse(BaseModel):
    """Structured response for internal project recommendations."""

    model_config = ConfigDict(extra="forbid")

    recommendations: List[ProjectRecommendationItem] = Field(
        ...,
        description="Ranked list of project recommendations in descending match_score order",
    )
    evaluated_projects_count: int = Field(
        ...,
        ge=0,
        description="Total number of candidate projects evaluated",
    )
    is_fallback: bool = Field(
        default=False,
        description="Indicates whether template-based explanations were used due to LLM provider timeout/failure",
    )
    disclaimer: str = Field(
        default="AI recommendations are advisory suggestions to assist students in discovering opportunities. Students must verify prerequisites and NGOs must independently review applications.",
        description="Standard advisory disclaimer",
    )
