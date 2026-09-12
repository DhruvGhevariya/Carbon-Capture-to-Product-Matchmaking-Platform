from datetime import date
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class AIRecommendRequest(BaseModel):
    required_quantity_tons: float = Field(..., gt=0.0, description="Desired batch volume in metric tons")
    minimum_purity_floor: float = Field(..., ge=70.00, le=99.99, description="Strict minimum purity required")
    budget_ceiling_per_ton: float = Field(..., gt=0.0, description="Maximum acceptable delivered cost per ton")
    delivery_deadline: date = Field(..., description="Target production fulfillment date")
    destination_latitude: float = Field(..., ge=-90.0, le=90.0, description="Receiving facility latitude")
    destination_longitude: float = Field(..., ge=-180.0, le=180.0, description="Receiving facility longitude")


class DimensionBreakdown(BaseModel):
    purity_score: float = Field(..., description="Normalized purity compatibility score (0-100)")
    distance_score: float = Field(..., description="Normalized proximity score (0-100)")
    price_score: float = Field(..., description="Normalized commercial score (0-100)")
    quantity_score: float = Field(..., description="Normalized volumetric score (0-100)")
    delivery_score: float = Field(..., description="Normalized schedule alignment score (0-100)")
    reliability_score: float = Field(..., description="Normalized supplier reliability score (0-100)")


class SupplierRecommendation(BaseModel):
    listing_id: str
    supplier_name: str
    industry_type: str
    location: str
    match_score: int = Field(..., ge=0, le=100, description="Composite AI Match Score")
    confidence_score: float = Field(..., ge=0.0, le=100.0, description="Algorithmic Confidence Score")
    compatibility_tier: str = Field(..., description="'HIGH_MATCH', 'MODERATE_MATCH', or 'LOW_MATCH'")
    purity_percentage: float
    distance_km: float
    total_landed_cost_ton: float
    dimension_breakdown: DimensionBreakdown
    explanation: str = Field(..., description="Explainable natural language justification")

    model_config = ConfigDict(from_attributes=True)


class AIRecommendResponse(BaseModel):
    top_recommendation: Optional[SupplierRecommendation] = None
    ranked_alternatives: List[SupplierRecommendation] = Field(default_factory=list)
    evaluated_candidates_count: int
