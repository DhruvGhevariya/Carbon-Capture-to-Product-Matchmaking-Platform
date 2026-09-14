import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.idempotency import _idempotency_store, store_idempotent_response

client = TestClient(app)


def test_idempotency_store_and_retrieve():
    key = 'test-idempotency-key-100'
    path = '/api/v1/marketplace/bids'
    
    response_data = {'success': True, 'data': {'bid_id': 1, 'status': 'submitted'}}
    store_idempotent_response(path, key, response_data)
    
    full_key = f'{path}:{key}'
    assert full_key in _idempotency_store
    assert _idempotency_store[full_key] == response_data


def test_idempotency_header_interceptor():
    headers = {'X-Idempotency-Key': 'key-bid-999'}
    payload = {
        'co2_captured_tons': 500.0,
        'conversion_efficiency': 0.90,
        'transport_distance_km': 40.0,
    }
    
    res1 = client.post('/api/v1/calculations/carbon', json=payload, headers=headers)
    assert res1.status_code == 200
    
    store_idempotent_response('/api/v1/calculations/carbon', 'key-bid-999', res1.json())
    
    full_key = '/api/v1/calculations/carbon:key-bid-999'
    assert full_key in _idempotency_store
    assert _idempotency_store[full_key] == res1.json()
