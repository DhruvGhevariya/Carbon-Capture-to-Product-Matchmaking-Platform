from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.database import init_db
from app.api import (
    auth_router,
    seller_router,
    marketplace_router,
    ai_router,
    bids_router,
    orders_router,
    logistics_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    try:
        await init_db()
        print("[CarbonX] Database tables verified and initialized successfully.")
    except Exception as e:
        print(f"[CarbonX] Warning during database init: {e}")
    yield
    # Shutdown logic if needed
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
# Global Standardized Error Handlers
# -------------------------------------------------------------------
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail,
                "status_code": exc.status_code,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(item) for item in err.get("loc", []))
        msg = err.get("msg", "Validation error")
        errors.append(f"{loc}: {msg}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "UNPROCESSABLE_ENTITY",
                "message": "Input payload failed schema validation.",
                "details": errors,
                "status_code": 422,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        }
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred. Please retry later.",
                "details": str(exc) if settings.DEBUG else None,
                "status_code": 500,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        }
    )


# -------------------------------------------------------------------
# Health Check & Root
# -------------------------------------------------------------------
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to the CarbonX Matchmaking Platform API",
        "documentation": "/docs",
        "version": settings.VERSION,
    }


# -------------------------------------------------------------------
# API Router Ingestion
# -------------------------------------------------------------------
api_v1 = settings.API_V1_STR

app.include_router(auth_router, prefix=api_v1)
app.include_router(seller_router, prefix=api_v1)
app.include_router(marketplace_router, prefix=api_v1)
app.include_router(ai_router, prefix=api_v1)
app.include_router(bids_router, prefix=api_v1)
app.include_router(orders_router, prefix=api_v1)
app.include_router(logistics_router, prefix=api_v1)
