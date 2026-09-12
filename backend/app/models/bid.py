import uuid
import enum
from datetime import datetime, date, timezone
from sqlalchemy import String, Numeric, Date, DateTime, ForeignKey, CheckConstraint, Index, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class BidStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class Bid(Base):
    __tablename__ = "bids"
    __table_args__ = (
        CheckConstraint("offered_price_ton > 0.00", name="check_bid_price_positive"),
        CheckConstraint("requested_quantity > 0.00", name="check_bid_quantity_positive"),
        Index("idx_bids_listing_status", "listing_id", "status"),
    )

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    listing_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("listings.id", ondelete="CASCADE"), 
        nullable=False
    )
    buyer_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("users.id", ondelete="RESTRICT"), 
        nullable=False
    )
    offered_price_ton: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    requested_quantity: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    delivery_target: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[BidStatus] = mapped_column(
        Enum(BidStatus, name="bid_status_enum", native_enum=False),
        default=BidStatus.PENDING,
        index=True,
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="bids")
    buyer: Mapped["User"] = relationship("User", back_populates="bids", foreign_keys=[buyer_id])
    order: Mapped["Order"] = relationship("Order", back_populates="bid", uselist=False)
