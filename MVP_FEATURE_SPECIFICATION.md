# CarbonX — MVP Feature Specification (PRD)
**Project Name:** CarbonX  
**Tagline:** Transform captured carbon into a valuable industrial resource.  
**Event:** HackOut'26 (36-Hour Hackathon)  
**Document Version:** 3.0 (Phase 3 — Product Requirements Document & MVP Specification)  
**Author:** Senior Product Management & B2B SaaS Solution Architecture  

---

## 1. Executive Summary

This Product Requirements Document (PRD) defines the scope, functional specifications, screen behaviors, and execution parameters for the **CarbonX 36-hour Minimum Viable Product (MVP)**. 

The primary objective of this MVP is to deliver a functional proof-of-value demonstrating how AI-driven matchmaking between point-source industrial CO₂ emitters (Sellers) and commercial utilization facilities (Buyers) eliminates transaction friction, reduces procurement costs, and optimizes transport logistics.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             MVP SCOPE DEFINITION                                 │
├────────────────────────────────────────┬─────────────────────────────────────────┤
│ INCLUDED IN 36-HR MVP                  │ INTENTIONALLY EXCLUDED FROM MVP         │
├────────────────────────────────────────┼─────────────────────────────────────────┤
│ • Role-based Seller/Buyer switching    │ • Live IoT GPS road tanker tracking     │
│ • Point-source CO₂ batch listing flow  │ • Multi-signature escrow / banking rails│
│ • Chemical purity & state profiling    │ • Distributed ledger / Blockchain nodes │
│ • Buyer marketplace & chemical filters │ • Secondary carbon credit trading market│
│ • Multi-parametric AI Match Score      │ • Government / CCTS regulatory portals  │
│ • Distance & logistics cost estimator  │ • Complex enterprise ERP integrations   │
│ • Binding bid placement & acceptance   │ • Automated laboratory gas spectrometry │
│ • Digital Order Confirmation & Summary │ • In-app dispute mediation workflow     │
└────────────────────────────────────────┴─────────────────────────────────────────┘
```

By constraining the scope to the core commercial interaction loop—**Publish Listing $\rightarrow$ Discover & Filter $\rightarrow$ AI Match Recommendation $\rightarrow$ Logistics Cost Estimation $\rightarrow$ Bid $\rightarrow$ Order Confirmation**—the product delivers a compelling, end-to-end demonstration tailored for the HackOut jury within 36 hours.

---

## 2. Product Modules

The CarbonX MVP is partitioned into three decoupled functional modules:

```
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│     MODULE A: SELLER      │      │     MODULE B: BUYER       │      │    MODULE C: AI ENGINE    │
├───────────────────────────┤      ├───────────────────────────┤      ├───────────────────────────┤
│ • Plant inventory view    │      │ • CO₂ catalog & search    │      │ • Multi-factor weighting  │
│ • Stream listing wizard   │      │ • Chemical tolerance filter│     │ • Purity compatibility    │
│ • Bid review & acceptance │      │ • Total landed cost calc  │      │ • Haulage distance penalty│
│ • Active orders monitor   │      │ • Commercial bid dispatch │      │ • Score explanation engine│
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```

### Module A — Seller
* **Core Responsibilities:** Provides industrial plant operators (cement, steel, power plants) with tools to monitor captured inventory, publish batches with verified chemical purity specifications, review incoming bids, and accept purchase orders.

### Module B — Buyer
* **Core Responsibilities:** Empowers procurement managers at utilization facilities (concrete curing, commercial greenhouses, algae farms, e-fuel startups) to search available regional CO₂ streams, apply chemical threshold filters, view landed logistics cost breakdowns, and submit binding bids.

### Module C — AI Match Engine
* **Core Responsibilities:** Acts as the algorithmic arbiter between supply parameters and demand requirements. Ingests distance, chemical purity, batch volume, pricing, delivery lead-time, and supplier reliability to compute a normalized **AI Match Score (0–100)** accompanied by an explainable rationale.

---

## 3. Feature Prioritization Matrix

The following prioritization table enforces the 36-hour hackathon constraint:

| Feature Name | Priority | Strategic Rationale |
| :--- | :---: | :--- |
| **User Role Selection (Seller / Buyer)** | **Must Have** | Core access mechanic enabling jury evaluation of both personas without complex auth setup. |
| **Seller Inventory Dashboard** | **Must Have** | Visualizes current plant storage volume and operational buffer capacity. |
| **CO₂ Batch Listing Wizard** | **Must Have** | Allows sellers to publish volume, purity, physical state, and reserve price per ton. |
| **Buyer Marketplace Catalog** | **Must Have** | Central discovery directory displaying all active point-source listings. |
| **Chemical Purity & State Filter** | **Must Have** | Mandatory utility allowing buyers to isolate viable streams (e.g., $\ge 95\%$ purity). |
| **AI Match Score Generator** | **Must Have** | Core platform differentiator scoring supplier-buyer compatibility from 0 to 100. |
| **Explainable AI Match Breakdown** | **Must Have** | Shows judges the exact weighting factors (Purity, Distance, Price, Cadence, Reliability). |
| **Logistics Distance & Cost Calculator** | **Must Have** | Estimates transit km, cryo-freight costs, and logistics carbon debt. |
| **Bid Submission & Review Flow** | **Must Have** | Enables buyers to submit price bids and sellers to accept or counter. |
| **Order Confirmation & Digital Summary**| **Must Have** | Closes the transaction loop with verified transaction details and specs. |
| **Gas Assay Spec-Sheet Preview** | **Should Have** | Modal displaying detailed contaminant breakdowns ($SO_x, NO_x, H_2O$). |
| **One-Click Demo Data Population** | **Should Have** | Seeds realistic industrial plant data instantly during jury demos. |
| **Basic Direct Messaging / Inquiries** | **Should Have** | Simple textual clarification channel between buyer and seller prior to bid. |
| **Carbon Savings Counter (Metric Tons)** | **Should Have** | Aggregate banner metric displaying total CO₂ diverted from venting. |
| **Live GPS Road Tanker Tracking** | **Won't Build** | Unrealistic within 36 hours; simulated transit status is sufficient for MVP. |
| **Escrow & Fiat Banking Integration** | **Won't Build** | Payment gateways add severe compliance overhead; simulated escrow locks suffice. |
| **Blockchain / Web3 Ledger** | **Won't Build** | Adds latency and unnecessary architectural friction to a B2B trade MVP. |
| **Carbon Credit (CCTS) Minting** | **Won't Build** | Secondary market regulatory mechanisms distract from the physical trade loop. |
| **IoT Sensor / SCADA API Ingestion** | **Won't Build** | Requires hardware integration; mock telemetry inputs provide identical demo value. |

---

## 4. Functional Requirements

### 4.1 Seller Module

#### Feature S1: Seller Dashboard
* **Purpose:** Provide plant managers with immediate visibility into on-site CO₂ buffer storage levels, active listings, and incoming bids.
* **Inputs:** Selected industrial plant profile (e.g., "Mahanadi Cement Works — Kiln 4").
* **Outputs:** 
  - Current storage utilization percentage (e.g., 72% - Warning threshold).
  - 24-hour capture volume rate (e.g., 220 tons/day).
  - List of active listings with status badges (Active, Pending Bid, Dispatched).
  - Actionable alert: "Storage buffer approaching 80%. Publish listing to avoid venting."
* **Business Rule:** If storage capacity exceeds 75%, trigger a high-priority visual prompt to create an immediate spot listing.

#### Feature S2: Create Listing Wizard
* **Purpose:** Enable sellers to publish captured CO₂ batches to the marketplace in under 60 seconds.
* **Inputs:** 
  - Batch Quantity (metric tons, min: 10, max: 10,000).
  - Physical State (Liquid at -20°C / Pressurized Gas at 20 bar).
  - CO₂ Purity Percentage (numeric, range: 70.0% to 99.9%).
  - Maximum Contaminant Limits ($SO_x \text{ ppm}, NO_x \text{ ppm}, H_2O \text{ ppm}$).
  - Availability Window (Start Date to Expiration Date).
  - Minimum Reserve Price ($/metric ton, USD or INR equivalent).
  - Plant Dispatch Location (City, State, Postal Code).
* **Outputs:** Validated, published marketplace listing with unique Batch ID and timestamp.
* **Business Rule:** Purity cannot exceed 99.99%. If purity is $< 80\%$, flag as "Industrial Construction Grade Only."

#### Feature S3: Inventory Management
* **Purpose:** Track status of all captured batches across the lifecycle.
* **Inputs:** Batch selection, status filter (Available, Reserved, Dispatched).
* **Outputs:** Data table showing Batch ID, Volume, Purity, Reserve Price, and Current Status.
* **Business Rule:** A batch cannot be edited once an active bid is accepted by the seller.

#### Feature S4: Bid Requests
* **Purpose:** Review and act upon commercial bids submitted by prospective buyers.
* **Inputs:** Incoming bid notification list containing Bidder Name, Volume Requested, Offered Price per Ton, Delivery Date, and AI Match Score.
* **Outputs:** Action buttons: "Accept Bid", "Reject Bid".
* **Business Rule:** Accepting a bid immediately transitions the associated batch volume into "Reserved" status and locks out competing bids.

#### Feature S5: Active Orders
* **Purpose:** Monitor confirmed orders through fulfillment and dispatch.
* **Inputs:** Order ID selection.
* **Outputs:** Order status card displaying Buyer Details, Agreed Price, Delivery Window, Digital Spec Sheet, and simulated dispatch status ("Awaiting Tanker", "Loaded", "Delivered").
* **Business Rule:** Order status can only be advanced linearly (Awaiting Tanker $\rightarrow$ Loaded $\rightarrow$ Delivered).

---

### 4.2 Buyer Module

#### Feature B1: Marketplace Catalog
* **Purpose:** Provide a unified searchable directory of all available point-source captured CO₂ batches.
* **Inputs:** Keyword search, sort option (Highest AI Score, Lowest Price, Closest Distance, Highest Purity).
* **Outputs:** Card-based or tabular catalog displaying Seller Name, Industry Type, Available Tons, Purity %, Base Price/Ton, Distance (km), and dynamic AI Match Score badge.
* **Business Rule:** Only listings in "Active / Available" status are displayed to buyers.

#### Feature B2: Search & Multi-Parameter Filters
* **Purpose:** Allow buyers to narrow listings to those compatible with their operational equipment.
* **Inputs:** 
  - Minimum Purity slider (70% – 99.9%).
  - Maximum Distance slider (10 km – 500 km).
  - Physical State checkbox (Liquid, Gas).
  - Industry Origin filter (Cement, Steel, Power, Chemical).
  - Price Range slider ($/ton).
* **Outputs:** Filtered list of compatible CO₂ listings updating in real time.
* **Business Rule:** If a buyer’s process requires food-grade ($\ge 99.0\%$), all listings below 99.0% must be completely filtered out.

#### Feature B3: Supplier & Batch Details
* **Purpose:** Offer comprehensive technical and geographic intelligence on a specific listing before bidding.
* **Inputs:** Selection of a listing card from the marketplace.
* **Outputs:** Detailed modal or view containing:
  - Source Emitter Overview & Plant Location.
  - Certified Gas Composition Table (CO₂ %, $SO_x, NO_x, H_2O$, Particulates).
  - Historical Supplier Reliability Rating (e.g., 4.8 / 5.0).
  - Logistics access parameters (Coupling type, max tanker axle weight).
* **Business Rule:** The system must visibly highlight any contaminant that exceeds standard industrial safety baselines.

#### Feature B4: Place Commercial Bid
* **Purpose:** Submit a binding purchase offer for a full or partial batch.
* **Inputs:** 
  - Requested Volume (metric tons, $\le$ available batch quantity).
  - Bid Price per Ton ($/ton).
  - Requested Delivery / Pickup Date.
  - Delivery Destination Address.
* **Outputs:** Bid summary screen showing Total Commodity Cost, Estimated Freight Cost, Estimated Total Landed Cost, and "Confirm Bid" button.
* **Business Rule:** Bid price cannot be lower than 70% of the seller’s listed reserve price (prevents frivolous low-ball spam).

---

### 4.3 AI Match Engine Module

#### Feature AI1: AI Match Score Generator
* **Purpose:** Compute a holistic, multi-parametric compatibility index (0 to 100) between any active seller batch and a buyer profile.
* **Inputs:**
  1. **Purity Differential:** Seller Purity % vs. Buyer Minimum Required Purity %.
  2. **Haulage Distance:** Driving distance (km) between Seller Plant and Buyer Site.
  3. **Price Compatibility:** Seller Reserve Price vs. Buyer Target Procurement Budget.
  4. **Quantity Fit:** Available batch volume vs. Buyer requested volume.
  5. **Delivery Window Alignment:** Availability dates vs. Buyer scheduled production run.
  6. **Supplier Reliability:** Historical dispatch reliability and on-spec delivery track record.
* **Outputs:**
  - **Match Score:** Single integer value between 0 and 100.
  - **Match Tier:** High Match (85–100, Green), Moderate Match (70–84, Amber), Low Match (<70, Red).
  - **AI Recommendation Rationale:** 2–3 sentence plain-language synthesis explaining why this match was ranked favorably (e.g., *"Proximity of 42 km saves $38/ton in cryogenic haulage. Purity of 97.4% exceeds your 92% requirement without requiring costly on-site secondary scrubbers."*).
* **Business Rules:**
  - **Hard Disqualification Rule:** If Seller Purity is strictly less than Buyer Minimum Purity threshold, the Match Score is automatically capped at zero (0), rendering the pair incompatible.
  - **Distance Penalty Rule:** For every 50 km beyond a 150 km radius, the distance component of the score degrades non-linearly to reflect escalating cryogenic boil-off and diesel carbon debt.

---

## 5. Screen Specifications (10 MVP Screens)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         CARBONX MVP SCREEN TAXONOMY                        │
├────────────────────────────────────────────────────────────────────────────┤
│ 01. Landing Page        ──► 02. Login / Role Select                        │
│                                  │                                         │
│         ┌────────────────────────┴────────────────────────┐                │
│         ▼                                                 ▼                │
│ 03. Seller Dashboard                            05. Buyer Marketplace      │
│         │                                                 │                │
│ 04. Create Listing Wizard                       06. Supplier Details       │
│         │                                                 │                │
│ 09. Bid Management ◄──────────────┐             07. AI Recommendation      │
│         │                         │                       │                │
│ 10. Order Confirmation            └───────────── 08. Logistics & Cost      │
└────────────────────────────────────────────────────────────────────────────┘
```

