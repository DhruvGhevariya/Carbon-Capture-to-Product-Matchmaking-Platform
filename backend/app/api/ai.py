from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User
from app.models.listing import Listing, ListingStatus
from app.models.company import Company
from app.models.ai_match import AIMatchResult
from app.schemas.ai import AIRecommendRequest, AIRecommendResponse
from app.security import get_current_user
from app.services.ai_service import ai_match_engine

router = APIRouter(prefix="/ai", tags=["AI Recommendation Engine"])


@router.post("/recommend", response_model=AIRecommendResponse)
async def generate_recommendation(
    request: AIRecommendRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Evaluates candidate point-source CO2 streams using the deterministic AI Match Engine.
    Uses ai_service only (no external ML/LLM dependencies).
    """
    query = (
        select(Listing, Company)
        .join(User, Listing.seller_id == User.id)
        .join(Company, User.company_id == Company.id)
        .where(Listing.status == ListingStatus.AVAILABLE)
    )
    result = await db.execute(query)
    rows = result.all()

    candidates = []
    for listing, company in rows:
        candidates.append({
            "id": listing.id,
            "purity_percentage": float(listing.purity_percentage),
            "volume_metric_tons": float(listing.volume_metric_tons),
            "reserve_price_ton": float(listing.reserve_price_ton),
            "latitude": float(company.latitude),
            "longitude": float(company.longitude),
            "company_name": company.company_name,
            "industry_type": company.industry_type,
            "location_name": company.location_name,
            "reliability": 4.9,
        })

    buyer_demand = {
        "required_quantity_tons": request.required_quantity_tons,
        "minimum_purity_floor": request.minimum_purity_floor,
        "budget_ceiling_per_ton": request.budget_ceiling_per_ton,
        "delivery_deadline": request.delivery_deadline,
        "destination_latitude": request.destination_latitude,
        "destination_longitude": request.destination_longitude,
    }

    ranked_output = ai_match_engine.rank_candidates(candidates, buyer_demand)

    # Persist top recommendation match record
    top_rec = ranked_output["top_recommendation"]
    if top_rec and current_user:
        existing = await db.execute(
            select(AIMatchResult).where(
                AIMatchResult.listing_id == top_rec["listing_id"],
                AIMatchResult.buyer_id == current_user.id
            )
        )
        match_record = existing.scalar_one_or_none()

        if not match_record:
            match_record = AIMatchResult(
                listing_id=top_rec["listing_id"],
                buyer_id=current_user.id,
                match_score=top_rec["match_score"],
                confidence_score=top_rec["confidence_score"],
                explanation_text=top_rec["explanation"]
            )
            db.add(match_record)
            await db.commit()

    return AIRecommendResponse(
        top_recommendation=top_rec,
        ranked_alternatives=ranked_output["ranked_alternatives"],
        evaluated_candidates_count=ranked_output["evaluated_candidates_count"]
    )
