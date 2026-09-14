from app.api.v1.auth import router as auth_router
from app.api.v1.co2_sources import router as co2_sources_router
from app.api.v1.co2_measurements import router as measurements_router
from app.api.v1.technologies_products_pathways import router as tech_router
from app.api.v1.technologies import router as technologies_router
from app.api.v1.products import router as products_router
from app.api.v1.pathways import router as pathways_router
from app.api.v1.matching import router as matching_router
from app.api.v1.calculations import router as calculations_router
from app.api.v1.marketplace import router as marketplace_router
from app.api.v1.partnerships import router as partnerships_router
from app.api.v1.copilot_analytics_notifications import router as copilot_router

__all__ = [
    "auth_router",
    "co2_sources_router",
    "measurements_router",
    "tech_router",
    "technologies_router",
    "products_router",
    "pathways_router",
    "matching_router",
    "calculations_router",
    "marketplace_router",
    "partnerships_router",
    "copilot_router",
]

