# CarbonX — System Architecture Document
**Project Name:** CarbonX  
**Tagline:** Transform Captured Carbon into Industrial Value  
**Event:** HackOut'26 (36-Hour Hackathon)  
**Document Version:** 5.0 (Phase 5 — System Architecture & Cloud Engineering Specification)  
**Author:** Senior Solution Architect, Backend Systems Architect & Cloud Specialist  

---

## 1. Executive Summary

The CarbonX platform is an enterprise-grade, event-driven B2B exchange engineered to handle multi-parametric matchmaking between continuous industrial carbon emitters and commercial off-takers. The architecture must satisfy three core engineering tenets:

1. **High Concurrency & Low Latency:** Rapid evaluation of dynamic flue gas telemetry against buyer tolerance matrices requires an asynchronous, non-blocking I/O runtime.
2. **Deterministic & Explainable Computation:** The AI Match Score engine must operate with mathematical determinism, returning structured scoring components in sub-100 millisecond response windows.
3. **Decoupled Modular Architecture:** Clear physical and logical separation among user interfaces, orchestration APIs, analytical engines, geospatial routing services, and persistence layers.

The technical stack is deliberately locked to modern, industry-standard technologies: **React + TypeScript + Tailwind CSS** on the frontend, **FastAPI (Python)** on the application layer, **PostgreSQL** as the relational source of truth, **Leaflet + OpenStreetMap** for geospatial visualization, and **Recharts** for industrial telemetry visualization.

---

## 2. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                             CLIENT TIER                                                │
│                                                                                                        │
│   ┌────────────────────────────────────────┐          ┌────────────────────────────────────────────┐   │
│   │           SELLER WORKSPACE UI          │          │             BUYER WORKSPACE UI             │   │
│   │   • Plant Telemetry & Buffer Gauge     │          │   • Point-Source CO₂ Marketplace Catalog   │   │
│   │   • Batch Listing Wizard               │          │   • Multi-Parameter Chemical Filters       │   │
│   │   • Incoming Bids Queue & Acceptance   │          │   • Landed Cost & Net-Carbon Calculator    │   │
│   └───────────────────┬────────────────────┘          └─────────────────────┬──────────────────────┘   │
│                       │                                                     │                          │
│                       └──────────────────────────┬──────────────────────────┘                          │
│                                                  │                                                     │
│                                                  ▼                                                     │
│                                    REACT + TYPESCRIPT APPLICATION                                      │
│                           (State Management, Leaflet Maps, Recharts Analytics)                         │
└──────────────────────────────────────────────────┬─────────────────────────────────────────────────────┘
                                                   │
                                                   │ HTTPS / REST (JSON) + JWT Bearer
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        APPLICATION GATEWAY TIER                                        │
│                                                                                                        │
│                                     FASTAPI ASYNCHRONOUS BACKEND                                       │
│                                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ MIDDLEWARE PIPELINE                                                                            │   │
│   │ • CORS Middleware      • Security & Rate Limiter     • Role-Based Access Control (RBAC)        │   │
│   └────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                  │                                                     │
│   ┌───────────────────────┬──────────────────────┴────────────────┬────────────────────────────────┐   │
│   │ ROUTER MODULES        │                                       │                                │   │
│   │ • /auth (JWT)         │ • /listings (Batches)                 │ • /bids (Offers & Escrow)      │   │
│   │ • /analytics (Emissions) • /orders (Fulfillment)              │ • /logistics (Routing & Cost)  │   │
│   └───────────────────────┴──────────────────────┬────────────────┴────────────────────────────────┘   │
└──────────────────────────────────────────────────┼─────────────────────────────────────────────────────┘
                                                   │
                 ┌─────────────────────────────────┼─────────────────────────────────┐
                 │                                 │                                 │
                 ▼                                 ▼                                 ▼
