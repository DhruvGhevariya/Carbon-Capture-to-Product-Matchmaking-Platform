import uuid
from datetime import datetime, date, timezone
from typing import Optional, List
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Text, JSON
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
    country = Column(String(100), default="USA")
    state = Column(String(100), default="Texas")
    city = Column(String(100), default="Houston")
    industrial_cluster = Column(String(100), default="Gulf Coast Clean Hydrogen & Carbon Hub")
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime, nullable=True)

    users = relationship("User", back_populates="company")
    memberships = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")
    co2_sources = relationship("CO2Source", back_populates="organization")
    calculations = relationship("Calculation", back_populates="organization")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    company_id = Column(Integer, ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="USER", index=True)  # SUPER_ADMIN, ADMIN, USER
    is_active = Column(Boolean, default=True)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime, nullable=True)

    company = relationship("Organization", back_populates="users")
    memberships = relationship("OrganizationMember", back_populates="user", cascade="all, delete-orphan")
    listings = relationship("Listing", back_populates="seller")
    bids = relationship("Bid", back_populates="buyer")
    copilot_conversations = relationship("CopilotConversation", back_populates="user")
    ai_usages = relationship("AIUsage", back_populates="user")


class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    org_role = Column(String(50), default="ANALYST", nullable=False)  # EMITTER, TECHNOLOGY_PROVIDER, PRODUCT_BUYER, ANALYST, ADMIN
    permissions_json = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="memberships")
    organization = relationship("Organization", back_populates="memberships")


class CO2Source(Base):
    __tablename__ = "co2_sources"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    facility_name = Column(String(255), nullable=False)
    industry_type = Column(String(100), nullable=False)
    location_name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False, default=0.0)
    longitude = Column(Float, nullable=False, default=0.0)
    annual_capture_tonnes = Column(Float, nullable=False, default=0.0)
    daily_capture_tonnes = Column(Float, nullable=False, default=0.0)
    purity_percentage = Column(Float, nullable=False, default=95.0)
    temperature_c = Column(Float, nullable=False, default=25.0)
    pressure_bar = Column(Float, nullable=False, default=1.013)
    physical_state = Column(String(50), default="liquid")
    impurities_json = Column(JSON, default=dict)
    source_status = Column(String(50), default="ACTIVE", index=True)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime, nullable=True)

    organization = relationship("Organization", back_populates="co2_sources")
    profiles = relationship("CO2Profile", back_populates="source")
    measurements = relationship("CO2Measurement", back_populates="source")
    impurities = relationship("CO2Impurity", back_populates="source")


class CO2Measurement(Base):
    __tablename__ = "co2_measurements"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    source_id = Column(Integer, ForeignKey("co2_sources.id", ondelete="CASCADE"), nullable=False, index=True)
    measured_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    co2_concentration_pct = Column(Float, nullable=False)
    flow_rate_m3h = Column(Float, nullable=False)
    temperature_c = Column(Float, nullable=False)
    pressure_bar = Column(Float, nullable=False)
    moisture_pct = Column(Float, default=0.0)
    impurities_json = Column(JSON, default=dict)
    measurement_source = Column(String(100), default="Continuous Emission Monitor (CEMS)")
    quality_status = Column(String(50), default="VERIFIED")

    source = relationship("CO2Source", back_populates="measurements")


class CO2Impurity(Base):
    __tablename__ = "co2_impurities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    source_id = Column(Integer, ForeignKey("co2_sources.id", ondelete="CASCADE"), nullable=False, index=True)
    chemical_formula = Column(String(50), nullable=False)
    concentration_ppm = Column(Float, nullable=False)
    measurement_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    source = relationship("CO2Source", back_populates="impurities")


