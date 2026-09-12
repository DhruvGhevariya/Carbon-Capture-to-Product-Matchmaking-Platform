# CarbonX — AI Match Engine Design Document
**Project Name:** CarbonX  
**Tagline:** Transform Captured Carbon into Industrial Value  
**Event:** HackOut'26 (36-Hour Hackathon)  
**Document Version:** 7.0 (Phase 7 — Explainable Recommendation Engine & Multi-Parametric Match Design)  
**Author:** AI Product Architect, Recommendation System Designer & Explainable AI Specialist  

---

## 1. Executive Summary

In industrial commodity trading, the lowest unit price is rarely the optimal commercial decision. Sourcing industrial carbon dioxide (CO₂) is governed by complex physical and chemical constraints: a low-cost batch with 88% purity will ruin an indoor greenhouse or poison a chemical synthesis catalyst; similarly, purchasing inexpensive CO₂ from a facility 450 kilometers away incurs massive cryogenic freight surcharges and creates diesel transport emissions that defeat the sustainability purpose of the trade.

The **CarbonX AI Match Engine** is an explainable, deterministic multi-criteria recommendation system designed specifically for industrial circular supply chains. Rather than functioning as an opaque "black-box" neural network or relying on unpredictable external LLM APIs, the engine uses a multi-factor multi-attribute utility model. It evaluates chemical compatibility, geospatial logistics, volumetric alignment, price elasticity, delivery schedules, and historical reliability. 

The engine delivers:
1. A normalized **AI Match Score (0–100)** representing overall commercial and physical compatibility.
2. An **Algorithmic Confidence Score (0–100)** reflecting data completeness and historical supplier reliability.
3. A transparent **Explainable AI (XAI) natural language justification** outlining the exact trade-offs that led to the recommendation.
4. A deterministic, ranked list of qualified suppliers with tie-breaking rules.

---

## 2. AI Recommendation Pipeline Architecture

The engine executes an eight-stage sequential pipeline for every procurement request:

```
+----------------------------------------------------------------------------------------------------+
|                                    AI RECOMMENDATION PIPELINE                                      |
+----------------------------------------------------------------------------------------------------+

     [ Buyer Procurement Request ]
                   │
                   ▼
     ┌───────────────────────────┐
     │ 1. Data Ingestion &       │ ──► Rejects malformed types, missing location, or impossible bounds
     │    Validation             │
     └─────────────┬─────────────┘
                   ▼
     ┌───────────────────────────┐
     │ 2. Candidate Filtering    │ ──► Hard gates: Purity floor, state mismatch, expired inventory
     │    (Hard Constraints)     │
     └─────────────┬─────────────┘
                   ▼
     ┌───────────────────────────┐
     │ 3. Feature Scoring &      │ ──► Converts disparate physical units (%, km, ₹, tons)
     │    Normalization          │     into normalized scalar indices [0.00 - 1.00]
     └─────────────┬─────────────┘
                   ▼
     ┌───────────────────────────┐
     │ 4. Weighted Match Score   │ ──► Applies business weights: Purity (30%), Distance (25%),
     │    Aggregation            │     Price (20%), Quantity (10%), Delivery (10%), Reliability (5%)
     └─────────────┬─────────────┘
                   ▼
     ┌───────────────────────────┐
     │ 5. Confidence Score       │ ──► Evaluates listing recency, assay freshness, and telemetry
     │    Computation            │
     └─────────────┬─────────────┘
                   ▼
     ┌───────────────────────────┐
     │ 6. Multi-Tier Ranking &   │ ──► Sorts candidates; executes deterministic tie-breaking logic
     │    Tie-Breaking           │
     └─────────────┬─────────────┘
                   ▼
     ┌───────────────────────────┐
     │ 7. Best Supplier          │ ──► Isolates top-ranked match and computes margin of advantage
     │    Designation            │
     └─────────────┬─────────────┘
                   ▼
     ┌───────────────────────────┐
     │ 8. Explainable AI (XAI)   │ ──► Compiles structured human-readable rationale templates
     │    Rationale Generation   │
     └─────────────┬─────────────┘
                   │
                   ▼
     [ Structured AI Match Output ]
```

