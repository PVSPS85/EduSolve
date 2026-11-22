"""Internal v1 chat context summarization endpoint."""

from fastapi import APIRouter, Depends
from app.agents.single_turn.chat_summary import generate_chat_summary
from app.api.deps import verify_internal_auth
from app.core.llm import BaseLLMProvider, get_llm_provider
from app.schemas.chat import AiChatSummaryRequest, AiChatSummaryResponse
from app.schemas.common import ErrorEnvelope

router = APIRouter(tags=["AI Chat Summary"])


@router.post(
    "/chat-summary",
    response_model=AiChatSummaryResponse,
    dependencies=[Depends(verify_internal_auth)],
    responses={
        400: {"model": ErrorEnvelope, "description": "Invalid input payload"},
        401: {"model": ErrorEnvelope, "description": "Missing or invalid internal secret"},
        500: {"model": ErrorEnvelope, "description": "Internal server or configuration error"},
        502: {"model": ErrorEnvelope, "description": "Upstream LLM provider error"},
        504: {"model": ErrorEnvelope, "description": "Upstream LLM provider timeout"},
    },
    summary="Generate role-aware conversation context summary",
    description="Processes pre-authorized project and profile data to generate contextual advisory summaries.",
)
async def chat_summary_endpoint(
    request: AiChatSummaryRequest,
    llm_provider: BaseLLMProvider = Depends(get_llm_provider),
) -> AiChatSummaryResponse:
    """Analyze conversation and project context and return structured advisory intelligence."""
    return await generate_chat_summary(request, llm_provider)
