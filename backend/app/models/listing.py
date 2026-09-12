import uuid
import enum
from datetime import datetime, date, timezone
from sqlalchemy import String, Numeric, Date, DateTime, ForeignKey, CheckConstraint, Index, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ListingStatus(str, enum.Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    SOLD = "sold"
    CANCELLED = "cancelled"


class Listing(Base):
    __tablename__ = "listings"
    __table_args__ = (
        CheckConstraint("purity_percentage >= 70.00 AND purity_percentage <= 99.99", name="check_purity_bounds"),
        CheckConstraint("volume_metric_tons > 0.00", name="check_volume_positive"),
        CheckConstraint("reserve_price_ton > 0.00", name="check_price_positive"),
        CheckConstraint("available_until >= available_from", name="check_valid_dates"),
        Index("idx_listings_status_purity_price", "status", "purity_percentage", "reserve_price_ton"),
    )

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    seller_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("users.id", ondelete="RESTRICT"), 
        nullable=False
    )
    purity_percentage: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    volume_metric_tons: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    physical_state: Mapped[str] = mapped_column(String(50), default="liquid", nullable=False)
    reserve_price_ton: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[ListingStatus] = mapped_column(
        Enum(ListingStatus, name="listing_status_enum", native_enum=False),
        default=ListingStatus.AVAILABLE,
        index=True,
        nullable=False
    )
    available_from: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    available_until: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    seller: Mapped["User"] = relationship("User", back_populates="listings")
    bids: Mapped[list["Bid"]] = relationship(
        "Bid", 
        back_populates="listing", 
        cascade="all, delete-orphan"
    )
    orders: Mapped[list["Order"]] = relationship("Order", back_populates="listing")
    match_results: Mapped[list["AIMatchResult"]] = relationship(
        "AIMatchResult", 
        back_populates="listing", 
        cascade="all, delete-orphan"
    )