### Detailed Pipeline Stages
* **Stage 1: Data Ingestion & Validation:** Validates the buyer request payload (quantity, purity floor, budget ceiling, location coordinates, deadline). Rejects incomplete inputs.
* **Stage 2: Candidate Filtering (Hard Gates):** Scans the active inventory catalog and eliminates unviable batches before scoring begins (e.g., lower purity than buyer minimum).
* **Stage 3: Feature Scoring & Normalization:** Maps physical metrics into unitless scores between `0.00` and `1.00`, ensuring equitable comparison across metrics.
* **Stage 4: Weighted Match Score Aggregation:** Multiplies normalized feature scores by assigned strategic business weights, summing to a composite score between `0.0` and `100.0`.
* **Stage 5: Confidence Score Computation:** Measures certainty in the match by evaluating supplier verification status, gas assay age, and profile completeness.
* **Stage 6: Multi-Tier Ranking & Tie-Breaking:** Sorts all surviving candidates in descending order, applying strict tie-breakers if scores match within 0.1 points.
* **Stage 7: Best Supplier Designation:** Selects the highest-ranking candidate as the recommended option and computes its comparative advantage over runner-up listings.
* **Stage 8: Explainable AI (XAI) Rationale Generation:** Synthesizes the score breakdown into structured, professional text explaining *why* this supplier was recommended.

---

## 3. Candidate Filtering Rules (Hard Gates vs. Soft Scoring)

To maintain computational efficiency and prevent unviable pairings, the engine separates **Hard Constraints (Pass/Fail Gates)** from **Soft Scoring (Optimization Weights)**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 FILTERING TAXONOMY                                     │
├────────────────────────────────────────┬───────────────────────────────────────────────┤
│ HARD GATES (Immediate Disqualification)│ SOFT SCORING (Continuous Optimization)        │
├────────────────────────────────────────┼───────────────────────────────────────────────┤
│ • Purity strictly below buyer floor    │ • Marginal purity surplus above requirement   │
│ • Available volume < 25% of request    │ • Proximity within economic radius (10–150 km)│
│ • Batch status != 'available'          │ • Landed price spread vs buyer target budget  │
│ • Physical state mismatch (Gas vs Liq) │ • Delivery arrival ahead of requested deadline│
│ • Haulage distance > 500 km (Economic) │ • Supplier reliability rating (3.0 to 5.0)    │
│ • Listing expiration date in past      │ • On-site storage buffer loading capabilities │
└────────────────────────────────────────┴───────────────────────────────────────────────┘
```

### Hard Gate Rules
1. **Purity Floor Gate:** If `Seller_Purity < Buyer_Min_Purity`, the candidate is immediately eliminated. A 90% purity stream cannot be used in a 99% purity process.
2. **Physical Phase Compatibility Gate:** If a buyer requires liquid CO₂ and an emitter outputs uncompressed gaseous flue stream without on-site liquefaction, the candidate is disqualified.
3. **Availability & Status Gate:** Only listings with `status = 'available'` and `available_until >= CURRENT_DATE` are eligible.
4. **Extreme Distance Cutoff:** Any emitter located beyond 500 road kilometers is disqualified, as cryogenic boil-off and diesel freight emissions exceed industrial viability.
5. **Critical Volume Threshold:** If available batch volume is less than 25% of the buyer's minimum required shipment, it is filtered out to avoid fragmented logistics.

---

## 4. Match Score Feature Weighting Design

The composite AI Match Score balances operational, chemical, and economic priorities. Weights sum to exactly **100 points**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              FEATURE WEIGHTING DISTRIBUTION                            │
├───────────────────┬────────┬───────────────────────────────────────────────────────────┤
│ Evaluation Vector │ Weight │ Strategic Rationale & Industrial Justification            │
├───────────────────┼────────┼───────────────────────────────────────────────────────────┤
│ **CO₂ Purity**    │ **30** │ Chemical specification is critical. Sub-optimal gas       │
│                   │        │ destroys biological cultures, compromises concrete        │
│                   │        │ strength, or poisons catalyst beds. Quality is paramount. │
├───────────────────┼────────┼───────────────────────────────────────────────────────────┤
│ **Logistics &**   │ **25** │ Road distance directly dictates cryogenic freight cost    │
│ **Distance**      │        │ and diesel carbon debt. Local clustering (<100 km)        │
│                   │        │ produces the greatest economic and environmental yield.   │
├───────────────────┼────────┼───────────────────────────────────────────────────────────┤
│ **Delivered**     │ **20** │ Landed unit price (Base Price + Freight) determines       │
│ **Landed Cost**   │        │ buyer profitability against legacy merchant gas cartels.  │
├───────────────────┼────────┼───────────────────────────────────────────────────────────┤
│ **Quantity Fit**  │ **10** │ Evaluates how closely the available volume satisfies the  │
│                   │        │ requested batch size without leaving awkward fractional   │
│                   │        │ tank volumes.                                             │
├───────────────────┼────────┼───────────────────────────────────────────────────────────┤
│ **Delivery Lead** │ **10** │ Plant operations operate on strict production schedules;  │
│ **Time & Window** │        │ early or on-time fulfillment prevents line downtime.     │
├───────────────────┼────────┼───────────────────────────────────────────────────────────┤
│ **Supplier**      │ **5**  │ Historical dispatch track record, weighbridge accuracy,   │
│ **Reliability**   │        │ and dispute-free fulfillment history.                     │
├───────────────────┼────────┼───────────────────────────────────────────────────────────┤
│ **TOTAL**         │ **100**│ Multi-parametric deterministic index                      │
└───────────────────┴────────┴───────────────────────────────────────────────────────────┘
```

