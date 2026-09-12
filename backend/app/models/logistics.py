import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Numeric, DateTime, ForeignKey, CheckConstraint, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class LogisticsEstimate(Base):
    __tablename__ = "logistics_estimates"
    __table_args__ = (
        CheckConstraint("distance_km >= 0.00", name="check_distance_positive"),
        CheckConstraint("transport_cost_ton >= 0.00", name="check_transport_cost_positive"),
        CheckConstraint("logistics_co2_debt >= 0.0000", name="check_co2_debt_positive"),
        CheckConstraint("origin_company_id != dest_company_id", name="check_different_facilities"),
        UniqueConstraint("origin_company_id", "dest_company_id", name="uq_origin_dest_logistics"),
        Index("idx_logistics_origin_dest", "origin_company_id", "dest_company_id"),
    )

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    origin_company_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("companies.id", ondelete="CASCADE"), 
        nullable=False
    )
    dest_company_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("companies.id", ondelete="CASCADE"), 
        nullable=False
    )
    distance_km: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    transport_cost_ton: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    transit_duration: Mapped[str] = mapped_column(String(50), nullable=False)
    logistics_co2_debt: Mapped[float] = mapped_column(Numeric(8, 4), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    origin_company: Mapped["Company"] = relationship(
        "Company", 
        foreign_keys=[origin_company_id],
        back_populates="origin_routes"
    )
    dest_company: Mapped["Company"] = relationship(
        "Company", 
        foreign_keys=[dest_company_id],
        back_populates="dest_routes"
    )
