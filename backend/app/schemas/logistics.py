from pydantic import BaseModel, Field, ConfigDict


class LogisticsEstimateRequest(BaseModel):
    origin_latitude: float = Field(..., ge=-90.0, le=90.0, description="Emitter plant latitude")
    origin_longitude: float = Field(..., ge=-180.0, le=180.0, description="Emitter plant longitude")
    destination_latitude: float = Field(..., ge=-90.0, le=90.0, description="Off-taker plant latitude")
    destination_longitude: float = Field(..., ge=-180.0, le=180.0, description="Off-taker plant longitude")
    volume_metric_tons: float = Field(..., gt=0.0, description="Haulage quantity in metric tons")


class CarbonAccounting(BaseModel):
    gross_co2_diverted_tons: float = Field(..., description="Captured CO2 mass delivered")
    diesel_haulage_emissions_tons: float = Field(..., description="Transport exhaust emissions incurred")
    net_abated_co2_tons: float = Field(..., description="True net-negative carbon abatement")
    emission_ratio_percentage: float = Field(..., description="Logistics emissions / gross CO2 %")


class LogisticsEstimateResponse(BaseModel):
    distance_km: float = Field(..., description="Calibrated road transit distance in kilometers")
    transit_duration_hours: float = Field(..., description="Estimated road tanker travel time")
    transport_cost_per_ton: float = Field(..., description="Cryogenic road freight rate per ton")
    total_freight_cost: float = Field(..., description="Total batch logistics surcharge")
    carbon_accounting: CarbonAccounting

    model_config = ConfigDict(from_attributes=True)
