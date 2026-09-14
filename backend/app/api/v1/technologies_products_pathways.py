from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.v1.technologies import list_technologies as canonical_list_technologies
from app.api.v1.products import list_products as canonical_list_products
from app.api.v1.pathways import list_pathways as canonical_list_pathways
from app.schemas.domain_schemas import StandardResponse

router = APIRouter(tags=["Technologies, Products & Pathways (Legacy Compatibility)"])


@router.get("/technologies", response_model=StandardResponse)
async def list_technologies(db: AsyncSession = Depends(get_db)):
    return await canonical_list_technologies(db=db)


@router.get("/products", response_model=StandardResponse)
async def list_products(db: AsyncSession = Depends(get_db)):
    return await canonical_list_products(db=db)


@router.get("/pathways", response_model=StandardResponse)
async def list_pathways(db: AsyncSession = Depends(get_db)):
    return await canonical_list_pathways(db=db)

