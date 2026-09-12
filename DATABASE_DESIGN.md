# CarbonX — Database Design Document
**Project Name:** CarbonX  
**Tagline:** Transform Captured Carbon into Industrial Value  
**Event:** HackOut'26 (36-Hour Hackathon)  
**Document Version:** 6.0 (Phase 6 — Relational Data Modeling & PostgreSQL Architecture)  
**Author:** Senior Database Architect, PostgreSQL Specialist & Data Modeler  

---

## 1. Executive Summary

The persistence architecture for CarbonX is engineered on **PostgreSQL 15+** to provide the transactional rigor, strict relational integrity, and consistency guarantees required for high-stakes industrial B2B commerce. Industrial CO₂ transactions involve complex multi-variable parameters—including continuous volumetric flow rates, hazardous gas purity certifications, and strict thermodynamic transport constraints. Off-the-shelf document databases or non-relational datastores are structurally unsuited for this problem due to the risk of race conditions, inventory double-allocation, and lack of atomic transaction support.

By anchoring the platform on a fully normalized (Third Normal Form / 3NF) PostgreSQL architecture, CarbonX guarantees:

* **Strict ACID Transactional Guarantees:** Preventing race conditions during bid acceptance through row-level locking (`SELECT ... FOR UPDATE`), ensuring that a single 100-ton batch cannot be sold to multiple buyers simultaneously.
* **Declarative Data Integrity:** Enforcing chemical boundaries (e.g., purity strictly between 70.0% and 99.99%) and commercial boundaries (volume and price strictly positive) at the database layer via check constraints.
* **Geospatial & Composite Indexing:** Facilitating high-concurrency marketplace queries that filter simultaneously across chemical purity thresholds, geographic radiuses, and reserve price ranges in sub-10 millisecond execution times.
* **Universal UUID Primary Keys:** Preventing enumeration attacks, facilitating distributed data generation, and avoiding sequential ID collisions across enterprise systems.

---

## 2. Entity List

