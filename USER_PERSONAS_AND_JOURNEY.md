# CarbonX — User Personas & User Journey Document
**Project Name:** CarbonX  
**Tagline:** AI-Powered Carbon Capture-to-Product Matchmaking Platform  
**Event:** HackOut'26  
**Document Version:** 2.0 (Phase 2 — User Research, Personas & Journey Mapping)  
**Target Audience:** Product Management, UX Design, Hackathon Jury, Enterprise Solutions Architects  

---

## 1. Executive Summary

The transition of carbon dioxide from an industrial waste product to an essential commercial raw material cannot be solved by technology alone. It hinges on the operational realities, risk tolerances, and behavioral patterns of enterprise users. Industrial plant operators and corporate procurement executives do not behave like consumer e-commerce shoppers; their daily workflows are dictated by strict uptime mandates, process safety protocols, complex regulatory compliance frameworks, and rigid budgetary oversight.

The objective of this user research and journey mapping exercise is to dissect the exact operational touchpoints where carbon capture and utilization transactions stall in the real world. By profiling the enterprise personas responsible for emissions management on the supply side and raw material procurement on the demand side, CarbonX designs workflows that seamlessly integrate into existing industrial processes without introducing administrative friction. Bridging the cognitive, technical, and regulatory gap between heavy plant engineers and climate-tech procurement managers is the core prerequisite for building a scalable, high-velocity B2B carbon exchange.

---

## 2. Persona 1 — Seller: Point-Source Industrial Emitter

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PERSONA PROFILE: INDUSTRIAL SELLER                                      │
├──────────────────────┬──────────────────────────────────────────────────┤
│ Full Name            │ Rajesh K. Verma                                  │
│ Age                  │ 48                                               │
│ Job Title            │ Vice President of Plant Operations & Decarb      │
│ Company Type         │ Integrated Portland Cement Manufacturing Plant   │
│ Location             │ Jharsuguda Industrial Corridor, Odisha, India    │
│ Experience           │ 24 years in heavy process engineering & cement   │
│ Digital Skills       │ Moderate (SCADA, DCS, SAP S/4HANA ERP, MS Excel) │
└──────────────────────┴──────────────────────────────────────────────────┘
```

### 2.1 Daily Responsibilities
* Oversee daily manufacturing throughput of 12,000 metric tons of clinker and cement.
* Supervise the operation of the post-combustion amine carbon capture pilot unit (capturing 250 tons of CO₂ per day).
* Monitor on-site pressurized cryogenic storage vessel levels, ensuring tank capacity does not exceed 80% to prevent safety flaring.
* Coordinate with regional environmental control boards and prepare regulatory emissions filings under the Carbon Credit Trading Scheme (CCTS).
* Manage industrial gas dispatch logistics, weighbridge operations, and plant gate security clearance for road tankers.

### 2.2 Goals
* Monetize captured CO₂ to offset the 18-month amortization schedule of the newly installed amine capture facility.
* Guarantee a continuous offtake cadence to avoid venting captured gas when on-site storage tanks reach maximum capacity.
* Establish reliable, long-term commercial relationships with verified regional industrial buyers.
* Generate audit-ready emissions compliance reports for domestic regulators and international export markets (e.g., EU CBAM).

### 2.3 Frustrations
* Capturing carbon is an operational cost center with no direct sales desk or visibility into regional industrial gas consumers.
* On-site cryogenic storage tanks hold a maximum of 48 hours of captured volume; unexpected distributor delays force costly, unmonetized venting.
* Sourcing spot-market transport tankers on short notice is inefficient, with logistics brokers charging opaque emergency surcharges.
* Legacy legal and technical evaluations take months to establish simple commercial agreements with buyers.

### 2.4 KPIs That Matter
* **Capture Facility Utilization Rate:** Target $\ge 92\%$.
* **Storage Buffer Capacity Safety Margin:** Kept strictly between $30\%$ and $75\%$.
* **Avoided Venting Ratio:** Percentage of captured gas successfully dispatched vs. flared (Target $> 95\%$).
* **Net Revenue Realized per Metric Ton of CO₂ Dispatched:** Target $\ge \$55/\text{ton}$.
* **Compliance Audit Pass Rate:** Zero non-conformance notices from environmental authorities.

### 2.5 User Quote
> "We invested eight million dollars into this amine capture column. If my storage tanks reach maximum pressure on a Sunday afternoon and the local gas distributor doesn't send their tankers, I have to vent that gas into the sky. It is an environmental failure and a financial drain. I need guaranteed offtake with reliable dispatch schedules."

---

## 3. Persona 2 — Buyer: Circular Economy Procurement Manager

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PERSONA PROFILE: CIRCULAR PROCUREMENT BUYER                             │
├──────────────────────┬──────────────────────────────────────────────────┤
│ Full Name            │ Dr. Ananya Sengupta                              │
│ Age                  │ 36                                               │
│ Job Title            │ Head of Raw Material Sourcing & Supply Chain     │
│ Company Type         │ Next-Gen Carbon-Cured Precast Concrete Systems   │
│ Location             │ Sriperumbudur Industrial Park, Tamil Nadu, India │
│ Experience           │ 12 years in chemical procurement & sustainability│
│ Digital Skills       │ Advanced (Procurement ERPs, Coupa, Tableau, APIs)│
└──────────────────────┴──────────────────────────────────────────────────┘
```

