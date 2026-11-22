"""Schemas for AI chat context summarization."""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ViewerRole(str, Enum):
    """Role of the user viewing the conversation."""

    NGO_REPRESENTATIVE = "ngo_representative"
    STUDENT = "student"


class ChatMessage(BaseModel):
    """An individual message in the conversation history."""

    model_config = ConfigDict(extra="ignore")

    sender_role: str = Field(
        ...,
        description="Role of the message sender: 'student', 'ngo_representative', or 'system'",
        examples=["student", "ngo_representative"],
    )
    body: Optional[str] = Field(
        default="",
        description="Message content",
        max_length=10000,
    )
    sent_at: Optional[str] = Field(
        default=None,
        description="ISO 8601 timestamp string",
    )


class ProjectContext(BaseModel):
    """Authorized project details provided by Supabase Edge Function."""

    model_config = ConfigDict(extra="allow")

    id: Optional[str] = Field(None, description="Project UUID")
    title: str = Field(..., description="Project title", min_length=2, max_length=200)
    problem_statement: str = Field(..., description="Core problem statement")
    category: Optional[str] = Field(None, description="Project category / domain")
    short_description: Optional[str] = Field(None, description="Brief project overview")
    required_skills: List[str] = Field(
        default_factory=list,
        description="Key technologies and skills required for the project",
        max_length=30,
    )
    expected_deliverables: List[str] = Field(
        default_factory=list,
        description="Concrete outputs expected from the collaboration",
        max_length=30,
    )
    weekly_commitment_hours: Optional[float] = Field(
        None,
        description="Expected weekly hours required",
        ge=0,
        le=80,
    )
    duration_weeks: Optional[int] = Field(
        None,
        description="Estimated duration in weeks",
        ge=1,
        le=104,
    )
    work_mode: Optional[str] = Field(
        None,
        description="remote, onsite, or hybrid",
    )
    constraints: Optional[str] = Field(
        None,
        description="Project constraints or technical limitations",
    )


class OtherPartyProfile(BaseModel):
    """Authorized profile details of the other conversation participant."""

    model_config = ConfigDict(extra="allow")

    display_name: str = Field(..., description="Public display name", min_length=1, max_length=200)
    bio: Optional[str] = Field(None, description="User bio or summary")

    # Student specific fields
    skills: List[str] = Field(
        default_factory=list,
        description="Skills listed on student profile",
        max_length=50,
    )
    institution_name: Optional[str] = Field(None, description="College or university")
    degree: Optional[str] = Field(None, description="Degree or program of study")
    study_year: Optional[int] = Field(None, description="Current year of study")
    portfolio_items: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Student portfolio highlights",
        max_length=20,
    )

    # NGO specific fields
    organization_name: Optional[str] = Field(None, description="Registered organization name")
    mission: Optional[str] = Field(None, description="Organization mission statement")
    focus_areas: List[str] = Field(
        default_factory=list,
        description="NGO focus domains (e.g. Education, Health)",
        max_length=20,
    )
    verification_status: Optional[str] = Field(
        None,
        description="Verification state of the organization",
    )


class AiChatSummaryRequest(BaseModel):
    """Request payload from Edge Function for chat context summarization."""

    model_config = ConfigDict(extra="allow")

    viewer_role: ViewerRole = Field(
        ...,
        description="Role of the authenticated caller requesting the summary",
    )
    project: ProjectContext = Field(
        ...,
        description="Authorized project context",
    )
    other_party_profile: OtherPartyProfile = Field(
        ...,
        description="Authorized profile data for the other conversation member",
    )
    recent_messages: List[ChatMessage] = Field(
        default_factory=list,
        description="Authorized recent messages exchanged in this conversation",
        max_length=50,
    )
    question: Optional[str] = Field(
        default=None,
        description="Optional viewer question to address in the summary",
        max_length=1000,
    )


class AiChatSummaryResponse(BaseModel):
    """Response payload adhering strictly to Tech/openapi.yaml AiChatSummaryResponse."""

    model_config = ConfigDict(extra="forbid")

    summary: str = Field(
        ...,
        description="Context-aware synthesis of conversation and alignment",
        max_length=5000,
    )
    relevant_evidence: List[str] = Field(
        ...,
        description="Concrete factual evidence extracted from supplied data",
        max_length=15,
    )
    missing_information: List[str] = Field(
        ...,
        description="Critical gaps, unverified claims, or missing commitments",
        max_length=15,
    )
    suggested_questions: List[str] = Field(
        ...,
        description="Recommended follow-up questions for the viewer to ask",
        max_length=15,
    )
    disclaimer: str = Field(
        default="AI assistance is an advisory summary. Please verify all key requirements and qualifications directly with the other party.",
        description="Required advisory disclaimer",
    )
