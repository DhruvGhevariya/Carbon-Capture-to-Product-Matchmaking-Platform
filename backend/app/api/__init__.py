from app.api.auth import router as auth_router
from app.api.seller import router as seller_router
from app.api.marketplace import router as marketplace_router
from app.api.ai import router as ai_router
from app.api.bids import router as bids_router
from app.api.orders import router as orders_router
from app.api.logistics import router as logistics_router

__all__ = [
    "auth_router",
    "seller_router",
    "marketplace_router",
    "ai_router",
    "bids_router",
    "orders_router",
    "logistics_router",
]
