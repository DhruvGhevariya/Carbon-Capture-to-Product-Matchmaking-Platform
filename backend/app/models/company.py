import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Numeric, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Company(Base):
    __tablename__ = "companies"
    __table_args__ = (
        Index("idx_companies_lat_lon", "latitude", "longitude"),
    )

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    company_name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    industry_type: Mapped[str] = mapped_column(String(100), nullable=False)
    location_name: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[float] = mapped_column(Numeric(9, 6), nullable=False)
    longitude: Mapped[float] = mapped_column(Numeric(9, 6), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    users: Mapped[list["User"]] = relationship(
        "User", 
        back_populates="company", 
        cascade="all, delete-orphan"
    )
    origin_routes: Mapped[list["LogisticsEstimate"]] = relationship(
        "LogisticsEstimate",
        foreign_keys="LogisticsEstimate.origin_company_id",
        back_populates="origin_company"
    )
    dest_routes: Mapped[list["LogisticsEstimate"]] = relationship(
        "LogisticsEstimate",
        foreign_keys="LogisticsEstimate.dest_company_id",
        back_populates="dest_company"
    )
