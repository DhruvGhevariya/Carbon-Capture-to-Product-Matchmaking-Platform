import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ai_unreachable_fallback():
    # Verify AI endpoint falls back gracefully without 500 when external AI service is offline
    res = client.post("/api/v1/copilot/chat", json={"message": "What is the purity requirement for concrete mineralization?"})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "answer" in data["data"]