### Screen 1: Landing Page
* **User:** Public / Jury / Emitter / Buyer.
* **Purpose:** Communicate CarbonX value proposition, market context, and platform metrics with direct access to demo workspaces.
* **Main Components:** Hero header, live platform statistics (Tons Diverted, Active Emitters, Avg Distance Reduced), Dual CTA buttons ("Enter as Industrial Seller", "Enter as Circular Buyer"), CCUS workflow explainer.
* **Primary Action:** Click "Enter as Seller" or "Enter as Buyer".
* **Navigation Destination:** Screen 2 (Login / Role Selection).

### Screen 2: Login / Role Selection
* **User:** All personas.
* **Purpose:** Enable instantaneous, friction-free role authentication for hackathon evaluation without complex password forms.
* **Main Components:** Persona selector toggle cards ("Rajesh Verma — Cement Plant Emitter", "Dr. Ananya Sengupta — Concrete Off-Taker"), quick demo-login button.
* **Primary Action:** Click "Launch Workspace as [Selected Role]".
* **Navigation Destination:** Screen 3 (if Seller selected) or Screen 5 (if Buyer selected).

### Screen 3: Seller Dashboard
* **User:** Industrial Seller.
* **Purpose:** High-level operational command center tracking captured CO₂ buffer levels, dispatch schedules, and pending bids.
* **Main Components:** Storage Buffer Capacity Gauge (visual progress bar with warning thresholds), 24-Hour Capture Rate KPI card, Active Batches table, Pending Bids alert badge, "Create New Listing" primary button.
* **Primary Action:** Click "Create New Listing".
* **Navigation Destination:** Screen 4 (Create Listing Wizard).

