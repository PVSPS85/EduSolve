"""Schemas for CrewAI Problem Structuring."""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class AiProblemStructureRequest(BaseModel):
    """Request payload for multi-agent problem structuring."""

    model_config = ConfigDict(extra="forbid")

    problem_statement: str = Field(
        ...,
        min_length=20,
        max_length=10000,
        description="Unstructured community problem statement provided by the NGO",
    )
    organization_focus_areas: Optional[List[str]] = Field(
        default_factory=list,
        description="Optional core impact domains of the NGO",
    )


class RequirementsAnalysis(BaseModel):
    """Output from Agent 1: Requirements Analyst."""

    core_problem: str = Field(..., description="The fundamental community problem identified")
    target_beneficiaries: Optional[str] = Field(None, description="Intended beneficiaries identified only if described")
    functional_objectives: List[str] = Field(..., description="Specific functional goals extracted from the statement")
    essential_requirements: List[str] = Field(..., description="Must-have functional components")
    optional_features: List[str] = Field(default_factory=list, description="Nice-to-have or future additions")
    missing_requirements: List[str] = Field(default_factory=list, description="Ambiguous or unstated requirements")


class SocialImpactAnalysis(BaseModel):
    """Output from Agent 2: Social Impact and Constraints Analyst."""

    community_context: str = Field(..., description="Social and local setting analysis")
    practical_constraints: List[str] = Field(..., description="Device access, internet connectivity, local realities")
    volunteer_workload_and_feasibility: str = Field(..., description="Realistic scope for student volunteers")
    ethical_and_accessibility_concerns: List[str] = Field(..., description="Accessibility, privacy, language, or ethical risks")
    questions_for_ngo: List[str] = Field(..., description="Clarification questions the NGO must answer")


class TechnicalArchitecture(BaseModel):
    """Output from Agent 3: Technical Architect."""

    technical_approach: str = Field(..., description="Pragmatic architecture without overengineering")
    recommended_skills: List[str] = Field(..., description="Justified technologies suitable for students")
    student_deliverables: List[str] = Field(..., description="Concrete tangible student deliverables")
    technical_dependencies_and_risks: List[str] = Field(..., description="Technical bottlenecks, offline sync, or deployment risks")


class AiProblemStructureResponse(BaseModel):
    """Final proposal synthesized from all agents."""

    model_config = ConfigDict(extra="forbid")

    suggested_title: str = Field(
        ...,
        max_length=200,
        description="Concise, professional project title",
    )
    short_description: str = Field(
        ...,
        max_length=2000,
        description="Refined 2-3 sentence overview of the project scope",
    )
    objectives: List[str] = Field(
        ...,
        max_length=10,
        description="Specific functional outcomes and goals",
    )
    required_skills: List[str] = Field(
        ...,
        max_length=20,
        description="Realistic skills and technologies suitable for student contributors",
    )
    deliverables: List[str] = Field(
        ...,
        max_length=15,
        description="Concrete student deliverables (code, docs, training materials)",
    )
    constraints_to_clarify: List[str] = Field(
        ...,
        max_length=15,
        description="Practical community and field constraints the NGO must clarify",
    )
    risks: List[str] = Field(
        ...,
        max_length=15,
        description="Feasibility, technical, social, or workload risks",
    )
    disclaimer: str = Field(
        default="AI assistance is an advisory draft. NGO representatives must review and approve all objectives, deliverables, and skill requirements before publishing the project.",
        description="Standard advisory disclaimer emphasizing human-in-the-loop NGO review and approval",
    )
