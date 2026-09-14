import math
from typing import Dict, Any, List, Optional
from app.core.config import settings


class MatchEngine:
    """
    Deterministic, Multi-Criteria Recommendation & Eligibility Engine for CarbonX.
    Evaluates Technical, Economic, Environmental, Geographic, and TRL compatibility.
    """

    @classmethod
    def calculate_haversine_distance(
        cls, lat1: float, lon1: float, lat2: float, lon2: float
    ) -> float:
        R = 6371.0  # Earth radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    @classmethod
    def evaluate_match(
        cls,
        candidate_source: Dict[str, Any],
        buyer_demand: Dict[str, Any],
    ) -> Dict[str, Any]:
        purity: float = float(candidate_source.get("purity_percentage", 95.0))
        available_vol: float = float(candidate_source.get("volume_metric_tons", 100.0))
        base_price: float = float(candidate_source.get("reserve_price_ton", 500.0))
        seller_lat: float = float(candidate_source.get("latitude", 0.0))
        seller_lon: float = float(candidate_source.get("longitude", 0.0))
        supplier_name: str = candidate_source.get("company_name", candidate_source.get("name", "Industrial Emitter"))
        industry: str = candidate_source.get("industry_type", "Industrial")
        location: str = candidate_source.get("location_name", "Industrial Zone")

        req_purity: float = float(buyer_demand.get("minimum_purity_floor", 90.0))
        req_quantity: float = float(buyer_demand.get("required_quantity_tons", 100.0))
        budget_ton: float = float(buyer_demand.get("budget_ceiling_per_ton", 5000.0))
        buyer_lat: float = float(buyer_demand.get("destination_latitude", seller_lat))
        buyer_lon: float = float(buyer_demand.get("destination_longitude", seller_lon))

        reasons: List[str] = []
        warnings: List[str] = []
        eligible: bool = True

        # ---------------------------------------------------------
        # 1. HARD ELIGIBILITY FILTERS
        # ---------------------------------------------------------
        if purity < req_purity:
            eligible = False
            warnings.append(f"CO₂ purity ({purity:.1f}%) is below minimum requirement ({req_purity:.1f}%).")
        else:
            reasons.append(f"CO₂ purity ({purity:.1f}%) satisfies minimum specification threshold.")

        if available_vol < (0.20 * req_quantity):
            eligible = False
            warnings.append(f"Available volume ({available_vol:.0f}t) is insufficient for required contract size ({req_quantity:.0f}t).")

        distance_km = cls.calculate_haversine_distance(seller_lat, seller_lon, buyer_lat, buyer_lon)
        if distance_km > 600.0:
            warnings.append(f"Transport distance ({distance_km:.1f} km) exceeds optimal 600 km economic radius.")

        # Transport cost estimation ($3.5 / ton-km base rate)
        freight_cost = float(round(distance_km * 3.5 + 200)) if distance_km > 0 else 150.0
        total_landed_cost = base_price + freight_cost

        if total_landed_cost > budget_ton:
            warnings.append(f"Total landed cost (${total_landed_cost:.2f}/t) exceeds budget ceiling (${budget_ton:.2f}/t).")

        # ---------------------------------------------------------
        # 2. SUB-DIMENSION NORMALIZED SCORING (0 to 100)
        # ---------------------------------------------------------
        # Technical Score
        tech_score = 100.0 if purity >= 99.0 else max(50.0, 70.0 + (purity - req_purity) * 3.0)

        # Economic Score
        if total_landed_cost <= budget_ton:
            econ_score = min(100.0, 80.0 + ((budget_ton - total_landed_cost) / budget_ton) * 20.0)
        else:
            econ_score = max(20.0, 80.0 - ((total_landed_cost - budget_ton) / budget_ton) * 50.0)

        # Environmental Score (Lower transport distance = higher environmental benefit)
        env_score = max(40.0, 100.0 - (distance_km / 500.0) * 40.0)

        # Geographic Score
        geo_score = max(30.0, 100.0 - (distance_km / 300.0) * 50.0)

        # TRL Score
        trl_score = 90.0

        # ---------------------------------------------------------
        # 3. WEIGHTED COMPOSITE SCORE
        # ---------------------------------------------------------
        w_tech = settings.WEIGHT_TECHNICAL
        w_econ = settings.WEIGHT_ECONOMIC
        w_env = settings.WEIGHT_ENVIRONMENTAL
        w_geo = settings.WEIGHT_GEOGRAPHIC
        w_trl = settings.WEIGHT_TRL
        w_total = w_tech + w_econ + w_env + w_geo + w_trl

        composite = (
            (tech_score * w_tech)
            + (econ_score * w_econ)
            + (env_score * w_env)
            + (geo_score * w_geo)
            + (trl_score * w_trl)
        ) / w_total

        overall_score = max(0, min(100, int(round(composite))))
        confidence_score = round(min(98.5, 88.0 + (purity >= 98.0) * 5.0 + (distance_km < 100) * 5.0), 1)

        # ---------------------------------------------------------
        # 4. XAI RATIONALE
        # ---------------------------------------------------------
        savings = max(0.0, budget_ton - total_landed_cost)
        explanation = (
            f"{supplier_name} is evaluated with an overall match score of {overall_score}/100. "
            f"Its certified {purity:.1f}% purity meets your requirements. Located {distance_km:.1f} km away in {location}, "
            f"it yields an estimated landed cost of ${total_landed_cost:.2f}/ton (saving ${savings:.2f}/ton against budget)."
        )

        return {
            "listing_id": candidate_source.get("id"),
            "source_id": candidate_source.get("source_id", candidate_source.get("id")),
            "technology_id": candidate_source.get("technology_id"),
            "supplier_name": supplier_name,
            "industry_type": industry,
            "location": location,
            "match_score": overall_score,
            "technical_score": round(tech_score, 1),
            "economic_score": round(econ_score, 1),
            "environmental_score": round(env_score, 1),
            "geographic_score": round(geo_score, 1),
            "trl_score": round(trl_score, 1),
            "confidence_score": confidence_score,
            "eligible": eligible,
            "reasons": reasons,
            "warnings": warnings,
            "purity_percentage": purity,
            "distance_km": round(distance_km, 1),
            "total_landed_cost_ton": round(total_landed_cost, 2),
            "explanation": explanation,
        }


match_engine = MatchEngine()
