from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User
from app.models.company import Company
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.security import get_current_user
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest, 
    db: AsyncSession = Depends(get_db)
):
    """
    Onboard a new enterprise industrial user and company profile.
    """
    result = await auth_service.register_user(db, request)
    return {"success": True, "data": result}


@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest, 
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate corporate credentials and issue a signed JWT Bearer token.
    """
    return await auth_service.login_user(db, request)


@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    """
    Return authenticated user identity and associated industrial plant facility.
    """
    comp_res = await db.execute(select(Company).where(Company.id == current_user.company_id))
    company = comp_res.scalar_one_or_none()

    return {
        "success": True,
        "data": {
            "user_id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role),
            "is_active": current_user.is_active,
            "company": {
                "id": company.id if company else None,
                "company_name": company.company_name if company else "",
                "industry_type": company.industry_type if company else "",
                "location_name": company.location_name if company else "",
                "latitude": float(company.latitude) if company else 0.0,
                "longitude": float(company.longitude) if company else 0.0,
            } if company else None,
            "created_at": current_user.created_at.isoformat(),
        }
    }
