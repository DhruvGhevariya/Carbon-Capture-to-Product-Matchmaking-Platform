import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import String, Numeric, DateTime, ForeignKey, CheckConstraint, Index, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class OrderStatus(str, enum.Enum):
    CONFIRMED = "confirmed"
    IN_TRANSIT = "in_transit"
    COMPLETED = "completed"


class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("final_price_ton > 0.00", name="check_order_price_positive"),
        CheckConstraint("quantity_tons > 0.00", name="check_order_quantity_positive"),
        Index("idx_orders_status", "order_status"),
    )

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    bid_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("bids.id", ondelete="RESTRICT"), 
        unique=True, 
        nullable=False
    )
    listing_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("listings.id", ondelete="RESTRICT"), 
        nullable=False
    )
    seller_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("users.id", ondelete="RESTRICT"), 
        nullable=False
    )
    buyer_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("users.id", ondelete="RESTRICT"), 
        nullable=False
    )
    order_reference: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    final_price_ton: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    quantity_tons: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    delivery_window: Mapped[str] = mapped_column(String(100), nullable=False)
    order_status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, name="order_status_enum", native_enum=False),
        default=OrderStatus.CONFIRMED,
        index=True,
        nullable=False
    )
    confirmed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    bid: Mapped["Bid"] = relationship("Bid", back_populates="order")
    listing: Mapped["Listing"] = relationship("Listing", back_populates="orders")
    seller: Mapped["User"] = relationship(
        "User", 
        back_populates="seller_orders", 
        foreign_keys=[seller_id]
    )
    buyer: Mapped["User"] = relationship(
        "User", 
        back_populates="buyer_orders", 
        foreign_keys=[buyer_id]
    )
