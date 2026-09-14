from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.exceptions import EntityNotFoundException, ValidationException
from app.core.dependencies import get_current_user_token_payload
from app.models.domain import Partnership, Bid, Organization
from app.schemas.domain_schemas import StandardResponse

router = APIRouter(prefix="/partnerships", tags=["B2B Industrial Partnerships"])


@router.post("", response_model=StandardResponse, status_code=status.HTTP_201_CREATED)
async def create_partnership(
    payload: dict,
    user_payload: dict = Depends(get_current_user_token_payload),
    db: AsyncSession = Depends(get_db),
):
    buyer_org_id = user_payload.get("company_id", 5)
    emitter_org_id = int(payload.get("emitter_org_id", 1))
    bid_id = payload.get("bid_id")
    partnership_name = payload.get("partnership_name", "CCUS Off-take Partnership Agreement")

    partnership = Partnership(
        emitter_org_id=emitter_org_id,
        buyer_org_id=buyer_org_id,
        bid_id=bid_id,
        partnership_name=partnership_name,
        status="ACTIVE",
    )
    db.add(partnership)
    await db.commit()
    await db.refresh(partnership)

    return StandardResponse(
        success=True,
        data={
            "id": partnership.id,
            "uuid": partnership.uuid,
            "partnership_name": partnership.partnership_name,
            "emitter_org_id": partnership.emitter_org_id,
            "buyer_org_id": partnership.buyer_org_id,
            "status": partnership.status,
            "created_at": partnership.created_at.isoformat(),
        },
    )


@router.get("", response_model=StandardResponse)
async def list_partnerships(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Partnership))
    partnerships = res.scalars().all()
    items = []
    for p in partnerships:
        items.append({
            "id": p.id,
            "uuid": p.uuid,
            "partnership_name": p.partnership_name,
            "emitter_org_id": p.emitter_org_id,
            "buyer_org_id": p.buyer_org_id,
            "status": p.status,
            "created_at": p.created_at.isoformat(),
        })

    return StandardResponse(success=True, data=items)


@router.get("/{id}", response_model=StandardResponse)
async def get_partnership_detail(id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Partnership).where(Partnership.id == id))
    p = res.scalars().first()
    if not p:
        raise EntityNotFoundException("Partnership", id)

    return StandardResponse(
        success=True,
        data={
            "id": p.id,
            "uuid": p.uuid,
            "partnership_name": p.partnership_name,
            "emitter_org_id": p.emitter_org_id,
            "buyer_org_id": p.buyer_org_id,
            "status": p.status,
            "created_at": p.created_at.isoformat(),
        },
    )