┌─────────────────────────────────┐ ┌─────────────────────────────┐ ┌─────────────────────────────────┐
│        DATA PERSISTENCE         │ │      AI MATCH ENGINE        │ │        LOGISTICS SERVICE        │
│                                 │ │                             │ │                                 │
│        POSTGRESQL 15+           │ │ • Multi-Factor Scoring      │ │ • OpenStreetMap Geocoding       │
│ • ACID Transaction Ledger       │ │ • Purity Compatibility Rule │ │ • Haversine / Road Network Calc │
│ • Relational Schemas            │ │ • Distance Penalty Function │ │ • Cryo-Freight Cost Matrix      │
│ • Parameterized Query Indexing  │ │ • Natural Language Generator│ │ • Diesel Carbon Debt Calculator │
└─────────────────────────────────┘ └─────────────────────────────┘ └─────────────────────────────────┘
```

### Component Breakdown
1. **Client Tier (React + TypeScript):** A single-page application (SPA) providing role-tailored experiences for Sellers and Buyers. It uses Leaflet for interactive plant mapping and Recharts for live storage level visualization.
2. **Application Tier (FastAPI):** High-throughput Python ASGI backend providing typed API contracts via Pydantic, role authorization, and business logic routing.
3. **Data Persistence Tier (PostgreSQL):** Relational engine guaranteeing ACID consistency for inventory locking, bidding lifecycles, and audit records.
4. **AI Match Engine Service:** Algorithmic computation layer calculating real-time compatibility scores (0–100) and plain-language match rationale.
5. **Logistics Service Module:** Geospatial intelligence module calculating road distance, cryogenic transport overhead, transit duration, and net logistics carbon debt.

---

## 3. Component Responsibilities

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              RESPONSIBILITY ALLOCATION MATRIX                          │
├────────────────────┬───────────────────────────────────────────────────────────────────┤
│ System Component   │ Core Technical Responsibilities                                   │
├────────────────────┼───────────────────────────────────────────────────────────────────┤
│ React Frontend     │ • Renders responsive desktop-first UI using Tailwind CSS tokens   │
│                    │ • Manages client auth tokens (JWT in memory / secure storage)     │
│                    │ • Renders OpenStreetMap tiles and vehicle routes via Leaflet      │
│                    │ • Visualizes storage buffer levels & match analytics with Recharts│
│                    │ • Debounces user filter inputs (200ms) for responsive search      │
├────────────────────┼───────────────────────────────────────────────────────────────────┤
│ FastAPI Backend    │ • Exposes standardized RESTful endpoints with automatic OpenAPI   │
│                    │ • Validates inbound payloads using strict Pydantic models         │
│                    │ • Enforces RBAC permissions (Seller, Buyer, System Admin)         │
│                    │ • Manages database transaction lifecycles and connection pooling  │
│                    │ • Coordinates cross-service calls between DB, AI, and Logistics   │
├────────────────────┼───────────────────────────────────────────────────────────────────┤
│ PostgreSQL DB      │ • Stores user identities, plant profiles, batches, bids, orders   │
│                    │ • Enforces foreign keys, uniqueness, and status check constraints │
│                    │ • Executes parameterized queries via SQLAlchemy / Asyncpg         │
│                    │ • Handles row-level locking during bid acceptance to avoid double-│
│                    │   allocation of captured CO₂ inventory                            │
├────────────────────┼───────────────────────────────────────────────────────────────────┤
│ AI Match Engine    │ • Normalizes physical and economic parameters into scalar weights │
│                    │ • Enforces hard disqualification rules (e.g., purity deficiencies)│
│                    │ • Generates explainable, natural language match justification     │
│                    │ • Returns composite score (0–100) with sub-metric breakdowns      │
├────────────────────┼───────────────────────────────────────────────────────────────────┤
│ Logistics Module   │ • Computes accurate point-to-point road haulage distance          │
│                    │ • Applies thermodynamic freight pricing models ($/ton-km)         │
│                    │ • Calculates diesel transit emissions vs. gross carbon diverted   │
│                    │ • Estimates delivery transit windows based on regional road speeds│
└────────────────────┴───────────────────────────────────────────────────────────────────┘
```