---

## 5. Score Normalization Principles

Disparate industrial units (percentages, kilometers, Indian Rupees, metric tons, and hours) are converted into normalized dimensionless indices between `0.00` and `1.00`:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              NORMALIZATION MAPPING LOGIC                               │
├───────────────────┬───────────────────┬────────────────────────────────────────────────┤
│ Metric            │ Raw Dimension     │ Normalization Behavior                         │
├───────────────────┼───────────────────┼────────────────────────────────────────────────┤
│ Purity Score      │ Percentage (%)    │ • At buyer minimum purity floor: Score = 0.70  │
│                   │                   │ • Progressively scales up to 1.00 as purity    │
│                   │                   │   approaches 99.99%.                           │
├───────────────────┼───────────────────┼────────────────────────────────────────────────┤
│ Distance Score    │ Kilometers (km)   │ • Inverse non-linear curve:                    │
│                   │                   │   - 0 to 50 km: High score (0.95 - 1.00)       │
│                   │                   │   - 50 to 150 km: Moderate score (0.75 - 0.94) │
│                   │                   │   - 150 to 300 km: Steep penalty (0.40 - 0.74) │
│                   │                   │   - > 300 km: Diminishing score (< 0.40)       │
├───────────────────┼───────────────────┼────────────────────────────────────────────────┤
│ Price Score       │ ₹ / Metric Ton    │ • Compares total landed cost against budget:   │
│                   │                   │   - Below buyer budget: Scales from 0.80 - 1.00│
│                   │                   │   - Exactly at budget: Score = 0.70            │
│                   │                   │   - Above budget: Drops sharply toward 0.10    │
├───────────────────┼───────────────────┼────────────────────────────────────────────────┤
│ Quantity Score    │ Metric Tons       │ • Ratio of available volume to requested volume│
│                   │                   │ • Exact match (100% fulfill): Score = 1.00     │
│                   │                   │ • Oversupply (>= 100%): Score = 0.95           │
│                   │                   │ • Partial supply (50%–99%): Scales 0.50 - 0.90 │
├───────────────────┼───────────────────┼────────────────────────────────────────────────┤
│ Delivery Score    │ Days / Hours      │ • Arriving on target delivery date: 1.00       │
│                   │                   │ • Arriving 1-2 days early: 0.90                │
│                   │                   │ • Delivery delay penalty per day late          │
├───────────────────┼───────────────────┼────────────────────────────────────────────────┤
│ Reliability Score │ Rating (1.0 - 5.0)│ • Direct linear mapping: 5.0 = 1.00, 4.0 = 0.80│
│                   │                   │   3.0 = 0.60, Unrated new supplier = 0.70      │
└───────────────────┴───────────────────┴────────────────────────────────────────────────┘
```

---

## 6. Algorithmic Confidence Score (0–100)

The **Confidence Score** measures the statistical completeness and freshness of the data backing the match recommendation, independent of whether the match score itself is high or low:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              CONFIDENCE SCORE CONTRIBUTIONS                            │
├───────────────────────────────────┬──────────────┬─────────────────────────────────────┤
│ Evaluation Factor                 │ Max Points   │ Verification Standard               │
├───────────────────────────────────┼──────────────┼─────────────────────────────────────┤
│ Certified Gas Assay Lab Report    │ 35 Points    │ Third-party lab report < 30 days old│
├───────────────────────────────────┼──────────────┼─────────────────────────────────────┤
│ Verified Geospatial Weighbridge   │ 25 Points    │ Plant coordinates and weighbridge   │
│ Telemetry                         │              │ verified via satellite/OSM mapping  │
├───────────────────────────────────┼──────────────┼─────────────────────────────────────┤
│ Supplier Order Fulfillment Track  │ 20 Points    │ Minimum 5 successfully completed    │
│ Record                            │              │ transactions on CarbonX             │
├───────────────────────────────────┼──────────────┼─────────────────────────────────────┤
│ Real-Time Storage Buffer Sensor   │ 10 Points    │ Live tank pressure/volume telemetry │
│ Connection                        │              │ updated within the last 2 hours     │
├───────────────────────────────────┼──────────────┼─────────────────────────────────────┤
│ Buyer Profile Specificity         │ 10 Points    │ Buyer provides exact tolerance caps │
│                                   │              │ for moisture, sulfur, and nitrogen  │
├───────────────────────────────────┼──────────────┼─────────────────────────────────────┤
│ TOTAL CONFIDENCE SCORE            │ 100 Points   │ High: >= 85 | Moderate: 65 - 84     │
└───────────────────────────────────┴──────────────┴─────────────────────────────────────┘
```

