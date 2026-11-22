"""EduSolve AI Service - FastAPI Application Entry Point."""

import time
import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import os

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.router import router as v1_router
from app.config import get_settings
from app.core.logging import (
    configure_logging,
    correlation_id_ctx,
)
from app.core.security import AppException
from app.schemas.common import ErrorDetail, ErrorEnvelope, HealthResponse

settings = get_settings()
os.environ.setdefault("CREWAI_STORAGE_DIR", settings.CREWAI_STORAGE_DIR)
logger = configure_logging(settings.LOG_LEVEL)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application startup and shutdown lifecycle management."""
    logger.info(
        "EduSolve AI Service starting",
        extra={
            "environment": settings.APP_ENV,
            "port": settings.APP_PORT,
        },
    )
    yield
    logger.info("EduSolve AI Service shutting down")


app = FastAPI(
    title="EduSolve AI Service",
    description="Internal agent orchestration and AI inference service for EduSolve",
    version="0.1.0",
    docs_url="/docs" if settings.APP_ENV != "production" else None,
    redoc_url="/redoc" if settings.APP_ENV != "production" else None,
    openapi_url="/openapi.json" if settings.APP_ENV != "production" else None,
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.middleware("http")
async def correlation_and_logging_middleware(request: Request, call_next):
    """Assigns correlation ID, measures latency, and logs safe operational telemetry."""
    # Extract or generate correlation ID
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    token = correlation_id_ctx.set(request_id)
    request.state.request_id = request_id

    start_time = time.perf_counter()
    try:
        response = await call_next(request)
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # Log safe operational telemetry (never log body, auth headers, or raw chat)
        logger.info(
            "Request completed",
            extra={
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "latency_ms": latency_ms,
                "request_id": request_id,
            },
        )
        response.headers["x-request-id"] = request_id
        return response
    except Exception:
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.exception(
            "Request failed with unhandled exception",
            extra={
                "method": request.method,
                "path": request.url.path,
                "latency_ms": latency_ms,
                "request_id": request_id,
            },
        )
        envelope = ErrorEnvelope(
            error=ErrorDetail(
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected server error occurred. Please contact system support.",
                request_id=request_id,
            )
        )
        error_response = JSONResponse(
            status_code=500,
            content=envelope.model_dump(),
        )
        error_response.headers["x-request-id"] = request_id
        return error_response
    finally:
        correlation_id_ctx.reset(token)


# -----------------------------------------------------------------------------
# Centralized Exception Handlers (Standardizing to ErrorEnvelope)
# -----------------------------------------------------------------------------

@app.exception_handler(AppException)
async def handle_app_exception(request: Request, exc: AppException) -> JSONResponse:
    """Handle domain application exceptions (e.g. AuthenticationError, ForbiddenError)."""
    request_id = getattr(request.state, "request_id", None)
    envelope = ErrorEnvelope(
        error=ErrorDetail(
            code=exc.code,
            message=exc.message,
            request_id=request_id,
        )
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=envelope.model_dump(),
    )


@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle request input validation failures conforming to ErrorEnvelope."""
    request_id = getattr(request.state, "request_id", None)
    # Simplify error message to avoid leaking internals
    error_messages = [f"{'.'.join(str(loc) for loc in err['loc'])}: {err['msg']}" for err in exc.errors()]
    formatted_message = "; ".join(error_messages) if error_messages else "Invalid request payload."

    envelope = ErrorEnvelope(
        error=ErrorDetail(
            code="VALIDATION_ERROR",
            message=formatted_message,
            request_id=request_id,
        )
    )
    return JSONResponse(
        status_code=400,
        content=envelope.model_dump(),
    )


@app.exception_handler(StarletteHTTPException)
async def handle_http_exception(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Handle standard HTTP exceptions conforming to ErrorEnvelope."""
    request_id = getattr(request.state, "request_id", None)
    code_map = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        405: "METHOD_NOT_ALLOWED",
        409: "CONFLICT",
        413: "PAYLOAD_TOO_LARGE",
        422: "UNPROCESSABLE_ENTITY",
        429: "RATE_LIMITED",
        500: "INTERNAL_SERVER_ERROR",
    }
    code = code_map.get(exc.status_code, "HTTP_ERROR")
    envelope = ErrorEnvelope(
        error=ErrorDetail(
            code=code,
            message=str(exc.detail),
            request_id=request_id,
        )
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=envelope.model_dump(),
    )


@app.exception_handler(Exception)
async def handle_unhandled_exception(request: Request, exc: Exception) -> JSONResponse:
    """Fallback handler for unexpected exceptions. Never exposes stack traces to caller."""
    request_id = getattr(request.state, "request_id", None)
    logger.exception("Unexpected server error occurred", extra={"request_id": request_id})
    envelope = ErrorEnvelope(
        error=ErrorDetail(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected server error occurred. Please contact system support.",
            request_id=request_id,
        )
    )
    return JSONResponse(
        status_code=500,
        content=envelope.model_dump(),
    )


# -----------------------------------------------------------------------------
# Base Endpoints & Routers
# -----------------------------------------------------------------------------

@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Root Service Health",
    description="Container and infrastructure health probe endpoint.",
)
async def root_health() -> HealthResponse:
    """Root public health probe."""
    return HealthResponse(
        status="healthy",
        service="edusolve-ai-service",
        environment=settings.APP_ENV,
    )


# Mount versioned internal API
app.include_router(v1_router)