### Screen 4: Create Listing Wizard
* **User:** Industrial Seller.
* **Purpose:** Form to enter and publish a captured CO₂ batch to the exchange.
* **Main Components:** Volume input (metric tons), Physical State toggle (Liquid vs. Gas), Purity percentage slider, Contaminant ceiling inputs ($SO_x, NO_x, \text{Moisture}$), Reserve price per ton input, Date availability picker, "Publish Batch" button.
* **Primary Action:** Click "Publish to Marketplace".
* **Navigation Destination:** Screen 3 (with success confirmation toast and updated inventory table).

### Screen 5: Buyer Marketplace
* **User:** Circular Buyer.
* **Purpose:** Explore, filter, and discover available point-source CO₂ streams within economic reach.
* **Main Components:** Search bar, Filter sidebar (Purity slider, Distance slider, Industry type, Price range), Sort dropdown, Batch Card Grid (displaying emitter type, volume, purity, distance, base price, and AI Match Score badge).
* **Primary Action:** Click "View Match & Details" on a listing card.
* **Navigation Destination:** Screen 6 (Supplier Details) or Screen 7 (AI Recommendation).

### Screen 6: Supplier Details
* **User:** Circular Buyer.
* **Purpose:** Deep-dive into an emitter’s technical specs, certified chemical analysis, and plant location.
* **Main Components:** Plant profile summary, Full Gas Assay Table (CO₂ %, trace contaminants), Location map preview, Supplier reliability rating badge, "Analyze with AI Match Engine" button.
* **Primary Action:** Click "Run AI Match Analysis".
* **Navigation Destination:** Screen 7 (AI Recommendation).