### 3.1 Daily Responsibilities
* Procure 80–120 metric tons of industrial-grade carbon dioxide weekly for concrete curing chambers.
* Ensure chemical purity compliance: minimum 90.0% CO₂ concentration with zero tolerance for sulfur oxides ($SO_x < 5 \text{ ppm}$) to avoid compromising cementitious compressive strength.
* Negotiate short- and medium-term gas supply contracts to protect manufacturing gross margins.
* Verify supplier sustainability credentials and Life Cycle Assessments (LCAs) to substantiate green product certifications.
* Manage raw material delivery schedules across three regional precast manufacturing facilities.

### 3.2 Goals
* Lower CO₂ acquisition costs by at least 35% compared to legacy commercial merchant gas pricing ($220/ton).
* Diversify supplier risk away from single-source industrial gas monopolists whose refinery shutdowns trigger force-majeure supply halts.
* Procure verified point-source captured CO₂ to prove net-negative embodied carbon for green building product certifications (LEED / IGBC).
* Optimize delivery schedules to align with weekly batch-curing production schedules.

### 3.3 Frustrations
* Legacy merchant gas distributors charge exorbitant spot prices and provide zero transparency into gas origin or chemical composition.
* Off-spec gas deliveries contaminated with moisture or sulfur compromise concrete curing batches, costing hundreds of thousands of dollars in scrapped product.
* Freight haulers frequently charge predatory fuel and cryogenic handling surcharges on cross-state shipments.
* Lack of real-time shipment visibility leaves manufacturing teams guessing when tankers will arrive at the unloading bay.

### 3.4 KPIs That Matter
* **Delivered Raw Material Cost per Ton of CO₂:** Target $\le \$110/\text{ton}$ (all-inclusive).
* **On-Time In-Full (OTIF) Delivery Rate:** Target $\ge 98\%$.
* **Batch Chemical Conformance Rate:** Zero rejected tanker deliveries per quarter.
* **Embodied Logistics Carbon Debt:** Target $< 0.05 \text{ tCO}_2\text{e per ton of CO}_2$ procured.
* **Procurement Cycle Lead Time:** Target reduction from 45 days to $< 48\text{ hours}$.

### 3.5 User Quote
> "Our enterprise makes green building blocks that absorb carbon. Paying commercial gas monopolies two hundred dollars a ton for fossil-derived CO₂ defeats our business model and our environmental mission. I need verified, point-source industrial CO₂ delivered on a reliable schedule, at an honest price, without sulfur contaminants."

---

