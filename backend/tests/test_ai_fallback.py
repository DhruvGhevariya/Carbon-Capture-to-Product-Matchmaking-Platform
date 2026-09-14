import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ai_offline_fallback():
    payload = {'message': 'Explain match calculation logic.'}
    res = client.post('/api/v1/copilot/chat', json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data['success'] is True
    assert len(data['data']['answer']) > 0
