import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class UserRole(str, enum.Enum):
    SELLER = "seller"
    BUYER = "buyer"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    company_id: Mapped[str] = mapped_column(
        String(36), 
        ForeignKey("companies.id", ondelete="RESTRICT"), 
        nullable=False
    )
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role_enum", native_enum=False),
        nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    company: Mapped["Company"] = relationship("Company", back_populates="users")
    listings: Mapped[list["Listing"]] = relationship(
        "Listing", 
        back_populates="seller", 
        cascade="all, delete-orphan"
    )
    bids: Mapped[list["Bid"]] = relationship(
        "Bid", 
        back_populates="buyer", 
        foreign_keys="Bid.buyer_id"
    )
    seller_orders: Mapped[list["Order"]] = relationship(
        "Order", 
        back_populates="seller", 
        foreign_keys="Order.seller_id"
    )
    buyer_orders: Mapped[list["Order"]] = relationship(
        "Order", 
        back_populates="buyer", 
        foreign_keys="Order.buyer_id"
    )
    match_results: Mapped[list["AIMatchResult"]] = relationship(
        "AIMatchResult",
        back_populates="buyer",
        cascade="all, delete-orphan"
    )
