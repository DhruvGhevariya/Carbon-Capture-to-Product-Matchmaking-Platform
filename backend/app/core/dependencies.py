from typing import List, Optional
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedException, PermissionDeniedException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


async def get_current_user_token_payload(
    token: Optional[str] = Depends(oauth2_scheme),
    authorization: Optional[str] = Header(None),
) -> dict:
    auth_token = token
    if not auth_token and authorization and authorization.startswith("Bearer "):
        auth_token = authorization.split(" ")[1]

    if not auth_token:
        raise UnauthorizedException("Authentication token is required.")

    try:
        payload = decode_token(auth_token)
        return payload
    except Exception as e:
        raise UnauthorizedException(f"Invalid authentication token: {e}")


def require_roles(allowed_roles: List[str]):
    async def role_checker(payload: dict = Depends(get_current_user_token_payload)) -> dict:
        user_role = payload.get("role", "USER").upper()
        allowed_upper = [r.upper() for r in allowed_roles]
        if user_role not in allowed_upper and "SUPER_ADMIN" not in user_role:
            raise PermissionDeniedException(f"Role '{user_role}' is not authorized for this operation.")
        return payload

    return role_checker
