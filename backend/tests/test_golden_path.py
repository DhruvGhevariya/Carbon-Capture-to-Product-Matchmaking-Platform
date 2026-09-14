import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_full_golden_path():
    # 1. Signup / Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.verma@ultratech.com", "password": "password123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get User Profile
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200

    # 3. Create CO2 Source & Fingerprint
    source_resp = client.post(
        "/api/v1/co2-sources",
        headers=headers,
        json={
            "name": "Ahmedabad Unit 4 Stream",
            "facility_name": "Sanand Plant 4",
            "industry_type": "Cement",
            "location_name": "Sanand Industrial Cluster, Ahmedabad",
            "latitude": 22.9868,
            "longitude": 72.3814,
            "annual_capture_tonnes": 50000.0,
            "daily_capture_tonnes": 150.0,
            "purity_percentage": 98.2,
            "temperature_c": 26.0,
            "pressure_bar": 10.0,
            "physical_state": "liquid",
        },
    )
    assert source_resp.status_code == 201
    source_id = source_resp.json()["data"]["id"]

    # 4. Fingerprint query
    fp_resp = client.get(f"/api/v1/co2-sources/{source_id}/fingerprint")
    assert fp_resp.status_code == 200
    assert fp_resp.json()["data"]["fingerprint"]["overall_quality_score"] > 70.0

    # 5. Run Match Engine
    match_resp = client.post(
        "/api/v1/matching/run",
        json={
            "minimum_purity_floor": 90.0,
            "required_quantity_tons": 100.0,
            "budget_ceiling_per_ton": 6000.0,
            "destination_latitude": 22.3100,
            "destination_longitude": 73.1900,
        },
    )
    assert match_resp.status_code == 200

    # 6. Carbon & Financial Calculation
    calc_resp = client.post(
        "/api/v1/calculations/scenario",
        json={
            "co2_captured_tons": 1000.0,
            "conversion_efficiency": 0.85,
            "transport_distance_km": 50.0,
            "product_selling_price_unit": 250.0,
            "capex_total": 500000.0,
            "opex_annual": 75000.0,
        },
    )
    assert calc_resp.status_code == 200
    assert len(calc_resp.json()["data"]["financial_scenarios"]) == 3

    # 7. Create B2B Partnership
    part_resp = client.post(
        "/api/v1/partnerships",
        headers=headers,
        json={"emitter_org_id": 1, "partnership_name": "Sanand Circular Off-take Partnership"},
    )
    assert part_resp.status_code == 201

    # 8. Analytics Dashboard
    analytics_resp = client.get("/api/v1/analytics/dashboard")
    assert analytics_resp.status_code == 200
    assert analytics_resp.json()["data"]["total_co2_captured_tons"] > 0