---

## 4. End-to-End Data Flows

---

### Flow A: Seller Creates a CO₂ Batch Listing

```
[ Seller UI ]               [ FastAPI Router ]             [ Pydantic Validator ]          [ PostgreSQL DB ]
      │                              │                               │                             │
      │ 1. POST /api/v1/listings     │                               │                             │
      │    (Volume, Purity, Price)   │                               │                             │
      │─────────────────────────────►│                               │                             │
      │                              │ 2. Validate Schema & Bounds   │                             │
      │                              │──────────────────────────────►│                             │
      │                              │                               │                             │
      │                              │ 3. Schema Validated           │                             │
      │                              │◄──────────────────────────────│                             │
      │                              │                                                             │
      │                              │ 4. INSERT INTO listings (status='available')                │
      │                              │────────────────────────────────────────────────────────────►│
      │                              │                                                             │
      │                              │ 5. Commit & Return Created Record with UUID                 │
      │                              │◄────────────────────────────────────────────────────────────│
      │                              │                                                             │
      │ 6. HTTP 201 Created          │                                                             │
      │    (Listing JSON Payload)    │                                                             │
      │◄─────────────────────────────│                                                             │
```

* **Request Flow:** Seller inputs batch parameters (120 metric tons, 96.5% purity, liquid, $65/ton reserve). The React frontend attaches the JWT Bearer token and dispatches `POST /api/v1/listings`.
* **Processing:** FastAPI routes the payload to `ListingController`. Pydantic validates data types, ensuring purity is within $[70.0, 99.9\%]$ and volume $> 0$. A database transaction inserts the record with `status = 'available'`.
* **Response Flow:** Backend responds with HTTP `201 Created` returning the serialized record including a unique Batch UUID and creation timestamp. The frontend updates the active inventory table.

---

### Flow B: Buyer Searches Compatible CO₂ Suppliers

```
[ Buyer UI ]                [ FastAPI Router ]             [ PostgreSQL DB ]              [ Logistics Service ]
      │                              │                              │                               │
      │ 1. GET /api/v1/listings      │                              │                               │
      │    ?min_purity=90&max_dist=100                              │                               │
      │─────────────────────────────►│                              │                               │
      │                              │ 2. Query Available Listings  │                               │
      │                              │    (purity >= 90)            │                               │
      │                              │─────────────────────────────►│                               │
      │                              │                              │                               │
      │                              │ 3. Return Filtered Batches   │                               │
      │                              │◄─────────────────────────────│                               │
      │                              │                                                              │
      │                              │ 4. Compute Distance & Freight for Buyer Coordinates          │
      │                              │─────────────────────────────────────────────────────────────►│
      │                              │                                                              │
      │                              │ 5. Return Distances & Landed Freight Costs                   │
      │                              │◄─────────────────────────────────────────────────────────────│
      │                              │                                                              │
      │ 6. HTTP 200 OK               │                                                              │
      │    (Array of Enriched Batch Cards with Distances and Base Prices)                           │
      │◄─────────────────────────────│                                                              │
```

* **Request Flow:** Buyer adjusts marketplace sliders (Purity $\ge 90\%$, Distance $\le 100\text{ km}$). Frontend sends debounced `GET /api/v1/listings?min_purity=90.0&max_distance=100`.
* **Processing:** FastAPI queries the database for all `available` batches satisfying the chemical floor. The Logistics module computes driving distances from the buyer's registered plant coordinates.
* **Response Flow:** Returns an array of listings enriched with computed distances and baseline freight rates, rendered as cards on the marketplace grid.

---

### Flow C: AI Generates Match Recommendation & Score

