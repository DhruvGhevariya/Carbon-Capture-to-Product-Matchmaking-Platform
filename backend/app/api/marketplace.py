import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.listing import Listing, ListingStatus
from app.models.user import User
from app.models.company import Company
from app.security import get_current_user
from app.services.logistics_service import logistics_service
from app.services.ai_service import ai_match_engine

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])


@router.get("")
async def get_marketplace(
    min_purity: Optional[float] = Query(None, ge=70.0, le=99.99),
    max_distance: Optional[float] = Query(None, gt=0.0),
    min_price: Optional[float] = Query(None, ge=0.0),
    max_price: Optional[float] = Query(None, ge=0.0),
    quantity: Optional[float] = Query(None, gt=0.0),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort_by: Optional[str] = Query("ai_score"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns active point-source captured CO2 streams with filtering, pagination, and search.
    """
    # Fetch buyer's company coordinates
    buyer_comp_res = await db.execute(select(Company).where(Company.id == current_user.company_id))
    buyer_comp = buyer_comp_res.scalar_one_or_none()

    buyer_lat = float(buyer_comp.latitude) if buyer_comp else 22.7523
    buyer_lon = float(buyer_comp.longitude) if buyer_comp else 72.6841

    query = (
        select(Listing, Company)
        .join(User, Listing.seller_id == User.id)
        .join(Company, User.company_id == Company.id)
        .where(Listing.status == ListingStatus.AVAILABLE)
    )

    if min_purity is not None:
        query = query.where(Listing.purity_percentage >= min_purity)
    if min_price is not None:
        query = query.where(Listing.reserve_price_ton >= min_price)
    if max_price is not None:
        query = query.where(Listing.reserve_price_ton <= max_price)
    if quantity is not None:
        query = query.where(Listing.volume_metric_tons >= (quantity * 0.25))

    result = await db.execute(query)
    rows = result.all()

    cards = []
    for listing, company in rows:
        if search:
            term = search.lower()
            if term not in company.company_name.lower() and term not in company.location_name.lower():
                continue

        seller_lat = float(company.latitude)
        seller_lon = float(company.longitude)

        req_vol = quantity if quantity else float(listing.volume_metric_tons)
        logistics = logistics_service.estimate_logistics(
            seller_lat, seller_lon, buyer_lat, buyer_lon, min(req_vol, float(listing.volume_metric_tons))
        )
        distance_km = logistics["distance_km"]

        if max_distance is not None and distance_km > max_distance:
            continue

        base_price = float(listing.reserve_price_ton)
        freight = logistics["transport_cost"]
        total_landed = round(base_price + freight, 2)

        eval_dict = {
            "purity_percentage": float(listing.purity_percentage),
            "volume_metric_tons": float(listing.volume_metric_tons),
            "reserve_price_ton": base_price,
            "latitude": seller_lat,
            "longitude": seller_lon,
            "company_name": company.company_name,
            "industry_type": company.industry_type,
            "location_name": company.location_name,
            "reliability": 4.8,
            "id": listing.id,
        }
        buyer_demand = {
            "minimum_purity_floor": min_purity if min_purity is not None else 70.0,
            "required_quantity_tons": req_vol,
            "budget_ceiling_per_ton": max_price if max_price is not None else (total_landed + 5000.0),
            "destination_latitude": buyer_lat,
            "destination_longitude": buyer_lon,
        }
        match_eval = ai_match_engine.evaluate_candidate(eval_dict, buyer_demand)
        if not match_eval:
            continue
        ai_score = match_eval["match_score"]

        cards.append({
            "listing_id": listing.id,
            "company_name": company.company_name,
            "industry_type": company.industry_type,
            "location": company.location_name,
            "latitude": seller_lat,
            "longitude": seller_lon,
            "purity_percentage": float(listing.purity_percentage),
            "volume_available_tons": float(listing.volume_metric_tons),
            "physical_state": listing.physical_state,
            "base_price_ton": base_price,
            "distance_km": distance_km,
            "estimated_freight_ton": freight,
            "total_landed_cost_ton": total_landed,
            "ai_match_score": ai_score,
            "status": listing.status.value if hasattr(listing.status, "value") else str(listing.status),
            "created_at": listing.created_at.isoformat(),
        })

    # Sort
    if sort_by == "price_asc":
        cards.sort(key=lambda x: x["total_landed_cost_ton"])
    elif sort_by == "distance_asc":
        cards.sort(key=lambda x: x["distance_km"])
    else:
        cards.sort(key=lambda x: -x["ai_match_score"])

    # Pagination
    total_records = len(cards)
    total_pages = math.ceil(total_records / limit) if total_records > 0 else 1
    has_next = page < total_pages
    has_previous = page > 1
    start_idx = (page - 1) * limit
    paginated_cards = cards[start_idx : start_idx + limit]

    return {
        "success": True,
        "data": {
            "listings": paginated_cards,
            "page": page,
            "limit": limit,
            "total": total_records,
            "total_pages": total_pages,
            "has_next": has_next,
            "has_previous": has_previous,
        }
    }


@router.get("/{id}")
async def get_marketplace_detail(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns full technical, chemical, and operational details for a specific batch.
    """
    result = await db.execute(
        select(Listing, Company)
        .join(User, Listing.seller_id == User.id)
        .join(Company, User.company_id == Company.id)
        .where(Listing.id == id)
    )
    row = result.first()

    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CO2 batch stream not found.")

    listing, company = row

    return {
        "success": True,
        "data": {
            "listing_id": listing.id,
            "company": {
                "name": company.company_name,
                "industry": company.industry_type,
                "address": company.location_name,
                "coordinates": {
                    "latitude": float(company.latitude),
                    "longitude": float(company.longitude),
                }
            },
            "purity_percentage": float(listing.purity_percentage),
            "physical_state": listing.physical_state,
            "available_tons": float(listing.volume_metric_tons),
            "reserve_price_ton": float(listing.reserve_price_ton),
            "available_from": listing.available_from.isoformat(),
            "available_until": listing.available_until.isoformat(),
            "technical_specifications": {
                "purity_percentage": float(listing.purity_percentage),
                "physical_state": listing.physical_state,
            },
            "commercial_terms": {
                "available_tons": float(listing.volume_metric_tons),
                "reserve_price_ton": float(listing.reserve_price_ton),
                "available_from": listing.available_from.isoformat(),
                "available_until": listing.available_until.isoformat(),
            }
        }
    }
