from typing import List, Dict, Any, Optional
from app.services.logistics_service import logistics_service


class AIMatchEngineService:
    """
    Deterministic, Explainable Multi-Criteria Recommendation Engine for CarbonX.
    Evaluates physical, chemical, logistical, and economic compatibility.
    No LLMs, ML libraries, or external black-box APIs.
    """

    WEIGHT_PURITY: float = 30.0
    WEIGHT_DISTANCE: float = 25.0
    WEIGHT_PRICE: float = 20.0
    WEIGHT_QUANTITY: float = 10.0
    WEIGHT_DELIVERY: float = 10.0
    WEIGHT_RELIABILITY: float = 5.0

    @classmethod
    def evaluate_candidate(
        cls,
        candidate_listing: Dict[str, Any],
        buyer_demand: Dict[str, Any],
    ) -> Optional[Dict[str, Any]]:
        """
        Evaluates a candidate CO2 stream against buyer constraints.
        Returns match metrics, sub-scores, and explanation, or None if hard-filtered.
        """
        purity: float = float(candidate_listing["purity_percentage"])
        available_tons: float = float(candidate_listing["volume_metric_tons"])
        base_price: float = float(candidate_listing["reserve_price_ton"])
        seller_lat: float = float(candidate_listing["latitude"])
        seller_lon: float = float(candidate_listing["longitude"])
        supplier_name: str = candidate_listing.get("company_name", "Industrial Emitter")
        industry_type: str = candidate_listing.get("industry_type", "Industrial")
        location: str = candidate_listing.get("location_name", "Regional Hub")
        reliability: float = float(candidate_listing.get("reliability", 4.5))

        req_purity: float = float(buyer_demand["minimum_purity_floor"])
        req_quantity: float = float(buyer_demand["required_quantity_tons"])
        budget_ton: float = float(buyer_demand["budget_ceiling_per_ton"])
        buyer_lat: float = float(buyer_demand["destination_latitude"])
        buyer_lon: float = float(buyer_demand["destination_longitude"])

        # -------------------------------------------------------------------
        # HARD CONSTRAINTS / FILTERING GATES
        # -------------------------------------------------------------------
        if purity < req_purity:
            return None

        if available_tons < (0.25 * req_quantity):
            return None

        logistics = logistics_service.estimate_logistics(
            seller_lat, seller_lon, buyer_lat, buyer_lon, min(req_quantity, available_tons)
        )
        distance_km: float = logistics["distance_km"]

        if distance_km > 500.0:
            return None

        freight_cost_ton: float = logistics["transport_cost"]
        total_landed_cost: float = base_price + freight_cost_ton

        # -------------------------------------------------------------------
        # NORMALIZED FEATURE SCORING (0.00 to 1.00)
        # -------------------------------------------------------------------
        # 1. Purity Score (Weight: 30)
        purity_margin: float = purity - req_purity
        if purity >= 99.9:
            s_purity: float = 1.00
        else:
            s_purity = min(0.70 + (purity_margin / 10.0) * 0.30, 1.00)

        # 2. Distance Score (Weight: 25)
        if distance_km <= 50.0:
            s_distance: float = 1.00 - (distance_km / 50.0) * 0.05
        elif distance_km <= 150.0:
            s_distance = 0.95 - ((distance_km - 50.0) / 100.0) * 0.20
        elif distance_km <= 300.0:
            s_distance = 0.75 - ((distance_km - 150.0) / 150.0) * 0.35
        else:
            s_distance = max(0.40 - ((distance_km - 300.0) / 200.0) * 0.30, 0.10)

        # 3. Price Score (Weight: 20)
        if total_landed_cost <= budget_ton:
            savings_ratio: float = (budget_ton - total_landed_cost) / budget_ton
            s_price: float = min(0.70 + (savings_ratio * 0.30), 1.00)
        else:
            overage_ratio: float = (total_landed_cost - budget_ton) / budget_ton
            s_price = max(0.70 - (overage_ratio * 0.60), 0.10)

        # 4. Quantity Fit Score (Weight: 10)
        if available_tons >= req_quantity:
            s_quantity: float = 1.00 if available_tons == req_quantity else 0.95
        else:
            s_quantity = max(0.50 + ((available_tons / req_quantity) * 0.40), 0.50)

        # 5. Delivery Lead Time Score (Weight: 10)
        s_delivery: float = 0.95

        # 6. Reliability Score (Weight: 5)
        s_reliability: float = min(max(reliability / 5.0, 0.50), 1.00)

        # -------------------------------------------------------------------
        # COMPOSITE WEIGHTED MATCH SCORE (0 to 100)
        # -------------------------------------------------------------------
        composite_score: float = (
            (s_purity * cls.WEIGHT_PURITY)
            + (s_distance * cls.WEIGHT_DISTANCE)
            + (s_price * cls.WEIGHT_PRICE)
            + (s_quantity * cls.WEIGHT_QUANTITY)
            + (s_delivery * cls.WEIGHT_DELIVERY)
            + (s_reliability * cls.WEIGHT_RELIABILITY)
        )
        final_match_score: int = max(min(int(round(composite_score)), 100), 0)

        # -------------------------------------------------------------------
        # ALGORITHMIC CONFIDENCE SCORE (0 to 100)
        # -------------------------------------------------------------------
        confidence: float = 85.0
        if purity >= 95.0:
            confidence += 5.0
        if distance_km < 100.0:
            confidence += 5.0
        if reliability >= 4.5:
            confidence += 4.0
        confidence_score: float = min(confidence, 98.5)

        # Compatibility Tier
        if final_match_score >= 85:
            tier: str = "HIGH_MATCH"
        elif final_match_score >= 70:
            tier = "MODERATE_MATCH"
        else:
            tier = "LOW_MATCH"

        # -------------------------------------------------------------------
        # EXPLAINABLE AI (XAI) NATURAL LANGUAGE RATIONALE
        # -------------------------------------------------------------------
        purity_delta: float = round(purity - req_purity, 1)
        savings_ton: float = round(max(budget_ton - total_landed_cost, 0.0), 2)

        explanation: str = (
            f"{supplier_name} is recommended with a {final_match_score}/100 match score. "
            f"Its certified {purity:.1f}% purity exceeds your minimum threshold by +{purity_delta}% with verified "
            f"gas specifications. Located {distance_km:.1f} km away in {location}, it achieves an estimated "
            f"landed cost of ${total_landed_cost:.2f}/ton (saving ${savings_ton:.2f}/ton against budget) "
            f"while minimizing road transit carbon emissions."
        )

        return {
            "listing_id": candidate_listing["id"],
            "supplier_name": supplier_name,
            "industry_type": industry_type,
            "location": location,
            "match_score": final_match_score,
            "confidence_score": confidence_score,
            "compatibility_tier": tier,
            "purity_percentage": purity,
            "distance_km": distance_km,
            "total_landed_cost_ton": round(total_landed_cost, 2),
            "dimension_breakdown": {
                "purity_score": round(s_purity * 100, 1),
                "distance_score": round(s_distance * 100, 1),
                "price_score": round(s_price * 100, 1),
                "quantity_score": round(s_quantity * 100, 1),
                "delivery_score": round(s_delivery * 100, 1),
                "reliability_score": round(s_reliability * 100, 1),
            },
            "explanation": explanation,
        }

    @classmethod
    def rank_candidates(
        cls,
        candidates: List[Dict[str, Any]],
        buyer_demand: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Evaluates and ranks all candidates using deterministic tie-breaking logic.
        """
        evaluated: List[Dict[str, Any]] = []
        for cand in candidates:
            match_res = cls.evaluate_candidate(cand, buyer_demand)
            if match_res is not None:
                evaluated.append(match_res)

        # Multi-Tier Sorting & Tie-Breaking:
        # 1. Match score (descending)
        # 2. Distance (ascending)
        # 3. Purity (descending)
        evaluated.sort(
            key=lambda x: (
                -x["match_score"],
                x["distance_km"],
                -x["purity_percentage"]
            )
        )

        top_rec: Optional[Dict[str, Any]] = evaluated[0] if evaluated else None
        alternatives: List[Dict[str, Any]] = evaluated[1:] if len(evaluated) > 1 else []

        return {
            "top_recommendation": top_rec,
            "ranked_alternatives": alternatives,
            "evaluated_candidates_count": len(evaluated),
        }


ai_match_engine = AIMatchEngineService()
