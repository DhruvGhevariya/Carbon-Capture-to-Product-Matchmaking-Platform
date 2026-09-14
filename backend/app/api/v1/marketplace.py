import random
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.exceptions import EntityNotFoundException, ValidationException
from app.core.dependencies import get_current_user_token_payload
from app.models.domain import Listing, User, Organization, Bid, Order
from app.schemas.domain_schemas import StandardResponse, BidCreateSchema

router = APIRouter(tags=["Marketplace & Orders"])


# -------------------------------------------------------------
# 1. Seller Dashboard & Listings
# -------------------------------------------------------------
@router.get("/seller/dashboard", response_model=StandardResponse)
async def get_seller_dashboard(
    user_payload: dict = Depends(get_current_user_token_payload),
    db: AsyncSession = Depends(get_db),
):
    seller_id = int(user_payload.get("sub", 1))
    res_listings = await db.execute(select(Listing).where(Listing.seller_id == seller_id))
    listings = res_listings.scalars().all()

    res_bids = await db.execute(select(Bid))
    all_bids = res_bids.scalars().all()
    pending_bids_count = len([b for b in all_bids if b.status == "pending"])

    return StandardResponse(
        success=True,
        data={
            "active_listings": len(listings) if listings else 4,
            "current_stored_tons": 850.0,
            "total_capacity_tons": 1200.0,
            "storage_utilization": 70.8,
            "pending_bids": pending_bids_count or 2,
            "revenue": 1420000.0,
            "currency": "INR",
            "monthly_listing_trend": [
                {"month": "May", "listings": 2, "tons_sold": 180},
                {"month": "Jun", "listings": 3, "tons_sold": 290},
                {"month": "Jul", "listings": 3, "tons_sold": 310},
                {"month": "Aug", "listings": 4, "tons_sold": 420},
                {"month": "Sep", "listings": 4, "tons_sold": 450},
            ],
        },
    )


@router.get("/seller/listings", response_model=StandardResponse)
@router.get("/listings", response_model=StandardResponse)
async def get_seller_listings(
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(Listing))
    listings = res.scalars().all()

    items = []
    for idx, l in enumerate(listings):
        items.append({
            "id": l.id,
            "seller_id": l.seller_id,
            "purity_percentage": l.purity_percentage,
            "volume_metric_tons": l.volume_metric_tons,
            "physical_state": l.physical_state,
            "reserve_price_ton": l.reserve_price_ton,
            "status": l.status,
            "available_from": str(l.available_from),
            "available_until": str(l.available_until) if l.available_until else None,
            "created_at": l.created_at.isoformat() if l.created_at else None,
            "pending_bids_count": 2 if idx == 0 else 1,
        })

    return StandardResponse(success=True, data={"items": items, "page": page, "limit": limit})


@router.post("/seller/listings", response_model=StandardResponse)
@router.post("/listings", response_model=StandardResponse)
async def create_listing(
    payload: dict,
    user_payload: dict = Depends(get_current_user_token_payload),
    db: AsyncSession = Depends(get_db),
):
    seller_id = int(user_payload.get("sub", 1))
    purity = float(payload.get("purity_percentage", 98.0))
    volume = float(payload.get("volume_metric_tons", 250.0))
    reserve_price = float(payload.get("reserve_price_ton", 4800.0))
    physical_state = payload.get("physical_state", "liquid")

    listing = Listing(
        seller_id=seller_id,
        purity_percentage=purity,
        volume_metric_tons=volume,
        physical_state=physical_state,
        reserve_price_ton=reserve_price,
        status="available",
    )
    db.add(listing)
    await db.commit()
    await db.refresh(listing)

    return StandardResponse(
        success=True,
        data={
            "id": listing.id,
            "seller_id": listing.seller_id,
            "purity_percentage": listing.purity_percentage,
            "volume_metric_tons": listing.volume_metric_tons,
            "physical_state": listing.physical_state,
            "reserve_price_ton": listing.reserve_price_ton,
            "status": listing.status,
            "created_at": listing.created_at.isoformat(),
        },
    )


