"""Profile intelligence endpoints for internal service consumption."""

from fastapi import APIRouter, Depends
from app.agents.single_turn.profile_summary import (
    generate_ngo_profile_summary,
    generate_student_profile_summary,
)
from app.api.deps import verify_internal_auth
from app.core.llm import BaseLLMProvider, get_llm_provider
from app.schemas.profiles import (
    AiNgoProfileSummaryRequest,
    AiNgoProfileSummaryResponse,
    AiStudentProfileSummaryRequest,
    AiStudentProfileSummaryResponse,
)

router = APIRouter(
    dependencies=[Depends(verify_internal_auth)],
    tags=["Profile Intelligence"],
)


@router.post(
    "/summarize-student-profile",
    response_model=AiStudentProfileSummaryResponse,
    summary="Generate Student Profile Intelligence Summary",
    description="Internal endpoint called by Supabase Edge Function to analyze a student's public profile against target project requirements.",
)
async def summarize_student_profile(
    request: AiStudentProfileSummaryRequest,
    llm_provider: BaseLLMProvider = Depends(get_llm_provider),
) -> AiStudentProfileSummaryResponse:
    """Generate structured analytical summary of a student profile."""
    return await generate_student_profile_summary(request, llm_provider)


@router.post(
    "/summarize-ngo-profile",
    response_model=AiNgoProfileSummaryResponse,
    summary="Generate NGO Profile Intelligence Summary",
    description="Internal endpoint called by Supabase Edge Function to analyze an NGO profile and mission alignment for student volunteers.",
)
async def summarize_ngo_profile(
    request: AiNgoProfileSummaryRequest,
    llm_provider: BaseLLMProvider = Depends(get_llm_provider),
) -> AiNgoProfileSummaryResponse:
    """Generate structured analytical summary of an NGO profile."""
    return await generate_ngo_profile_summary(request, llm_provider)
