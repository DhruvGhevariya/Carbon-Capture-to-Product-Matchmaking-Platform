import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.database import get_db
from app.models.user import User, UserRole
from app.models.company import Company
from app.models.listing import Listing, ListingStatus
from app.models.bid import Bid, BidStatus
from app.models.order import Order, OrderStatus
from app.models.ai_match import AIMatchResult
from app.schemas.bid import BidCreateRequest, BidActionRequest
from app.security import get_current_user, require_buyer, require_seller

router = APIRouter(prefix="/bids", tags=["Bidding & Negotiation"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_bid(
    request: BidCreateRequest,
    current_user: User = Depends(require_buyer),
    db: AsyncSession = Depends(get_db)
):
    """
    Submits a binding purchase offer against an available CO2 listing.
    """
    res = await db.execute(select(Listing).where(Listing.id == request.listing_id))
    listing = res.scalar_one_or_none()

    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CO2 listing not found.")

    if listing.status != ListingStatus.AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Listing is no longer available for bidding.",
        )

    if request.requested_quantity > float(listing.volume_metric_tons):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Requested quantity ({request.requested_quantity} t) exceeds available volume ({listing.volume_metric_tons} t).",
        )

    min_bid_allowed = round(float(listing.reserve_price_ton) * 0.70, 2)
    if request.offered_price_ton < min_bid_allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Offered price (₹{request.offered_price_ton}/t) cannot be lower than 70% of reserve price (₹{min_bid_allowed}/t).",
        )

    bid = Bid(
        listing_id=request.listing_id,
        buyer_id=current_user.id,
        offered_price_ton=request.offered_price_ton,
        requested_quantity=request.requested_quantity,
        delivery_target=request.delivery_target,
        status=BidStatus.PENDING,
    )
    db.add(bid)
    await db.commit()
    await db.refresh(bid)

    return {
        "success": True,
        "data": {
            "bid_id": bid.id,
            "listing_id": bid.listing_id,
            "buyer_id": bid.buyer_id,
            "offered_price_ton": float(bid.offered_price_ton),
            "requested_quantity": float(bid.requested_quantity),
            "total_offered_value": round(float(bid.offered_price_ton) * float(bid.requested_quantity), 2),
            "status": bid.status.value if hasattr(bid.status, "value") else str(bid.status),
            "delivery_target": bid.delivery_target.isoformat(),
            "created_at": bid.created_at.isoformat(),
        }
    }


@router.get("")
async def get_bids(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves bids filtered by user role:
    - Seller: View incoming bids on own listings.
    - Buyer: View outgoing bids placed by buyer.
    """
    if current_user.role == UserRole.SELLER or str(current_user.role) == "seller":
        query = (
            select(Bid, User, Company, Listing)
            .join(Listing, Bid.listing_id == Listing.id)
            .join(User, Bid.buyer_id == User.id)
            .join(Company, User.company_id == Company.id)
            .where(Listing.seller_id == current_user.id)
        )
    else:
        query = (
            select(Bid, User, Company, Listing)
            .join(Listing, Bid.listing_id == Listing.id)
            .join(User, Listing.seller_id == User.id)
            .join(Company, User.company_id == Company.id)
            .where(Bid.buyer_id == current_user.id)
        )

    if status_filter:
        query = query.where(Bid.status == status_filter)

    query = query.order_by(Bid.created_at.desc())
    result = await db.execute(query)
    rows = result.all()

    items = []
    for bid, counter_user, counter_company, listing in rows:
        score_res = await db.execute(
            select(AIMatchResult.match_score).where(
                AIMatchResult.listing_id == bid.listing_id,
                AIMatchResult.buyer_id == bid.buyer_id
            )
        )
        ai_score = score_res.scalar() or 90

        items.append({
            "id": bid.id,
            "listing_id": bid.listing_id,
            "purity_percentage": float(listing.purity_percentage),
            "counter_party_name": counter_user.full_name,
            "counter_party_company": counter_company.company_name,
            "offered_price_ton": float(bid.offered_price_ton),
            "requested_quantity": float(bid.requested_quantity),
            "total_offered_value": round(float(bid.offered_price_ton) * float(bid.requested_quantity), 2),
            "delivery_target": bid.delivery_target.isoformat(),
            "status": bid.status.value if hasattr(bid.status, "value") else str(bid.status),
            "ai_match_score": ai_score,
            "created_at": bid.created_at.isoformat(),
        })

    return {"success": True, "data": items}


@router.patch("/{id}")
async def act_on_bid(
    id: str,
    request: BidActionRequest,
    current_user: User = Depends(require_seller),
    db: AsyncSession = Depends(get_db)
):
    """
    Allows a seller to accept or reject an incoming bid.
    Accepting atomically generates a binding Order and locks the listing inventory.
    """
    query = (
        select(Bid, Listing)
        .join(Listing, Bid.listing_id == Listing.id)
        .where(and_(Bid.id == id, Listing.seller_id == current_user.id))
    )
    result = await db.execute(query)
    row = result.first()

    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bid request not found.")

    bid, listing = row

    if bid.status != BidStatus.PENDING:
        curr_status = bid.status.value if hasattr(bid.status, "value") else str(bid.status)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Bid has already been resolved with status: {curr_status}",
        )

    if request.action == "reject":
        bid.status = BidStatus.REJECTED
        await db.commit()
        return {"success": True, "message": "Bid rejected successfully.", "status": "rejected"}

    # Action is 'accept'
    bid.status = BidStatus.ACCEPTED
    listing.status = ListingStatus.RESERVED

    order_ref = f"#CX-{uuid.uuid4().hex[:6].upper()}-OD"
    order = Order(
        bid_id=bid.id,
        listing_id=listing.id,
        seller_id=current_user.id,
        buyer_id=bid.buyer_id,
        order_reference=order_ref,
        final_price_ton=bid.offered_price_ton,
        quantity_tons=bid.requested_quantity,
        delivery_window=f"Target Date: {bid.delivery_target.isoformat()}",
        order_status=OrderStatus.CONFIRMED,
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)

    return {
        "success": True,
        "data": {
            "bid_id": bid.id,
            "order_id": order.id,
            "order_reference": order.order_reference,
            "status": "accepted",
            "message": "Bid accepted successfully. Commercial order generated.",
        }
    }
