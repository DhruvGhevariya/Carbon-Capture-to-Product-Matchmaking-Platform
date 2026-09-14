from app.engines.fingerprint.fingerprint_engine import fingerprint_engine
from app.engines.matching.match_engine import match_engine
from app.engines.carbon.carbon_engine import carbon_engine
from app.engines.economics.economic_engine import economic_engine


def test_fingerprint_engine():
    res = fingerprint_engine.generate_fingerprint({
        "purity_percentage": 98.5,
        "daily_capture_tonnes": 350.0,
        "pressure_bar": 12.5,
        "temperature_c": 28.0,
    })

    assert res["overall_quality_score"] > 80.0
    assert res["readiness_classification"] == "READY"
    assert "Chemical Synthesis" in res["suitable_grades"]


def test_match_engine():
    source = {
        "id": 1,
        "name": "UltraTech Kiln Stream",
        "purity_percentage": 98.5,
        "volume_metric_tons": 350.0,
        "reserve_price_ton": 4800.0,
        "latitude": 22.9868,
        "longitude": 72.3814,
    }

    demand = {
        "minimum_purity_floor": 90.0,
        "required_quantity_tons": 100.0,
        "budget_ceiling_per_ton": 6000.0,
        "destination_latitude": 22.3100,
        "destination_longitude": 73.1900,
    }

    res = match_engine.evaluate_match(source, demand)
    assert res["eligible"] is True
    assert res["match_score"] >= 80
    assert "UltraTech" in res["explanation"]


def test_carbon_engine():
    res = carbon_engine.calculate_carbon_balance({
        "co2_captured_tons": 100.0,
        "conversion_efficiency": 0.85,
        "transport_distance_km": 50.0,
    })

    assert res["results"]["co2_utilized_tonnes"] == 85.0
    assert res["results"]["co2_avoided_net_tonnes"] > 0
    assert res["results"]["net_carbon_benefit_score"] > 0


def test_economic_engine():
    scenarios = economic_engine.compare_all_scenarios({
        "co2_captured_tons": 1000.0,
        "conversion_efficiency": 0.85,
        "transport_distance_km": 50.0,
        "product_selling_price_unit": 250.0,
        "capex_total": 500000.0,
        "opex_annual": 75000.0,
    })

    assert len(scenarios) == 3
    assert scenarios[0]["scenario"] == "CONSERVATIVE"
    assert scenarios[1]["scenario"] == "BASE"
    assert scenarios[2]["scenario"] == "OPTIMISTIC"
    assert scenarios[2]["gross_margin_annual"] >= scenarios[0]["gross_margin_annual"]