---

## 7. Explainable AI (XAI) Natural Language Templates

The engine populates contextual explanation templates using live parameters:

### Template 1: High-Purity Local Cluster Win (Horticulture / Agriculture)
> *"**{Supplier_Name}** is recommended with a **{Match_Score}/100** score because its certified **{Purity}%** purity exceeds your minimum threshold by **+{Purity_Delta}%** with zero sulfur content, and its **{Distance} km** proximity in the **{Cluster_Name}** corridor reduces cryogenic haulage costs by **₹{Savings_Amount}/ton** compared to regional averages."*

### Template 2: High-Volume Industrial Proximity (Concrete & Building Materials)
> *"Recommended as the top operational match: **{Supplier_Name}** fully fulfills your **{Requested_Tons} ton** requirement in a single dispatch from **{Location_Name}**. Located just **{Distance} km** away, this stream delivers an estimated landed cost of **₹{Landed_Cost}/ton**, achieving **{Cost_Savings_Pct}%** savings versus traditional merchant gas."*

### Template 3: Economical Alternative with Trace Contaminant Tolerance
> *"**{Supplier_Name}** is ranked first due to competitive pricing at **₹{Reserve_Price}/ton**. While its **{Purity}%** purity is lower than premium grades, it comfortably satisfies your **{Industry_Type}** tolerance threshold, resulting in **₹{Total_Budget_Savings}** total savings for this order."*

