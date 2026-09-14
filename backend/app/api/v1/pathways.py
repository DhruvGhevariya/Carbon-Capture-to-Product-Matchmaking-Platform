from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.domain import UtilizationPathway
from app.schemas.domain_schemas import StandardResponse

router = APIRouter(prefix='/pathways', tags=['Pathways'])

@router.get('', response_model=StandardResponse)
async def list_pathways(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(UtilizationPathway))
    items = res.scalars().all()
    return StandardResponse(success=True, data=[
        {
            'id': pw.id,
            'uuid': pw.uuid,
            'name': pw.name,
            'technology_id': pw.technology_id,
            'product_id': pw.product_id,
            'conversion_ratio': pw.conversion_ratio,
            'carbon_avoidance_factor': pw.carbon_avoidance_factor,
            'energy_intensity_kwh_ton': pw.energy_intensity_kwh_ton,
            'provenance_type': pw.provenance_type,
        } for pw in items
    ])

@router.get('/{pathway_id}', response_model=StandardResponse)
async def get_pathway(pathway_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(UtilizationPathway).where(UtilizationPathway.id == pathway_id))
    pw = res.scalar_one_or_none()
    if not pw:
        raise HTTPException(status_code=404, detail='Pathway not found')
    return StandardResponse(success=True, data={
        'id': pw.id,
        'uuid': pw.uuid,
        'name': pw.name,
        'technology_id': pw.technology_id,
        'product_id': pw.product_id,
        'conversion_ratio': pw.conversion_ratio,
        'carbon_avoidance_factor': pw.carbon_avoidance_factor,
        'energy_intensity_kwh_ton': pw.energy_intensity_kwh_ton,
        'provenance_type': pw.provenance_type,
    })
