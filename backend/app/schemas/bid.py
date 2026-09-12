from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.bid import BidStatus


class BidCreateRequest(BaseModel):
    listing_id: str = Field(..., description="Target CO2 batch listing UUID")
    offered_price_ton: float = Field(..., gt=0.0, description="Offered price per metric ton")
    requested_quantity: float = Field(..., gt=0.0, description="Requested purchase volume in metric tons")
    delivery_target: date = Field(..., description="Target delivery arrival date")


class BidActionRequest(BaseModel):
    action: str = Field(..., pattern="^(accept|reject)$", description="Seller commercial decision")


class BidResponse(BaseModel):
    id: str
    listing_id: str
    buyer_id: str
    buyer_name: Optional[str] = None
    buyer_company: Optional[str] = None
    offered_price_ton: float
    requested_quantity: float
    total_offered_value: float
    delivery_target: date
    status: BidStatus
    created_at: datetime
    ai_match_score: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)
