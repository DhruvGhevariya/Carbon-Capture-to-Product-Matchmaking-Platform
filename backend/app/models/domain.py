import uuid
from datetime import datetime, date, timezone
from typing import Optional, List
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Text, JSON, Enum
)
from sqlalchemy.orm import relationship
from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    company_name = Column(String(255), nullable=False, index=True)
    industry_type = Column(String(100), nullable=False, index=True)
    location_name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False, default=0.0)
    longitude = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    users = relationship("User", back_populates="company")
    co2_sources = relationship("CO2Source", back_populates="organization")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    company_id = Column(Integer, ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="USER", index=True)  # SUPER_ADMIN, ADMIN, EMITTER, TECHNOLOGY_PROVIDER, PRODUCT_BUYER, ANALYST, USER
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    company = relationship("Organization", back_populates="users")
    listings = relationship("Listing", back_populates="seller")
    bids = relationship("Bid", back_populates="buyer")


class CO2Source(Base):
    __tablename__ = "co2_sources"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    industry_type = Column(String(100), nullable=False)
    facility_name = Column(String(255), nullable=False)
    location_name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    annual_capture_tonnes = Column(Float, nullable=False, default=0.0)
    daily_capture_tonnes = Column(Float, nullable=False, default=0.0)
    purity_percentage = Column(Float, nullable=False, default=95.0)
    temperature_c = Column(Float, nullable=False, default=25.0)
    pressure_bar = Column(Float, nullable=False, default=1.013)
    physical_state = Column(String(50), default="liquid")  # liquid, pressurized_gas, supercritical
    operating_hours = Column(Float, default=8760.0)
    capture_method = Column(String(100), default="Amine Absorption")
    source_status = Column(String(50), default="ACTIVE", index=True)
    impurities_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    organization = relationship("Organization", back_populates="co2_sources")
    profiles = relationship("CO2Profile", back_populates="source")


class CO2Profile(Base):
    __tablename__ = "co2_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    source_id = Column(Integer, ForeignKey("co2_sources.id", ondelete="CASCADE"), nullable=False, index=True)
    purity_score = Column(Float, nullable=False, default=0.0)
    volume_score = Column(Float, nullable=False, default=0.0)
    pressure_score = Column(Float, nullable=False, default=0.0)
    temperature_score = Column(Float, nullable=False, default=0.0)
    overall_quality_score = Column(Float, nullable=False, default=0.0)
    readiness_tier = Column(String(50), nullable=False, default="READY")  # READY, CONDITIONALLY_READY, REQUIRES_TREATMENT, NOT_READY
    suitable_grades = Column(JSON, default=list)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    source = relationship("CO2Source", back_populates="profiles")


class Technology(Base):
    __tablename__ = "technologies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    provider_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, index=True)  # MINERALIZATION, CONCRETE, FUELS, METHANOL, CHEMICALS, POLYMERS, ALGAE, SYNTHETIC_FUELS
    trl = Column(Integer, default=7)  # 1 to 9
    min_co2_purity = Column(Float, default=90.0)
    min_co2_volume = Column(Float, default=10.0)
    max_co2_volume = Column(Float, default=100000.0)
    conversion_efficiency = Column(Float, default=0.85)
    capex_per_ton = Column(Float, default=250.0)
    opex_per_ton = Column(Float, default=45.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    co2_requirement_ton_per_unit = Column(Float, default=1.0)
    market_price_per_unit = Column(Float, default=150.0)
    trl = Column(Integer, default=8)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class UtilizationPathway(Base):
    __tablename__ = "utilization_pathways"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    name = Column(String(255), nullable=False)
    technology_id = Column(Integer, ForeignKey("technologies.id"), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    conversion_ratio = Column(Float, default=1.2)
    carbon_avoidance_factor = Column(Float, default=0.75)
    energy_intensity_kwh_ton = Column(Float, default=320.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    purity_percentage = Column(Float, nullable=False)
    volume_metric_tons = Column(Float, nullable=False)
    physical_state = Column(String(50), nullable=False, default="liquid")
    reserve_price_ton = Column(Float, nullable=False)
    status = Column(String(50), default="available", index=True)
    available_from = Column(Date, default=date.today)
    available_until = Column(Date, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    seller = relationship("User", back_populates="listings")
    bids = relationship("Bid", back_populates="listing")


class Bid(Base):
    __tablename__ = "bids"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    offered_price_ton = Column(Float, nullable=False)
    requested_quantity = Column(Float, nullable=False)
    delivery_target = Column(Date, nullable=True)
    status = Column(String(50), default="pending", index=True)  # pending, accepted, rejected
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    listing = relationship("Listing", back_populates="bids")
    buyer = relationship("User", back_populates="bids")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    bid_id = Column(Integer, ForeignKey("bids.id"), nullable=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_reference = Column(String(100), unique=True, index=True, nullable=False)
    final_price_ton = Column(Float, nullable=False)
    quantity_tons = Column(Float, nullable=False)
    delivery_window = Column(String(255), nullable=True)
    order_status = Column(String(50), default="confirmed", index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AIMatchResult(Base):
    __tablename__ = "ai_match_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    source_id = Column(Integer, ForeignKey("co2_sources.id"), nullable=True)
    technology_id = Column(Integer, ForeignKey("technologies.id"), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)

    match_score = Column(Integer, nullable=False)
    technical_score = Column(Float, default=90.0)
    economic_score = Column(Float, default=85.0)
    environmental_score = Column(Float, default=95.0)
    geographic_score = Column(Float, default=88.0)
    trl_score = Column(Float, default=90.0)

    confidence_score = Column(Float, default=95.0)
    eligible = Column(Boolean, default=True)
    explanation_text = Column(Text, nullable=False)
    reasons_json = Column(JSON, default=list)
    warnings_json = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    name = Column(String(255), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    source_id = Column(Integer, ForeignKey("co2_sources.id"), nullable=True)
    technology_id = Column(Integer, ForeignKey("technologies.id"), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    expected_co2_utilization = Column(Float, default=5000.0)
    expected_product_output = Column(Float, default=7500.0)
    status = Column(String(50), default="ACTIVE", index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=True)
    organization_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    details_json = Column(JSON, default=dict)