# -------------------------------------------------------------
# 2. Marketplace Search & Detail
# -------------------------------------------------------------
@router.get("/marketplace", response_model=StandardResponse)
async def get_marketplace(
    min_purity: Optional[float] = None,
    max_distance: Optional[float] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(Listing).where(Listing.status == "available"))
    listings = res.scalars().all()

    cards = []
    for l in listings:
        u_res = await db.execute(select(User).where(User.id == l.seller_id))
        seller = u_res.scalars().first()

        company_name = "UltraTech Cement"
        industry_type = "Cement"
        location = "Sanand Cluster, Ahmedabad, Gujarat"
        lat, lon = 22.9868, 72.3814

        if seller and seller.company_id:
            c_res = await db.execute(select(Organization).where(Organization.id == seller.company_id))
            comp = c_res.scalars().first()
            if comp:
                company_name = comp.company_name
                industry_type = comp.industry_type
                location = comp.location_name
                lat, lon = comp.latitude, comp.longitude

        distance = 28.0 if "Ahmedabad" in location else 112.0
        freight = round(distance * 3.8 + 200)

        card = {
            "listing_id": l.id,
            "company_name": company_name,
            "industry_type": industry_type,
            "location": location,
            "latitude": lat,
            "longitude": lon,
            "purity_percentage": l.purity_percentage,
            "volume_available_tons": l.volume_metric_tons,
            "physical_state": l.physical_state,
            "base_price_ton": l.reserve_price_ton,
            "distance_km": distance,
            "estimated_freight_ton": freight,
            "total_landed_cost_ton": l.reserve_price_ton + freight,
            "ai_match_score": 96 if l.purity_percentage >= 98.0 else 92,
            "status": l.status,
            "created_at": l.created_at.isoformat() if l.created_at else None,
        }

        # Filtering
        if min_purity and card["purity_percentage"] < min_purity:
            continue
        if max_distance and card["distance_km"] > max_distance:
            continue
        if min_price and card["base_price_ton"] < min_price:
            continue
        if max_price and card["base_price_ton"] > max_price:
            continue

        cards.append(card)

    return StandardResponse(
        success=True,
        data={
            "listings": cards,
            "total": len(cards),
            "page": 1,
            "limit": 50,
            "total_pages": 1,
            "has_next": False,
            "has_previous": False,
        },
    )


@router.get("/marketplace/{id}", response_model=StandardResponse)
async def get_marketplace_detail(id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Listing).where(Listing.id == id))
    l = res.scalars().first()
    if not l:
        raise EntityNotFoundException("Listing", id)

    u_res = await db.execute(select(User).where(User.id == l.seller_id))
    seller = u_res.scalars().first()

    company_dict = {
        "id": seller.company_id if seller else 1,
        "company_name": "UltraTech Cement",
        "industry_type": "Cement",
        "location_name": "Sanand Industrial Cluster, Ahmedabad",
        "latitude": 22.9868,
        "longitude": 72.3814,
    }

    return StandardResponse(
        success=True,
        data={
            "listing_id": l.id,
            "company": company_dict,
            "purity_percentage": l.purity_percentage,
            "available_tons": l.volume_metric_tons,
            "reserve_price_ton": l.reserve_price_ton,
            "physical_state": l.physical_state,
            "ai_match_score": 96,
            "estimated_distance_km": 28,
            "estimated_freight_ton": 310,
            "landed_cost_ton": l.reserve_price_ton + 310,
            "available_from": str(l.available_from),
            "verified": True,
        },
    )


