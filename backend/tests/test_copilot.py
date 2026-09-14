import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_copilot_chat_grounded():
    payload = {'message': 'What are the top recommended carbon capture sources for concrete mineralization?'}
    res = client.post('/api/v1/copilot/chat', json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data['success'] is True
    assert 'answer' in data['data']
