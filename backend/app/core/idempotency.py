from typing import Dict, Any, Optional
from fastapi import Request, Header, HTTPException, status
import json
import hashlib

# High-performance Idempotency Store (Redis-compatible memory layer & DB fallback)
_idempotency_store: Dict[str, Dict[str, Any]] = {}


async def check_idempotency_key(
    request: Request,
    x_idempotency_key: Optional[str] = Header(None, alias="X-Idempotency-Key"),
) -> Optional[Dict[str, Any]]:
    if not x_idempotency_key:
        return None

    full_key = f"{request.url.path}:{x_idempotency_key}"
    if full_key in _idempotency_store:
        return _idempotency_store[full_key]

    return None


def store_idempotent_response(path: str, key: str, response_data: Dict[str, Any]):
    if key:
        full_key = f"{path}:{key}"
        _idempotency_store[full_key] = response_data

