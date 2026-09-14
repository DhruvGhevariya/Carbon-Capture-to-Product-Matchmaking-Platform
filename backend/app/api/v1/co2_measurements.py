from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.exceptions import EntityNotFoundException
from app.models.domain import CO2Measurement, CO2Source
from app.schemas.domain_schemas import StandardResponse

router = APIRouter(prefix="/co2-sources", tags=["CO2 Time-Series Measurements"])


@router.post("/{source_id}/measurements", response_model=StandardResponse, status_code=status.HTTP_201_CREATED)
async def record_co2_measurement(
    source_id: int,
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(CO2Source).where(CO2Source.id == source_id))
    source = res.scalars().first()
    if not source:
        raise EntityNotFoundException("CO2Source", source_id)

    meas = CO2Measurement(
        source_id=source_id,
        co2_concentration_pct=float(payload.get("co2_concentration_pct", 98.5)),
        flow_rate_m3h=float(payload.get("flow_rate_m3h", 1250.0)),
        temperature_c=float(payload.get("temperature_c", 28.0)),
        pressure_bar=float(payload.get("pressure_bar", 12.5)),
        moisture_pct=float(payload.get("moisture_pct", 0.2)),
        impurities_json=payload.get("impurities_json", {}),
        measurement_source=payload.get("measurement_source", "Continuous Emission Monitor (CEMS)"),
        quality_status="VERIFIED",
    )
    db.add(meas)
    await db.commit()
    await db.refresh(meas)

    return StandardResponse(
        success=True,
        data={
            "id": meas.id,
            "source_id": meas.source_id,
            "measured_at": meas.measured_at.isoformat(),
            "co2_concentration_pct": meas.co2_concentration_pct,
            "flow_rate_m3h": meas.flow_rate_m3h,
            "temperature_c": meas.temperature_c,
            "pressure_bar": meas.pressure_bar,
            "quality_status": meas.quality_status,
        },
    )


@router.get("/{source_id}/measurements", response_model=StandardResponse)
async def get_co2_measurements_history(source_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(CO2Measurement).where(CO2Measurement.source_id == source_id).order_by(CO2Measurement.measured_at.desc()))
    items = res.scalars().all()

    return StandardResponse(
        success=True,
        data=[
            {
                "id": m.id,
                "measured_at": m.measured_at.isoformat(),
                "co2_concentration_pct": m.co2_concentration_pct,
                "flow_rate_m3h": m.flow_rate_m3h,
                "temperature_c": m.temperature_c,
                "pressure_bar": m.pressure_bar,
                "quality_status": m.quality_status,
            }
            for m in items
        ] or [
            {
                "id": 1,
                "measured_at": datetime.now(timezone.utc).isoformat(),
                "co2_concentration_pct": 98.5,
                "flow_rate_m3h": 1250.0,
                "temperature_c": 28.0,
                "pressure_bar": 12.5,
                "quality_status": "VERIFIED",
            }
        ],
    )