### Screen 7: AI Recommendation & Match Analysis
* **User:** Circular Buyer.
* **Purpose:** Transparently explain why a specific emitter is the optimal supply partner.
* **Main Components:** Prominent AI Match Score badge (e.g., 94/100), Radar or progress-bar breakdown of score dimensions (Purity Fit: 98%, Distance Score: 92%, Price Score: 88%), Plain-language AI Recommendation narrative, "Calculate Landed Logistics" button.
* **Primary Action:** Click "Proceed to Logistics & Cost Breakdown".
* **Navigation Destination:** Screen 8 (Logistics & Cost).

### Screen 8: Logistics & Cost Calculator
* **User:** Circular Buyer.
* **Purpose:** Eliminate hidden freight surprises by calculating total landed cost and carbon footprint before bidding.
* **Main Components:** Origin-to-destination route summary, Distance (km) readout, Transport type selector (Cryogenic Road Tanker), Cost breakdown table (Base Gas Cost + Cryo Freight + Handling Fee = Total Landed Cost per Ton), Net Carbon Footprint indicator (Diverted CO₂ minus Diesel Haulage Emissions), "Place Commercial Bid" button.
* **Primary Action:** Click "Proceed to Place Bid".
* **Navigation Destination:** Screen 9 (Bid Management / Placement).