class CO2Profile(Base):
    __tablename__ = "co2_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    source_id = Column(Integer, ForeignKey("co2_sources.id", ondelete="CASCADE"), nullable=False, index=True)
    algorithm_version = Column(String(50), default="v1.0.0")
    fingerprint_version = Column(Integer, default=1)
    profile_source = Column(String(100), default="CEMS_AGGREGATED")
    measurement_window_start = Column(DateTime, nullable=True)
    measurement_window_end = Column(DateTime, nullable=True)
    data_quality_score = Column(Float, default=95.0)
    input_snapshot_json = Column(JSON, default=dict)
    calculated_scores_json = Column(JSON, default=dict)
    purity_score = Column(Float, nullable=False, default=0.0)
    volume_score = Column(Float, nullable=False, default=0.0)
    pressure_score = Column(Float, nullable=False, default=0.0)
    temperature_score = Column(Float, nullable=False, default=0.0)
    overall_quality_score = Column(Float, nullable=False, default=0.0)
    readiness_classification = Column(String(50), nullable=False, default="READY")
    suitable_grades = Column(JSON, default=list)
    generated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    source = relationship("CO2Source", back_populates="profiles")


class Technology(Base):
    __tablename__ = "technologies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    provider_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, index=True)
    trl = Column(Integer, default=7)
    min_co2_purity = Column(Float, default=90.0)
    min_co2_volume = Column(Float, default=10.0)
    conversion_efficiency = Column(Float, default=0.85)
    capex_per_ton = Column(Float, default=250.0)
    opex_per_ton = Column(Float, default=45.0)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime, nullable=True)

    requirements = relationship("TechnologyRequirement", back_populates="technology", cascade="all, delete-orphan")


class TechnologyRequirement(Base):
    __tablename__ = "technology_requirements"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    technology_id = Column(Integer, ForeignKey("technologies.id", ondelete="CASCADE"), nullable=False, index=True)
    parameter_name = Column(String(100), nullable=False)
    min_threshold = Column(Float, nullable=True)
    max_threshold = Column(Float, nullable=True)
    unit = Column(String(50), nullable=False)
    is_mandatory = Column(Boolean, default=True)

    technology = relationship("Technology", back_populates="requirements")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    cas_number = Column(String(50), nullable=True)
    co2_requirement_ton_per_unit = Column(Float, default=1.0)
    market_price_per_unit = Column(Float, default=150.0)
    market_size_tonnes_year = Column(Float, default=1000000.0)
    trl = Column(Integer, default=8)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime, nullable=True)

    requirements = relationship("ProductRequirement", back_populates="product", cascade="all, delete-orphan")


class ProductRequirement(Base):
    __tablename__ = "product_requirements"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    specification_name = Column(String(100), nullable=False)
    required_purity_pct = Column(Float, default=99.0)
    max_impurities_json = Column(JSON, default=dict)

    product = relationship("Product", back_populates="requirements")


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
    provenance_type = Column(String(50), default="RESEARCH")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    source_id = Column(Integer, ForeignKey("co2_sources.id"), nullable=False, index=True)
    pathway_id = Column(Integer, ForeignKey("utilization_pathways.id"), nullable=False, index=True)
    algorithm_version = Column(String(50), default="v1.0.0")
    scoring_weight_version = Column(String(50), default="v1.0.0")
    input_snapshot_json = Column(JSON, default=dict)
    overall_score = Column(Float, nullable=False)
    confidence_score = Column(Float, default=95.0)
    eligibility = Column(Boolean, default=True)
    generated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    scores = relationship("MatchScore", back_populates="match", uselist=False, cascade="all, delete-orphan")
    explanations = relationship("MatchExplanation", back_populates="match", uselist=False, cascade="all, delete-orphan")


class MatchScore(Base):
    __tablename__ = "match_scores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    match_id = Column(Integer, ForeignKey("matches.id", ondelete="CASCADE"), nullable=False, index=True)
    technical_score = Column(Float, default=90.0)
    economic_score = Column(Float, default=85.0)
    environmental_score = Column(Float, default=95.0)
    geographic_score = Column(Float, default=88.0)
    trl_score = Column(Float, default=90.0)

    match = relationship("Match", back_populates="scores")


