from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.domain import Technology
from app.schemas.domain_schemas import StandardResponse

router = APIRouter(prefix='/technologies', tags=['Technologies'])

@router.get('', response_model=StandardResponse)
async def list_technologies(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Technology).where(Technology.deleted_at == None))
    items = res.scalars().all()
    return StandardResponse(success=True, data=[
        {
            'id': t.id,
            'uuid': t.uuid,
            'name': t.name,
            'provider_name': t.provider_name,
            'category': t.category,
            'trl': t.trl,
            'min_co2_purity': t.min_co2_purity,
            'min_co2_volume': t.min_co2_volume,
            'conversion_efficiency': t.conversion_efficiency,
            'capex_per_ton': t.capex_per_ton,
            'opex_per_ton': t.opex_per_ton,
            'version': t.version,
        } for t in items
    ])

@router.get('/{tech_id}', response_model=StandardResponse)
async def get_technology(tech_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Technology).where(Technology.id == tech_id, Technology.deleted_at == None))
    tech = res.scalar_one_or_none()
    if not tech:
        raise HTTPException(status_code=404, detail='Technology not found')
    return StandardResponse(success=True, data={
        'id': tech.id,
        'uuid': tech.uuid,
        'name': tech.name,
        'provider_name': tech.provider_name,
        'category': tech.category,
        'trl': tech.trl,
        'min_co2_purity': tech.min_co2_purity,
        'min_co2_volume': tech.min_co2_volume,
        'conversion_efficiency': tech.conversion_efficiency,
        'capex_per_ton': tech.capex_per_ton,
        'opex_per_ton': tech.opex_per_ton,
        'version': tech.version,
    })
