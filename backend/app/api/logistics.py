from fastapi import APIRouter, Depends
from app.schemas.logistics import LogisticsEstimateRequest, LogisticsEstimateResponse
from app.security import get_current_user
from app.services.logistics_service import logistics_service

router = APIRouter(prefix="/logistics", tags=["Logistics & Geospatial"])


@router.post("/estimate", response_model=LogisticsEstimateResponse)
async def estimate_logistics(
    request: LogisticsEstimateRequest,
    current_user = Depends(get_current_user)
):
    """
    Computes road haulage distance, transit ETA, cryogenic transport freight costs,
    and net carbon accounting balance between origin and destination coordinates.
    """
    result = logistics_service.estimate_logistics(
        request.origin_latitude,
        request.origin_longitude,
        request.destination_latitude,
        request.destination_longitude,
        request.volume_metric_tons
    )
    return LogisticsEstimateResponse(**result)
