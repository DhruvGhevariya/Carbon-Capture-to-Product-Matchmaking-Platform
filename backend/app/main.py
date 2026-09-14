from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.database import init_db
from app.core.exceptions import CarbonXException, format_error_response
from app.api import (
    auth_router,
    co2_sources_router,
    measurements_router,
    tech_router,
    matching_router,
    calculations_router,
    marketplace_router,
    partnerships_router,
    copilot_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_db()
        print("[CarbonX] Database tables verified and initialized successfully.")
    except Exception as e:
        print(f"[CarbonX] Warning during database init: {e}")
    yield
    print("[CarbonX] Application shutdown complete.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Carbon Capture-to-Product Matchmaking Platform Backend API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# -------------------------------------------------------------------
# CORS Configuration
# -------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins if settings.cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------------
# Exception Handlers
# -------------------------------------------------------------------
@app.exception_handler(CarbonXException)
async def custom_exception_handler(request: Request, exc: CarbonXException):
    return JSONResponse(
        status_code=exc.status_code,
        content=format_error_response(
            code=exc.code,
            message=exc.message,
            status_code=exc.status_code,
            details=exc.details,
        ),
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=format_error_response(
            code=f"HTTP_{exc.status_code}",
            message=str(exc.detail),
            status_code=exc.status_code,
        ),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [" -> ".join(str(i) for i in err.get("loc", [])) + f": {err.get('msg')}" for err in exc.errors()]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=format_error_response(
            code="UNPROCESSABLE_ENTITY",
            message="Input payload failed schema validation.",
            status_code=422,
            details=errors,
        ),
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=format_error_response(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected server error occurred.",
            status_code=500,
            details=str(exc) if settings.DEBUG else None,
        ),
    )


# -------------------------------------------------------------------
# Health Checks & Root
# -------------------------------------------------------------------
@app.get("/health", tags=["Health"])
@app.get("/ready", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to CarbonX Matchmaking Platform API",
        "documentation": "/docs",
        "version": settings.VERSION,
    }


# -------------------------------------------------------------------
# API Router Ingestion
# -------------------------------------------------------------------
api_v1 = settings.API_V1_STR

app.include_router(auth_router, prefix=api_v1)
app.include_router(co2_sources_router, prefix=api_v1)
app.include_router(measurements_router, prefix=api_v1)
app.include_router(tech_router, prefix=api_v1)
app.include_router(matching_router, prefix=api_v1)
app.include_router(calculations_router, prefix=api_v1)
app.include_router(marketplace_router, prefix=api_v1)
app.include_router(partnerships_router, prefix=api_v1)
app.include_router(copilot_router, prefix=api_v1)