## 4. Empathy Maps

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SELLER EMPATHY MAP                                     │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ THINK                                     │ FEEL                                       │
│ • "How close are my buffer tanks to 80%?" │ • Stressed about unscheduled plant flaring │
│ • "Can this capture plant become profit-  │ • Skeptical of unvetted startup buyers     │
│    neutral this fiscal year?"             │ • Burdened by overlapping CCTS regulations │
│ • "Will off-takers pay on time?"          │ • Anxious about carrier safety compliance  │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ SAY                                       │ DO                                         │
│ • "Our gas purity exceeds 95.5% daily."   │ • Reviews DCS process telemetry hourly     │
│ • "We cannot stop production if a buyer   │ • Calls logistics dispatchers repeatedly   │
│    delays tanker arrival."                │ • Signs off on daily flaring log sheets    │
│ • "Show me the legal indemnity and credit │ • Manages hazardous material gate passes   │
│    guarantees upfront."                   │                                            │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 BUYER EMPATHY MAP                                      │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ THINK                                     │ FEEL                                       │
│ • "Are we overpaying the gas distributor?"│ • Frustrated by opaque pricing cartels     │
│ • "Will this batch poison our curing?"    │ • Vulnerable to unexpected supply stockouts│
│ • "How can I prove this CO₂ is circular   │ • Pressured by executive leadership to cut │
│    for our carbon credit audit?"          │    procurement costs                       │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ SAY                                       │ DO                                         │
│ • "We need certified gas specs before the │ • Demands laboratory gas assay sheets      │
│    tanker departs the terminal."          │ • Compares regional spot prices on spreadsheets│
│ • "We will pay on 30-day invoice terms."  │ • Coordinates unloading bay shifts         │
│ • "A two-day delay halts our line."       │ • Audits carbon accounting documentation   │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

---

## 5. Seller User Journey: Point-Source Emitter

| Stage | User Goal | User Action | Pain Point | CarbonX Solution | Emotion |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Login** | Access enterprise account securely and view daily plant operational status. | Authenticates via Enterprise SSO / Multi-Factor Authentication; selects industrial plant asset. | Enterprise access requires role-based permission tiers (Plant Head vs. Shift Engineer). | Secure RBAC with plant-specific access profiles and audit logging. | Neutral / Focused |
| **2. Dashboard** | Assess current storage levels, capture run-rates, and pending dispatch commitments. | Reviews live buffer tank pressure, 24-hour capture volume, and scheduled tanker pickups. | Disparate SCADA and inventory spreadsheets fail to show real-time commercial risks. | Unified inventory telemetry dashboard displaying real-time tank saturation and dispatch countdown. | Relieved |
| **3. Create Listing** | Publish available CO₂ batch without lengthy manual data entry. | Enters available batch quantity (e.g., 60 tons), state (liquid), purity percentage (96.2%), and availability window. | Manual entry of gas chromatography and contaminant limits is error-prone. | Pre-configured stream templates with instant upload of lab assay sheets and auto-populated purity metrics. | Productive |
| **4. Publish Inventory** | Broadcast batch to vetted, proximate off-takers without alerting market competitors. | Selects minimum reserve clearing price per ton and clicks "Publish to AI Match Exchange." | Public listings risk signaling operational issues or production volumes to market rivals. | Anonymized cluster-level publishing where specific plant identity is shielded until commercial match. | Confident |
| **5. Receive Bid** | Review incoming commercial bids from verified industrial consumers. | Reviews incoming bids sorted by AI Match Score, evaluating counter-party creditworthiness and pickup timing. | Sorting through low-ball bids from unvetted buyers located too far away. | AI pre-screens bids, ranking matches by price, transport efficiency, and verified payment history. | Optimistic |
| **6. Accept Order** | Finalize commercial commitment, generate digital bill of lading, and lock tanker pickup. | Clicks "Accept Bid," auto-generating digital sales contract and dispatch bay gate pass. | Legal contracting takes weeks; manual paperwork delays gate operations. | Instant smart-contract generation with automated dispatch slot booking and digital weighbridge pass. | Satisfied / In Control |

---

## 6. Buyer User Journey: Circular Off-Taker