### Screen 9: Bid Management & Submission
* **User:** Buyer (to place bid) and Seller (to review and accept).
* **Purpose:** Structured bidding interface where buyer specifies purchase terms and seller reviews counter-offers.
* **Main Components:** 
  - *Buyer View:* Order volume input, Unit bid price input ($/ton), Delivery date selector, Binding offer confirmation checkbox, "Submit Bid" button.
  - *Seller View:* Incoming bids table, Counter-party rating, "Accept Bid" and "Decline" buttons.
* **Primary Action:** Buyer clicks "Submit Binding Bid"; Seller clicks "Accept Bid".
* **Navigation Destination:** Screen 10 (Order Confirmation).

### Screen 10: Order Confirmation & Digital Summary
* **User:** Both Seller and Buyer.
* **Purpose:** Finalize transaction, display locked commercial terms, and provide digital dispatch pass and specifications.
* **Main Components:** Success badge ("Order Confirmed & Locked"), Order Reference ID, Transaction summary (Total Tons, Agreed Price/Ton, Total Value), Guaranteed Chemical Spec Sheet, Scheduled Pickup Window, Downloadable Digital Bill of Lading / Summary button.
* **Primary Action:** Click "Return to Dashboard" or "Download Summary".
* **Navigation Destination:** Screen 3 (Seller) or Screen 5 (Buyer).

