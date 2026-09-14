from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions import UnauthorizedException, ValidationException
from app.core.dependencies import get_current_user_token_payload
from app.models.domain import User, Organization
from app.schemas.domain_schemas import UserLoginSchema, UserRegisterSchema, TokenResponseSchema, UserResponseSchema, StandardResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponseSchema)
async def login(credentials: UserLoginSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalars().first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise UnauthorizedException("Invalid email or password.")

    company_dict = None
    if user.company_id:
        c_res = await db.execute(select(Organization).where(Organization.id == user.company_id))
        comp = c_res.scalars().first()
        if comp:
            company_dict = {
                "id": comp.id,
                "company_name": comp.company_name,
                "industry_type": comp.industry_type,
                "location_name": comp.location_name,
                "latitude": comp.latitude,
                "longitude": comp.longitude,
            }

    token = create_access_token(subject=user.id, role=user.role, company_id=user.company_id)

    user_resp = UserResponseSchema(
        id=user.id,
        uuid=user.uuid,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        company_id=user.company_id,
        company=company_dict,
        is_active=user.is_active,
    )

    return TokenResponseSchema(access_token=token, token_type="bearer", user=user_resp)


@router.post("/register", response_model=TokenResponseSchema)
async def register(payload: UserRegisterSchema, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalars().first():
        raise ValidationException(f"Email '{payload.email}' is already registered.")

    company_id = None
    if payload.company_name:
        org = Organization(
            company_name=payload.company_name,
            industry_type=payload.industry_type or "Industrial",
            location_name="Sanand Industrial Cluster, Ahmedabad, Gujarat",
            latitude=22.9868,
            longitude=72.3814,
        )
        db.add(org)
        await db.flush()
        company_id = org.id

    new_user = User(
        company_id=company_id,
        full_name=payload.full_name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        role=payload.role.upper() if payload.role else "USER",
        is_active=True,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = create_access_token(subject=new_user.id, role=new_user.role, company_id=new_user.company_id)
    user_resp = UserResponseSchema(
        id=new_user.id,
        uuid=new_user.uuid,
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role,
        company_id=new_user.company_id,
        is_active=new_user.is_active,
    )

    return TokenResponseSchema(access_token=token, token_type="bearer", user=user_resp)


@router.get("/me")
async def get_me(
    payload: dict = Depends(get_current_user_token_payload),
    db: AsyncSession = Depends(get_db),
):
    user_id = int(payload.get("sub"))
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalars().first()

    if not user:
        raise UnauthorizedException("User profile not found.")

    company_dict = None
    if user.company_id:
        c_res = await db.execute(select(Organization).where(Organization.id == user.company_id))
        comp = c_res.scalars().first()
        if comp:
            company_dict = {
                "id": comp.id,
                "company_name": comp.company_name,
                "industry_type": comp.industry_type,
                "location_name": comp.location_name,
            }

    return {
        "success": True,
        "data": {
            "id": user.id,
            "uuid": user.uuid,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "company_id": user.company_id,
            "company": company_dict,
        },
    }
