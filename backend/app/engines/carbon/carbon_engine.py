from datetime import datetime, timezone
from typing import Dict, Any
from app.core.config import settings


class CarbonImpactEngine:
    """
    Deterministic Carbon Impact Engine for CarbonX.
    Calculates gross CO2 captured, utilized, transport emissions, net avoided carbon, and permanently stored CO2.
    Stores reproducible formula and assumption metadata.
    """

    @classmethod
    def calculate_carbon_balance(cls, params: Dict[str, Any]) -> Dict[str, Any]:
        co2_captured_tons = float(params.get("co2_captured_tons", 100.0))
        conversion_efficiency = float(params.get("conversion_efficiency", 0.85))
        transport_distance_km = float(params.get("transport_distance_km", 50.0))
        avoidance_factor = float(params.get("carbon_avoidance_factor", 0.80))

        # 1. Utilized CO2
        co2_utilized = round(co2_captured_tons * conversion_efficiency, 2)

        # 2. Process emissions (compression & chemical synthesis ~ 0.15 tons CO2e per ton utilized)
        process_emissions = round(co2_utilized * 0.15, 2)

        # 3. Transport emissions (~ 0.00012 tons CO2e per ton-km for heavy trucking)
        transport_emissions = round(co2_utilized * transport_distance_km * 0.00012, 2)

        # 4. Total penalty emissions
        total_penalties = process_emissions + transport_emissions

        # 5. Net Avoided CO2
        co2_avoided_net = round(max(0.0, (co2_utilized * avoidance_factor) - total_penalties), 2)

        # 6. Permanently Stored CO2
        co2_permanently_stored = round(co2_utilized * 0.90, 2)

        # 7. Net Carbon Benefit Score (0 - 100)
        net_carbon_benefit_score = round(min(100.0, (co2_avoided_net / max(1.0, co2_captured_tons)) * 100.0), 1)

        return {
            "formula_version": settings.FORMULA_VERSION,
            "calculated_at": datetime.now(timezone.utc).isoformat(),
            "inputs": {
                "co2_captured_tonnes": co2_captured_tons,
                "conversion_efficiency_ratio": conversion_efficiency,
                "transport_distance_km": transport_distance_km,
                "avoidance_factor_ratio": avoidance_factor,
            },
            "units": {
                "co2_captured": "metric tonnes",
                "co2_utilized": "metric tonnes",
                "co2_avoided_net": "metric tonnes CO2e",
                "transport_emissions": "metric tonnes CO2e",
            },
            "assumptions": {
                "process_emission_intensity": "0.15 tCO2e/t_utilized",
                "trucking_transport_intensity": "0.00012 tCO2e/t-km",
                "storage_permanence_ratio": "0.90",
            },
            "results": {
                "co2_captured_tonnes": co2_captured_tons,
                "co2_utilized_tonnes": co2_utilized,
                "co2_avoided_net_tonnes": co2_avoided_net,
                "co2_permanently_stored_tonnes": co2_permanently_stored,
                "process_emissions_tonnes": process_emissions,
                "transport_emissions_tonnes": transport_emissions,
                "net_carbon_benefit_score": net_carbon_benefit_score,
            },
        }


carbon_engine = CarbonImpactEngine()
