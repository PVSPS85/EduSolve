"""Service orchestrating problem structuring workflows."""

from app.agents.crew.problem_scoper.crew import ProblemScopingCrew
from app.agents.crew.problem_scoper.schemas import (
    AiProblemStructureRequest,
    AiProblemStructureResponse,
)
from app.core.llm import BaseLLMProvider


class ProblemStructuringService:
    """Application service for managing problem structuring tasks."""

    def __init__(self, provider: BaseLLMProvider) -> None:
        self.provider = provider
        self.crew = ProblemScopingCrew(provider=provider)

    async def structure_problem(
        self,
        request: AiProblemStructureRequest,
    ) -> AiProblemStructureResponse:
        """Process an unstructured problem statement through the multi-agent crew."""
        return await self.crew.kickoff(request)
