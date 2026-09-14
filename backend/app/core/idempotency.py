from typing import Dict, Any, Optional
from fastapi import Request, Header, HTTPException, status
import json

# In-Memory Idempotency Cache (redis-compatible fallback for dev/testing)
_idempotency_store: Dict[str, Dict[str, Any]] = {}


async def check_idempotency_key(
    request: Request,
    x_idempotency_key: Optional[str] = Header(None, alias="X-Idempotency-Key"),
) -> Optional[Dict[str, Any]]:
    if not x_idempotency_key:
        return None

    key = f"{request.url.path}:{x_idempotency_key}"
    if key in _idempotency_store:
        return _idempotency_store[key]

    return None


def store_idempotent_response(path: str, key: str, response_data: Dict[str, Any]):
    if key:
        full_key = f"{path}:{key}"
        _idempotency_store[full_key] = response_data
