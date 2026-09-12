import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Numeric, Text, DateTime, ForeignKey, CheckConstraint, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class AIMatchResult(Base):
    __tablename__ = "ai_match_results"
    __table_args__ = (
        CheckConstraint("match_score >= 0 AND match_score <= 100", name="check_match_score_bounds"),
        CheckConstraint("confidence_score >= 0.00 AND confidence_score <= 100.00", name="check_confidence_bounds"),
        UniqueConstraint("listing_id", "buyer_id", name="uq_listing_buyer_match"),
        Index("idx_ai_match_listing_buyer", "listing_id", "buyer_id"),
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
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    match_score: Mapped[int] = mapped_column(Integer, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    explanation_text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="match_results")
    buyer: Mapped["User"] = relationship("User", back_populates="match_results")