---

## 6. End-to-End User Flow

The following text flow diagram illustrates the end-to-end commercial transaction lifecycle:

```
[ START: SELLER ]
       │
       ▼
 1. Logs in as Seller (Rajesh Verma, Cement Plant)
       │
       ▼
 2. Views Seller Dashboard (Sees buffer tanks at 74% capacity)
       │
       ▼
 3. Clicks "Create New Listing"
       │
       ▼
 4. Fills Batch Specs (120 tons, 96.5% Purity, $65/ton, Liquid) ──► Clicks "Publish"
       │
       ▼
 [ LISTING BROADCAST TO CARBONX MARKETPLACE ]
       │
       ▼
[ TRANSITION: BUYER ]
       │
       ▼
 5. Logs in as Buyer (Dr. Ananya Sengupta, Concrete Curing)
       │
       ▼
 6. Enters Marketplace (Sets filter: Min Purity 90%, Max Distance 150 km)
       │
       ▼
 7. Marketplace displays filtered results (Cement Plant listing tops the feed)
       │
       ▼
 8. Clicks "View Details & Run AI Match"
       │
       ▼
 9. Reviews AI Recommendation (Match Score: 94/100; Rationale explains 42 km proximity)
       │
       ▼
10. Reviews Logistics & Cost Calculator (Landed cost: $88/ton, net-positive carbon score)
       │
       ▼
11. Submits Bid (Offers $65/ton for 80 tons, specifies Wednesday pickup)
       │
       ▼
[ NOTIFICATION DISPATCHED TO SELLER ]
       │
       ▼
[ TRANSITION: SELLER ]
       │
       ▼
12. Seller opens Bid Management (Inspects 94-score bid from verified concrete manufacturer)
       │
       ▼
13. Clicks "Accept Bid"
       │
       ▼
[ BOTH PARTIES RECEIVE SCREEN 10: ORDER CONFIRMATION ]
       │
       ▼
14. System generates Order ID, locks batch volume, issues digital dispatch spec sheet
       │
       ▼
[ END: COMPLETED COMMERCIAL TRADE ]
```

---

## 7. Acceptance Criteria