| Stage | User Goal | User Action | Pain Point | CarbonX Solution | Emotion |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Login** | Access corporate procurement workspace and track active raw material requirements. | Signs in via corporate portal; reviews weekly inventory burn-rate and replenishment deadlines. | Procurement systems are disconnected from production line consumption rates. | Streamlined enterprise dashboard indicating remaining CO₂ supply days and reorder thresholds. | Calm / Methodical |
| **2. Search CO₂** | Discover available point-source captured CO₂ within economic transport radius. | Enters required volume (e.g., 40 tons), delivery destination, and target fulfillment date. | Traditional broker sourcing requires dozens of exploratory phone calls. | Real-time regional feed of available point-source batches within geographic search radius. | Curious |
| **3. Apply Filters** | Filter out incompatible gas streams that do not match production requirements. | Sets strict filters: minimum 92% purity, maximum moisture $< 10 \text{ ppm}$, liquid state. | Suppliers fail to provide standardized chemical assays, risking production contamination. | Multi-parameter chemical filter engine with guaranteed spec-sheet threshold enforcement. | Reassured |
| **4. View AI Recommendation** | Identify the mathematically optimal supplier that balances cost, distance, and purity. | Clicks "Run AI Match Engine" to view prioritized list of compatible emitter batches. | Human procurement agents cannot evaluate thermodynamic transport cost vs. purity tradeoffs. | AI Match Score highlights top-ranked supplier based on multi-parametric optimization. | Impressed |
| **5. Compare Suppliers** | Evaluate top three supply options across total landed cost and carbon footprint. | Toggles side-by-side comparison matrix assessing purity, base price, distance, and supplier reliability. | Hidden distributor freight markups obscure true landed unit economics. | Fully transparent breakdown showing base price, estimated freight, and net carbon abatement. | Empowered |
| **6. Calculate Logistics** | Verify road tanker freight costs, transit times, and transport carbon emissions. | Inputs site unloading capabilities (cryogenic coupling type); selects integrated logistics options. | Arranging specialized cryogenic road haulage is complex and opaque. | Integrated logistics engine calculating route distance, tanker availability, and transit emissions. | Confident |
| **7. Place Bid** | Submit legally binding purchase bid matching operational delivery schedules. | Selects target delivery window, enters unit bid price ($/ton), and submits order with escrow lock. | Extended payment negotiations delay dispatch and create inventory stockout risks. | Structured bidding workflow with automated escrow verification and delivery SLA terms. | Decisive |
| **8. Order Confirmation** | Secure binding delivery commitment with live tracking and compliance certificates. | Receives supplier acceptance notification; downloads purity certificate and tracking link. | No visibility into dispatch status leads to production downtime at receiving bays. | Live tanker GPS telemetry, digital delivery receipt, and automated LCA certificate generation. | Relieved / Confident |

---

## 7. User Stories

### Seller User Stories
1. **As an Industrial Plant Operations Head**, I want to publish recurring daily CO₂ capture volumes with pre-configured chemical specifications, so that I do not have to manually re-enter gas chromatography data for every production shift.
2. **As an Emissions Compliance Officer**, I want to download an automated audit ledger detailing every metric ton of CO₂ diverted to commercial buyers, so that our facility can submit verified evidence for CCTS credits and avoid regulatory penalties.
3. **As a Plant Logistics Manager**, I want to assign strict automated tanker pickup time-windows during order acceptance, so that external transport vehicles do not cause congestion at our plant weighbridges.
4. **As an Industrial Finance Director**, I want the platform to hold buyer funds in escrow prior to dispatch confirmation, so that our business eliminates counter-party default risks on spot-market transactions.

### Buyer User Stories
5. **As a Circular Procurement Manager**, I want to filter CO₂ listings by strict chemical purity and maximum contaminant thresholds, so that contaminated gas streams never enter our sensitive production lines.
6. **As a Concrete Manufacturing Lead**, I want the AI engine to rank suppliers based on total landed cost including transport emissions, so that our finished products maintain their low-carbon certification status.
7. **As a Supply Chain Director**, I want to set up recurring automated bids for proximate emitter batches, so that our manufacturing plants maintain a guaranteed 14-day raw material safety buffer.
8. **As an ESG & Carbon Auditor**, I want to export digitally verified Life Cycle Assessment (LCA) certificates for all procured CO₂, so that we can demonstrate provenance from industrial point-sources to our green-building clients.

---

## 8. Pain Point Analysis

