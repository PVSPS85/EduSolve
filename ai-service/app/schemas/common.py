"""Common and shared schema definitions."""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ErrorDetail(BaseModel):
    """Detailed error object conforming to Tech/openapi.yaml ErrorEnvelope."""

    model_config = ConfigDict(extra="forbid")

    code: str = Field(
        ...,
        description="Machine-readable uppercase error code",
        examples=["UNAUTHORIZED", "FORBIDDEN", "VALIDATION_ERROR", "INTERNAL_SERVER_ERROR"],
    )
    message: str = Field(
        ...,
        description="Human-readable error explanation",
        examples=["Missing or invalid authentication credentials."],
    )
    request_id: Optional[str] = Field(
        default=None,
        description="Unique request correlation identifier for tracing",
        examples=["f81d4fae-7dec-11d0-a765-00a0c91e6bf6"],
    )


class ErrorEnvelope(BaseModel):
    """Top-level error response envelope defined in Tech/openapi.yaml."""

    model_config = ConfigDict(extra="forbid")

    error: ErrorDetail


class HealthResponse(BaseModel):
    """Health status response payload."""

    status: str = Field(default="healthy", description="Current health status")
    service: str = Field(default="edusolve-ai-service", description="Service identifier")
    environment: str = Field(..., description="Active runtime environment")


class PingResponse(BaseModel):
    """Internal ping/echo response for internal route verification."""

    message: str = Field(default="pong", description="Echo message")
    status: str = Field(default="ok", description="Status string")
