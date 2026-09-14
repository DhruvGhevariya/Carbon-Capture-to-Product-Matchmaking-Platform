import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token

client = TestClient(app)


def test_tenant_security_cross_access_denied():
    # User from Org A (Company ID 1)
    token_org_a = create_access_token(subject=1, role="EMITTER", company_id=1)
    
    # User from Org B (Company ID 2)
    token_org_b = create_access_token(subject=2, role="USER", company_id=2)

    headers_org_b = {"Authorization": f"Bearer {token_org_b}"}

    # Org B user attempts to access an endpoint restricted to EMITTER / ADMIN
    response = client.get("/api/v1/seller/dashboard", headers=headers_org_b)
    
    assert response.status_code == 403
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "FORBIDDEN"
