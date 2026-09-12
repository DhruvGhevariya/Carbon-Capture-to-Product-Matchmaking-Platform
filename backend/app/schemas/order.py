from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.order import OrderStatus


class OrderStatusUpdateRequest(BaseModel):
    status: OrderStatus = Field(..., description="Next fulfillment status: 'in_transit' or 'completed'")


class OrderPartyInfo(BaseModel):
    name: str
    contact_person: str
    location: str


class OrderSpecSheet(BaseModel):
    purity_percentage: float
    physical_state: str
    moisture_ppm: float
    sulfur_oxides_sox_ppm: float


class OrderCommercialTerms(BaseModel):
    quantity_metric_tons: float
    commodity_price_ton: float
    total_order_value: float
    scheduled_pickup_window: str


class OrderDetailResponse(BaseModel):
    order_id: str
    order_reference: str
    status: OrderStatus
    seller: OrderPartyInfo
    buyer: OrderPartyInfo
    commercial_terms: OrderCommercialTerms
    technical_spec_sheet: OrderSpecSheet
    confirmed_at: datetime


class OrderResponse(BaseModel):
    id: str
    order_reference: str
    bid_id: str
    listing_id: str
    seller_id: str
    seller_name: Optional[str] = None
    seller_company: Optional[str] = None
    buyer_id: str
    buyer_name: Optional[str] = None
    buyer_company: Optional[str] = None
    final_price_ton: float
    quantity_tons: float
    total_value: float
    delivery_window: str
    order_status: OrderStatus
    purity_percentage: Optional[float] = None
    confirmed_at: datetime

    model_config = ConfigDict(from_attributes=True)