class MatchExplanation(Base):
    __tablename__ = "match_explanations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    match_id = Column(Integer, ForeignKey("matches.id", ondelete="CASCADE"), nullable=False, index=True)
    reasons_json = Column(JSON, default=list)
    warnings_json = Column(JSON, default=list)
    eligibility_rationale = Column(Text, nullable=True)

    match = relationship("Match", back_populates="explanations")


class Calculation(Base):
    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True, index=True)
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    calculation_type = Column(String(50), nullable=False)  # CARBON_IMPACT, ECONOMIC, SCENARIO
    engine_version = Column(String(50), default="v1.0.0")
    formula_version = Column(String(50), default="v1.0.0")
    input_snapshot_json = Column(JSON, default=dict)
    assumptions_json = Column(JSON, default=dict)
    provenance_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    organization = relationship("Organization", back_populates="calculations")
    scenarios = relationship("CalculationScenario", back_populates="calculation", cascade="all, delete-orphan")


class CalculationScenario(Base):
    __tablename__ = "calculation_scenarios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    calculation_id = Column(Integer, ForeignKey("calculations.id", ondelete="CASCADE"), nullable=False, index=True)
    scenario_name = Column(String(50), nullable=False)  # CONSERVATIVE, BASE, OPTIMISTIC
    assumptions_override_json = Column(JSON, default=dict)

    calculation = relationship("Calculation", back_populates="scenarios")
    results = relationship("CalculationResult", back_populates="scenario", cascade="all, delete-orphan")


class CalculationResult(Base):
    __tablename__ = "calculation_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scenario_id = Column(Integer, ForeignKey("calculation_scenarios.id", ondelete="CASCADE"), nullable=False, index=True)
    metrics_json = Column(JSON, default=dict)
    units_json = Column(JSON, default=dict)
    calculated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    scenario = relationship("CalculationScenario", back_populates="results")


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    purity_percentage = Column(Float, nullable=False)
    volume_metric_tons = Column(Float, nullable=False)
    physical_state = Column(String(50), nullable=False, default="liquid")
    reserve_price_ton = Column(Float, nullable=False)
    status = Column(String(50), default="ACTIVE", index=True)  # DRAFT, ACTIVE, PAUSED, CLOSED
    available_from = Column(Date, default=date.today)
    available_until = Column(Date, nullable=True)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime, nullable=True)

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
    status = Column(String(50), default="SUBMITTED", index=True)  # SUBMITTED, ACCEPTED, REJECTED, WITHDRAWN
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    listing = relationship("Listing", back_populates="bids")
    buyer = relationship("User", back_populates="bids")
    partnership_requests = relationship("PartnershipRequest", back_populates="bid")


class PartnershipRequest(Base):
    __tablename__ = "partnership_requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    bid_id = Column(Integer, ForeignKey("bids.id"), nullable=True, index=True)
    initiator_org_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    recipient_org_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    status = Column(String(50), default="PENDING", index=True)  # PENDING, ACCEPTED, DECLINED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    bid = relationship("Bid", back_populates="partnership_requests")