The database architecture is strictly scoped to seven essential entities supporting the 36-hour MVP without unnecessary administrative overhead:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CORE ENTITY CATALOG                                    │
├──────────────────────┬─────────────────────────────────────────────────────────────────┤
│ Entity Name          │ Business & Architectural Purpose                                │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ `companies`          │ Represents the legal industrial enterprise, plant facility,     │
│                      │ sector classification, and physical geospatial coordinates.     │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ `users`              │ Represents authenticated individual operators, procurement      │
│                      │ managers, credentials, and RBAC system roles.                   │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ `listings`           │ Represents discrete point-source captured CO₂ batches published │
│                      │ by sellers, including volume, purity %, state, and price.       │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ `bids`               │ Represents commercial purchase offers submitted by buyers for   │
│                      │ specific batches, defining offered price, volume, and timing.   │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ `orders`             │ Represents finalized, binding commercial contracts resulting   │
│                      │ from accepted bids with locked delivery terms and spec sheets.  │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ `ai_match_results`   │ Caches computed multi-factor AI Match Scores (0–100), dimension │
│                      │ weights, and explainable natural language rationales.           │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ `logistics_estimates`│ Stores calculated road transit distances, estimated cryogenic   │
│                      │ freight rates, and net transport carbon debt between clusters.  │
└──────────────────────┴─────────────────────────────────────────────────────────────────┘
```

---

## 3. Entity-Relationship (ER) Diagram

```
+----------------------------------------------------------------------------------------------------+
|                                      CARBONX LOGICAL ER DIAGRAM                                    |
+----------------------------------------------------------------------------------------------------+

       +-------------------------+
       |        companies        |
       +-------------------------+
       | PK  id                  |
       |     company_name        |
       |     industry_type       |
       |     location_name       |
       |     latitude            |
       |     longitude           |
       +-------------------------+
                    |
                    | 1:N (One company has many users)
                    v
       +-------------------------+
       |          users          |
       +-------------------------+
       | PK  id                  |
       | FK  company_id          |
       |     full_name           |
       |     email (UQ)          |
       |     password_hash       |
       |     role (ENUM)         |
       |     created_at          |
       +-------------------------+
            |               |
            | 1:N (Seller)  | 1:N (Buyer)
            v               |
 +-----------------------+  |
 |       listings        |  |
 +-----------------------+  |
 | PK  id                |  |
 | FK  seller_id         |  |
 |     purity_percentage |  |
 |     volume_metric_tons|  |
 |     physical_state    |  |
 |     reserve_price_ton |  |
 |     status (ENUM)     |  |
 |     available_from    |  |
 |     available_until   |  |
 |     created_at        |  |
 +-----------------------+  |
      |         |           |
      | 1:N     | 1:N       |
      |         |           |
      |         v           |
      |  +---------------------+
      |  |  ai_match_results   |
      |  +---------------------+
      |  | PK  id              |
      |  | FK  listing_id      |
      |  | FK  buyer_id        |<-------------------+
      |  |     match_score     |                    |
      |  |     confidence_score|                    |
      |  |     explanation_text|                    |
      |  |     created_at      |                    |
      |  +---------------------+                    |
      |                                             |
      v 1:N                                         |
 +-----------------------+                          |
 |         bids          |                          |
 +-----------------------+                          |
 | PK  id                |                          |
 | FK  listing_id        |                          |
 | FK  buyer_id          |--------------------------+
 |     offered_price_ton |
 |     requested_quantity|
 |     delivery_target   |
 |     status (ENUM)     |
 |     created_at        |
 +-----------------------+
      |
      | 1:1 (An accepted bid creates exactly one binding order)
      v
 +-----------------------+                     +-----------------------+
 |        orders         |                     |  logistics_estimates  |
 +-----------------------+                     +-----------------------+
 | PK  id                |                     | PK  id                |
 | FK  bid_id (UQ)       |                     | FK  origin_company_id |
 | FK  listing_id        |                     | FK  dest_company_id   |
 | FK  seller_id         |                     |     distance_km       |
 | FK  buyer_id          |                     |     transport_cost_ton|
 |     final_price_ton   |                     |     transit_duration  |
 |     quantity_tons     |                     |     logistics_co2_debt|
 |     delivery_window   |                     |     created_at        |
 |     order_status(ENUM)|                     +-----------------------+
 |     confirmed_at      |
 +-----------------------+