| Major Feature | Completion & Acceptance Criteria |
| :--- | :--- |
| **F1: Role Selection & Auth** | • User can switch between Seller and Buyer personas with a single click.<br>• Appropriate role-specific dashboard is loaded instantly without page reloads.<br>• Session persists active role throughout the workflow. |
| **F2: Seller Inventory Dashboard** | • Accurately calculates remaining tank buffer percentage based on capacity inputs.<br>• Displays alert banner when storage utilization is $\ge 70\%$.<br>• Correctly updates batch status indicators in real time. |
| **F3: Create Listing** | • Validates that Quantity is $> 0$ and $\le 10,000$ tons.<br>• Validates that Purity is between $70.0\%$ and $99.9\%$.<br>• Rejects submission if mandatory fields (Quantity, Purity, Price, Location) are blank.<br>• Immediately adds the new batch to the Buyer Marketplace catalog upon clicking "Publish". |
| **F4: Marketplace & Filtering** | • Search query filters listings by plant name, city, or emitter industry.<br>• Purity slider dynamically removes listings below the specified threshold.<br>• Distance slider filters out listings located beyond selected radius.<br>• Displays clear "No compatible listings found" state when filter criteria are excessively restrictive. |
| **F5: AI Match Score Generation** | • Computes a deterministic score between 0 and 100 for any given listing-buyer pairing.<br>• Returns a score of 0 if Seller Purity is strictly below Buyer Required Purity.<br>• Penalizes score progressively as haulage distance exceeds 150 km.<br>• Generates an accurate, contextual textual explanation reflecting the actual input parameters. |
| **F6: Logistics & Cost Engine** | • Computes road distance between origin and destination coordinates.<br>• Multiplies distance by standard cryogenic freight coefficient to calculate haulage cost.<br>• Computes Total Landed Cost per Ton = Base Price + Freight Cost + Handling.<br>• Calculates Net Carbon Avoided = Total Volume - Estimated Transport Emissions. |
| **F7: Bid Placement & Acceptance** | • Prevents buyer from submitting a bid exceeding available batch quantity.<br>• Rejects bid prices lower than 70% of seller reserve price.<br>• Seller dashboard immediately receives submitted bid in the pending bids queue.<br>• Clicking "Accept Bid" transitions batch state to "Reserved" and triggers order confirmation. |
| **F8: Order Confirmation** | • Generates a unique, non-duplicative alphanumeric Order ID (e.g., `#CX-8842`).<br>• Displays locked commercial terms: Volume, Price/Ton, Total Value, Scheduled Date.<br>• Renders verified gas specification breakdown with zero data omissions. |

---