```
[ Buyer UI ]               [ FastAPI Router ]              [ AI Match Engine ]            [ Logistics Module ]
      │                              │                               │                             │
      │ 1. POST /api/v1/match/analyze│                               │                             │
      │    (Listing_ID, Buyer_ID)    │                               │                             │
      │─────────────────────────────►│                               │                             │
      │                              │ 2. Fetch Distance & Route     │                             │
      │                              │────────────────────────────────────────────────────────────►│
      │                              │                               │                             │
      │                              │ 3. Return 42 km & Freight $   │                             │
      │                              │◄────────────────────────────────────────────────────────────│
      │                              │                               │                             │
      │                              │ 4. Execute Multi-Factor Scoring (Purity, Price, Dist, Rel)   │
      │                              │──────────────────────────────►│                             │
      │                              │                               │                             │
      │                              │ 5. Compute Normalized Score (94/100) + Generate Rationale   │
      │                              │◄──────────────────────────────│                             │
      │                              │                                                             │
      │ 6. HTTP 200 OK               │                                                             │
      │    (Match Score: 94, Rationale, Score Breakdown Vector, Landed Cost Breakdown)              │
      │◄─────────────────────────────│                                                             │
```

* **Request Flow:** Buyer clicks "Run AI Match" on a candidate listing. Client sends `POST /api/v1/match/analyze` with `listing_id` and `buyer_id`.
* **Processing:** The AI Service ingests physical stream parameters, coordinates with the Logistics Service for precise road distance, applies normalization curves, checks hard disqualification thresholds, and formats an explainable narrative.
* **Response Flow:** Returns a structured JSON payload containing the overall score (`94`), categorical tier (`HIGH_MATCH`), sub-metric distribution vectors, and natural language summary.

---

### Flow D: Buyer Submits Commercial Bid

```
[ Buyer UI ]                [ FastAPI Router ]             [ PostgreSQL DB ]              [ Notification Bus ]
      │                              │                              │                               │
      │ 1. POST /api/v1/bids         │                              │                               │
      │    (Listing_ID, Tons, Price) │                              │                               │
      │─────────────────────────────►│                              │                               │
      │                              │ 2. Validate Reserve Price    │                               │
      │                              │    (Bid >= 70% Reserve)      │                               │
      │                              │                              │                               │
      │                              │ 3. INSERT INTO bids (status='pending')                       │
      │                              │─────────────────────────────►│                               │
      │                              │                              │                               │
      │                              │ 4. Return Bid UUID           │                               │
      │                              │◄─────────────────────────────│                               │
      │                              │                                                              │
      │                              │ 5. Broadcast "New Bid" Event to Seller Workspace             │
      │                              │─────────────────────────────────────────────────────────────►│
      │                              │                                                              │
      │ 6. HTTP 201 Created          │                                                              │
      │    (Bid Confirmation Payload)│                                                              │
      │◄─────────────────────────────│                                                              │
```

* **Request Flow:** Buyer enters bid parameters (80 tons at $65/ton for target delivery date) and clicks "Submit Binding Bid".
* **Processing:** Backend verifies that requested volume $\le$ batch volume and bid price $\ge 0.70 \times \text{reserve price}$. Inserts record into `bids` with `status = 'pending'`.
* **Response Flow:** HTTP `201 Created` returned to buyer; asynchronous event notifies the seller's active session.

---

### Flow E: Seller Accepts Bid & Locks Order

```
[ Seller UI ]               [ FastAPI Router ]             [ PostgreSQL DB (ACID Tx) ]     [ Order Generator ]
      │                              │                               │                             │
      │ 1. POST /api/v1/bids/{id}/accept                             │                             │
      │─────────────────────────────►│                               │                             │
      │                              │ 2. BEGIN TRANSACTION          │                             │
      │                              │    SELECT ... FOR UPDATE      │                             │
      │                              │──────────────────────────────►│                             │
      │                              │                               │                             │
      │                              │ 3. UPDATE bids SET status='accepted'                        │
      │                              │    UPDATE listings SET status='reserved'                    │
      │                              │──────────────────────────────►│                             │
      │                              │                               │                             │
      │                              │ 4. INSERT INTO orders (...)   │                             │
      │                              │    COMMIT TRANSACTION         │                             │
      │                              │──────────────────────────────►│                             │
      │                              │                                                             │
      │                              │ 5. Compile Spec Sheet & Order Summary                       │
      │                              │────────────────────────────────────────────────────────────►│
      │                              │                               │                             │
      │                              │ 6. Order Summary Payload Ready│                             │
      │                              │◄──────────────────────────────│                             │
      │                              │                                                             │
      │ 7. HTTP 200 OK               │                                                             │
      │    (Order ID: #CX-8842, Status: Confirmed, Spec Sheet, Digital Gate Pass)                  │
      │◄─────────────────────────────│                                                             │
```

