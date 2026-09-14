from datetime import datetime, timezone
from typing import Dict, Any, List
from app.core.config import settings


class FinancialEconomicEngine:
    """
    Financial Scenario & Economic Modeling Engine for CarbonX.
    Computes CAPEX, OPEX, revenue, gross margin, payback period, NPV, and ROI across scenarios.
    Exposes explicit assumption sources and version metadata.
    """

    @classmethod
    def calculate_scenario(
        cls, params: Dict[str, Any], scenario_type: str = "BASE"
    ) -> Dict[str, Any]:
        co2_tons = float(params.get("co2_captured_tons", 1000.0))
        conversion = float(params.get("conversion_efficiency", 0.85))
        distance_km = float(params.get("transport_distance_km", 50.0))
        product_price = float(params.get("product_selling_price_unit", 250.0))
        capex = float(params.get("capex_total", 500000.0))
        base_opex = float(params.get("opex_annual", 75000.0))

        # Scenario Multipliers
        if scenario_type.upper() == "CONSERVATIVE":
            price_mult = 0.85
            volume_mult = 0.90
            opex_mult = 1.15
        elif scenario_type.upper() == "OPTIMISTIC":
            price_mult = 1.15
            volume_mult = 1.10
            opex_mult = 0.90
        else:  # BASE
            price_mult = 1.0
            volume_mult = 1.0
            opex_mult = 1.0

        effective_product_price = product_price * price_mult
        effective_volume = co2_tons * conversion * volume_mult

        # Revenue
        annual_revenue = round(effective_volume * effective_product_price, 2)

        # Freight & OPEX
        freight_cost = distance_km * 3.5 * effective_volume
        annual_opex = round((base_opex + freight_cost) * opex_mult, 2)

        # Gross Margin
        gross_margin = round(annual_revenue - annual_opex, 2)

        # Payback Period (years)
        payback_years = round(capex / gross_margin, 1) if gross_margin > 0 else 99.0

        # Simple 10-Year Net Present Value (NPV @ 10% discount rate)
        discount_rate = 0.10
        npv = -capex
        for t in range(1, 11):
            npv += gross_margin / ((1 + discount_rate) ** t)
        npv = round(npv, 2)

        # 10-Year ROI %
        roi = round(((gross_margin * 10 - capex) / capex) * 100, 1) if capex > 0 else 0.0

        return {
            "formula_version": settings.FORMULA_VERSION,
            "scenario": scenario_type.upper(),
            "calculated_at": datetime.now(timezone.utc).isoformat(),
            "annual_revenue": annual_revenue,
            "annual_operating_cost": annual_opex,
            "gross_margin_annual": gross_margin,
            "payback_period_years": payback_years,
            "npv_10_year": npv,
            "roi_percentage": roi,
            "assumptions_used": {
                "scenario_type": scenario_type.upper(),
                "effective_product_price_per_unit": round(effective_product_price, 2),
                "effective_volume_tonnes": round(effective_volume, 2),
                "freight_cost_annual": round(freight_cost, 2),
                "discount_rate": 0.10,
                "assumption_source": "CarbonX Regional Benchmark 2026",
            },
        }

    @classmethod
    def compare_all_scenarios(cls, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [
            cls.calculate_scenario(params, "CONSERVATIVE"),
            cls.calculate_scenario(params, "BASE"),
            cls.calculate_scenario(params, "OPTIMISTIC"),
        ]


economic_engine = FinancialEconomicEngine()