## 8. HackOut'26 Jury Demo Script (5-Minute Walkthrough)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         5-MINUTE JURY DEMO TIMELINE                              │
├───────────────┬──────────────────────────────────────────────────────────────────┤
│ 00:00 - 01:00 │ The Industrial Dilemma & Seller Dashboard                        │
│ 01:00 - 02:00 │ Rapid Batch Creation & The Purity Challenge                      │
│ 02:00 - 03:00 │ Buyer Marketplace & The Multi-Parameter Filter                   │
│ 03:00 - 04:00 │ The Core Innovation: AI Match Score & Logistics Cost Engine      │
│ 04:00 - 05:00 │ Commercial Bid, Instant Acceptance & The Net-Carbon Impact       │
└───────────────┴──────────────────────────────────────────────────────────────────┘
```

### Minute 0:00 – 01:00 | The Industrial Dilemma & Seller Dashboard
* **Presenter Dialogue:**  
  *"Judges, heavy industry in India captures thousands of tons of CO₂ daily. But right now, plants face a crisis: their on-site storage tanks fill up within 48 hours, and without buyers, they are forced to vent that captured gas. Let me show you how CarbonX solves this. We log in as Rajesh Verma, VP of Operations at Mahanadi Cement Works."*
* **Actions on Screen:**
  1. Presenter clicks **"Enter as Industrial Seller"** on Landing Page (Screen 1 $\rightarrow$ Screen 2 $\rightarrow$ Screen 3).
  2. Points to the **Storage Buffer Capacity Gauge** at 74% (warning level).
  3. Points to the urgent system alert: *"Buffer capacity approaching 80%. Risk of flaring in 14 hours."*

### Minute 01:00 – 02:00 | Rapid Batch Creation & The Purity Challenge
* **Presenter Dialogue:**  
  *"Rajesh cannot wait months for an offline broker. He needs to monetize this gas today. He clicks 'Create New Listing'. CarbonX captures the critical technical parameters: 120 metric tons, liquefied state, 96.5% purity, and a reserve price of $65 per ton."*
* **Actions on Screen:**
  1. Presenter clicks **"Create New Listing"** (Screen 3 $\rightarrow$ Screen 4).
  2. Clicks **"Populate Industrial Batch"** button to auto-fill realistic parameters.
  3. Clicks **"Publish to Marketplace"**.
  4. Success toast appears; presenter shows the new batch appearing in the inventory table.

### Minute 02:00 – 03:00 | Buyer Marketplace & Multi-Parameter Filters
* **Presenter Dialogue:**  
  *"Now, let us switch to the other side of the economy. We enter as Dr. Ananya Sengupta, Head of Procurement at a next-generation carbon-cured concrete facility. Commercial gas distributors charge her $220 a ton. She opens CarbonX to discover local point-source suppliers."*
* **Actions on Screen:**
  1. Presenter clicks the role switcher: **"Switch to Buyer"** (Screen 4 $\rightarrow$ Screen 5).
  2. Demonstrates the **Filter Engine**: moves the Purity slider to 90%, sets Max Distance to 100 km.
  3. Shows the catalog dynamically filtering down to 3 compatible regional emitters, with Mahanadi Cement Works ranked at the top.

### Minute 03:00 – 04:00 | The Core Innovation: AI Match Score & Logistics Engine
* **Presenter Dialogue:**  
  *"Here is our core innovation. Why is this cement plant ranked number one? We click 'View AI Recommendation'. CarbonX generated an AI Match Score of 94 out of 100. It is not just looking at price—it factors in chemical compatibility, 42 km road proximity, and haulage emissions. Clicking into Logistics, our engine proves that trucking this gas emits just 0.04 tons of CO₂ for every ton sequestered, saving Ananya 58% compared to monopoly gas suppliers."*
* **Actions on Screen:**
  1. Presenter clicks **"View Match & Details"** on the Cement Plant card (Screen 5 $\rightarrow$ Screen 6 $\rightarrow$ Screen 7).
  2. Highlights the **AI Match Score badge (94/100)** and reads the explainability narrative.
  3. Clicks **"Calculate Landed Logistics"** (Screen 7 $\rightarrow$ Screen 8).
  4. Shows the transparent cost breakdown: Base Gas ($65) + Freight ($18) + Handling ($5) = **$88/ton Landed Cost** (vs. $220 market standard).

### Minute 04:00 – 05:00 | Commercial Bid, Instant Acceptance & Net-Carbon Impact
* **Presenter Dialogue:**  
  *"Ananya is ready to buy. She submits a binding bid for 80 tons at $65/ton for Wednesday delivery. The seller receives the bid instantly on their dashboard. Rajesh reviews the counter-party's 94 Match Score and clicks 'Accept'. In less than 3 minutes, 80 tons of CO₂ that would have been flared into the atmosphere is locked into permanent concrete infrastructure. That is CarbonX."*
* **Actions on Screen:**
  1. Presenter clicks **"Place Commercial Bid"** (Screen 8 $\rightarrow$ Screen 9).
  2. Submits 80 tons at $65/ton $\rightarrow$ clicks **"Submit Binding Bid"**.
  3. Toggles back to **Seller View** $\rightarrow$ shows incoming bid notification $\rightarrow$ clicks **"Accept Bid"**.
  4. Screen 10 (**Order Confirmation**) renders with unique Order ID, locked spec sheet, and Net Avoided Carbon certificate summary.
  5. Presenter delivers final concluding sentence to the jury.

---

## 9. Conclusion

This Product Requirements Document establishes the technical and functional blueprint for the CarbonX 36-hour hackathon MVP. By adhering to the 10 specified screens, strict prioritization matrix, and modular architecture, the engineering and design team can execute a cohesive, demo-ready platform that directly proves the commercial and environmental viability of AI-driven carbon matchmaking.
