from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.domain import Technology, Product, UtilizationPathway
from app.schemas.domain_schemas import StandardResponse

router = APIRouter(tags=["Technologies, Products & Pathways"])


@router.get("/technologies", response_model=StandardResponse)
async def list_technologies(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Technology))
    items = res.scalars().all()
    return StandardResponse(success=True, data=[
        {
            "id": t.id,
            "uuid": t.uuid,
            "name": t.name,
            "provider_name": t.provider_name,
            "category": t.category,
            "trl": t.trl,
            "min_co2_purity": t.min_co2_purity,
            "min_co2_volume": t.min_co2_volume,
            "conversion_efficiency": t.conversion_efficiency,
            "capex_per_ton": t.capex_per_ton,
            "opex_per_ton": t.opex_per_ton,
        } for t in items
    ])


@router.get("/products", response_model=StandardResponse)
async def list_products(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Product))
    items = res.scalars().all()
    return StandardResponse(success=True, data=[
        {
            "id": p.id,
            "uuid": p.uuid,
            "name": p.name,
            "category": p.category,
            "co2_requirement_ton_per_unit": p.co2_requirement_ton_per_unit,
            "market_price_per_unit": p.market_price_per_unit,
            "trl": p.trl,
        } for p in items
    ])


@router.get("/pathways", response_model=StandardResponse)
async def list_pathways(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(UtilizationPathway))
    items = res.scalars().all()
    return StandardResponse(success=True, data=[
        {
            "id": pw.id,
            "uuid": pw.uuid,
            "name": pw.name,
            "technology_id": pw.technology_id,
            "product_id": pw.product_id,
            "conversion_ratio": pw.conversion_ratio,
            "carbon_avoidance_factor": pw.carbon_avoidance_factor,
            "energy_intensity_kwh_ton": pw.energy_intensity_kwh_ton,
        } for pw in items
    ])