```

---

## 4. Table Specifications

---

### 4.1 Table Name: `companies`
* **Purpose:** Stores enterprise profiles for industrial facilities (both point-source emitters and off-takers), including physical location and geographic coordinates.

| Column Name | PostgreSQL Data Type | Nullable | Default Value | Description | Constraints / Keys |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `UUID` | **No** | `gen_random_uuid()` | Unique enterprise identifier | **Primary Key** |
| `company_name` | `VARCHAR(255)` | **No** | *None* | Legal entity or plant name | Unique per legal division |
| `industry_type` | `VARCHAR(100)` | **No** | *None* | Industrial classification (e.g., Cement, Steel, Concrete) | Not Null |
| `location_name` | `VARCHAR(255)` | **No** | *None* | Physical plant address or industrial corridor name | Not Null |
| `latitude` | `DECIMAL(9, 6)` | **No** | *None* | Geographic latitude for routing | Range: -90.0 to 90.0 |
| `longitude` | `DECIMAL(9, 6)` | **No** | *None* | Geographic longitude for routing | Range: -180.0 to 180.0 |
| `created_at` | `TIMESTAMPTZ` | **No** | `CURRENT_TIMESTAMP` | System onboarding timestamp | Not Null |

---

### 4.2 Table Name: `users`
* **Purpose:** Stores authenticated user accounts, role-based access levels, credential hashes, and company affiliation.

| Column Name | PostgreSQL Data Type | Nullable | Default Value | Description | Constraints / Keys |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `UUID` | **No** | `gen_random_uuid()` | Unique user account identifier | **Primary Key** |
| `company_id` | `UUID` | **No** | *None* | Associated industrial enterprise | **Foreign Key** $\rightarrow$ `companies(id)` |
| `full_name` | `VARCHAR(150)` | **No** | *None* | User's legal name | Not Null |
| `email` | `VARCHAR(255)` | **No** | *None* | Corporate email used for authentication | **Unique**, Valid email format |
| `password_hash`| `VARCHAR(255)` | **No** | *None* | Cryptographic password hash (Argon2 / Bcrypt) | Not Null |
| `role` | `user_role_enum` | **No** | *None* | RBAC role: `seller` or `buyer` | User Role Enum |
| `is_active` | `BOOLEAN` | **No** | `TRUE` | Account operational status | Not Null |
| `created_at` | `TIMESTAMPTZ` | **No** | `CURRENT_TIMESTAMP` | Account creation timestamp | Not Null |

---

### 4.3 Table Name: `listings`
* **Purpose:** Represents discrete point-source captured CO₂ batches published by sellers to the marketplace.

| Column Name | PostgreSQL Data Type | Nullable | Default Value | Description | Constraints / Keys |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `UUID` | **No** | `gen_random_uuid()` | Unique batch listing identifier | **Primary Key** |
| `seller_id` | `UUID` | **No** | *None* | User account that authored the listing | **Foreign Key** $\rightarrow$ `users(id)` |
| `purity_percentage` | `DECIMAL(5, 2)` | **No** | *None* | Certified CO₂ concentration percentage | Check: `purity BETWEEN 70.00 AND 99.99` |
| `volume_metric_tons`| `DECIMAL(10, 2)` | **No** | *None* | Total batch quantity available in metric tons | Check: `volume > 0.00` |
| `physical_state` | `VARCHAR(50)` | **No** | `'liquid'` | Physical phase: `'liquid'` or `'pressurized_gas'` | Check: `IN ('liquid', 'pressurized_gas')` |
| `reserve_price_ton` | `DECIMAL(10, 2)` | **No** | *None* | Minimum acceptable base price per metric ton | Check: `reserve_price > 0.00` |
| `status` | `listing_status_enum`| **No** | `'available'` | Batch state: `available`, `reserved`, `sold` | Listing Status Enum |
| `available_from` | `DATE` | **No** | `CURRENT_DATE` | Earliest dispatch date | Not Null |
| `available_until` | `DATE` | **No** | *None* | Expiration date of buffer storage availability | Check: `available_until >= available_from` |
| `created_at` | `TIMESTAMPTZ` | **No** | `CURRENT_TIMESTAMP` | Publication timestamp | Not Null |

---

### 4.4 Table Name: `bids`
* **Purpose:** Stores commercial purchase offers placed by buyers against available seller listings.

| Column Name | PostgreSQL Data Type | Nullable | Default Value | Description | Constraints / Keys |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `UUID` | **No** | `gen_random_uuid()` | Unique commercial bid identifier | **Primary Key** |
| `listing_id` | `UUID` | **No** | *None* | Target CO₂ batch listing | **Foreign Key** $\rightarrow$ `listings(id)` |
| `buyer_id` | `UUID` | **No** | *None* | User account placing the bid | **Foreign Key** $\rightarrow$ `users(id)` |
| `offered_price_ton`| `DECIMAL(10, 2)` | **No** | *None* | Bid price per metric ton offered by buyer | Check: `offered_price > 0.00` |
| `requested_quantity`| `DECIMAL(10, 2)` | **No** | *None* | Quantity requested in metric tons | Check: `requested_quantity > 0.00` |
| `delivery_target` | `DATE` | **No** | *None* | Requested delivery fulfillment date | Not Null |
| `status` | `bid_status_enum` | **No** | `'pending'` | Bid state: `pending`, `accepted`, `rejected` | Bid Status Enum |
| `created_at` | `TIMESTAMPTZ` | **No** | `CURRENT_TIMESTAMP` | Bid submission timestamp | Not Null |

---

### 4.5 Table Name: `orders`
* **Purpose:** Represents legally binding commercial contracts created upon seller acceptance of a bid.

| Column Name | PostgreSQL Data Type | Nullable | Default Value | Description | Constraints / Keys |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `UUID` | **No** | `gen_random_uuid()` | Unique order & bill-of-lading identifier | **Primary Key** |
| `bid_id` | `UUID` | **No** | *None* | Accepted commercial bid | **Foreign Key** $\rightarrow$ `bids(id)`, **Unique** |
| `listing_id` | `UUID` | **No** | *None* | Originating CO₂ batch | **Foreign Key** $\rightarrow$ `listings(id)` |
| `seller_id` | `UUID` | **No** | *None* | Seller user fulfilling the order | **Foreign Key** $\rightarrow$ `users(id)` |
| `buyer_id` | `UUID` | **No** | *None* | Buyer user receiving the shipment | **Foreign Key** $\rightarrow$ `users(id)` |
| `final_price_ton` | `DECIMAL(10, 2)` | **No** | *None* | Locked commercial commodity price per ton | Check: `final_price > 0.00` |
| `quantity_tons` | `DECIMAL(10, 2)` | **No** | *None* | Final contracted quantity in metric tons | Check: `quantity_tons > 0.00` |
| `delivery_window` | `VARCHAR(100)` | **No** | *None* | Scheduled dispatch timeframe (e.g., "Wed 08:00")| Not Null |
| `order_status` | `order_status_enum`| **No** | `'confirmed'` | Status: `confirmed`, `in_transit`, `completed` | Order Status Enum |
| `confirmed_at` | `TIMESTAMPTZ` | **No** | `CURRENT_TIMESTAMP` | Order execution timestamp | Not Null |

---

### 4.6 Table Name: `ai_match_results`
* **Purpose:** Caches multi-parametric algorithmic compatibility calculations and plain-language explainability rationales.

| Column Name | PostgreSQL Data Type | Nullable | Default Value | Description | Constraints / Keys |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `UUID` | **No** | `gen_random_uuid()` | Unique match evaluation identifier | **Primary Key** |
| `listing_id` | `UUID` | **No** | *None* | Evaluated seller batch listing | **Foreign Key** $\rightarrow$ `listings(id)` |
| `buyer_id` | `UUID` | **No** | *None* | Buyer user for whom match was evaluated | **Foreign Key** $\rightarrow$ `users(id)` |
| `match_score` | `INTEGER` | **No** | *None* | Normalized AI compatibility index (0 to 100) | Check: `match_score BETWEEN 0 AND 100` |
| `confidence_score` | `DECIMAL(5, 2)` | **No** | *None* | Statistical confidence index (e.g., 98.4%) | Check: `confidence BETWEEN 0.00 AND 100.00` |
| `explanation_text` | `TEXT` | **No** | *None* | Plain-language natural language rationale | Not Null |
| `created_at` | `TIMESTAMPTZ` | **No** | `CURRENT_TIMESTAMP` | Calculation timestamp | Not Null |

---

### 4.7 Table Name: `logistics_estimates`
* **Purpose:** Stores precomputed and cached road haulage distances, cryogenic freight rates, and net carbon debt between industrial facilities.

| Column Name | PostgreSQL Data Type | Nullable | Default Value | Description | Constraints / Keys |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `UUID` | **No** | `gen_random_uuid()` | Unique logistics calculation identifier | **Primary Key** |
| `origin_company_id` | `UUID` | **No** | *None* | Dispatch facility (Emitter) | **Foreign Key** $\rightarrow$ `companies(id)` |
| `dest_company_id` | `UUID` | **No** | *None* | Receiving facility (Off-taker) | **Foreign Key** $\rightarrow$ `companies(id)` |
| `distance_km` | `DECIMAL(8, 2)` | **No** | *None* | Computed road network distance in kilometers | Check: `distance_km >= 0.00` |
| `transport_cost_ton`| `DECIMAL(10, 2)` | **No** | *None* | Estimated cryogenic freight cost per ton | Check: `transport_cost_ton >= 0.00` |
| `transit_duration` | `VARCHAR(50)` | **No** | *None* | Estimated transit time (e.g., "1.4 hours") | Not Null |
| `logistics_co2_debt`| `DECIMAL(8, 4)` | **No** | *None* | Estimated diesel transit emissions in tCO₂e | Check: `logistics_co2_debt >= 0.0000` |
| `created_at` | `TIMESTAMPTZ` | **No** | `CURRENT_TIMESTAMP` | Calculation timestamp | Not Null |

---

## 5. Relationship Matrix & Cardinality

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIP MATRIX                                │
├──────────────────────┬──────────────────────┬─────────────┬────────────────────────────┤
│ Source Entity        │ Target Entity        │ Cardinality │ Business Rule Description  │
├──────────────────────┼──────────────────────┼─────────────┼────────────────────────────┤
│ `companies`          │ `users`              │ **1 : N**   │ One company can register   │
│                      │                      │             │ multiple plant operators.  │
├──────────────────────┼──────────────────────┼─────────────┼────────────────────────────┤
│ `users` (Seller)     │ `listings`           │ **1 : N**   │ A seller can publish many  │
│                      │                      │             │ captured batches over time.│
├──────────────────────┼──────────────────────┼─────────────┼────────────────────────────┤
│ `listings`           │ `bids`               │ **1 : N**   │ Multiple buyers can submit │
│                      │                      │             │ competing bids on a batch. │
├──────────────────────┼──────────────────────┼─────────────┼────────────────────────────┤
│ `users` (Buyer)      │ `bids`               │ **1 : N**   │ A buyer can submit many    │
│                      │                      │             │ bids across the catalog.   │
├──────────────────────┼──────────────────────┼─────────────┼────────────────────────────┤
│ `bids`               │ `orders`             │ **1 : 1**   │ Exactly one accepted bid   │
│                      │                      │             │ generates one final order. │
├──────────────────────┼──────────────────────┼─────────────┼────────────────────────────┤
│ `listings`           │ `ai_match_results`   │ **1 : N**   │ A listing can be evaluated │
│                      │                      │             │ against multiple buyers.   │
├──────────────────────┼──────────────────────┼─────────────┼────────────────────────────┤
│ `companies` (Origin) │ `logistics_estimates`│ **1 : N**   │ One plant origin can have  │
│                      │                      │             │ cached routes to buyers.   │
└──────────────────────┴──────────────────────┴─────────────┴────────────────────────────┘
```

