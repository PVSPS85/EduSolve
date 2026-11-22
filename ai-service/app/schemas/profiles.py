"""Schemas for Student and NGO Profile Intelligence."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class StudentSkillItem(BaseModel):
    """Self-reported skill with optional proficiency."""

    model_config = ConfigDict(extra="ignore")

    skill_name: str = Field(..., max_length=80, description="Name of the skill or technology")
    proficiency: Optional[str] = Field(
        None,
        description="Self-reported proficiency: beginner, intermediate, advanced, expert",
    )


class StudentPortfolioItem(BaseModel):
    """Portfolio project item."""

    model_config = ConfigDict(extra="ignore")

    title: str = Field(..., max_length=160, description="Project title")
    description: Optional[str] = Field(None, max_length=2000, description="Project overview")
    url: str = Field(..., description="Project repository, demo or documentation URL")
    technologies: List[str] = Field(default_factory=list, description="Technologies used in project")


class StudentExperienceItem(BaseModel):
    """Past work or volunteer experience."""

    model_config = ConfigDict(extra="ignore")

    organization_or_project: str = Field(..., description="Organization or project name")
    role_title: str = Field(..., description="Role title")
    description: Optional[str] = Field(None, description="Role responsibilities and achievements")
    is_current: bool = Field(default=False, description="Whether this is an ongoing role")


class StudentCertificationItem(BaseModel):
    """Documented certification."""

    model_config = ConfigDict(extra="ignore")

    title: str = Field(..., description="Certification title")
    issuer: Optional[str] = Field(None, description="Certifying authority or issuer")
    credential_url: Optional[str] = Field(None, description="Public credential validation URL")


class TargetProjectRequirements(BaseModel):
    """Optional target project requirements to evaluate student suitability."""

    model_config = ConfigDict(extra="ignore")

    title: str = Field(..., description="Project title")
    required_skills: List[str] = Field(default_factory=list, description="Target required skills")
    deliverables: List[str] = Field(default_factory=list, description="Target expected deliverables")


class StudentProfileData(BaseModel):
    """Pre-authorized student profile data."""

    model_config = ConfigDict(extra="allow")

    display_name: str = Field(..., min_length=1, max_length=200, description="Student public display name")
    bio: Optional[str] = Field(None, max_length=1200, description="Student biography")
    institution_name: Optional[str] = Field(None, max_length=200, description="Educational institution")
    degree: Optional[str] = Field(None, max_length=120, description="Degree or course of study")
    study_year: Optional[int] = Field(None, ge=1, le=12, description="Year of study")
    availability: Optional[str] = Field(None, description="available, limited, unavailable")
    availability_hours_per_week: Optional[int] = Field(None, ge=0, le=80, description="Weekly hours available")
    preferred_work_mode: Optional[str] = Field(None, description="remote, onsite, hybrid")
    city: Optional[str] = Field(None, description="City")
    country: Optional[str] = Field("India", description="Country")
    github_url: Optional[str] = Field(None, description="GitHub profile URL")
    portfolio_url: Optional[str] = Field(None, description="Portfolio website URL")
    skills: List[StudentSkillItem] = Field(default_factory=list, description="Self-reported skills")
    portfolio_items: List[StudentPortfolioItem] = Field(default_factory=list, description="Portfolio items")
    experiences: List[StudentExperienceItem] = Field(default_factory=list, description="Experience records")
    certifications: List[StudentCertificationItem] = Field(default_factory=list, description="Certifications")


class AiStudentProfileSummaryRequest(BaseModel):
    """Request payload for student profile intelligence."""

    model_config = ConfigDict(extra="allow")

    profile: StudentProfileData = Field(..., description="Pre-authorized student profile data")
    target_project_requirements: Optional[TargetProjectRequirements] = Field(
        None,
        description="Optional project requirements to evaluate alignment against",
    )


class AiStudentProfileSummaryResponse(BaseModel):
    """Structured response for student profile intelligence."""

    model_config = ConfigDict(extra="forbid")

    profile_summary: str = Field(..., max_length=5000, description="Concise objective profile summary")
    key_skills: List[str] = Field(..., max_length=20, description="Key technical and practical skills")
    portfolio_evidence: List[str] = Field(..., max_length=15, description="Documented portfolio evidence")
    relevant_strengths: List[str] = Field(..., max_length=15, description="Identified strengths")
    missing_information: List[str] = Field(..., max_length=15, description="Missing or unverified details")
    suggested_questions: List[str] = Field(..., max_length=15, description="Follow-up interview/clarification questions")
    disclaimer: str = Field(
        default="AI assistance is an advisory summary. Please verify all key requirements and qualifications directly with the student.",
        description="Standard advisory disclaimer",
    )


class PastProjectItem(BaseModel):
    """Summary of a past NGO project."""

    model_config = ConfigDict(extra="ignore")

    title: str = Field(..., description="Project title")
    category: Optional[str] = Field(None, description="Project category")
    status: str = Field(..., description="Project status")


class OrganizationProfileData(BaseModel):
    """Pre-authorized NGO organization profile data."""

    model_config = ConfigDict(extra="allow")

    display_name: str = Field(..., min_length=2, max_length=200, description="Organization display name")
    description: Optional[str] = Field(None, max_length=4000, description="Organization description")
    mission: Optional[str] = Field(None, max_length=2000, description="Organization mission statement")
    focus_areas: List[str] = Field(default_factory=list, description="Core impact domains")
    city: Optional[str] = Field(None, description="City")
    region: Optional[str] = Field(None, description="State / Region")
    country: Optional[str] = Field("India", description="Country")
    website_url: Optional[str] = Field(None, description="Website URL")
    public_contact_email: Optional[str] = Field(None, description="Public contact email")
    verification_status: str = Field(
        ...,
        description="Backend-provided immutable verification status",
    )
    past_projects_summary: List[PastProjectItem] = Field(default_factory=list, description="Past project items")


class AiNgoProfileSummaryRequest(BaseModel):
    """Request payload for NGO profile intelligence."""

    model_config = ConfigDict(extra="allow")

    organization: OrganizationProfileData = Field(..., description="Pre-authorized organization data")
    student_interests: Optional[List[str]] = Field(
        None,
        description="Optional student interests to evaluate alignment against",
    )


class AiNgoProfileSummaryResponse(BaseModel):
    """Structured response for NGO profile intelligence."""

    model_config = ConfigDict(extra="forbid")

    organization_summary: str = Field(..., max_length=5000, description="Concise organization summary")
    mission_and_focus: List[str] = Field(..., max_length=10, description="Mission and key focus domains")
    verification_analysis: str = Field(..., description="Objective analysis of backend-supplied verification status")
    relevant_evidence: List[str] = Field(..., max_length=15, description="Factual evidence documented in profile")
    alignment_analysis: List[str] = Field(..., max_length=15, description="Alignment with student interests or general social impact")
    missing_information: List[str] = Field(..., max_length=15, description="Omitted or unverified organizational details")
    suggested_questions: List[str] = Field(..., max_length=15, description="Recommended clarification questions for student volunteers")
    disclaimer: str = Field(
        default="AI assistance is an advisory summary. Verification status is supplied by platform records. Verify all details directly with the organization.",
        description="Standard advisory disclaimer",
    )
