from fastapi import APIRouter
from app.schemas.domain_schemas import CalculationRequestSchema, StandardResponse
from app.engines.carbon.carbon_engine import carbon_engine
from app.engines.economics.economic_engine import economic_engine

router = APIRouter(prefix="/calculations", tags=["Carbon & Financial Calculation Engine"])


@router.post("/carbon", response_model=StandardResponse)
async def calculate_carbon_impact(payload: CalculationRequestSchema):
    result = carbon_engine.calculate_carbon_balance(payload.model_dump())
    return StandardResponse(success=True, data=result)


@router.post("/economics", response_model=StandardResponse)
async def calculate_economic_modeling(payload: CalculationRequestSchema):
    result = economic_engine.calculate_scenario(payload.model_dump(), "BASE")
    return StandardResponse(success=True, data=result)


@router.post("/scenario", response_model=StandardResponse)
async def run_scenario_analysis(payload: CalculationRequestSchema):
    scenarios = economic_engine.compare_all_scenarios(payload.model_dump())
    carbon = carbon_engine.calculate_carbon_balance(payload.model_dump())
    return StandardResponse(
        success=True,
        data={
            "carbon_metrics": carbon,
            "financial_scenarios": scenarios,
        },
    )