---

## 6. Constraints & Referential Integrity Rules

The schema enforces data integrity natively in PostgreSQL to protect application business rules:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA INTEGRITY CONSTRAINTS                                │
├───────────────────┬────────────────────────────────────────────────────────────────────┤
│ Table             │ Specific Constraint Rule & Operational Behavior                    │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ `users`           │ • `email`: Unique constraint prevents duplicate registrations.   │
│                   │ • `company_id`: ON DELETE RESTRICT (Prevents deleting active org). │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ `listings`        │ • `purity_percentage`: CHECK (`purity >= 70.00 AND purity <= 99.99`│
│                   │ • `volume_metric_tons`: CHECK (`volume_metric_tons > 0.00`).       │
│                   │ • `reserve_price_ton`: CHECK (`reserve_price_ton > 0.00`).         │
│                   │ • `seller_id`: ON DELETE RESTRICT (Protects inventory lineage).    │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ `bids`            │ • `offered_price_ton`: CHECK (`offered_price_ton > 0.00`).         │
│                   │ • `requested_quantity`: CHECK (`requested_quantity > 0.00`).       │
│                   │ • `listing_id`: ON DELETE CASCADE (Cleans orphan bids if unlisted).│
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ `orders`          │ • `bid_id`: UNIQUE (Guarantees one bid cannot produce two orders). │
│                   │ • `final_price_ton`: CHECK (`final_price_ton > 0.00`).             │
│                   │ • `quantity_tons`: CHECK (`quantity_tons > 0.00`).                 │
│                   │ • `listing_id`, `bid_id`: ON DELETE RESTRICT (Immutable audit).    │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ `ai_match_results`│ • `match_score`: CHECK (`match_score >= 0 AND match_score <= 100`).│
│                   │ • Composite Unique: `(listing_id, buyer_id)` (Prevents duplicate   │
│                   │   cached match evaluations for the same pair).                     │
├───────────────────┼────────────────────────────────────────────────────────────────────┤
│ `logistics`       │ • Composite Unique: `(origin_company_id, dest_company_id)`         │
│                   │ • CHECK (`origin_company_id <> dest_company_id`) (No self-routing).│
└───────────────────┴────────────────────────────────────────────────────────────────────┘
```

---

## 7. Indexing Strategy

To achieve sub-10ms response times on high-volume marketplace queries, the following indexes are specified:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              INDEXING OPTIMIZATION MATRIX                              │
├───────────────────┬──────────────────────────┬───────────┬─────────────────────────────┤
│ Target Table      │ Columns Indexed          │ Index Type│ Performance Justification   │
├───────────────────┼──────────────────────────┼───────────┼─────────────────────────────┤
│ `users`           │ `email`                  │ B-Tree    │ Fast O(1) user lookup during│
│                   │                          │ (Unique)  │ JWT login authentication.   │
├───────────────────┼──────────────────────────┼───────────┼─────────────────────────────┤
│ `listings`        │ `status`                 │ B-Tree    │ Primary marketplace filter; │
│                   │                          │           │ isolates 'available' rows.  │
├───────────────────┼──────────────────────────┼───────────┼─────────────────────────────┤
│ `listings`        │ `status`, `purity_pct`,  │ B-Tree    │ **Core Composite Index:**   │
│                   │ `reserve_price_ton`      │ Composite │ Powers multi-slider filters │
│                   │                          │           │ without full table scans.   │
├───────────────────┼──────────────────────────┼───────────┼─────────────────────────────┤
│ `companies`       │ `latitude`, `longitude`  │ B-Tree    │ Accelerates radius and      │
│                   │                          │ Composite │ bounding-box cluster queries│
├───────────────────┼──────────────────────────┼───────────┼─────────────────────────────┤
│ `bids`            │ `listing_id`, `status`   │ B-Tree    │ Enables instant retrieval of│
│                   │                          │ Composite │ pending bids for a listing. │
├───────────────────┼──────────────────────────┼───────────┼─────────────────────────────┤
│ `ai_match_results`│ `listing_id`, `buyer_id` │ B-Tree    │ Rapid retrieval of cached   │
│                   │                          │ Composite │ match scores during browsing│
└───────────────────┴──────────────────────────┴───────────┴─────────────────────────────┘
```

---

## 8. Status Enumerations (Enums)

PostgreSQL custom native ENUM types enforce domain state transitions cleanly:

### 8.1 `user_role_enum`
Defines role permissions for RBAC enforcement:
* `seller`: Industrial point-source emitter authorized to list inventory and accept bids.
* `buyer`: Commercial circular off-taker authorized to search catalog and place bids.

### 8.2 `listing_status_enum`
Governs inventory availability:
* `available`: Active on the marketplace; open for buyer bids.
* `reserved`: Commercial bid accepted; volume locked pending logistics dispatch.
* `sold`: Completed and fully dispatched; archived in historical records.

### 8.3 `bid_status_enum`
Tracks negotiation lifecycles:
* `pending`: Submitted by buyer; awaiting seller review.
* `accepted`: Approved by seller; automatically transitions listing and triggers order generation.
* `rejected`: Declined by seller or superseded by a competing accepted bid.

### 8.4 `order_status_enum`
Manages physical order fulfillment:
* `confirmed`: Legally locked and recorded; digital bill-of-lading issued.
* `in_transit`: Road tanker loaded at emitter plant and moving to destination.
* `completed`: Unloaded at buyer facility; delivery receipts and LCA certificates signed.

---

## 9. Sample Realistic Seed Data (Indian Industrial Context)

---

### 9.1 Table: `companies`

```
┌──────────────────────────────────────┬─────────────────────────┬───────────────┬───────────────────────────┬───────────┬───────────┐
│ id                                   │ company_name            │ industry_type │ location_name             │ latitude  │ longitude │
├──────────────────────────────────────┼─────────────────────────┼───────────────┼───────────────────────────┼───────────┼───────────┤
│ 11111111-1111-1111-1111-111111111111 │ Ahmedabad Cement Ltd    │ Cement        │ Sanand Industrial Corridor│ 22.986800 │ 72.381400 │
│ 22222222-2222-2222-2222-222222222222 │ Kalinga Steel Works     │ Steel         │ Jharsuguda Cluster, Odisha│ 21.855400 │ 84.006200 │
│ 33333333-3333-3333-3333-333333333333 │ GreenGrow Gujarat Ltd   │ Greenhouse    │ Kheda Agri Park, Gujarat  │ 22.752300 │ 72.684100 │
└──────────────────────────────────────┴─────────────────────────┴───────────────┴───────────────────────────┴───────────┴───────────┘
```

---

### 9.2 Table: `users`

```
┌──────────────────────────────────────┬──────────────────────────────────────┬─────────────────────┬───────────────────────────┬─────────┐
│ id                                   │ company_id                           │ full_name           │ email                     │ role    │
├──────────────────────────────────────┼──────────────────────────────────────┼─────────────────────┼───────────────────────────┼─────────┤
│ aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa │ 11111111-1111-1111-1111-111111111111 │ Rajesh K. Verma     │ rajesh.verma@ahmedabad.com│ seller  │
│ bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb │ 22222222-2222-2222-2222-222222222222 │ Pradeep Patnaik     │ p.patnaik@kalingasteel.in │ seller  │
│ cccccccc-cccc-cccc-cccc-cccccccccccc │ 33333333-3333-3333-3333-333333333333 │ Dr. Ananya Sengupta │ ananya.s@greengrow.in     │ buyer   │
└──────────────────────────────────────┴──────────────────────────────────────┴─────────────────────┴───────────────────────────┴─────────┘
```

---

### 9.3 Table: `listings`

```
┌──────────────────────────────────────┬──────────────────────────────────────┬────────────┬────────────┬──────────────────┬─────────────┬───────────┐
│ id                                   │ seller_id                            │ purity_pct │ volume_tons│ physical_state   │ reserve_ton │ status    │
├──────────────────────────────────────┼──────────────────────────────────────┼────────────┼────────────┼──────────────────┼─────────────┼───────────┤
│ L1111111-1111-1111-1111-111111111111 │ aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa │ 96.50      │ 120.00     │ liquid           │ 65.00       │ available │
│ L2222222-2222-2222-2222-222222222222 │ aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa │ 98.20      │ 60.00      │ liquid           │ 75.00       │ available │
│ L3333333-3333-3333-3333-333333333333 │ bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb │ 88.40      │ 250.00     │ pressurized_gas  │ 42.00       │ available │
└──────────────────────────────────────┴──────────────────────────────────────┴────────────┴────────────┴──────────────────┴─────────────┴───────────┘
```

---

### 9.4 Table: `bids`

```
┌──────────────────────────────────────┬──────────────────────────────────────┬──────────────────────────────────────┬─────────────┬────────────┬───────────┐
│ id                                   │ listing_id                           │ buyer_id                             │ offered_ton │ req_tons   │ status    │
├──────────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────────┼─────────────┼────────────┼───────────┤
│ B1111111-1111-1111-1111-111111111111 │ L1111111-1111-1111-1111-111111111111 │ cccccccc-cccc-cccc-cccc-cccccccccccc │ 65.00       │ 80.00      │ accepted  │
│ B2222222-2222-2222-2222-222222222222 │ L2222222-2222-2222-2222-222222222222 │ cccccccc-cccc-cccc-cccc-cccccccccccc │ 72.00       │ 40.00      │ pending   │
│ B3333333-3333-3333-3333-333333333333 │ L1111111-1111-1111-1111-111111111111 │ cccccccc-cccc-cccc-cccc-cccccccccccc │ 50.00       │ 100.00     │ rejected  │
└──────────────────────────────────────┴──────────────────────────────────────┴──────────────────────────────────────┴─────────────┴────────────┴───────────┘
```

---

### 9.5 Table: `orders`

```
┌──────────────────────────────────────┬──────────────────────────────────────┬──────────────────────────────────────┬───────────┬────────────┬───────────┐
│ id                                   │ bid_id                               │ listing_id                           │ final_ton │ total_tons │ status    │
├──────────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────────┼───────────┼────────────┼───────────┤
│ O1111111-1111-1111-1111-111111111111 │ B1111111-1111-1111-1111-111111111111 │ L1111111-1111-1111-1111-111111111111 │ 65.00     │ 80.00      │ confirmed │
└──────────────────────────────────────┴──────────────────────────────────────┴──────────────────────────────────────┴───────────┴────────────┴───────────┘
```

---

### 9.6 Table: `ai_match_results`

```
┌──────────────────────────────────────┬──────────────────────────────────────┬──────────────────────────────────────┬───────┬────────────┬────────────────────────────────────────────────────────┐
│ id                                   │ listing_id                           │ buyer_id                             │ score │ confidence │ explanation_text                                       │
├──────────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────────┼───────┼────────────┼────────────────────────────────────────────────────────┤
│ M1111111-1111-1111-1111-111111111111 │ L1111111-1111-1111-1111-111111111111 │ cccccccc-cccc-cccc-cccc-cccccccccccc │ 94    │ 98.40      │ Proximity of 42 km saves $34/ton in freight. 96.5%     │
│                                      │                                      │                                      │       │            │ purity exceeds your 90% threshold with zero sulfur.    │
└──────────────────────────────────────┴──────────────────────────────────────┴──────────────────────────────────────┴───────┴────────────┴────────────────────────────────────────────────────────┘
```

---

### 9.7 Table: `logistics_estimates`

```
┌──────────────────────────────────────┬──────────────────────────────────────┬──────────────────────────────────────┬─────────────┬────────────┬──────────┐
│ id                                   │ origin_company_id                    │ dest_company_id                      │ distance_km │ freight_ton│ co2_debt │
├──────────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────────┼─────────────┼────────────┼──────────┤
│ T1111111-1111-1111-1111-111111111111 │ 11111111-1111-1111-1111-111111111111 │ 33333333-3333-3333-3333-333333333333 │ 42.00       │ 14.20      │ 0.0378   │
└──────────────────────────────────────┴──────────────────────────────────────┴──────────────────────────────────────┴─────────────┴────────────┴──────────┘
```

---

## 10. Database Validation Checklist

Before deployment to the PostgreSQL instance, this architecture must satisfy all 6 integrity gates:

* [x] **Third Normal Form (3NF) Verified:** Zero non-key dependencies or transitive relationships across tables.
* [x] **Universal UUID Primary Keys:** Every table uses `UUID` with `gen_random_uuid()` defaults, avoiding integer sequence exhaustion and enumeration vulnerabilities.
* [x] **Referential Integrity Enforcement:** All foreign keys specify explicit `ON DELETE RESTRICT` or `ON DELETE CASCADE` rules to prevent orphaned records.
* [x] **Concurrency & Race Condition Proofing:** Row-level locks (`SELECT FOR UPDATE`) supported cleanly on `listings` and `bids` during order acceptance.
* [x] **Comprehensive Constraint Bounds:** Check constraints enforce domain rules on purity ($70–99.99\%$), quantities ($>0$), and positive currency figures.
* [x] **Targeted Index Coverage:** Composite indexes align precisely with marketplace search parameters (`status, purity_percentage, reserve_price_ton`) and single-key B-Trees for authentication lookups.
* [x] **MVP Compatibility:** Schema captures 100% of the data requirements for the 10 MVP screens without introducing unneeded enterprise bloat.
