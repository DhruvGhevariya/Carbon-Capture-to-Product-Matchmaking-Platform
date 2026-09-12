from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.user import User, UserRole
from app.models.company import Company
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserBasicInfo
from app.security import get_password_hash, verify_password, create_access_token


class AuthService:
    @staticmethod
    async def register_user(db: AsyncSession, request: RegisterRequest) -> dict:
        # Duplicate email validation
        existing_user = await db.execute(select(User).where(User.email == request.email))
        if existing_user.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this corporate email address already exists.",
            )

        # Check existing company or register new facility
        existing_company = await db.execute(
            select(Company).where(Company.company_name == request.company_name)
        )
        company = existing_company.scalar_one_or_none()

        if not company:
            company = Company(
                company_name=request.company_name,
                industry_type=request.industry_type,
                location_name=request.location_name,
                latitude=request.latitude,
                longitude=request.longitude,
            )
            db.add(company)
            await db.flush()

        # Create user with salted bcrypt password hash
        user = User(
            company_id=company.id,
            full_name=request.full_name,
            email=request.email,
            password_hash=get_password_hash(request.password),
            role=request.role,
            is_active=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        return {
            "user_id": user.id,
            "company_id": company.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.value if hasattr(user.role, "value") else str(user.role),
            "created_at": user.created_at.isoformat(),
        }

    @staticmethod
    async def login_user(db: AsyncSession, request: LoginRequest) -> TokenResponse:
        # Authenticate email
        result = await db.execute(select(User).where(User.email == request.email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password credentials.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account has been suspended.",
            )

        # Retrieve company profile
        comp_res = await db.execute(select(Company).where(Company.id == user.company_id))
        company = comp_res.scalar_one_or_none()

        # Generate cryptographically signed JWT token
        claims = {
            "sub": str(user.id),
            "role": user.role.value if hasattr(user.role, "value") else str(user.role),
            "company_id": str(user.company_id),
        }
        token = create_access_token(claims)

        user_info = UserBasicInfo(
            id=str(user.id),
            full_name=user.full_name,
            email=user.email,
            role=user.role,
            company_id=str(company.id) if company else None,
            company_name=company.company_name if company else "",
            latitude=float(company.latitude) if company else 0.0,
            longitude=float(company.longitude) if company else 0.0,
        )

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            expires_in_seconds=28800,
            user=user_info,
        )


auth_service = AuthService()