class Partnership(Base):
    __tablename__ = "partnerships"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    emitter_org_id = Column(Integer, ForeignKey("organizations.id"), nullable=False, index=True)
    buyer_org_id = Column(Integer, ForeignKey("organizations.id"), nullable=False, index=True)
    bid_id = Column(Integer, ForeignKey("bids.id"), nullable=True)
    partnership_name = Column(String(255), nullable=False)
    status = Column(String(50), default="ACTIVE", index=True)  # PROPOSED, TECHNICAL_REVIEW, COMMERCIAL_REVIEW, ACTIVE, SUSPENDED, TERMINATED
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    projects = relationship("Project", back_populates="partnership")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    partnership_id = Column(Integer, ForeignKey("partnerships.id"), nullable=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    source_id = Column(Integer, ForeignKey("co2_sources.id"), nullable=True)
    technology_id = Column(Integer, ForeignKey("technologies.id"), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    name = Column(String(255), nullable=False)
    expected_co2_utilization_tonnes = Column(Float, default=5000.0)
    expected_product_output_tonnes = Column(Float, default=7500.0)
    status = Column(String(50), default="DRAFT", index=True)  # DRAFT, PROPOSED, TECHNICAL_VALIDATION, ACTIVE, COMPLETED, CANCELLED
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime, nullable=True)

    partnership = relationship("Partnership", back_populates="projects")
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")
    milestones = relationship("ProjectMilestone", back_populates="project", cascade="all, delete-orphan")
    activities = relationship("ProjectActivity", back_populates="project", cascade="all, delete-orphan")


class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role_in_project = Column(String(50), default="MEMBER")

    project = relationship("Project", back_populates="members")


class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    target_date = Column(Date, nullable=True)
    status = Column(String(50), default="PENDING")  # PENDING, ACHIEVED, DELAYED

    project = relationship("Project", back_populates="milestones")


class ProjectActivity(Base):
    __tablename__ = "project_activities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    activity_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="activities")


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
    order_status = Column(String(50), default="CONFIRMED", index=True)  # DRAFT, CONFIRMED, FULFILLED, CANCELLED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AIMatchResult(Base):
    __tablename__ = "ai_match_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    source_id = Column(Integer, ForeignKey("co2_sources.id"), nullable=True)

    algorithm_version = Column(String(50), default="v1.0.0")
    scoring_weight_version = Column(String(50), default="v1.0.0")
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


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="TECHNICAL_SPEC")
    source_name = Column(String(255), nullable=False)
    content_text = Column(Text, nullable=False)
    storage_provider = Column(String(50), default="LOCAL")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime, nullable=True)

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")


class KnowledgeSource(Base):
    __tablename__ = "knowledge_sources"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), default="RESEARCH_PAPER")
    source_url = Column(String(500), nullable=True)
    version = Column(String(50), default="v1.0")
    is_verified = Column(Boolean, default=True)


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    chunk_text = Column(Text, nullable=False)
    embedding_json = Column(JSON, nullable=True)

    document = relationship("Document", back_populates="chunks")


class CopilotConversation(Base):
    __tablename__ = "copilot_conversations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), default=generate_uuid, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), default="Copilot Discussion")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="copilot_conversations")
    messages = relationship("CopilotMessage", back_populates="conversation", cascade="all, delete-orphan")


class CopilotMessage(Base):
    __tablename__ = "copilot_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    conversation_id = Column(Integer, ForeignKey("copilot_conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_role = Column(String(20), nullable=False)  # USER, ASSISTANT
    message_text = Column(Text, nullable=False)
    sources_json = Column(JSON, default=list)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    conversation = relationship("CopilotConversation", back_populates="messages")


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
    request_id = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    details_json = Column(JSON, default=dict)


class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value_json = Column(JSON, default=dict)
    description = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class IdempotencyRecord(Base):
    __tablename__ = "idempotency_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    key = Column(String(255), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    endpoint = Column(String(255), nullable=False)
    request_hash = Column(String(64), nullable=False)
    status = Column(String(50), default="PROCESSING", index=True)  # PROCESSING, COMPLETED
    response_status = Column(Integer, nullable=True)
    response_body_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=True)


class AIUsage(Base):
    __tablename__ = "ai_usages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True, index=True)
    model = Column(String(100), nullable=False, default="gemini-2.5-flash")
    request_type = Column(String(100), nullable=False)
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    estimated_cost_usd = Column(Float, default=0.0)
    latency_ms = Column(Float, default=0.0)
    status = Column(String(50), default="SUCCESS")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="ai_usages")
