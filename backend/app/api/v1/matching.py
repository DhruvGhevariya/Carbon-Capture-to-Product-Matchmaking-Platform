from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.domain import Listing, User, Organization, AIMatchResult
from app.schemas.domain_schemas import MatchRequestSchema, StandardResponse
from app.engines.matching.match_engine import match_engine

router = APIRouter(tags=["Matchmaking Engine"])


@router.post("/matching/run", response_model=StandardResponse)
@router.post("/ai/recommendations", response_model=StandardResponse)
@router.post("/ai/recommend", response_model=StandardResponse)
async def run_matchmaking(demand: MatchRequestSchema, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Listing).where(Listing.status == "available"))
    available_listings = res.scalars().all()

    evaluated_matches = []
    for l in available_listings:
        # Fetch seller details
        u_res = await db.execute(select(User).where(User.id == l.seller_id))
        seller = u_res.scalars().first()

        company_name = "Industrial Emitter"
        location_name = "Sanand Cluster, Ahmedabad"
        industry_type = "Cement"
        seller_lat, seller_lon = 22.9868, 72.3814

        if seller and seller.company_id:
            c_res = await db.execute(select(Organization).where(Organization.id == seller.company_id))
            comp = c_res.scalars().first()
            if comp:
                company_name = comp.company_name
                location_name = comp.location_name
                industry_type = comp.industry_type
                seller_lat, seller_lon = comp.latitude, comp.longitude

        cand_dict = {
            "id": l.id,
            "company_name": company_name,
            "industry_type": industry_type,
            "location_name": location_name,
            "latitude": seller_lat,
            "longitude": seller_lon,
            "purity_percentage": l.purity_percentage,
            "volume_metric_tons": l.volume_metric_tons,
            "reserve_price_ton": l.reserve_price_ton,
        }

        match_res = match_engine.evaluate_match(cand_dict, demand.model_dump())
        evaluated_matches.append(match_res)

    # Sort descending by match_score
    evaluated_matches.sort(key=lambda x: x["match_score"], reverse=True)

    top_match = evaluated_matches[0] if evaluated_matches else None

    # Backward compatible shape for frontend apiService getAIRecommendations
    compat_data = None
    if top_match:
        compat_data = {
            "recommended_listing_id": f"listing-{top_match['listing_id']}",
            "match_score": top_match["match_score"],
            "confidence_score": top_match["confidence_score"],
            "supplier_name": top_match["supplier_name"],
            "purity_percentage": top_match["purity_percentage"],
            "available_tons": 350,
            "estimated_distance_km": top_match["distance_km"],
            "base_price_ton": top_match["total_landed_cost_ton"] - 310,
            "transport_cost_ton": 310,
            "landed_cost_ton": top_match["total_landed_cost_ton"],
            "total_contract_value": round(top_match["total_landed_cost_ton"] * demand.required_quantity_tons, 2),
            "rationale": top_match["explanation"],
            "score_breakdown": {
                "purity_match": int(top_match["technical_score"]),
                "distance_penalty": int(top_match["geographic_score"]),
                "price_competitiveness": int(top_match["economic_score"]),
                "volume_availability": int(top_match["environmental_score"]),
                "delivery_reliability": int(top_match["trl_score"]),
            },
            "all_ranked_matches": evaluated_matches,
        }

    return StandardResponse(success=True, data=compat_data or {"matches": evaluated_matches})


@router.get("/matches", response_model=StandardResponse)
async def list_matches(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AIMatchResult).order_by(AIMatchResult.match_score.desc()).limit(20))
    matches = res.scalars().all()
    items = []
    for m in matches:
        items.append({
            "id": m.id,
            "listing_id": m.listing_id,
            "match_score": m.match_score,
            "confidence_score": m.confidence_score,
            "explanation": m.explanation_text,
        })
    return StandardResponse(success=True, data=items)
