from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_

from app.database import get_db
from app.models.user import User
from app.models.company import Company
from app.models.listing import Listing, ListingStatus
from app.models.order import Order, OrderStatus
from app.schemas.order import OrderStatusUpdateRequest
from app.security import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders & Fulfillment"])


@router.get("")
async def get_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves confirmed commercial contracts for the authenticated user (both seller & buyer).
    """
    query = (
        select(Order, Listing)
        .join(Listing, Order.listing_id == Listing.id)
        .where(or_(Order.seller_id == current_user.id, Order.buyer_id == current_user.id))
        .order_by(Order.confirmed_at.desc())
    )
    result = await db.execute(query)
    rows = result.all()

    orders_list = []
    for order, listing in rows:
        seller_res = await db.execute(
            select(User, Company).join(Company, User.company_id == Company.id).where(User.id == order.seller_id)
        )
        seller_user, seller_company = seller_res.first()

        buyer_res = await db.execute(
            select(User, Company).join(Company, User.company_id == Company.id).where(User.id == order.buyer_id)
        )
        buyer_user, buyer_company = buyer_res.first()

        orders_list.append({
            "id": order.id,
            "order_reference": order.order_reference,
            "bid_id": order.bid_id,
            "listing_id": order.listing_id,
            "seller_id": order.seller_id,
            "seller_name": seller_user.full_name,
            "seller_company": seller_company.company_name,
            "buyer_id": order.buyer_id,
            "buyer_name": buyer_user.full_name,
            "buyer_company": buyer_company.company_name,
            "final_price_ton": float(order.final_price_ton),
            "quantity_tons": float(order.quantity_tons),
            "total_value": round(float(order.final_price_ton) * float(order.quantity_tons), 2),
            "delivery_window": order.delivery_window,
            "order_status": order.order_status.value if hasattr(order.order_status, "value") else str(order.order_status),
            "purity_percentage": float(listing.purity_percentage),
            "confirmed_at": order.confirmed_at.isoformat(),
        })

    return {"success": True, "data": orders_list}


@router.get("/{id}")
async def get_order_detail(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns full order details, specifications, and digital bill of lading summary.
    """
    result = await db.execute(
        select(Order, Listing)
        .join(Listing, Order.listing_id == Listing.id)
        .where(and_(Order.id == id, or_(Order.seller_id == current_user.id, Order.buyer_id == current_user.id)))
    )
    row = result.first()

    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order contract not found.")

    order, listing = row

    seller_res = await db.execute(
        select(User, Company).join(Company, User.company_id == Company.id).where(User.id == order.seller_id)
    )
    seller_user, seller_company = seller_res.first()

    buyer_res = await db.execute(
        select(User, Company).join(Company, User.company_id == Company.id).where(User.id == order.buyer_id)
    )
    buyer_user, buyer_company = buyer_res.first()

    total_val = round(float(order.final_price_ton) * float(order.quantity_tons), 2)

    return {
        "success": True,
        "data": {
            "order_id": order.id,
            "order_reference": order.order_reference,
            "status": order.order_status.value if hasattr(order.order_status, "value") else str(order.order_status),
            "seller": {
                "name": seller_company.company_name,
                "contact_person": seller_user.full_name,
                "location": seller_company.location_name,
            },
            "buyer": {
                "name": buyer_company.company_name,
                "contact_person": buyer_user.full_name,
                "location": buyer_company.location_name,
            },
            "commercial_terms": {
                "quantity_metric_tons": float(order.quantity_tons),
                "commodity_price_ton": float(order.final_price_ton),
                "total_order_value": total_val,
                "scheduled_pickup_window": order.delivery_window,
            },
            "technical_spec_sheet": {
                "purity_percentage": float(listing.purity_percentage),
                "physical_state": listing.physical_state,
            },
            "confirmed_at": order.confirmed_at.isoformat(),
        }
    }


@router.patch("/{id}")
async def update_order_status(
    id: str,
    request: OrderStatusUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Advances order fulfillment state along the linear lifecycle:
    confirmed -> in_transit -> completed
    """
    result = await db.execute(
        select(Order).where(and_(Order.id == id, or_(Order.seller_id == current_user.id, Order.buyer_id == current_user.id)))
    )
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    current_st = order.order_status.value if hasattr(order.order_status, "value") else str(order.order_status)
    new_st = request.status.value if hasattr(request.status, "value") else str(request.status)

    valid_transitions = {
        "confirmed": ["in_transit"],
        "in_transit": ["completed"],
        "completed": [],
    }

    if new_st not in valid_transitions.get(current_st, []):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Illegal state transition from '{current_st}' to '{new_st}'. Allowed next state: {valid_transitions.get(current_st, [])}",
        )

    order.order_status = request.status

    if new_st == "completed":
        list_res = await db.execute(select(Listing).where(Listing.id == order.listing_id))
        listing = list_res.scalar_one_or_none()
        if listing:
            listing.status = ListingStatus.SOLD

    await db.commit()

    return {
        "success": True,
        "data": {
            "order_id": order.id,
            "order_reference": order.order_reference,
            "status": order.order_status.value if hasattr(order.order_status, "value") else str(order.order_status),
            "message": f"Order status updated to {new_st}.",
        }
    }
