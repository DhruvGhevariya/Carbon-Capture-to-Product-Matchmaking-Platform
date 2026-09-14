from datetime import date, datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Base Standard API Response
class StandardResponse(BaseModel):
    success: bool = True
    data: Optional[Any] = None
    meta: Optional[Dict[str, Any]] = None


# Auth & User Schemas
class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "user"
    company_name: Optional[str] = None
    industry_type: Optional[str] = None


class UserResponseSchema(BaseModel):
    id: int
    uuid: Optional[str] = None
    email: str
    full_name: str
    role: str
    company_id: Optional[int] = None
    company: Optional[Dict[str, Any]] = None
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


class TokenResponseSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponseSchema


# Organization Schemas
class OrganizationCreateSchema(BaseModel):
    company_name: str
    industry_type: str
    location_name: str
    latitude: float = 0.0
    longitude: float = 0.0


class OrganizationResponseSchema(BaseModel):
    id: int
    company_name: str
    industry_type: str
    location_name: str
    latitude: float
    longitude: float

    model_config = ConfigDict(from_attributes=True)


# CO2 Source & Fingerprint Schemas
class CO2SourceCreateSchema(BaseModel):
    name: str
    facility_name: str
    industry_type: str
    location_name: str
    latitude: float
    longitude: float
    annual_capture_tonnes: float = Field(ge=0)
    daily_capture_tonnes: float = Field(ge=0)
    purity_percentage: float = Field(ge=0, le=100)
    temperature_c: float = 25.0
    pressure_bar: float = Field(ge=0, default=1.013)
    physical_state: str = "liquid"
    impurities_json: Optional[Dict[str, Any]] = None


class CO2SourceResponseSchema(CO2SourceCreateSchema):
    id: int
    uuid: str
    organization_id: int
    source_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CO2FingerprintResponseSchema(BaseModel):
    source_id: int
    purity_score: float
    volume_score: float
    pressure_score: float
    temperature_score: float
    overall_quality_score: float
    readiness_tier: str
    suitable_grades: List[str]
    version: int


# Technology & Product Schemas
class TechnologySchema(BaseModel):
    id: int
    name: str
    provider_name: str
    description: Optional[str] = None
    category: str
    trl: int
    min_co2_purity: float
    min_co2_volume: float
    conversion_efficiency: float
    capex_per_ton: float
    opex_per_ton: float

    model_config = ConfigDict(from_attributes=True)


class ProductSchema(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None
    co2_requirement_ton_per_unit: float
    market_price_per_unit: float
    trl: int

    model_config = ConfigDict(from_attributes=True)


# Matchmaking & Scenario Request Schemas
class MatchRequestSchema(BaseModel):
    minimum_purity_floor: float = Field(default=90.0, ge=0, le=100)
    required_quantity_tons: float = Field(default=100.0, gt=0)
    budget_ceiling_per_ton: float = Field(default=10000.0, gt=0)
    destination_latitude: float
    destination_longitude: float
    preferred_category: Optional[str] = None


class MatchItemSchema(BaseModel):
    listing_id: Optional[int] = None
    source_id: Optional[int] = None
    technology_id: Optional[int] = None
    supplier_name: str
    industry_type: str
    location: str
    match_score: int
    technical_score: float
    economic_score: float
    environmental_score: float
    geographic_score: float
    trl_score: float
    confidence_score: float
    eligible: bool
    reasons: List[str]
    warnings: List[str]
    purity_percentage: float
    distance_km: float
    total_landed_cost_ton: float
    explanation: str


class CalculationRequestSchema(BaseModel):
    co2_captured_tons: float = Field(gt=0)
    conversion_efficiency: float = Field(default=0.85, gt=0, le=1.0)
    transport_distance_km: float = Field(default=50.0, ge=0)
    energy_price_per_kwh: float = Field(default=0.12, ge=0)
    co2_reserve_price_ton: float = Field(default=50.0, ge=0)
    product_selling_price_unit: float = Field(default=250.0, ge=0)
    capex_total: float = Field(default=500000.0, ge=0)
    opex_annual: float = Field(default=75000.0, ge=0)


class CarbonCalculationResultSchema(BaseModel):
    co2_captured_tons: float
    co2_utilized_tons: float
    co2_avoided_net_tons: float
    co2_permanently_stored_tons: float
    process_emissions_tons: float
    transport_emissions_tons: float
    net_carbon_benefit_score: float


class EconomicScenarioResultSchema(BaseModel):
    scenario: str
    annual_revenue: float
    annual_operating_cost: float
    gross_margin_annual: float
    payback_period_years: float
    npv_10_year: float
    roi_percentage: float
    assumptions_used: Dict[str, Any]


# Bidding & Orders
class BidCreateSchema(BaseModel):
    listing_id: int
    offered_price_ton: float = Field(gt=0)
    requested_quantity: float = Field(gt=0)
    delivery_target: Optional[date] = None


class OrderResponseSchema(BaseModel):
    id: int
    order_reference: str
    seller_id: int
    buyer_id: int
    final_price_ton: float
    quantity_tons: float
    order_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Copilot Schemas
class CopilotChatRequestSchema(BaseModel):
    message: str
    source_id: Optional[int] = None
    technology_id: Optional[int] = None


class CopilotChatResponseSchema(BaseModel):
    answer: str
    citations: List[str] = []
    recommended_actions: List[str] = []
