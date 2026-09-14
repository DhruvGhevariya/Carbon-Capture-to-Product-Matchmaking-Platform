from app.api.v1.auth import router as auth_router
from app.api.v1.co2_sources import router as co2_sources_router
from app.api.v1.technologies_products_pathways import router as tech_router
from app.api.v1.matching import router as matching_router
from app.api.v1.calculations import router as calculations_router
from app.api.v1.marketplace import router as marketplace_router
from app.api.v1.copilot_analytics_notifications import router as copilot_router

__all__ = [
    "auth_router",
    "co2_sources_router",
    "tech_router",
    "matching_router",
    "calculations_router",
    "marketplace_router",
    "copilot_router",
]