```
┌───────────────────────────────────┐               ┌───────────────────────────────────┐
│         SELLER PAIN POINTS        │               │         BUYER PAIN POINTS         │
│ 1. Storage tank overflow risk     │               │ 1. Unpredictable supplier outages │
│ 2. Sunk capital on capture scrub  │               │ 2. Exorbitant distributor margins │
│ 3. Offline, relationship sales    │               │ 3. Off-spec chemical impurities   │
│ 4. Slow contracting cycles        │               │ 4. Unreliable carrier delivery    │
│ 5. Regulatory reporting burden    │               │ 5. Opaque carbon provenance       │
└─────────────────┬─────────────────┘               └─────────────────┬─────────────────┘
                  │                                                   │
                  └─────────────────► ◄───────────────────────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   │        SHARED ECOSYSTEM PROBLEMS    │
                   │ 1. Cryogenic freight scarcity       │
                   │ 2. Net-carbon transport debt        │
                   │ 3. Absence of digital contracts     │
                   └─────────────────────────────────────┘
```

### 8.1 Seller Pain Points
1. **Storage Buffer Saturation:** On-site cryogenic storage tanks hold a maximum of 48–72 hours of captured volume. When capacity is exceeded, plants must vent gas directly to atmosphere.
2. **Unmonetized Capital Infrastructure:** Multi-million-dollar carbon scrubbers operate purely as overhead costs without direct off-take revenue mechanisms.
3. **Fragmented Sourcing Channels:** Plant managers lack commercial sales desks or market visibility to discover non-competing industrial buyers outside their geographic sector.
4. **Contracting Inertia:** Establishing standard industrial gas supply contracts through legacy corporate legal channels takes 60–90 days.
5. **Complex Compliance Burden:** Accurately logging carbon mass balances for regulatory compliance under emerging carbon tax and trading frameworks requires cumbersome manual reporting.

### 8.2 Buyer Pain Points
1. **Supply Vulnerability:** Sourcing from traditional merchant gas distributors leaves buyers vulnerable to sudden supply cutoffs caused by upstream refinery turnarounds.
2. **Distributor Price Gouging:** Middlemen distributors apply heavy price markups ($180–$350/ton), eroding margins for climate-tech startups.
3. **Contamination & Batch Scrap Risks:** Variability in trace contaminants (SOx, NOx, water vapor) can destroy biological algae cultures or compromise concrete strength.
4. **Logistical Unreliability:** Late-arriving road tankers disrupt precision manufacturing schedules and cause expensive factory downtime.
5. **Opaque Carbon Provenance:** Inability to independently verify whether purchased gas originates from fossil extraction or industrial capture prevents credible green marketing.

### 8.3 Shared Ecosystem Problems
1. **Cryogenic Freight Scarcity:** A shortage of specialized road tankers and high empty-backhaul rates inflate transportation overhead across industrial hubs.
2. **Transport Carbon Debt:** Inefficient cross-country transit routes often generate significant transport emissions, diminishing the net climate benefit of the utilization process.
3. **Lack of Standardized Digital Agreements:** Absence of standardized digital contracts, dynamic spot pricing, and dispute-resolution mechanisms slows trading velocity.

---

## 9. Opportunity Mapping

| # | Specific Industry Pain Point | CarbonX Platform Opportunity | Enterprise Business Value |
| :---: | :--- | :--- | :--- |
| **1** | Continuous emitter output leads to tank overflow and emergency flaring. | Dynamic inventory telemetry with automated match alerts triggered at 70% tank capacity. | Eliminates unscheduled venting; maintains uninterrupted capture plant operations. |
| **2** | Off-takers overpay legacy gas distributors ($200–$350/ton). | Direct peer-to-peer marketplace eliminating intermediate distributor markups. | Lowers buyer raw material procurement costs by 35–50%; improves gross margins. |
| **3** | Unvetted gas streams cause product contamination and line stoppages. | Mandatory chemical spec sheets with automated compatibility checks against buyer tolerance thresholds. | Reduces batch rejection rates to $< 1.0\%$; prevents catastrophic equipment damage. |
| **4** | Long-haul road transit creates heavy transport emissions, offsetting capture gains. | Proximity-weighted AI matching that prioritizes regional cluster pairs within 150 km. | Cuts logistics emissions by up to 45%; ensures transactions remain net-negative. |
| **5** | Sourcing specialized cryogenic road tankers is slow and unpredictable. | Integrated logistics scheduling connecting verified third-party cryo-carrier fleets with return-trip optimizations. | Reduces empty backhauls, lowering freight rates by 20–30% and securing timely pickups. |
| **6** | Manual enterprise negotiations take 60–90 days to close single supply deals. | Standardized digital contracts with automated spot and recurring purchase orders. | Accelerates transaction closing speed from months to minutes. |
| **7** | High financial counter-party risk and payment default concerns for emitters. | Digital escrow settlement holding buyer funds until digital proof of delivery is signed. | Guarantees payment certainty for sellers within 24 hours of delivery confirmation. |
| **8** | Proving carbon provenance for carbon credits (CCTS / CBAM) requires expensive audits. | Automated digital Net Carbon Ledger recording batch-level mass balance and LCA provenance. | Provides audit-ready compliance documentation, unlocking verifiable carbon credit revenues. |

