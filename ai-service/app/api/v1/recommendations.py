"""Recommendation internal API endpoint."""

from fastapi import APIRouter, Depends
from app.api.deps import verify_internal_auth
from app.core.llm import BaseLLMProvider, get_llm_provider
from app.schemas.recommendations import (
    AiProjectRecommendationsRequest,
    AiProjectRecommendationsResponse,
)
from app.services.recommendation_service import RecommendationService

router = APIRouter(
    dependencies=[Depends(verify_internal_auth)],
    tags=["Project Recommendations"],
)


@router.post(
    "/project-recommendations",
    response_model=AiProjectRecommendationsResponse,
    summary="Generate Ranked Project Recommendations for Students",
    description=(
        "Internal service-to-service endpoint called by Supabase Edge Functions. "
        "Evaluates pre-filtered candidate projects using deterministic multi-criteria scoring "
        "(skills 40%, evidence 20%, interests 15%, availability 15%, work-mode 10%) and "
        "enriches recommendations with evidence-grounded LLM explanations. Gracefully falls back "
        "to deterministic template explanations upon upstream LLM failure."
    ),
)
async def get_project_recommendations(
    request: AiProjectRecommendationsRequest,
    llm_provider: BaseLLMProvider = Depends(get_llm_provider),
) -> AiProjectRecommendationsResponse:
    """Evaluate and rank candidate projects for a student."""
    service = RecommendationService(provider=llm_provider)
    return await service.get_recommendations(request)
