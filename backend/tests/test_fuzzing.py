import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.engines.fingerprint.fingerprint_engine import fingerprint_engine

client = TestClient(app)


def test_fuzz_fingerprint_engine():
    res_low = fingerprint_engine.generate_fingerprint({'purity_percentage': 0.0, 'daily_capture_tonnes': 50.0, 'pressure_bar': 1.0, 'temperature_c': 25.0})
    assert res_low['readiness_classification'] in ['REQUIRES_TREATMENT', 'NOT_READY']

    res_high = fingerprint_engine.generate_fingerprint({'purity_percentage': 100.0, 'daily_capture_tonnes': 500.0, 'pressure_bar': 20.0, 'temperature_c': 25.0})
    assert res_high['readiness_classification'] == 'READY'


def test_fuzz_api_invalid_payloads():
    res = client.post('/api/v1/calculations/carbon', json={'invalid_field': -9999})
    assert res.status_code == 422
    data = res.json()
    assert data['success'] is False
    assert data['error']['code'] == 'UNPROCESSABLE_ENTITY'
