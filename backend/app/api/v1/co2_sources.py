from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.exceptions import EntityNotFoundException, ValidationException
from app.core.dependencies import get_current_user_token_payload
from app.models.domain import CO2Source, CO2Profile, Organization
from app.schemas.domain_schemas import CO2SourceCreateSchema, CO2SourceResponseSchema, CO2FingerprintResponseSchema, StandardResponse
from app.engines.fingerprint.fingerprint_engine import fingerprint_engine

router = APIRouter(prefix="/co2-sources", tags=["CO2 Sources & Fingerprints"])


@router.post("", response_model=StandardResponse, status_code=status.HTTP_201_CREATED)
async def create_co2_source(
    payload: CO2SourceCreateSchema,
    user_payload: dict = Depends(get_current_user_token_payload),
    db: AsyncSession = Depends(get_db),
):
    org_id = user_payload.get("company_id")
    if not org_id:
        # Fallback to first organization if user has no assigned company
        res_org = await db.execute(select(Organization))
        org = res_org.scalars().first()
        org_id = org.id if org else 1

    source = CO2Source(
        organization_id=int(org_id),
        name=payload.name,
        facility_name=payload.facility_name,
        industry_type=payload.industry_type,
        location_name=payload.location_name,
        latitude=payload.latitude,
        longitude=payload.longitude,
        annual_capture_tonnes=payload.annual_capture_tonnes,
        daily_capture_tonnes=payload.daily_capture_tonnes,
        purity_percentage=payload.purity_percentage,
        temperature_c=payload.temperature_c,
        pressure_bar=payload.pressure_bar,
        physical_state=payload.physical_state,
        impurities_json=payload.impurities_json or {},
        source_status="ACTIVE",
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)

    # Generate initial CO2 profile fingerprint
    fp = fingerprint_engine.generate_fingerprint({
        "purity_percentage": source.purity_percentage,
        "daily_capture_tonnes": source.daily_capture_tonnes,
        "pressure_bar": source.pressure_bar,
        "temperature_c": source.temperature_c,
    })

    profile = CO2Profile(
        source_id=source.id,
        purity_score=fp["purity_score"],
        volume_score=fp["volume_score"],
        pressure_score=fp["pressure_score"],
        temperature_score=fp["temperature_score"],
        overall_quality_score=fp["overall_quality_score"],
        readiness_tier=fp["readiness_tier"],
        suitable_grades=fp["suitable_grades"],
        version=1,
    )
    db.add(profile)
    await db.commit()

    return StandardResponse(
        success=True,
        data={
            "id": source.id,
            "uuid": source.uuid,
            "name": source.name,
            "purity_percentage": source.purity_percentage,
            "fingerprint": fp,
        },
    )


@router.get("", response_model=StandardResponse)
async def list_co2_sources(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    offset = (page - 1) * limit
    res = await db.execute(select(CO2Source).offset(offset).limit(limit))
    sources = res.scalars().all()

    items = []
    for s in sources:
        items.append({
            "id": s.id,
            "uuid": s.uuid,
            "name": s.name,
            "facility_name": s.facility_name,
            "industry_type": s.industry_type,
            "location_name": s.location_name,
            "purity_percentage": s.purity_percentage,
            "daily_capture_tonnes": s.daily_capture_tonnes,
            "physical_state": s.physical_state,
            "source_status": s.source_status,
        })

    return StandardResponse(success=True, data={"items": items, "page": page, "limit": limit})


@router.get("/{id}", response_model=StandardResponse)
async def get_co2_source_detail(id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(CO2Source).where(CO2Source.id == id))
    source = res.scalars().first()
    if not source:
        raise EntityNotFoundException("CO2Source", id)

    fp_res = await db.execute(select(CO2Profile).where(CO2Profile.source_id == id))
    profile = fp_res.scalars().first()

    fp_data = None
    if profile:
        fp_data = {
            "purity_score": profile.purity_score,
            "volume_score": profile.volume_score,
            "pressure_score": profile.pressure_score,
            "temperature_score": profile.temperature_score,
            "overall_quality_score": profile.overall_quality_score,
            "readiness_tier": profile.readiness_tier,
            "suitable_grades": profile.suitable_grades,
        }

    return StandardResponse(
        success=True,
        data={
            "id": source.id,
            "uuid": source.uuid,
            "name": source.name,
            "facility_name": source.facility_name,
            "industry_type": source.industry_type,
            "location_name": source.location_name,
            "latitude": source.latitude,
            "longitude": source.longitude,
            "purity_percentage": source.purity_percentage,
            "daily_capture_tonnes": source.daily_capture_tonnes,
            "annual_capture_tonnes": source.annual_capture_tonnes,
            "temperature_c": source.temperature_c,
            "pressure_bar": source.pressure_bar,
            "physical_state": source.physical_state,
            "fingerprint": fp_data,
        },
    )


@router.get("/{id}/fingerprint", response_model=StandardResponse)
async def get_co2_source_fingerprint(id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(CO2Source).where(CO2Source.id == id))
    source = res.scalars().first()
    if not source:
        raise EntityNotFoundException("CO2Source", id)

    fp = fingerprint_engine.generate_fingerprint({
        "purity_percentage": source.purity_percentage,
        "daily_capture_tonnes": source.daily_capture_tonnes,
        "pressure_bar": source.pressure_bar,
        "temperature_c": source.temperature_c,
    })

    return StandardResponse(success=True, data={"source_id": id, "fingerprint": fp})