### Template 4: Reliable Rush Delivery Fulfillment
> *"Recommended for rapid schedule alignment: **{Supplier_Name}** maintains an on-site storage buffer ready for immediate dispatch, meeting your target delivery date of **{Delivery_Date}**. Backed by a **{Reliability_Rating}/5.0** supplier rating across **{Order_Count}** past fulfillments, this match guarantees zero operational disruption."*

### Template 5: High Net-Carbon Abatement (ESG / Carbon Credit Priority)
> *"**{Supplier_Name}** delivers the highest net environmental yield among candidates. Due to an ultra-short **{Distance} km** transport route, logistics emissions account for only **{Logistics_Emissions_Pct}%** of the total volume, ensuring **{Net_Abated_Tons} net tons** of verified CO₂ abatement."*

---

## 8. Supplier Ranking & Tie-Breaking Logic

Surviving candidate suppliers are sorted using a prioritized, multi-tier tie-breaking protocol:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              RANKING & TIE-BREAKING PROTOCOL                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PRIMARY SORT: Composite AI Match Score (Descending Order)                              │
│                                                                                        │
│ TIE-BREAKER 1 (Score Delta <= 0.20 points):                                            │
│ ──► Select supplier with SHORTER HAULAGE DISTANCE (Minimizes road carbon footprint)    │
│                                                                                        │
│ TIE-BREAKER 2 (Distance identical within 5 km):                                        │
│ ──► Select supplier with HIGHER PURITY PERCENTAGE (Minimizes process contamination)    │
│                                                                                        │
│ TIE-BREAKER 3 (Purity identical within 0.1%):                                          │
│ ──► Select supplier with HIGHER SUPPLIER RELIABILITY RATING (Guarantees SLA execution) │
│                                                                                        │
│ TIE-BREAKER 4 (All metrics equivalent):                                                │
│ ──► Select supplier with EARLIER INVENTORY LISTING DATE (First-In, First-Out rule)     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Edge Case Management & Product Behaviors

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              EDGE CASE OPERATIONAL RULES                               │
├───────────────────┬────────────────────────────────────────────────────────────────────┤
│ Scenario          │ Engine Diagnostic & Product Behavior                               │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ **No Suppliers**  │ Trigger diagnostic feedback indicating which constraint caused the │
│ **Survive Hard**  │ failure: (e.g., *"No suppliers found within 200 km with >= 99%   │
│ **Gates**         │ purity. Suggested action: Expand search radius to 350 km."*).      │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ **Buyer Budget**  │ If the lowest landed cost exceeds buyer budget by > 20%, flag with │
│ **Too Low**       │ Amber badge: *"High Price Alert: Available market supply exceeds   │
│                   │ target budget by ₹450/ton due to prevailing cryogenic rates."*    │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ **Split Volume**  │ If no single supplier has the full requested volume, the engine    │
│ **Required**      │ identifies the top primary supplier (fulfilling 60–80%) and flags  │
│                   │ a complementary secondary regional supplier.                       │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ **High Logistics**│ If transport cost exceeds 50% of the total landed cost, trigger    │
│ **Carbon Debt**   │ warning: *"Transport emissions exceed 12% of sequestered carbon.  │
│                   │ Consider waiting for closer cluster listings."*                    │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ **Unrated New**   │ New suppliers with zero platform history are assigned a neutral    │
│ **Suppliers**     │ reliability baseline (3.5 / 5.0) and a flagged confidence score of │
│                   │ 70% until 3 successful shipments are completed.                    │
└───────────────────┴────────────────────────────────────────────────────────────────────┘
```

---

## 10. AI Validation Scenarios (Realistic Industrial Test Cases)

---

### Scenario 1: High-Purity Commercial Greenhouse (Kheda, Gujarat)
* **Buyer Profile:** GreenGrow Gujarat Ltd (Commercial Greenhouse).
* **Buyer Demand:** 60 Metric Tons, **Minimum Purity: 98.0%**, Budget: ₹6,500/ton delivered.
* **Candidate Pool:**
  * *Option A (Ahmedabad Cement):* 96.5% purity, 42 km distance, ₹4,800/ton base price.
  * *Option B (Baroda Bio-Refinery):* 98.8% purity, 78 km distance, ₹5,200/ton base price.
  * *Option C (Surat Chemical):* 99.2% purity, 190 km distance, ₹4,500/ton base price.
* **Engine Evaluation:**
  * Option A is **instantly rejected** by Hard Gate 1 (96.5% purity < 98.0% minimum requirement).
  * Option B: Purity score (0.85), Distance score (0.88), Landed cost (₹5,800/ton $\rightarrow$ within budget). **Composite Score: 89/100**.
  * Option C: High purity, but 190 km distance adds ₹1,800/ton in freight (Landed: ₹6,300/ton) and incurs distance penalty. **Composite Score: 78/100**.
* **Winning Supplier:** **Option B (Baroda Bio-Refinery)**.
* **Generated Rationale:**  
  *"Baroda Bio-Refinery is recommended with an 89/100 score. Its 98.8% certified purity satisfies your 98.0% threshold, while its 78 km distance delivers a landed price of ₹5,800/ton—saving ₹500/ton over long-haul options while eliminating crop contamination risks."*

---

### Scenario 2: Carbon-Cured Precast Concrete Plant (Jharsuguda, Odisha)
* **Buyer Profile:** Utkal Precast Systems (Building Materials).
* **Buyer Demand:** 150 Metric Tons, **Minimum Purity: 85.0%**, Budget: ₹4,200/ton delivered.
* **Candidate Pool:**
  * *Option A (Kalinga Steel Works):* 88.4% purity, 250 tons available, 18 km distance, ₹3,200/ton base price.
  * *Option B (Rourkela Power):* 94.0% purity, 100 tons available, 110 km distance, ₹3,600/ton base price.
  * *Option C (Mahanadi Cement):* 96.5% purity, 120 tons available, 42 km distance, ₹5,000/ton base price.
* **Engine Evaluation:**
  * Option A: Purity exceeds 85% requirement, 18 km distance receives near-perfect score (0.98), volume (250 t) fulfills order completely in single contract, landed cost is ₹3,450/ton. **Composite Score: 95/100**.
  * Option B: Higher purity than needed, only partial volume (100 t vs 150 t needed), 110 km distance. **Composite Score: 76/100**.
  * Option C: Base price exceeds buyer total budget ceiling. **Composite Score: 68/100**.
* **Winning Supplier:** **Option A (Kalinga Steel Works)**.
* **Generated Rationale:**  
  *"Kalinga Steel Works is recommended with a 95/100 score. Its close 18 km proximity in the Jharsuguda cluster minimizes freight costs to ₹250/ton, while its 88.4% purity matches concrete curing tolerances, yielding ₹1,125/ton savings compared to commercial distributor rates."*

---

### Scenario 3: Microalgae Cultivation Bioreactor (Tuticorin, Tamil Nadu)
* **Buyer Profile:** Oceanic Bio-Proteins (Algae Farming).
* **Buyer Demand:** 40 Metric Tons, **Minimum Purity: 95.0%**, Zero Sulfur ($SO_x < 2 \text{ ppm}$), Budget: ₹6,000/ton.
* **Candidate Pool:**
  * *Option A (Tuticorin Thermal Power):* 91.0% purity, 15 km distance, ₹2,800/ton base price.
  * *Option B (Madurai Fermentation Plant):* 97.5% purity (Zero sulfur), 135 km distance, ₹4,600/ton base price.
  * *Option C (Chennai Petrochemical):* 96.0% purity (Sulfur: 18 ppm), 420 km distance, ₹3,900/ton base price.
* **Engine Evaluation:**
  * Option A is **disqualified** (Purity 91.0% < 95.0% required).
  * Option C is **disqualified** (Contaminant gate: Sulfur 18 ppm exceeds critical 2 ppm ceiling).
  * Option B: Only surviving compliant supplier. 97.5% purity, zero sulfur, landed cost of ₹5,650/ton is within budget. **Composite Score: 84/100**.
* **Winning Supplier:** **Option B (Madurai Fermentation Plant)**.
* **Generated Rationale:**  
  *"Madurai Fermentation Plant is recommended with an 84/100 score. It is the only regional supplier satisfying your strict zero-sulfur threshold with 97.5% purity, protecting your biological algae culture from fatal chemical poisoning."*

---

### Scenario 4: Urgent Cement Plant Flaring Relief (Seller-Driven Spot Match)
* **Buyer Profile:** Deccan Green Blocks (Masonry Blocks, Hyderabad).
* **Buyer Demand:** 80 Metric Tons, Minimum Purity: 90.0%, Delivery needed within 24 hours.
* **Candidate Pool:**
  * *Option A (Nalgonda Cement - Tank at 88% capacity):* 94.5% purity, 65 km distance, Ready for immediate loading, ₹3,500/ton spot price.
  * *Option B (Warangal Fertilizer):* 97.0% purity, 140 km distance, Dispatch available in 3 days, ₹4,200/ton.
  * *Option C (Ramagundam Power):* 92.0% purity, 210 km distance, Ready for immediate loading, ₹3,100/ton.
* **Engine Evaluation:**
  * Option B penalized heavily on delivery lead time (cannot meet 24-hour turnaround).
  * Option C ready immediately, but 210 km haulage prevents delivery within 24-hour window.
  * Option A: Immediate loading slot, 65 km distance allows same-day tanker turnaround, excellent landed cost. **Composite Score: 93/100**.
* **Winning Supplier:** **Option A (Nalgonda Cement Works)**.
* **Generated Rationale:**  
  *"Nalgonda Cement Works is recommended with a 93/100 score. Facing on-site buffer saturation, the facility offers immediate loading dispatch, enabling fulfillment within 12 hours over a 65 km transit route at an economical spot price of ₹3,500/ton."*

---

### Scenario 5: Synthetic E-Methanol Pilot (Dahej Chemical Hub, Gujarat)
* **Buyer Profile:** CleanFuel Innovations (E-Methanol Synthesis).
* **Buyer Demand:** 100 Metric Tons, **Minimum Purity: 99.0%** (Catalyst grade), Budget: ₹7,500/ton.
* **Candidate Pool:**
  * *Option A (Dahej Chlor-Alkali Unit):* 99.5% purity, 12 km distance, 60 tons available, ₹5,800/ton base price.
  * *Option B (Hazira Gas Reforming):* 99.2% purity, 85 km distance, 120 tons available, ₹5,500/ton base price.
  * *Option C (Bharuch Petrochemical):* 96.0% purity, 28 km distance, 200 tons available, ₹3,800/ton base price.
* **Engine Evaluation:**
  * Option C is **disqualified** by Purity Floor Gate (96.0% < 99.0% required).
  * Option A offers premium purity and close distance (12 km), but only fulfills 60% of requested volume. Score: 82/100.
  * Option B fulfills 100% of volume (120 tons available), 99.2% purity satisfies catalyst requirements, 85 km transit is well within economic radius. Score: **91/100**.
* **Winning Supplier:** **Option B (Hazira Gas Reforming)**.
* **Generated Rationale:**  
  *"Hazira Gas Reforming is recommended with a 91/100 score. It fulfills your full 100-ton requirement in a single lot with certified 99.2% catalyst-grade purity, avoiding the double-freight overhead of split-shipment sourcing."*

---

## 11. Conclusion

The CarbonX AI Match Engine achieves explainable, mathematically sound matchmaking tailored for industrial carbon utilization. By strictly enforcing chemical pass/fail gates before applying weighted optimization curves, the platform guarantees that every recommendation is operationally viable, economically attractive, and environmentally net-negative.
