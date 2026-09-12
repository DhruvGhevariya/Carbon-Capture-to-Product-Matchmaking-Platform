from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.user import UserRole


class CompanyResponse(BaseModel):
    id: str
    company_name: str
    industry_type: str
    location_name: str
    latitude: float
    longitude: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    company: Optional[CompanyResponse] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