* **Request Flow:** Seller clicks "Accept Bid" on incoming offer. Client calls `POST /api/v1/bids/{bid_id}/accept`.
* **Processing:** Executed within an **ACID transaction using row-level locking (`SELECT ... FOR UPDATE`)** to prevent race conditions. The bid transitions to `accepted`, the batch transitions to `reserved` (or updates remaining quantity), and an immutable record is created in `orders`.
* **Response Flow:** Returns HTTP `200 OK` with the confirmed Order entity, locking terms for both parties and rendering Screen 10.

---

## 5. Authentication & Authorization Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                AUTHENTICATION LIFECYCLE                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. User Credentials (Email / Role) ──► POST /api/v1/auth/login                         │
│ 2. Verification                    ──► Password Hashing Verification (Bcrypt / Argon2) │
│ 3. Token Generation                ──► Cryptographically signed JWT Access Token       │
│ 4. Request Authorization           ──► Authorization: Bearer <JWT>                     │
│ 5. RBAC Middleware                 ──► Validates Role Claims against Route Guards      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Registration & Login Flow
* **Registration:** Enterprise profiles are initialized with company identity, physical plant coordinates, facility type, and default role (`SELLER_OPERATOR` or `BUYER_PROCUREMENT`).
* **Login:** User submits email and password. Backend verifies the salted cryptographic hash (Bcrypt). Upon verification, an access token is issued.

### 5.2 Stateless JWT Structure
The JSON Web Token payload contains minimal, immutable identification claims:
* `sub`: Unique User UUID.
* `role`: System access tier (`seller`, `buyer`, or `admin`).
* `plant_id`: Associated industrial asset UUID.
* `exp`: Expiration timestamp (standard 8-hour shift lifetime).
* `iat`: Issuance timestamp.

### 5.3 Role-Based Access Control (RBAC)
FastAPI dependency injection enforces strict endpoint protection:
* `require_seller`: Enforces that only accounts with `role == 'seller'` can invoke listing creation, batch modification, or bid acceptance routes.
* `require_buyer`: Enforces that only accounts with `role == 'buyer'` can access bidding routes and sourcing preference profiles.

---

## 6. AI Match Engine Service Architecture

The AI Match Engine operates as a high-performance Python computational module decoupled from standard CRUD operations.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                AI MATCH ENGINE PIPELINE                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ INGESTION: Seller Batch Spec + Buyer Requirements + Road Routing Data                  │
│                                           │                                            │
│ STEP 1: HARD DISQUALIFICATION GATE        ▼                                            │
│ • If Seller_Purity < Buyer_Min_Purity   ──► Capped at Score = 0 (INCOMPATIBLE)         │
│ • If Distance > Max_Transport_Radius    ──► Capped at Score = 0 (OUT_OF_RANGE)         │
│                                           │                                            │
│ STEP 2: MULTI-FACTOR WEIGHTED SCORING     ▼                                            │
│ • Purity Quality Score     (Weight: 30%)  ──► Scaled above required baseline           │
│ • Logistics Proximity      (Weight: 25%)  ──► Non-linear decay past 150 km             │
│ • Commercial Alignment     (Weight: 20%)  ──► Bid/Reserve price spread                 │
│ • Volumetric Capacity Fit  (Weight: 15%)  ──► Batch quantity ratio                     │
│ • Historical Reliability   (Weight: 10%)  ──► On-spec delivery fulfillment track record│
│                                           │                                            │
│ STEP 3: COMPOSITE COMPILATION             ▼                                            │
│ • AI Match Score = Σ(Weight_i × Score_i) normalized to [0, 100]                        │
│ • Natural Language Rationale compiled via rule-based explainability templates          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Output Schema Contract
The AI Match Engine guarantees a deterministic JSON response:
* `match_score`: Integer (0–100).
* `compatibility_tier`: Enum (`HIGH`: 85–100, `MODERATE`: 70–84, `LOW`: <70).
* `dimension_scores`: Vector of normalized sub-scores (`purity`, `distance`, `price`, `volume`, `reliability`).
* `explanation`: Concise natural language explanation describing the economic and physical rationale behind the score.

