from typing import Dict, Any


class CarbonCalculationEngine:
    """
    Deterministic Life Cycle Assessment (LCA) Carbon Balance Engine.
    Calculates gross CO2 captured, utilized, avoided emissions, transport footprint, and net offset.
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
            "co2_captured_tons": co2_captured_tons,
            "co2_utilized_tons": co2_utilized,
            "co2_avoided_net_tons": co2_avoided_net,
            "co2_permanently_stored_tons": co2_permanently_stored,
            "process_emissions_tons": process_emissions,
            "transport_emissions_tons": transport_emissions,
            "net_carbon_benefit_score": net_carbon_benefit_score,
        }


carbon_engine = CarbonCalculationEngine()
