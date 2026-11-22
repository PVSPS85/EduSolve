"""Adapter connecting EduSolve BaseLLMProvider to CrewAI's LLM interface."""

import os
import asyncio
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

# Set environment defaults to ensure CrewAI runs headless and safely in sandbox
os.environ.setdefault("CREWAI_STORAGE_DIR", "/tmp/crewai_storage")
os.environ.setdefault("OTEL_SDK_DISABLED", "true")
os.environ.setdefault("CREWAI_DISABLE_TELEMETRY", "true")
os.environ.setdefault("CREWAI_TESTING", "true")

# Ensure secure storage directory exists in sandbox /tmp
try:
    from crewai.cli.shared.token_manager import TokenManager
    p = Path("/tmp/crewai_credentials")
    p.mkdir(parents=True, exist_ok=True)
    TokenManager.get_secure_storage_path = lambda self: p
except Exception:
    pass

# Ensure trace batch manager doesn't trigger remote exporter in sandboxed environment
try:
    from crewai.events.listeners.tracing import trace_listener
    class SafeTraceBatchManager:
        is_batch_initialized = True
        batch_owner_type = "crew"
        def add_event(self, *args, **kwargs): pass
        def flush(self): pass
        def initialize_batch(self, *args, **kwargs): pass
        def end_batch(self, *args, **kwargs): pass
    trace_listener.TraceBatchManager = SafeTraceBatchManager
except Exception:
    pass

from crewai.llm import LLM
from app.core.llm import BaseLLMProvider


class CrewAILLMAdapter(LLM):
    """Adapter class wrapping BaseLLMProvider to conform to CrewAI's LLM interface."""

    def __init__(self, provider: BaseLLMProvider, model_name: str = "custom") -> None:
        super().__init__(model=model_name)
        self.provider = provider

    def call(
        self,
        messages: Union[str, List[Dict[str, str]]],
        callbacks: Optional[Any] = None,
        **kwargs: Any,
    ) -> str:
        """Synchronous call invoked by CrewAI agents."""
        prompt = ""
        system_prompt = ""

        if isinstance(messages, str):
            prompt = messages
        elif isinstance(messages, list):
            user_parts = []
            for msg in messages:
                role = msg.get("role", "")
                content = msg.get("content", "")
                if role == "system":
                    system_prompt += content + "\n"
                else:
                    user_parts.append(f"{role.capitalize()}: {content}")
            prompt = "\n\n".join(user_parts)

        # Execute provider call using a thread pool executor to safely invoke async provider from sync call
        try:
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                return executor.submit(
                    asyncio.run,
                    self.provider.generate_text(prompt=prompt, system_prompt=system_prompt),
                ).result()
        except Exception as e:
            # Re-raise AppException types so FastAPI exception handlers catch them
            from app.core.security import AppException
            if isinstance(e, AppException):
                raise e
            if hasattr(e, "__cause__") and isinstance(e.__cause__, AppException):
                raise e.__cause__
            raise e
