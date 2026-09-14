from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.domain import Product
from app.schemas.domain_schemas import StandardResponse

router = APIRouter(prefix='/products', tags=['Products'])

@router.get('', response_model=StandardResponse)
async def list_products(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Product).where(Product.deleted_at == None))
    items = res.scalars().all()
    return StandardResponse(success=True, data=[
        {
            'id': p.id,
            'uuid': p.uuid,
            'name': p.name,
            'category': p.category,
            'co2_requirement_ton_per_unit': p.co2_requirement_ton_per_unit,
            'market_price_per_unit': p.market_price_per_unit,
            'trl': p.trl,
        } for p in items
    ])

@router.get('/{product_id}', response_model=StandardResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Product).where(Product.id == product_id, Product.deleted_at == None))
    p = res.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail='Product not found')
    return StandardResponse(success=True, data={
        'id': p.id,
        'uuid': p.uuid,
        'name': p.name,
        'category': p.category,
        'co2_requirement_ton_per_unit': p.co2_requirement_ton_per_unit,
        'market_price_per_unit': p.market_price_per_unit,
        'trl': p.trl,
    })
