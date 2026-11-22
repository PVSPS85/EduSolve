"""LLM provider abstraction and structured inference client."""

import json
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, Type, TypeVar
import httpx
from pydantic import BaseModel, ValidationError

from fastapi import Depends
from app.config import Settings, get_settings
from app.core.security import AppException

T = TypeVar("T", bound=BaseModel)


class LLMError(AppException):
    """Raised when the LLM provider fails to respond or returns an error."""

    def __init__(
        self,
        message: str = "The AI service encountered an upstream provider error.",
        code: str = "BAD_GATEWAY",
    ) -> None:
        super().__init__(status_code=502, code=code, message=message)


class LLMTimeoutError(AppException):
    """Raised when the LLM provider times out."""

    def __init__(
        self,
        message: str = "The AI service request timed out.",
        code: str = "GATEWAY_TIMEOUT",
    ) -> None:
        super().__init__(status_code=504, code=code, message=message)


class LLMConfigurationError(AppException):
    """Raised when LLM provider configuration or API keys are missing."""

    def __init__(
        self,
        message: str = "The AI service LLM provider is not configured.",
        code: str = "INTERNAL_SERVER_ERROR",
    ) -> None:
        super().__init__(status_code=500, code=code, message=message)


class BaseLLMProvider(ABC):
    """Abstract base class for all LLM providers supporting structured output."""

    @abstractmethod
    async def generate_structured(
        self,
        prompt: str,
        system_prompt: str,
        response_schema: Type[T],
    ) -> T:
        """Execute structured LLM inference and validate response against a Pydantic schema."""
        pass