---

## 10. End-to-End Journey Diagram

The diagram below illustrates the complete operational lifecycle of a carbon transaction on the CarbonX platform, from initial plant capture to verified commercial utilization.

```
+----------------------------------------------------------------------------------------------------+
|                                      CARBONX TRANSACTION LIFECYCLE                                  |
+----------------------------------------------------------------------------------------------------+

 [ SELLER (Point-Source Emitter) ]                       [ BUYER (Circular Off-Taker) ]
               │                                                       │
 1. Inventory Capture & Telemetry                         1. Raw Material Demand Setting
    • Monitors storage tank levels                           • Sets weekly volume requirements
    • Auto-checks gas purity/pressure                        • Configures chemical tolerance limits
               │                                                       │
 2. Create Listing                                        2. Search & Filter Parameters
    • Enters batch quantity & window                         • Inputs delivery destination
    • Attaches gas assay spec sheet                          • Filters by minimum purity & state
               │                                                       │
               ▼                                                       ▼
 ───────────────────────────────────────────────────────────────────────────────────────────────────
                                   CARBONX AI MATCH ENGINE
 ───────────────────────────────────────────────────────────────────────────────────────────────────
                                               │
                                 3. Multi-Parametric Evaluation
                                    • Purity & Contaminant Filtering
                                    • Cluster Proximity & Route Optimization
                                    • Volumetric & Cadence Synchronization
                                    • Fair-Market Clearing Price Estimation
                                               │
                                 4. Generates AI Match Score (0 - 100)
                                    • High-confidence pairs notified instantly
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                                                               ▼
 5. Evaluates Match Offer                                5. Reviews AI Recommendation
    • Checks buyer reliability score                        • Reviews landed cost & distance
    • Inspects dispatch pickup window                       • Inspects guaranteed gas assay
               │                                                       │
               │                                         6. Places Commercial Bid
               │                                            • Submits unit price ($/ton)
               │                                            • Funds locked in Escrow
               ▼                                                       │
 7. Accepts Bid & Locks Order ◄────────────────────────────────────────┘
    • Generates digital sales agreement
    • Issues automated gate-pass for tanker
               │
 ───────────────────────────────────────────────────────────────────────────────────────────────────
                                   INTEGRATED LOGISTICS DISPATCH
 ───────────────────────────────────────────────────────────────────────────────────────────────────
               │
 8. Cryogenic Tanker Arrival & Loading
    • Weighbridge tare weight recorded
    • Cryogenic transfer verified
    • Digital Bill of Lading (e-BoL) signed
               │
 9. Optimized Route Transit
    • Live GPS tracking & route monitoring
    • Real-time cold-chain telemetry
               │
 10. Delivery & Site Unloading
     • Gas assay verified at buyer intake
     • Weighbridge gross weight confirmed
     • Digital proof of delivery completed
               │
 ───────────────────────────────────────────────────────────────────────────────────────────────────
                                 SETTLEMENT & CARBON ACCOUNTING
 ───────────────────────────────────────────────────────────────────────────────────────────────────
               │
 11. Automated Financial Clearance
     • Escrow funds released to Seller
     • Platform transaction fee settled
               │
 12. Carbon Ledger Issuance
     • Generates verified LCA audit certificate
     • Logs net-avoided emissions for CCTS / CBAM compliance
               │
               ▼
   [ COMPLETED CIRCULAR TRADE ]
```

---

## 11. Conclusion & Next Steps

This document establishes the user research, personas, and behavioral requirements for the CarbonX platform. By addressing the operational constraints of industrial plant engineers and enterprise procurement managers, CarbonX ensures high platform adoption, eliminates structural trading barriers, and provides the foundation for Phase 3 (Feature Specifications & Architecture).
