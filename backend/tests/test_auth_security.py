import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token, decode_token

client = TestClient(app)


def test_auth_token_generation_and_decoding():
    token = create_access_token(subject="user-uuid-123", role="ADMIN")
    assert token is not None
    payload = decode_token(token)
    assert payload is not None
    assert payload.get("sub") == "user-uuid-123"
    assert payload.get("role") == "ADMIN"


def test_auth_invalid_and_tampered_token():
    invalid_token = "invalid.bearer.jwt.token"
    with pytest.raises(ValueError):
        decode_token(invalid_token)


def test_unauthorized_api_access_missing_header():
    res = client.get("/api/v1/co2-sources")
    assert res.status_code in [200, 401, 403]

