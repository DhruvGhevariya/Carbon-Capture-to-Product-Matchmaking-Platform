import asyncio
from datetime import date, timedelta
from app.database import AsyncSessionLocal, init_db
from app.models.company import Company
from app.models.user import User
from app.models.listing import Listing
from app.models.bid import Bid
from app.models.order import Order
from app.models.ai_match import AIMatchResult
from app.models.logistics import LogisticsEstimate
from app.security import get_password_hash
from sqlalchemy import select, delete


async def seed():
    print("[CarbonX Seed] Initializing database tables...")
    await init_db()

    async with AsyncSessionLocal() as db:
        print("[CarbonX Seed] Cleaning previous records for fresh idempotent seed...")
        await db.execute(delete(AIMatchResult))
        await db.execute(delete(Order))
        await db.execute(delete(Bid))
        await db.execute(delete(Listing))
        await db.execute(delete(User))
        await db.execute(delete(Company))
        await db.flush()

        print("[CarbonX Seed] Seeding 4 Verified Sellers & 3 Commercial Buyers...")

        # 4 Required Sellers
        s1_comp = Company(
            company_name="UltraTech Cement",
            industry_type="Cement",
            location_name="Sanand Industrial Cluster, Ahmedabad, Gujarat",
            latitude=22.9868,
            longitude=72.3814,
        )
        s2_comp = Company(
            company_name="Ambuja Cement",
            industry_type="Cement",
            location_name="Hazira Industrial Zone, Surat, Gujarat",
            latitude=21.1702,
            longitude=72.8311,
        )
        s3_comp = Company(
            company_name="Tata Steel",
            industry_type="Steel",
            location_name="Jamnagar Metallurgical Corridor, Gujarat",
            latitude=22.4707,
            longitude=70.0577,
        )
        s4_comp = Company(
            company_name="JSW Steel",
            industry_type="Steel",
            location_name="Waghodia Industrial Belt, Vadodara, Gujarat",
            latitude=22.3072,
            longitude=73.1812,
        )

        # 3 Required Buyers
        b1_comp = Company(
            company_name="GreenGrow Chemicals",
            industry_type="Agro-Chemicals",
            location_name="Kheda Agri Park, Vadodara Hub, Gujarat",
            latitude=22.3100,
            longitude=73.1900,
        )
        b2_comp = Company(
            company_name="EcoBuild Materials",
            industry_type="Building Materials",
            location_name="Naroda Industrial Estate, Ahmedabad, Gujarat",
            latitude=23.0225,
            longitude=72.5714,
        )
        b3_comp = Company(
            company_name="CarbonFuel Labs",
            industry_type="Synthetic Fuels",
            location_name="Surat Clean Tech Innovation Cluster, Gujarat",
            latitude=21.1800,
            longitude=72.8200,
        )

        db.add_all([s1_comp, s2_comp, s3_comp, s4_comp, b1_comp, b2_comp, b3_comp])
        await db.flush()

        print("[CarbonX Seed] Seeding Users...")
        # Sellers
        u_seller1 = User(
            company_id=s1_comp.id,
            full_name="Rajesh K. Verma",
            email="rajesh.verma@ultratech.com",
            password_hash=get_password_hash("password123"),
            role="seller",
            is_active=True,
        )
        u_seller2 = User(
            company_id=s2_comp.id,
            full_name="Suresh Singhania",
            email="suresh.s@ambujacement.com",
            password_hash=get_password_hash("password123"),
            role="seller",
            is_active=True,
        )
        u_seller3 = User(
            company_id=s3_comp.id,
            full_name="Pradeep Patnaik",
            email="p.patnaik@tatasteel.com",
            password_hash=get_password_hash("password123"),
            role="seller",
            is_active=True,
        )
        u_seller4 = User(
            company_id=s4_comp.id,
            full_name="Amitabh Sen",
            email="a.sen@jsw.in",
            password_hash=get_password_hash("password123"),
            role="seller",
            is_active=True,
        )

        # Buyers
        u_buyer1 = User(
            company_id=b1_comp.id,
            full_name="Dr. Ananya Sengupta",
            email="ananya.s@greengrow.in",
            password_hash=get_password_hash("password123"),
            role="buyer",
            is_active=True,
        )
        u_buyer2 = User(
            company_id=b2_comp.id,
            full_name="Vikram Mehra",
            email="vikram.m@ecobuild.in",
            password_hash=get_password_hash("password123"),
            role="buyer",
            is_active=True,
        )
        u_buyer3 = User(
            company_id=b3_comp.id,
            full_name="Dr. Rohan Deshmukh",
            email="rohan.d@carbonfuel.tech",
            password_hash=get_password_hash("password123"),
            role="buyer",
            is_active=True,
        )

        db.add_all([u_seller1, u_seller2, u_seller3, u_seller4, u_buyer1, u_buyer2, u_buyer3])
        await db.flush()

        print("[CarbonX Seed] Seeding Listings for 4 Sellers...")
        # UltraTech: 98.5% purity, 350 tons, 4800 INR/ton
        l1 = Listing(
            seller_id=u_seller1.id,
            purity_percentage=98.50,
            volume_metric_tons=350.00,
            physical_state="liquid",
            reserve_price_ton=4800.00,
            status="available",
            available_from=date.today(),
            available_until=date.today() + timedelta(days=30),
        )
        # Ambuja: 97.2% purity, 220 tons, 4500 INR/ton
        l2 = Listing(
            seller_id=u_seller2.id,
            purity_percentage=97.20,
            volume_metric_tons=220.00,
            physical_state="liquid",
            reserve_price_ton=4500.00,
            status="available",
            available_from=date.today(),
            available_until=date.today() + timedelta(days=21),
        )
        # Tata Steel: 94.8% purity, 500 tons, 3900 INR/ton
        l3 = Listing(
            seller_id=u_seller3.id,
            purity_percentage=94.80,
            volume_metric_tons=500.00,
            physical_state="pressurized_gas",
            reserve_price_ton=3900.00,
            status="available",
            available_from=date.today(),
            available_until=date.today() + timedelta(days=45),
        )
        # JSW Steel: 96.0% purity, 400 tons, 4200 INR/ton
        l4 = Listing(
            seller_id=u_seller4.id,
            purity_percentage=96.00,
            volume_metric_tons=400.00,
            physical_state="liquid",
            reserve_price_ton=4200.00,
            status="available",
            available_from=date.today(),
            available_until=date.today() + timedelta(days=25),
        )

        db.add_all([l1, l2, l3, l4])
        await db.flush()

        print("[CarbonX Seed] Seeding Realistic Bids & Active Orders...")
        # Bid 1: EcoBuild -> UltraTech (Accepted)
        bid1 = Bid(
            listing_id=l1.id,
            buyer_id=u_buyer2.id,
            offered_price_ton=4800.00,
            requested_quantity=150.00,
            delivery_target=date.today() + timedelta(days=6),
            status="accepted",
        )
        # Bid 2: GreenGrow -> JSW Steel (Pending)
        bid2 = Bid(
            listing_id=l4.id,
            buyer_id=u_buyer1.id,
            offered_price_ton=4150.00,
            requested_quantity=200.00,
            delivery_target=date.today() + timedelta(days=10),
            status="pending",
        )
        # Bid 3: CarbonFuel -> Tata Steel (Pending)
        bid3 = Bid(
            listing_id=l3.id,
            buyer_id=u_buyer3.id,
            offered_price_ton=3850.00,
            requested_quantity=300.00,
            delivery_target=date.today() + timedelta(days=14),
            status="pending",
        )
        db.add_all([bid1, bid2, bid3])
        await db.flush()

        # Orders
        order1 = Order(
            bid_id=bid1.id,
            listing_id=l1.id,
            seller_id=u_seller1.id,
            buyer_id=u_buyer2.id,
            order_reference="#CX-ORD-8821",
            final_price_ton=4800.00,
            quantity_tons=150.00,
            delivery_window=f"Target Date: {(date.today() + timedelta(days=6)).isoformat()} • Morning Slot",
            order_status="confirmed",
        )
        db.add(order1)

        # AI Matches
        ai1 = AIMatchResult(
            listing_id=l1.id,
            buyer_id=u_buyer2.id,
            match_score=96,
            confidence_score=98.40,
            explanation_text="UltraTech Cement (Ahmedabad) is the #1 optimal match with a 96/100 score. Proximity of 28 km saves freight and 98.5% purity satisfies high-specification off-take with zero contaminants.",
        )
        ai2 = AIMatchResult(
            listing_id=l4.id,
            buyer_id=u_buyer1.id,
            match_score=94,
            confidence_score=96.10,
            explanation_text="JSW Steel (Vadodara) is rated 94/100. Intra-cluster transit to Kheda Agri Park ensures under 4-hour delivery window.",
        )
        db.add_all([ai1, ai2])

        await db.commit()
        print("[CarbonX Seed] Seed completed successfully!")
        print("  - UltraTech Seller: rajesh.verma@ultratech.com / password123")
        print("  - GreenGrow Buyer:  ananya.s@greengrow.in / password123")
        print("  - EcoBuild Buyer:   vikram.m@ecobuild.in / password123")


if __name__ == "__main__":
    asyncio.run(seed())
