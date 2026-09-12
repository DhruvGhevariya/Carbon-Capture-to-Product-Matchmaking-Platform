from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.database import get_db
from app.models.user import User
from app.models.listing import Listing, ListingStatus
from app.models.bid import Bid, BidStatus
from app.models.order import Order
from app.schemas.listing import ListingCreateRequest, ListingUpdateRequest, ListingResponse
from app.security import require_seller

router = APIRouter(tags=["Seller Operations"])


@router.get("/seller/dashboard")
async def get_seller_dashboard(
    current_user: User = Depends(require_seller),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns seller dashboard metrics computed purely from real database data:
    - Active listings
    - Current stored tons
    - Pending bids
    - Revenue
    - Storage utilization
    """
    listings_res = await db.execute(
        select(Listing).where(Listing.seller_id == current_user.id)
    )
    all_listings = listings_res.scalars().all()
    active_listings = [item for item in all_listings if item.status == ListingStatus.AVAILABLE]
    active_listings_count = len(active_listings)

    current_stored_tons = round(sum(float(item.volume_metric_tons) for item in active_listings), 2)
    total_capacity_tons = round(sum(float(item.volume_metric_tons) for item in all_listings), 2)
    storage_utilization_pct = round((current_stored_tons / total_capacity_tons) * 100, 2) if total_capacity_tons > 0 else 0.0

    bids_res = await db.execute(
        select(func.count(Bid.id))
        .join(Listing, Bid.listing_id == Listing.id)
        .where(and_(Listing.seller_id == current_user.id, Bid.status == BidStatus.PENDING))
    )
    pending_bids_count = bids_res.scalar() or 0

    orders_res = await db.execute(
        select(Order).where(Order.seller_id == current_user.id)
    )
    orders = orders_res.scalars().all()
    total_revenue = round(sum(float(o.final_price_ton) * float(o.quantity_tons) for o in orders), 2)

    return {
        "success": True,
        "data": {
            "active_listings": active_listings_count,
            "current_stored_tons": current_stored_tons,
            "pending_bids": pending_bids_count,
            "revenue": total_revenue,
            "storage_utilization": storage_utilization_pct,
            "currency": "INR",
        }
    }


@router.post("/listings", status_code=status.HTTP_201_CREATED)
async def create_listing(
    request: ListingCreateRequest,
    current_user: User = Depends(require_seller),
    db: AsyncSession = Depends(get_db)
):
    """
    Publishes a new captured CO2 batch to the marketplace.
    """
    listing = Listing(
        seller_id=current_user.id,
        purity_percentage=request.purity_percentage,
        volume_metric_tons=request.volume_metric_tons,
        physical_state=request.physical_state,
        reserve_price_ton=request.reserve_price_ton,
        status=ListingStatus.AVAILABLE,
        available_from=request.available_from,
        available_until=request.available_until,
    )
    db.add(listing)
    await db.commit()
    await db.refresh(listing)

    return {
        "success": True,
        "data": {
            "listing_id": listing.id,
            "seller_id": listing.seller_id,
            "purity_percentage": float(listing.purity_percentage),
            "volume_metric_tons": float(listing.volume_metric_tons),
            "physical_state": listing.physical_state,
            "reserve_price_ton": float(listing.reserve_price_ton),
            "status": listing.status.value if hasattr(listing.status, "value") else str(listing.status),
            "available_from": listing.available_from.isoformat(),
            "available_until": listing.available_until.isoformat(),
            "created_at": listing.created_at.isoformat(),
        }
    }


@router.get("/listings")
async def get_seller_listings(
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_seller),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves seller inventory list with pagination and optional status filter.
    """
    query = select(Listing).where(Listing.seller_id == current_user.id)
    if status_filter:
        query = query.where(Listing.status == status_filter)

    query = query.order_by(Listing.created_at.desc()).offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    listings = result.scalars().all()

    items = []
    for item in listings:
        bids_count_res = await db.execute(
            select(func.count(Bid.id)).where(and_(Bid.listing_id == item.id, Bid.status == BidStatus.PENDING))
        )
        p_count = bids_count_res.scalar() or 0

        items.append({
            "id": item.id,
            "purity_percentage": float(item.purity_percentage),
            "volume_metric_tons": float(item.volume_metric_tons),
            "physical_state": item.physical_state,
            "reserve_price_ton": float(item.reserve_price_ton),
            "status": item.status.value if hasattr(item.status, "value") else str(item.status),
            "available_from": item.available_from.isoformat(),
            "available_until": item.available_until.isoformat(),
            "pending_bids_count": p_count,
            "created_at": item.created_at.isoformat(),
        })

    return {
        "success": True,
        "data": {
            "items": items,
            "page": page,
            "limit": limit,
        }
    }


@router.put("/listings/{id}")
async def update_listing(
    id: str,
    request: ListingUpdateRequest,
    current_user: User = Depends(require_seller),
    db: AsyncSession = Depends(get_db)
):
    """
    Updates an available batch listing before a bid is accepted.
    """
    result = await db.execute(
        select(Listing).where(and_(Listing.id == id, Listing.seller_id == current_user.id))
    )
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    if listing.status != ListingStatus.AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot modify batch: Listing is already reserved, sold, or cancelled.",
        )

    if request.volume_metric_tons is not None:
        listing.volume_metric_tons = request.volume_metric_tons
    if request.reserve_price_ton is not None:
        listing.reserve_price_ton = request.reserve_price_ton
    if request.available_until is not None:
        listing.available_until = request.available_until

    await db.commit()
    await db.refresh(listing)

    return {
        "success": True,
        "data": {
            "id": listing.id,
            "volume_metric_tons": float(listing.volume_metric_tons),
            "reserve_price_ton": float(listing.reserve_price_ton),
            "available_until": listing.available_until.isoformat(),
            "status": listing.status.value if hasattr(listing.status, "value") else str(listing.status),
        }
    }


@router.delete("/listings/{id}")
async def delete_listing(
    id: str,
    current_user: User = Depends(require_seller),
    db: AsyncSession = Depends(get_db)
):
    """
    Soft-deletes/cancels an unsold CO2 batch.
    """
    result = await db.execute(
        select(Listing).where(and_(Listing.id == id, Listing.seller_id == current_user.id))
    )
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    if listing.status != ListingStatus.AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot cancel listing: Batch is in reserved or sold state.",
        )

    listing.status = ListingStatus.CANCELLED
    await db.commit()

    return {"success": True, "message": "Listing cancelled successfully."}
