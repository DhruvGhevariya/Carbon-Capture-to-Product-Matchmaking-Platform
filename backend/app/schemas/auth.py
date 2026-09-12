from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.user import UserRole


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150, description="Legal full name")
    email: EmailStr = Field(..., description="Corporate work email")
    password: str = Field(..., min_length=8, max_length=64, description="Raw password string")
    role: UserRole = Field(..., description="Role: 'seller' or 'buyer'")
    company_name: str = Field(..., min_length=2, max_length=255, description="Industrial enterprise name")
    industry_type: str = Field(..., min_length=2, max_length=100, description="Industrial sector")
    location_name: str = Field(..., min_length=2, max_length=255, description="Facility physical location")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Geographic latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Geographic longitude")


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered corporate email")
    password: str = Field(..., description="Account password")


class UserBasicInfo(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: UserRole
    company_id: Optional[str] = None
    company_name: str
    latitude: float
    longitude: float

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str = Field(..., description="JWT Bearer token")
    token_type: str = Field(default="bearer", description="Token scheme")
    expires_in_seconds: int = Field(default=28800, description="Lifetime in seconds")
    user: UserBasicInfo