---

## 7. Logistics & Geospatial Routing Service

The Logistics Module bridges physical geography and industrial economics without external paid API dependencies by leveraging **OpenStreetMap (OSM)** data models.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              LOGISTICS ENGINE PIPELINE                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Geocoding Coordinates: Plant Origin Lat/Lng ──► Destination Lat/Lng                 │
│ 2. Distance Computation:  Haversine Matrix with 1.25 Road Tortuosity Winding Factor    │
│ 3. Freight Cost Formula:  Base Rate ($/ton) + [Distance (km) × Cryo-Rate ($0.22/t-km)] │
│ 4. Transport Carbon Debt: Distance (km) × 2 × Diesel Emission Factor (0.0009 tCO₂/km)  │
│ 5. Net Carbon Avoided:    Gross CO₂ Diverted (t) - Transport Carbon Debt (tCO₂e)       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Distance Estimation:** Computes point-to-point road distance between registered emitter weighbridges and buyer receiving bays using geodesic coordinates scaled by a calibrated industrial road factor.
* **Cryogenic Landed Cost Matrix:** Dynamically models freight overhead, calculating base handling plus cryogenic road freight ($0.20–$0.28 per ton-kilometer).
* **Net-Negative Carbon Verification:** Calculates diesel tanker exhaust emissions based on round-trip haulage and subtracts this from gross diverted CO₂, verifying that the transaction delivers net carbon abatement.

---

## 8. API Communication Diagram & Route Taxonomy

