"""Internal v1 API router."""

from fastapi import APIRouter, Depends
from app.api.deps import verify_internal_auth
from app.api.v1.chat import router as chat_router
from app.api.v1.profiles import router as profiles_router
from app.config import Settings, get_settings
from app.schemas.common import HealthResponse, PingResponse

router = APIRouter(prefix="/internal/v1", tags=["Internal v1"])

# Include sub-routers
router.include_router(chat_router)
router.include_router(profiles_router)


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Internal Service Health Status",
    description="Returns service health and active environment without exposing sensitive configuration.",
)
async def internal_health(
    settings: Settings = Depends(get_settings),
) -> HealthResponse:
    """Internal health check endpoint."""
    return HealthResponse(
        status="healthy",
        service="edusolve-ai-service",
        environment=settings.APP_ENV,
    )


@router.get(
    "/ping",
    response_model=PingResponse,
    dependencies=[Depends(verify_internal_auth)],
    summary="Protected Internal Echo/Ping",
    description="Requires valid internal authentication secret to verify service-to-service connectivity.",
)
async def internal_ping() -> PingResponse:
    """Protected verification endpoint for internal handshake testing."""
    return PingResponse(message="pong", status="ok")