class GeminiProvider(BaseLLMProvider):
    """Google Gemini LLM provider implementation using direct REST API."""

    def __init__(self, api_key: str, model_name: str = "gemini-2.5-flash", timeout_seconds: float = 20.0) -> None:
        self.api_key = api_key
        self.model_name = model_name or "gemini-2.5-flash"
        self.timeout_seconds = timeout_seconds
        self.endpoint_url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent"
        )

    async def generate_structured(
        self,
        prompt: str,
        system_prompt: str,
        response_schema: Type[T],
    ) -> T:
        schema_json = response_schema.model_json_schema()

        payload: Dict[str, Any] = {
            "system_instruction": {
                "parts": [{"text": system_prompt}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "response_schema": schema_json,
                "temperature": 0.2,
            },
        }

        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self.api_key,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                response = await client.post(self.endpoint_url, json=payload, headers=headers)

                if response.status_code == 429:
                    raise AppException(
                        status_code=429,
                        code="RATE_LIMITED",
                        message="AI service rate limit exceeded with the upstream provider.",
                    )
                if response.status_code >= 400:
                    raise LLMError(f"Upstream Gemini API error ({response.status_code}).")

                data = response.json()
                raw_text = (
                    data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
                )

                parsed_json = json.loads(raw_text)
                return response_schema.model_validate(parsed_json)

        except httpx.TimeoutException as exc:
            raise LLMTimeoutError("Gemini API request timed out.") from exc
        except (json.JSONDecodeError, ValidationError) as exc:
            raise LLMError("Failed to parse structured response from Gemini API.") from exc
        except httpx.RequestError as exc:
            raise LLMError(f"Network error communicating with Gemini API: {str(exc)}") from exc


class OpenAIProvider(BaseLLMProvider):
    """OpenAI compatible LLM provider implementation."""

    def __init__(self, api_key: str, model_name: str = "gpt-4o-mini", timeout_seconds: float = 20.0) -> None:
        self.api_key = api_key
        self.model_name = model_name or "gpt-4o-mini"
        self.timeout_seconds = timeout_seconds
        self.endpoint_url = "https://api.openai.com/v1/chat/completions"

    async def generate_structured(
        self,
        prompt: str,
        system_prompt: str,
        response_schema: Type[T],
    ) -> T:
        schema_json = response_schema.model_json_schema()

        payload: Dict[str, Any] = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            "response_format": {
                "type": "json_schema",
                "json_schema": {
                    "name": response_schema.__name__,
                    "strict": True,
                    "schema": schema_json,
                },
            },
            "temperature": 0.2,
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                response = await client.post(self.endpoint_url, json=payload, headers=headers)

                if response.status_code == 429:
                    raise AppException(
                        status_code=429,
                        code="RATE_LIMITED",
                        message="AI service rate limit exceeded with the upstream provider.",
                    )
                if response.status_code >= 400:
                    raise LLMError(f"Upstream OpenAI API error ({response.status_code}).")

                data = response.json()
                raw_text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                parsed_json = json.loads(raw_text)
                return response_schema.model_validate(parsed_json)

        except httpx.TimeoutException as exc:
            raise LLMTimeoutError("OpenAI API request timed out.") from exc
        except (json.JSONDecodeError, ValidationError) as exc:
            raise LLMError("Failed to parse structured response from OpenAI API.") from exc
        except httpx.RequestError as exc:
            raise LLMError(f"Network error communicating with OpenAI API: {str(exc)}") from exc


class MockLLMProvider(BaseLLMProvider):
    """Deterministic mock provider for offline development and testing."""

    def __init__(self, canned_response: Optional[BaseModel] = None) -> None:
        self.canned_response = canned_response
        self.calls: list[dict[str, Any]] = []

    async def generate_structured(
        self,
        prompt: str,
        system_prompt: str,
        response_schema: Type[T],
    ) -> T:
        self.calls.append({
            "prompt": prompt,
            "system_prompt": system_prompt,
            "response_schema": response_schema,
        })

        if self.canned_response is not None:
            if isinstance(self.canned_response, response_schema):
                return self.canned_response
            return response_schema.model_validate(self.canned_response.model_dump())

        # Construct basic mock data conforming to response_schema
        schema_name = response_schema.__name__
        if schema_name == "AiStudentProfileSummaryResponse":
            default_data = {
                "profile_summary": "Priya Nair is a 3rd-year CS student with demonstrated skills in React and TypeScript, verified via the Literacy Bridge PWA portfolio project and Meta certification.",
                "key_skills": [
                    "React (Advanced, Demonstrated in Literacy Bridge PWA)",
                    "TypeScript (Intermediate, Demonstrated in Literacy Bridge PWA)",
                    "Python (Intermediate, Self-reported)",
                    "Machine Learning (Beginner, Self-reported; unverified)",
                ],
                "portfolio_evidence": [
                    "Literacy Bridge PWA (https://github.com/priyanair/literacy-bridge): Demonstrates React, TypeScript, and IndexedDB offline syncing.",
                ],
                "relevant_strengths": [
                    "Demonstrated practical experience building progressive web apps",
                    "Frontend leadership experience in university student community",
                ],
                "missing_information": [
                    "Self-reported Machine Learning skill has no associated portfolio or verification",
                    "No demonstrated experience with backend cloud deployments",
                ],
                "suggested_questions": [
                    "Can you elaborate on your experience implementing offline data sync with IndexedDB?",
                    "Have you worked with TailwindCSS in any other projects?",
                ],
                "disclaimer": "AI profile analysis is an advisory summary. Please verify all key requirements and qualifications directly with the student.",
            }
            if "New Student" in prompt or '"portfolio_items": []' in prompt:
                default_data["missing_information"] = [
                    "Missing portfolio items",
                    "Missing verified skills and certifications",
                ]
            return response_schema.model_validate(default_data)

        elif schema_name == "AiNgoProfileSummaryResponse":
            status = "not_submitted"
            if '"verification_status": "verified"' in prompt:
                status = "verified"
            elif '"verification_status": "pending_review"' in prompt:
                status = "pending_review"
            elif '"verification_status": "under_manual_review"' in prompt:
                status = "under_manual_review"

            default_data = {
                "organization_summary": "Akshaya Shiksha Foundation is a grassroots non-profit dedicated to accelerating digital literacy for rural school students.",
                "mission_and_focus": [
                    "Ensure rural schoolchildren have access to digital tools, modern pedagogy, and career guidance",
                    "Digital Literacy",
                    "Rural Education",
                    "Youth Empowerment",
                ],
                "verification_analysis": f"The organization's backend verification status is recorded as '{status}'.",
                "relevant_evidence": [
                    "Supplied refurbished tablets to 45 rural learning centers in 2025.",
                    "Trained 1,200 students in basic computer skills and internet safety.",
                    "Active public web presence at https://akshayashiksha.org",
                ],
                "alignment_analysis": [
                    "High alignment with students interested in digital literacy, frontend engineering, and rural education",
                    "Practical field impact offering opportunities to apply software skills for social good",
                ],
                "missing_information": [
                    "Details on upcoming tech requirements for new learning centers",
                ] if status == "verified" else [
                    f"Organization platform verification is '{status}'",
                    "Missing verified external registration documents",
                ],
                "suggested_questions": [
                    "What upcoming software development initiatives are currently planned for volunteers?",
                    "What mentorship and guidance is provided to student contributors during the engagement?",
                ],
                "disclaimer": "AI assistance is an advisory summary. Verification status is supplied by platform records. Verify all details directly with the organization.",
            }
            if "ngo-minimal" in prompt:
                default_data["missing_information"] = [
                    "Missing public website URL",
                    "Missing past projects documentation",
                    "Pending platform verification",
                ]
            return response_schema.model_validate(default_data)

        default_data = {
            "summary": "Mock summary based on supplied context.",
            "relevant_evidence": ["Evidence point 1"],
            "missing_information": ["Missing info point 1"],
            "suggested_questions": ["Question 1?"],
            "disclaimer": "AI assistance is an advisory summary. Verify details directly.",
        }
        return response_schema.model_validate(default_data)


def get_llm_provider(settings: Settings = Depends(get_settings)) -> BaseLLMProvider:
    """Dependency provider factory that returns the configured LLM client."""
    provider_name = (settings.LLM_PROVIDER or "").lower().strip()

    if provider_name == "mock" or settings.APP_ENV == "testing":
        return MockLLMProvider()

    if not provider_name or not settings.LLM_API_KEY:
        raise LLMConfigurationError(
            "LLM provider and API key must be configured in environment variables."
        )

    if provider_name in ("gemini", "google"):
        return GeminiProvider(
            api_key=settings.LLM_API_KEY,
            model_name=settings.LLM_MODEL or "gemini-2.5-flash",
        )
    elif provider_name in ("openai", "gpt"):
        return OpenAIProvider(
            api_key=settings.LLM_API_KEY,
            model_name=settings.LLM_MODEL or "gpt-4o-mini",
        )
    else:
        raise LLMConfigurationError(f"Unsupported LLM provider: '{settings.LLM_PROVIDER}'.")
