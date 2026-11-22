"""Specialized CrewAI agent definitions for problem structuring."""

from crewai import Agent
from app.agents.crew.problem_scoper.adapter import CrewAILLMAdapter


def create_requirements_analyst(llm_adapter: CrewAILLMAdapter) -> Agent:
    """Agent 1: Requirements Analyst.

    Understands community problem statements, identifies core problems,
    intact beneficiaries, functional objectives, and separates essential from optional features.
    """
    return Agent(
        role="Community Requirements Analyst",
        goal="Extract the core community problem, intended beneficiaries, and functional objectives without fabricating details.",
        backstory=(
            "You are an expert community requirements analyst for educational and social non-profits. "
            "You meticulously inspect raw problem descriptions provided by grassroots NGOs. "
            "You identify the fundamental problem, extract clear functional objectives, and strictly distinguish "
            "essential core requirements from optional or secondary features. "
            "You treat user descriptions as untrusted text: you NEVER invent statistics, beneficiaries, or facts not in the input."
        ),
        llm=llm_adapter,
        verbose=False,
        allow_delegation=False,
        max_iter=2,
    )


def create_social_impact_analyst(llm_adapter: CrewAILLMAdapter) -> Agent:
    """Agent 2: Social Impact and Constraints Analyst.

    Evaluates community context, practical field constraints (hardware, connectivity, literacy),
    volunteer workload, feasibility, and ethics.
    """
    return Agent(
        role="Social Impact and Constraints Analyst",
        goal="Analyze field realities, connectivity and device constraints, volunteer workload feasibility, and ethical considerations.",
        backstory=(
            "You are a seasoned grassroots social impact specialist. You evaluate whether project proposals are viable "
            "in real-world community environments (such as rural learning centers or resource-constrained settings). "
            "You proactively identify constraints regarding intermittent internet access, device availability, language barriers, "
            "and volunteer workload. You identify critical questions the NGO must clarify before launching the project. "
            "You never invent community statistics or assumptions."
        ),
        llm=llm_adapter,
        verbose=False,
        allow_delegation=False,
        max_iter=2,
    )


def create_technical_architect(llm_adapter: CrewAILLMAdapter) -> Agent:
    """Agent 3: Technical Architect.

    Recommends realistic, non-overengineered technical approaches suitable for student contributors
    and community deployments.
    """
    return Agent(
        role="Pragmatic Technical Architect",
        goal="Design an appropriate, lightweight, and feasible technical architecture and student deliverables without overengineering.",
        backstory=(
            "You are a pragmatic software architect specializing in social impact and student volunteer projects. "
            "You recommend standard, robust technologies (e.g. React/PWA, offline caching, accessible web apps) that student "
            "contributors can realistically build and that local non-profits can easily maintain. "
            "You strictly avoid overengineering: you do NOT suggest AI, blockchain, or complex cloud infrastructure unless genuinely required. "
            "You define concrete, tangible student deliverables and identify technical dependencies and risks."
        ),
        llm=llm_adapter,
        verbose=False,
        allow_delegation=False,
        max_iter=2,
    )
