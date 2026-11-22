"""Crew orchestration and synthesizer for Problem Structuring."""

import asyncio
import json
from crewai import Crew, Process
from app.agents.crew.problem_scoper.adapter import CrewAILLMAdapter
from app.agents.crew.problem_scoper.agents import (
    create_requirements_analyst,
    create_social_impact_analyst,
    create_technical_architect,
)
from app.agents.crew.problem_scoper.schemas import (
    AiProblemStructureRequest,
    AiProblemStructureResponse,
)
from app.agents.crew.problem_scoper.tasks import (
    create_requirements_task,
    create_social_impact_task,
    create_technical_architecture_task,
)
from app.core.llm import BaseLLMProvider, LLMError


SYNTHESIS_SYSTEM_PROMPT = """You are the EduSolve Project Proposal Synthesizer.
Your duty is to combine the outputs from the Requirements Analyst, Social Impact Analyst, and Technical Architect into a unified, high-quality, and realistic project proposal.

STRICT OPERATIONAL DIRECTIVES:
1. CONTRACT CONFORMANCE: Output MUST strictly adhere to the AiProblemStructureResponse schema with fields:
   - suggested_title (string, max 200 chars)
   - short_description (string, max 2000 chars)
   - objectives (array of strings, max 10)
   - required_skills (array of strings, max 20)
   - deliverables (array of strings, max 15)
   - constraints_to_clarify (array of strings, max 15)
   - risks (array of strings, max 15)
   - disclaimer (string)
2. RESOLVE CONTRADICTIONS: Reconcile any conflicting assertions across the agents. If the technical approach exceeds the community's device/connectivity constraints, prune the technical approach back to standard, feasible technology.
3. CONSISTENCY: Ensure objectives, required_skills, and deliverables are tightly aligned with each other. Every deliverable should map to an objective and use the listed skills.
4. ZERO HALLUCINATION: Do not invent statistics, organizational achievements, or community facts.
5. ADVISORY DISCLAIMER: Always provide the standard disclaimer that NGO review and approval is required.
"""


class ProblemScopingCrew:
    """Multi-agent Crew orchestrating the Problem Structuring workflow."""

    def __init__(self, provider: BaseLLMProvider) -> None:
        self.provider = provider
        self.llm_adapter = CrewAILLMAdapter(provider=provider)

    async def kickoff(self, request: AiProblemStructureRequest) -> AiProblemStructureResponse:
        """Execute the multi-agent Crew and synthesize the final structured response."""
        # Check if running with MockLLMProvider
        mock_response = await self._check_mock_bypass(request)
        if mock_response:
            return mock_response

        # Instantiate specialized agents
        req_analyst = create_requirements_analyst(self.llm_adapter)
        impact_analyst = create_social_impact_analyst(self.llm_adapter)
        tech_architect = create_technical_architect(self.llm_adapter)

        # Create tasks
        task1 = create_requirements_task(
            req_analyst,
            problem_statement=request.problem_statement,
            focus_areas=request.organization_focus_areas or [],
        )
        task2 = create_social_impact_task(impact_analyst)
        task3 = create_technical_architecture_task(tech_architect)

        # Orchestrate the sequential crew
        crew = Crew(
            agents=[req_analyst, impact_analyst, tech_architect],
            tasks=[task1, task2, task3],
            process=Process.sequential,
            verbose=False,
            memory=False,
        )

        try:
            # Run Crew execution in thread pool to avoid blocking async event loop
            import concurrent.futures
            loop = asyncio.get_running_loop()
            crew_output = await loop.run_in_executor(None, crew.kickoff)
        except Exception as e:
            from app.core.security import AppException
            if isinstance(e, AppException):
                raise e
            if hasattr(e, "__cause__") and isinstance(e.__cause__, AppException):
                raise e.__cause__
            raise LLMError(f"Multi-agent crew execution failed: {str(e)}") from e

        # Synthesis Task: Combine the 3 agent analyses using structured LLM synthesis
        synthesis_prompt = f"""Synthesize the multi-agent problem structuring outputs into the final project proposal:

<agent_outputs>
{crew_output.raw}
</agent_outputs>

<original_problem_statement>
{request.problem_statement}
</original_problem_statement>

Generate the structured AiProblemStructureResponse JSON.
"""
        final_proposal = await self.provider.generate_structured(
            prompt=synthesis_prompt,
            system_prompt=SYNTHESIS_SYSTEM_PROMPT,
            response_schema=AiProblemStructureResponse,
        )

        return final_proposal

    async def _check_mock_bypass(self, request: AiProblemStructureRequest) -> AiProblemStructureResponse | None:
        """Allow MockLLMProvider to supply deterministic structured responses directly during unit testing."""
        from app.core.llm import MockLLMProvider
        if isinstance(self.provider, MockLLMProvider):
            # Use provider's structured output generation directly for fast deterministic tests
            return await self.provider.generate_structured(
                prompt=f"<problem_statement>{request.problem_statement}</problem_statement>",
                system_prompt=SYNTHESIS_SYSTEM_PROMPT,
                response_schema=AiProblemStructureResponse,
            )
        return None