Communication between the React SPA and the FastAPI backend follows standard REST conventions over HTTPS.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                API ROUTE ARCHITECTURE                                  │
├───────────────────────────────┬─────────┬──────────────────────────────────────────────┤
│ Endpoint                      │ Method  │ Functional Operation                         │
├───────────────────────────────┼─────────┼──────────────────────────────────────────────┤
│ `/api/v1/auth/login`          │ POST    │ Authenticates user; returns JWT token        │
│ `/api/v1/auth/me`             │ GET     │ Retrieves authenticated session profile      │
├───────────────────────────────┼─────────┼──────────────────────────────────────────────┤
│ `/api/v1/listings`            │ GET     │ Queries active CO₂ catalog with filters      │
│ `/api/v1/listings`            │ POST    │ Creates new point-source batch (Seller)      │
│ `/api/v1/listings/{id}`       │ GET     │ Retrieves technical spec sheet & gas assay   │
├───────────────────────────────┼─────────┼──────────────────────────────────────────────┤
│ `/api/v1/match/analyze`       │ POST    │ Generates AI Match Score & explanation       │
│ `/api/v1/logistics/calculate` │ POST    │ Computes road distance, freight & emissions  │
├───────────────────────────────┼─────────┼──────────────────────────────────────────────┤
│ `/api/v1/bids`                │ POST    │ Submits binding purchase bid (Buyer)         │
│ `/api/v1/bids/incoming`       │ GET     │ Fetches received bids queue (Seller)         │
│ `/api/v1/bids/{id}/accept`    │ POST    │ Accepts bid; reserves inventory (Seller)     │
├───────────────────────────────┼─────────┼──────────────────────────────────────────────┤
│ `/api/v1/orders/{id}`         │ GET     │ Retrieves finalized order & digital BoL      │
│ `/api/v1/analytics/dashboard` │ GET     │ Retrieves aggregate tons diverted & savings  │
└───────────────────────────────┴─────────┴──────────────────────────────────────────────┘
```

---

## 9. Security & Data Integrity Architecture

The application implements defense-in-depth security principles suitable for enterprise B2B infrastructure:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               SECURITY DEFENSE LAYERS                                  │
├───────────────────┬────────────────────────────────────────────────────────────────────┤
│ Security Layer    │ Enforcement Mechanism                                              │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ Transport Layer   │ Strict TLS 1.3 encryption across all client-server communications  │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ Authentication    │ Stateless JWT with HS256 / RS256 signature; Bcrypt password hashing│
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ Input Validation  │ Strict Pydantic models reject unexpected fields or out-of-bound    │
│                   │ numbers before hitting the application business layer              │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ SQL Injection     │ Eliminated via SQLAlchemy ORM parameterized query construction;    │
│ Prevention        │ raw concatenated SQL strings are strictly prohibited               │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ Concurrency & ACID│ Row-level database locks (`SELECT FOR UPDATE`) on listing tables   │
│ Integrity         │ prevent double-allocation of CO₂ batches during simultaneous bids  │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ Cross-Origin CORS │ Explicit origin whitelisting restricting API invocation strictly   │
│ Restrictions      │ to the authorized frontend domain                                  │
└───────────────────┴────────────────────────────────────────────────────────────────────┘
```

---

## 10. Deployment & Infrastructure Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                PRODUCTION CLOUD TOPOLOGY                               │
│                                                                                        │
│     [ Global CDN / Edge ] ────────► React + TypeScript SPA (Static Build Artifacts)    │
│                                                                                        │
│                                            │ HTTPS / REST                              │
│                                            ▼                                           │
│     [ Managed Cloud Run / ECS ] ──► FastAPI Application Container (Uvicorn ASGI)       │
│                                     • Python 3.11 Runtime                              │
│                                     • Multi-Worker Process Pool                        │
│                                                                                        │
│                                            │ Asyncpg Connection Pool                   │
│                                            ▼                                           │
│     [ Managed Database Instance ] ─► PostgreSQL 15+ Engine                             │
│                                     • Multi-AZ Automated Backups                       │
│                                     • Connection Pooling (PgBouncer)                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 10.1 Development Environment
* **Frontend:** Vite development server running React + TypeScript with hot module replacement (Port: `5173`).
* **Backend:** FastAPI running locally with Uvicorn in auto-reload mode (Port: `8000`).
* **Database:** Local or cloud-hosted PostgreSQL instance running on default port `5432`.
* **Orchestration:** Executable via a single unified startup script or standard container orchestration.

### 10.2 Production Topology
* **Frontend Hosting:** Static distribution via Cloudflare Pages or AWS CloudFront/S3, delivering optimized bundle assets with low edge latency.
* **Backend Hosting:** Containerized deployment on Google Cloud Run or AWS ECS/Fargate, configured with horizontal auto-scaling (minimum 1, maximum 10 container instances based on CPU utilization and request concurrency).
* **Database:** Managed PostgreSQL (e.g., AWS RDS or Supabase/Neon), configured with connection pooling (PgBouncer) to sustain burst traffic without exhausting database connections.

### 10.3 Scalability Considerations
* **Stateless Application Layer:** Because user sessions are validated via cryptographically signed JWT tokens, FastAPI worker instances remain completely stateless and can scale horizontally behind a round-robin load balancer.
* **Algorithmic Compute Isolation:** The AI Match scoring function uses optimized vector arithmetic that executes in under 10 milliseconds, preventing CPU starvation even under heavy concurrent evaluation.
