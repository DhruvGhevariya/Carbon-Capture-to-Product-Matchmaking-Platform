import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_auth_login_seed_user():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.verma@ultratech.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "rajesh.verma@ultratech.com"


def test_matchmaking_api():
    payload = {
        "minimum_purity_floor": 90.0,
        "required_quantity_tons": 100.0,
        "budget_ceiling_per_ton": 6000.0,
        "destination_latitude": 22.3100,
        "destination_longitude": 73.1900,
    }
    response = client.post("/api/v1/matching/run", json=payload)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert "recommended_listing_id" in res_json["data"]


def test_carbon_calculation_api():
    payload = {
        "co2_captured_tons": 500.0,
        "conversion_efficiency": 0.90,
        "transport_distance_km": 40.0,
    }
    response = client.post("/api/v1/calculations/carbon", json=payload)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert res_json["data"]["results"]["co2_utilized_tonnes"] == 450.0


def test_scenario_calculation_api():
    payload = {
        "co2_captured_tons": 1000.0,
        "conversion_efficiency": 0.85,
        "transport_distance_km": 50.0,
        "product_selling_price_unit": 250.0,
        "capex_total": 500000.0,
        "opex_annual": 75000.0,
    }
    response = client.post("/api/v1/calculations/scenario", json=payload)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert len(res_json["data"]["financial_scenarios"]) == 3
