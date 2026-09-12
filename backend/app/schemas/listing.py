from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, model_validator
from app.models.listing import ListingStatus


class ListingCreateRequest(BaseModel):
    purity_percentage: float = Field(..., ge=70.00, le=99.99, description="CO2 purity concentration percentage")
    volume_metric_tons: float = Field(..., gt=0.0, le=100000.0, description="Available quantity in metric tons")
    physical_state: str = Field(default="liquid", pattern="^(liquid|pressurized_gas)$", description="Physical phase")
    reserve_price_ton: float = Field(..., gt=0.0, description="Minimum acceptable reserve price per metric ton")
    available_from: date = Field(default_factory=date.today, description="Earliest dispatch pickup date")
    available_until: date = Field(..., description="Batch storage buffer expiration date")

    @model_validator(mode="after")
    def validate_dates(self):
        if self.available_until < self.available_from:
            raise ValueError("available_until must be greater than or equal to available_from")
        return self


class ListingUpdateRequest(BaseModel):
    volume_metric_tons: Optional[float] = Field(None, gt=0.0, description="Updated quantity in tons")
    reserve_price_ton: Optional[float] = Field(None, gt=0.0, description="Updated floor price")
    available_until: Optional[date] = Field(None, description="Updated expiration date")


class ListingResponse(BaseModel):
    id: str
    seller_id: str
    purity_percentage: float
    volume_metric_tons: float
    physical_state: str
    reserve_price_ton: float
    status: ListingStatus
    available_from: date
    available_until: date
    created_at: datetime
    pending_bids_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)


class MarketplaceCardResponse(BaseModel):
    listing_id: str
    company_name: str
    industry_type: str
    location: str
    latitude: float
    longitude: float
    purity_percentage: float
    volume_available_tons: float
    physical_state: str
    base_price_ton: float
    distance_km: float
    estimated_freight_ton: float
    total_landed_cost_ton: float
    ai_match_score: int
    status: ListingStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
