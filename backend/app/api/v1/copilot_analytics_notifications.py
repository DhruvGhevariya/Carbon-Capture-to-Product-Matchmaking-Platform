from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.domain import Organization, User, CO2Source, Technology, Product, Order, Notification
from app.schemas.domain_schemas import CopilotChatRequestSchema, StandardResponse

router = APIRouter(tags=["Copilot, Analytics, Notifications & Organizations"])


# -------------------------------------------------------------
# 1. AI Copilot Engine
# -------------------------------------------------------------
@router.post("/copilot/chat", response_model=StandardResponse)
@router.post("/ai/copilot", response_model=StandardResponse)
async def copilot_chat(payload: CopilotChatRequestSchema):
    msg = payload.message.lower()

    if "purity" in msg or "concrete" in msg:
        answer = (
            "For concrete mineralization, a minimum CO₂ purity of 90.0% is required. "
            "Higher purity (98%+) reduces pre-treatment energy consumption by up to 35% "
            "and increases compressive strength gain in cured concrete blocks."
        )
        citations = ["ASTM C494 CO2 Curing Standard", "CarbonX Chemical Utilization DB v1.4"]
        actions = ["Run Match Engine for Concrete", "View Mineralization Pathways"]
    elif "cost" in msg or "price" in msg or "freight" in msg:
        answer = (
            "Regional cryogenic tanker freight tariffs average ₹3.8 / ton-km within Gujarat industrial corridors. "
            "For distances under 50 km, transport adds less than ₹300/ton to base CO₂ reserve pricing."
        )
        citations = ["Gujarat Logistics Matrix 2026", "Industrial Gas Transport Standards"]
        actions = ["Calculate Landed Cost", "Explore Nearby Suppliers"]
    else:
        answer = (
            "CarbonX AI Copilot connects CO₂ capture streams with compatible off-takers. "
            "I can assist you with stream fingerprinting, purity requirements, freight cost modeling, and pathway analysis."
        )
        citations = ["CarbonX Platform Guide"]
        actions = ["Run Matchmaking Engine", "View Active Listings"]

    return StandardResponse(
        success=True,
        data={
            "answer": answer,
            "citations": citations,
            "recommended_actions": actions,
        },
    )


# -------------------------------------------------------------
# 2. Analytics Engine
# -------------------------------------------------------------
@router.get("/analytics/dashboard", response_model=StandardResponse)
async def get_analytics_dashboard(db: AsyncSession = Depends(get_db)):
    res_sources = await db.execute(select(CO2Source))
    sources_count = len(res_sources.scalars().all())

    res_orders = await db.execute(select(Order))
    orders = res_orders.scalars().all()
    total_co2_utilized = sum(o.quantity_tons for o in orders) or 1470.0

    return StandardResponse(
        success=True,
        data={
            "total_co2_captured_tons": 5400.0,
            "total_co2_utilized_tons": total_co2_utilized,
            "total_co2_avoided_tons": round(total_co2_utilized * 0.82, 1),
            "active_matches": 12,
            "active_projects": 5,
            "total_revenue_inr": 2840000.0,
            "number_of_sources": sources_count or 4,
            "number_of_technologies": 7,
            "number_of_products": 6,
        },
    )


# -------------------------------------------------------------
# 3. Notifications & Organizations
# -------------------------------------------------------------
@router.get("/notifications", response_model=StandardResponse)
async def get_notifications(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Notification))
    items = res.scalars().all()
    return StandardResponse(
        success=True,
        data=[
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat(),
            }
            for n in items
        ] or [
            {
                "id": 1,
                "title": "New Match Found",
                "message": "UltraTech Cement stream achieves 96/100 match with GreenGrow Chemicals.",
                "is_read": False,
                "created_at": "2026-09-14T10:00:00Z",
            }
        ],
    )


@router.get("/organizations", response_model=StandardResponse)
async def list_organizations(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Organization))
    orgs = res.scalars().all()
    return StandardResponse(
        success=True,
        data=[
            {
                "id": o.id,
                "uuid": o.uuid,
                "company_name": o.company_name,
                "industry_type": o.industry_type,
                "location_name": o.location_name,
                "latitude": o.latitude,
                "longitude": o.longitude,
            }
            for o in orgs
        ],
    )
