"""Problem structuring internal endpoints."""

from fastapi import APIRouter, Depends
from app.agents.crew.problem_scoper.schemas import (
    AiProblemStructureRequest,
    AiProblemStructureResponse,
)
from app.api.deps import verify_internal_auth
from app.core.llm import BaseLLMProvider, get_llm_provider
from app.services.problem_structuring import ProblemStructuringService

router = APIRouter(
    dependencies=[Depends(verify_internal_auth)],
    tags=["Problem Structuring"],
)


@router.post(
    "/problem-structure",
    response_model=AiProblemStructureResponse,
    summary="Multi-Agent Problem Structuring for NGOs",
    description=(
        "Internal service-to-service endpoint called by Supabase Edge Functions. "
        "Orchestrates a CrewAI multi-agent crew (Requirements Analyst, Social Impact Analyst, "
        "Technical Architect, and Proposal Synthesizer) to structure raw community problems into "
        "concrete project proposals. Output is strictly advisory and requires NGO approval."
    ),
)
async def structure_problem(
    request: AiProblemStructureRequest,
    llm_provider: BaseLLMProvider = Depends(get_llm_provider),
) -> AiProblemStructureResponse:
    """Structure unstructured problem statement into concrete proposal."""
    service = ProblemStructuringService(provider=llm_provider)
    return await service.structure_problem(request)
