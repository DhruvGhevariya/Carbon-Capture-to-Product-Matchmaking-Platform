import asyncio
from datetime import date, timedelta
from app.core.database import AsyncSessionLocal, init_db, engine, Base
from app.core.security import get_password_hash
from app.models.domain import (
    Organization, User, CO2Source, CO2Profile, Technology, Product, UtilizationPathway,
    Listing, Bid, Order, AIMatchResult, Notification
)


async def seed():
    print("[CarbonX Seed] Re-creating database tables for fresh schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        print("[CarbonX Seed] Seeding Technologies & Products...")
        t1 = Technology(
            name="Concrete Mineralization & Curing",
            provider_name="CarbonCure Systems",
            category="CONCRETE",
            trl=9,
            min_co2_purity=90.0,
            min_co2_volume=5.0,
            conversion_efficiency=0.92,
            capex_per_ton=180.0,
            opex_per_ton=25.0,
        )
        t2 = Technology(
            name="Catalytic Methanol Synthesis",
            provider_name="CarbonClean Tech",
            category="METHANOL",
            trl=8,
            min_co2_purity=97.0,
            min_co2_volume=20.0,
            conversion_efficiency=0.85,
            capex_per_ton=320.0,
            opex_per_ton=55.0,
        )
        t3 = Technology(
            name="Microalgae Bio-Fixation",
            provider_name="PhycoCapture Labs",
            category="ALGAE",
            trl=7,
            min_co2_purity=85.0,
            min_co2_volume=10.0,
            conversion_efficiency=0.78,
            capex_per_ton=210.0,
            opex_per_ton=40.0,
        )
        db.add_all([t1, t2, t3])
        await db.flush()

        p1 = Product(
            name="Carbon-Cured Concrete Block",
            category="Building Materials",
            description="CO2 permanently mineralized into structural pre-cast concrete.",
            co2_requirement_ton_per_unit=0.05,
            market_price_per_unit=12.5,
            trl=9,
        )
        p2 = Product(
            name="Green Methanol Fuel",
            category="Chemicals",
            description="Low-carbon liquid fuel synthesized from captured CO2.",
            co2_requirement_ton_per_unit=1.38,
            market_price_per_unit=450.0,
            trl=8,
        )
        db.add_all([p1, p2])
        await db.flush()

        pw1 = UtilizationPathway(
            name="Flue Gas -> Amine Capture -> Concrete Mineralization",
            technology_id=t1.id,
            product_id=p1.id,
            conversion_ratio=0.92,
            carbon_avoidance_factor=0.88,
        )
        pw2 = UtilizationPathway(
            name="High-Purity CO2 -> Hydrogenation -> Green Methanol",
            technology_id=t2.id,
            product_id=p2.id,
            conversion_ratio=0.85,
            carbon_avoidance_factor=0.76,
        )
        db.add_all([pw1, pw2])
        await db.flush()

        print("[CarbonX Seed] Seeding Emitter & Buyer Organizations...")
        s1_org = Organization(company_name="UltraTech Cement", industry_type="Cement", location_name="Sanand Cluster, Ahmedabad, Gujarat", latitude=22.9868, longitude=72.3814)
        s2_org = Organization(company_name="Ambuja Cement", industry_type="Cement", location_name="Hazira Zone, Surat, Gujarat", latitude=21.1702, longitude=72.8311)
        s3_org = Organization(company_name="Tata Steel", industry_type="Steel", location_name="Jamnagar Corridor, Gujarat", latitude=22.4707, longitude=70.0577)
        s4_org = Organization(company_name="JSW Steel", industry_type="Steel", location_name="Waghodia Belt, Vadodara, Gujarat", latitude=22.3072, longitude=73.1812)

        b1_org = Organization(company_name="GreenGrow Chemicals", industry_type="Agro-Chemicals", location_name="Kheda Agri Park, Vadodara, Gujarat", latitude=22.3100, longitude=73.1900)
        b2_org = Organization(company_name="EcoBuild Materials", industry_type="Building Materials", location_name="Naroda Estate, Ahmedabad, Gujarat", latitude=23.0225, longitude=72.5714)
        b3_org = Organization(company_name="CarbonFuel Labs", industry_type="Synthetic Fuels", location_name="Surat Clean Tech Cluster, Gujarat", latitude=21.1800, longitude=72.8200)

        db.add_all([s1_org, s2_org, s3_org, s4_org, b1_org, b2_org, b3_org])
        await db.flush()

        print("[CarbonX Seed] Seeding Users...")
        u_s1 = User(company_id=s1_org.id, full_name="Rajesh K. Verma", email="rajesh.verma@ultratech.com", password_hash=get_password_hash("password123"), role="EMITTER")
        u_s2 = User(company_id=s2_org.id, full_name="Suresh Singhania", email="suresh.s@ambujacement.com", password_hash=get_password_hash("password123"), role="EMITTER")
        u_s3 = User(company_id=s3_org.id, full_name="Pradeep Patnaik", email="p.patnaik@tatasteel.com", password_hash=get_password_hash("password123"), role="EMITTER")
        u_s4 = User(company_id=s4_org.id, full_name="Amitabh Sen", email="a.sen@jsw.in", password_hash=get_password_hash("password123"), role="EMITTER")

        u_b1 = User(company_id=b1_org.id, full_name="Dr. Ananya Sengupta", email="ananya.s@greengrow.in", password_hash=get_password_hash("password123"), role="PRODUCT_BUYER")
        u_b2 = User(company_id=b2_org.id, full_name="Vikram Mehra", email="vikram.m@ecobuild.in", password_hash=get_password_hash("password123"), role="PRODUCT_BUYER")
        u_b3 = User(company_id=b3_org.id, full_name="Dr. Rohan Deshmukh", email="rohan.d@carbonfuel.tech", password_hash=get_password_hash("password123"), role="PRODUCT_BUYER")

        db.add_all([u_s1, u_s2, u_s3, u_s4, u_b1, u_b2, u_b3])
        await db.flush()

        print("[CarbonX Seed] Seeding CO2 Sources & Fingerprints...")
        src1 = CO2Source(
            organization_id=s1_org.id,
            name="UltraTech Kiln-3 Flue Stream",
            facility_name="Sanand Kiln 3",
            industry_type="Cement",
            location_name=s1_org.location_name,
            latitude=s1_org.latitude,
            longitude=s1_org.longitude,
            annual_capture_tonnes=120000.0,
            daily_capture_tonnes=350.0,
            purity_percentage=98.5,
            temperature_c=28.0,
            pressure_bar=12.5,
            physical_state="liquid",
        )
        db.add(src1)
        await db.flush()

        fp1 = CO2Profile(
            source_id=src1.id,
            purity_score=98.5,
            volume_score=90.0,
            pressure_score=95.0,
            temperature_score=92.0,
            overall_quality_score=94.5,
            readiness_classification="READY",
            suitable_grades=["Chemical Synthesis", "Concrete Mineralization"],
        )
        db.add(fp1)

        print("[CarbonX Seed] Seeding Marketplace Listings & Bids...")
        l1 = Listing(seller_id=u_s1.id, purity_percentage=98.50, volume_metric_tons=350.00, physical_state="liquid", reserve_price_ton=4800.00, status="available")
        l2 = Listing(seller_id=u_s2.id, purity_percentage=97.20, volume_metric_tons=220.00, physical_state="liquid", reserve_price_ton=4500.00, status="available")
        l3 = Listing(seller_id=u_s3.id, purity_percentage=94.80, volume_metric_tons=500.00, physical_state="pressurized_gas", reserve_price_ton=3900.00, status="available")
        l4 = Listing(seller_id=u_s4.id, purity_percentage=96.00, volume_metric_tons=400.00, physical_state="liquid", reserve_price_ton=4200.00, status="available")

        db.add_all([l1, l2, l3, l4])
        await db.flush()

        bid1 = Bid(listing_id=l1.id, buyer_id=u_b2.id, offered_price_ton=4800.00, requested_quantity=150.00, delivery_target=date.today() + timedelta(days=6), status="accepted")
        bid2 = Bid(listing_id=l4.id, buyer_id=u_b1.id, offered_price_ton=4150.00, requested_quantity=200.00, delivery_target=date.today() + timedelta(days=10), status="pending")
        db.add_all([bid1, bid2])
        await db.flush()

        order1 = Order(bid_id=bid1.id, listing_id=l1.id, seller_id=u_s1.id, buyer_id=u_b2.id, order_reference="#CX-ORD-8821", final_price_ton=4800.00, quantity_tons=150.00, delivery_window="Target Date: In 6 Days • Scheduled", order_status="confirmed")
        ai1 = AIMatchResult(listing_id=l1.id, buyer_id=u_b2.id, match_score=96, confidence_score=98.4, explanation_text="UltraTech Cement is rated #1 match score of 96/100.")
        db.add_all([order1, ai1])

        await db.commit()
        print("[CarbonX Seed] Comprehensive seed completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
