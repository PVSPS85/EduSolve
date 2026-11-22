"""Pydantic schemas package."""

from app.schemas.chat import (
    AiChatSummaryRequest,
    AiChatSummaryResponse,
    ChatMessage,
    OtherPartyProfile,
    ProjectContext,
    ViewerRole,
)
from app.schemas.common import ErrorDetail, ErrorEnvelope, HealthResponse, PingResponse
from app.schemas.profiles import (
    AiNgoProfileSummaryRequest,
    AiNgoProfileSummaryResponse,
    AiStudentProfileSummaryRequest,
    AiStudentProfileSummaryResponse,
    OrganizationProfileData,
    PastProjectItem,
    StudentCertificationItem,
    StudentExperienceItem,
    StudentPortfolioItem,
    StudentProfileData,
    StudentSkillItem,
    TargetProjectRequirements,
)

__all__ = [
    "ErrorDetail",
    "ErrorEnvelope",
    "HealthResponse",
    "PingResponse",
    "ViewerRole",
    "ChatMessage",
    "ProjectContext",
    "OtherPartyProfile",
    "AiChatSummaryRequest",
    "AiChatSummaryResponse",
    "StudentSkillItem",
    "StudentPortfolioItem",
    "StudentExperienceItem",
    "StudentCertificationItem",
    "TargetProjectRequirements",
    "StudentProfileData",
    "AiStudentProfileSummaryRequest",
    "AiStudentProfileSummaryResponse",
    "PastProjectItem",
    "OrganizationProfileData",
    "AiNgoProfileSummaryRequest",
    "AiNgoProfileSummaryResponse",
]