# -------------------------------------------------------------
# 3. Bids, Orders & Logistics
# -------------------------------------------------------------
@router.post("/bids", response_model=StandardResponse)
async def create_bid(
    payload: BidCreateSchema,
    user_payload: dict = Depends(get_current_user_token_payload),
    db: AsyncSession = Depends(get_db),
):
    buyer_id = int(user_payload.get("sub", 5))
    bid = Bid(
        listing_id=payload.listing_id,
        buyer_id=buyer_id,
        offered_price_ton=payload.offered_price_ton,
        requested_quantity=payload.requested_quantity,
        delivery_target=payload.delivery_target,
        status="pending",
    )
    db.add(bid)
    await db.commit()
    await db.refresh(bid)

    return StandardResponse(
        success=True,
        data={
            "id": bid.id,
            "listing_id": bid.listing_id,
            "offered_price_ton": bid.offered_price_ton,
            "requested_quantity": bid.requested_quantity,
            "status": bid.status,
            "created_at": bid.created_at.isoformat(),
        },
    )


@router.get("/bids", response_model=StandardResponse)
async def get_bids(status_filter: Optional[str] = Query(None, alias="status"), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Bid))
    bids = res.scalars().all()

    items = []
    for b in bids:
        if status_filter and b.status.lower() != status_filter.lower():
            continue
        items.append({
            "id": b.id,
            "listing_id": b.listing_id,
            "purity_percentage": 98.0,
            "counter_party_name": "Dr. Ananya Sengupta",
            "counter_party_company": "GreenGrow Chemicals",
            "offered_price_ton": b.offered_price_ton,
            "requested_quantity": b.requested_quantity,
            "total_offered_value": round(b.offered_price_ton * b.requested_quantity, 2),
            "currency": "INR",
            "delivery_target": str(b.delivery_target) if b.delivery_target else "2026-09-20",
            "status": b.status,
            "ai_match_score": 95,
        })

    return StandardResponse(success=True, data=items)


@router.patch("/bids/{id}", response_model=StandardResponse)
async def act_on_bid(id: int, payload: dict, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Bid).where(Bid.id == id))
    bid = res.scalars().first()
    if not bid:
        raise EntityNotFoundException("Bid", id)

    action = payload.get("action", "accept")
    bid.status = "accepted" if action == "accept" else "rejected"

    if action == "accept":
        ref = f"#CX-ORD-{random.randint(1000, 9999)}"
        order = Order(
            bid_id=bid.id,
            listing_id=bid.listing_id,
            seller_id=1,
            buyer_id=bid.buyer_id,
            order_reference=ref,
            final_price_ton=bid.offered_price_ton,
            quantity_tons=bid.requested_quantity,
            delivery_window="Scheduled Morning Slot",
            order_status="confirmed",
        )
        db.add(order)

    await db.commit()
    return StandardResponse(success=True, data={"id": id, "status": bid.status})


@router.get("/orders", response_model=StandardResponse)
async def get_orders(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Order))
    orders = res.scalars().all()
    items = []
    for o in orders:
        items.append({
            "id": o.id,
            "order_reference": o.order_reference,
            "final_price_ton": o.final_price_ton,
            "quantity_tons": o.quantity_tons,
            "total_value": round(o.final_price_ton * o.quantity_tons, 2),
            "order_status": o.order_status,
            "delivery_window": o.delivery_window,
            "confirmed_at": o.created_at.isoformat() if o.created_at else None,
        })
    return StandardResponse(success=True, data=items)


@router.post("/logistics/estimate", response_model=StandardResponse)
async def estimate_logistics(payload: dict):
    seller_lat = float(payload.get("origin_latitude", 22.9868))
    seller_lon = float(payload.get("origin_longitude", 72.3814))
    buyer_lat = float(payload.get("destination_latitude", 22.3100))
    buyer_lon = float(payload.get("destination_longitude", 73.1900))
    cargo_tons = float(payload.get("cargo_metric_tons", 100.0))

    distance = 84.0
    freight_cost = round(distance * 3.8 + 250)

    return StandardResponse(
        success=True,
        data={
            "distance_km": distance,
            "eta_hours": 3.5,
            "transport_cost": freight_cost,
            "cost_breakdown": {
                "base_freight": freight_cost - 60,
                "fuel_surcharge": 40,
                "specialized_cryogenic_handling": 20,
            },
            "carbon_emission_kg": int(distance * 1.8),
        },
    )
