# CarbonX — Backend API Specification Document
**Project Name:** CarbonX  
**Tagline:** Transform Captured Carbon into Industrial Value  
**Event:** HackOut'26 (36-Hour Hackathon)  
**Document Version:** 8.0 (Phase 8 — RESTful API Contract & Backend Interface Specification)  
**Author:** Senior Backend Architect, FastAPI Solution Designer & API Lead  

---

## 1. Executive Summary

The CarbonX backend application programming interface (API) is engineered as a high-throughput, contract-first RESTful service powered by **FastAPI**. It serves as the single source of truth connecting client applications, the PostgreSQL persistence layer, the deterministic AI Match Engine, and the OpenStreetMap-based Logistics Service.

### Architectural API Principles
* **Predictable RESTful Hierarchy:** Resources are organized strictly by domain entities, adhering to standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
* **Strict Versioning (`/api/v1`):** All endpoints are prefixed under `/api/v1/` to ensure zero breaking changes for downstream consumers.
* **Strict JSON Representation:** All incoming request payloads and outgoing response bodies use standardized JSON formatting with `snake_case` keys.
* **Stateless Bearer JWT Authentication:** Requests to protected endpoints require an `Authorization: Bearer <token>` header, verified against cryptographically signed claims containing user ID, role, and enterprise affiliation.
* **Declarative Schema Validation:** Every payload is validated against strict boundaries before hitting application logic, returning standard HTTP `422 Unprocessable Entity` for schema deviations.
* **Deterministic Status Codes:** Consistent usage of semantic HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, and `500 Internal Error`).

---

## 2. API Domain Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              API DOMAIN ENDPOINT OVERVIEW                              │
├───────────────────┬────────────────┬───────────────────────────────────────────────────┤
│ Module Name       │ Endpoint Count │ Functional Operational Scope                      │
├───────────────────┼────────────────┼───────────────────────────────────────────────────┤
│ **Authentication**│ 3 Endpoints    │ Registration, login token issuance, active profile│
├───────────────────┼────────────────┼───────────────────────────────────────────────────┤
│ **Seller Domain** │ 5 Endpoints    │ Operational dashboard, batch creation & inventory │
├───────────────────┼────────────────┼───────────────────────────────────────────────────┤
│ **Marketplace**   │ 2 Endpoints    │ Filtered catalog feed and emitter stream details  │
├───────────────────┼────────────────┼───────────────────────────────────────────────────┤
│ **AI Engine**     │ 1 Endpoint     │ Multi-parametric match scoring and explainability │
├───────────────────┼────────────────┼───────────────────────────────────────────────────┤
│ **Logistics**     │ 1 Endpoint     │ Road distance, cryogenic freight & carbon debt    │
├───────────────────┼────────────────┼───────────────────────────────────────────────────┤
│ **Bidding**       │ 3 Endpoints    │ Offer submission, counter-party queue & decisions │
├───────────────────┼────────────────┼───────────────────────────────────────────────────┤
│ **Orders**        │ 3 Endpoints    │ Order contracts, fulfillment & status transitions │
├───────────────────┼────────────────┼───────────────────────────────────────────────────┤
│ **TOTAL**         │ 18 Endpoints   │ Complete RESTful MVP surface                      │
└───────────────────┴────────────────┴───────────────────────────────────────────────────┘
```

---

## 3. Authentication & Identity APIs

---

### 3.1 `POST /api/v1/auth/register`
* **Purpose:** Onboards a new industrial enterprise user with company profile and role designation.
* **Authentication:** Public (No Bearer Token required).
* **Request Headers:** `Content-Type: application/json`

#### Request Payload Table
| Field Name | Type | Required | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `full_name` | String | **Yes** | 2–150 characters | Legal user name |
| `email` | String | **Yes** | Valid RFC email | Corporate work email |
| `password` | String | **Yes** | 8–64 chars, $\ge 1$ number | Plaintext password to be hashed |
| `role` | String | **Yes** | Enum: `'seller'`, `'buyer'` | Platform role |
| `company_name` | String | **Yes** | 2–255 characters | Legal industrial company name |
| `industry_type`| String | **Yes** | E.g., 'Cement', 'Concrete' | Industrial sector |
| `location_name`| String | **Yes** | Industrial park or city | Plant address |
| `latitude` | Number | **Yes** | Float between -90.0 and 90.0 | Facility latitude |
| `longitude` | Number | **Yes** | Float between -180.0 and 180.0| Facility longitude |

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "company_id": "11111111-1111-1111-1111-111111111111",
    "full_name": "Rajesh K. Verma",
    "email": "rajesh.verma@ahmedabad.com",
    "role": "seller",
    "created_at": "2026-09-12T01:30:00Z"
  }
}
```

#### Error Responses
* `400 Bad Request`: Password fails security complexity rules.
* `409 Conflict`: Email address already registered.
* `422 Unprocessable Entity`: Coordinates out of geographic bounds.

---

### 3.2 `POST /api/v1/auth/login`
* **Purpose:** Authenticates user credentials and issues a signed JSON Web Token (JWT).
* **Authentication:** Public.

#### Request Payload Table
| Field Name | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `email` | String | **Yes** | Registered corporate email |
| `password` | String | **Yes** | Account password |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in_seconds": 28800,
    "user": {
      "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "full_name": "Rajesh K. Verma",
      "email": "rajesh.verma@ahmedabad.com",
      "role": "seller",
      "company_name": "Ahmedabad Cement Ltd"
    }
  }
}
```

#### Error Responses
* `401 Unauthorized`: Invalid email or password combination.
* `403 Forbidden`: Account deactivated by administrator.

---

### 3.3 `GET /api/v1/auth/me`
* **Purpose:** Returns the active authenticated user profile and associated plant profile.
* **Authentication:** Protected (Requires `Authorization: Bearer <token>`).

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "user_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "full_name": "Rajesh K. Verma",
    "email": "rajesh.verma@ahmedabad.com",
    "role": "seller",
    "company": {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Ahmedabad Cement Ltd",
      "industry": "Cement",
      "location": "Sanand Industrial Corridor, Gujarat",
      "coordinates": {
        "latitude": 22.9868,
        "longitude": 72.3814
      }
    }
  }
}
```

---

## 4. Seller Operations APIs

---

### 4.1 `GET /api/v1/seller/dashboard`
* **Purpose:** Aggregates operational plant metrics, buffer capacity, capture run-rates, and pending commercial bids.
* **Authentication:** Protected (Role: `seller`).

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "buffer_capacity": {
      "total_storage_tons": 240.0,
      "current_stored_tons": 178.0,
      "utilization_percentage": 74.17,
      "warning_threshold_exceeded": true,
      "hours_until_overflow": 14.2
    },
    "capture_telemetry": {
      "daily_run_rate_tons": 240.0,
      "average_purity_percentage": 96.5,
      "flaring_avoided_mtd_tons": 1840.0
    },
    "commercial_summary": {
      "active_listings_count": 2,
      "pending_bids_count": 3,
      "total_revenue_realized": 18400.0,
      "currency": "INR"
    }
  }
}
```

---

### 4.2 `POST /api/v1/listings`
* **Purpose:** Publishes a discrete captured CO₂ batch to the marketplace.
* **Authentication:** Protected (Role: `seller`).

#### Request Payload Table
| Field Name | Type | Required | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `volume_metric_tons`| Number | **Yes** | Float $> 0.0, \le 10000.0$ | Batch quantity |
| `purity_percentage` | Number | **Yes** | Float $70.00$ to $99.99$ | CO₂ concentration |
| `physical_state` | String | **Yes** | Enum: `'liquid'`, `'pressurized_gas'`| Physical phase |
| `reserve_price_ton` | Number | **Yes** | Float $> 0.0$ | Floor price per ton |
| `available_from` | String | **Yes** | ISO-8601 Date (`YYYY-MM-DD`)| Earliest dispatch |
| `available_until` | String | **Yes** | Date $\ge$ `available_from` | Buffer expiration |

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "listing_id": "L1111111-1111-1111-1111-111111111111",
    "seller_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "purity_percentage": 96.50,
    "volume_metric_tons": 120.00,
    "physical_state": "liquid",
    "reserve_price_ton": 65.00,
    "status": "available",
    "available_from": "2026-09-12",
    "available_until": "2026-09-19",
    "created_at": "2026-09-12T01:35:00Z"
  }
}
```

---

### 4.3 `GET /api/v1/listings`
* **Purpose:** Retrieves the seller's active, reserved, and sold inventory batches with optional pagination.
* **Authentication:** Protected (Role: `seller`).
* **Query Parameters:**
  * `status`: Optional string filter (`available`, `reserved`, `sold`).
  * `page`: Integer (Default: 1).
  * `limit`: Integer (Default: 20).

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "L1111111-1111-1111-1111-111111111111",
        "purity_percentage": 96.50,
        "volume_metric_tons": 120.00,
        "physical_state": "liquid",
        "reserve_price_ton": 65.00,
        "status": "available",
        "pending_bids_count": 1,
        "created_at": "2026-09-12T01:35:00Z"
      }
    ],
    "pagination": {
      "total_records": 1,
      "current_page": 1,
      "total_pages": 1
    }
  }
}
```

---

### 4.4 `PUT /api/v1/listings/{id}`
* **Purpose:** Updates listing volume, reserve price, or dates before a bid is accepted.
* **Authentication:** Protected (Role: `seller`).
* **Business Rule:** Rejects edits if listing status is `reserved` or `sold` (HTTP `409 Conflict`).

---

### 4.5 `DELETE /api/v1/listings/{id}`
* **Purpose:** Soft-deletes/cancels an unsold listing.
* **Authentication:** Protected (Role: `seller`).
* **Success Response:** `200 OK` with `{"success": true, "message": "Listing cancelled successfully."}`.

---

## 5. Buyer Marketplace APIs

---

### 5.1 `GET /api/v1/marketplace`
* **Purpose:** Retrieves a dynamic, filtered catalog of active point-source CO₂ streams.
* **Authentication:** Protected (Role: `buyer` or `seller`).

#### Query Parameters Table
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `min_purity` | Number | No | Minimum purity threshold (e.g., `90.0`) |
| `max_distance` | Number | No | Maximum haulage radius in km (e.g., `150.0`) |
| `min_price` | Number | No | Minimum base price filter |
| `max_price` | Number | No | Maximum base price filter |
| `physical_state`| String | No | Filter by `'liquid'` or `'pressurized_gas'` |
| `industry_type` | String | No | Filter by emitter sector (e.g., `'Cement'`) |
| `search` | String | No | Substring search across plant or location name |
| `sort_by` | String | No | `'ai_score'`, `'price_asc'`, `'distance_asc'` |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "listing_id": "L1111111-1111-1111-1111-111111111111",
        "company_name": "Ahmedabad Cement Ltd",
        "industry_type": "Cement",
        "location": "Sanand Industrial Corridor, Gujarat",
        "purity_percentage": 96.50,
        "volume_available_tons": 120.00,
        "physical_state": "liquid",
        "base_price_ton": 65.00,
        "distance_km": 42.0,
        "estimated_freight_ton": 14.20,
        "total_landed_cost_ton": 79.20,
        "ai_match_score": 94,
        "status": "available"
      }
    ],
    "count": 1
  }
}
```

---

### 5.2 `GET /api/v1/marketplace/{id}`
* **Purpose:** Returns comprehensive technical, chemical, and operational details for a specific batch.
* **Authentication:** Protected.

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "listing_id": "L1111111-1111-1111-1111-111111111111",
    "company": {
      "name": "Ahmedabad Cement Ltd",
      "industry": "Cement",
      "address": "Sanand Industrial Corridor, Gujarat",
      "coordinates": { "latitude": 22.9868, "longitude": 72.3814 }
    },
    "technical_specifications": {
      "purity_percentage": 96.50,
      "moisture_ppm": 8.0,
      "sulfur_oxides_sox_ppm": 0.0,
      "nitrogen_oxides_nox_ppm": 4.2,
      "physical_state": "liquid",
      "storage_pressure_bar": 18.5,
      "temperature_celsius": -24.0
    },
    "commercial_terms": {
      "available_tons": 120.00,
      "reserve_price_ton": 65.00,
      "loading_window": "2026-09-12 to 2026-09-19"
    },
    "supplier_performance": {
      "reliability_rating": 4.9,
      "total_orders_fulfilled": 14
    }
  }
}
```

---

## 6. AI Recommendation APIs

---

### 6.1 `POST /api/v1/ai/recommend`
* **Purpose:** Invokes the Phase 7 multi-parametric recommendation engine to score and rank candidate suppliers.
* **Authentication:** Protected (Role: `buyer`).

#### Request Payload Table
| Field Name | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `required_quantity_tons` | Number | **Yes** | Desired procurement volume (e.g., `80.0`) |
| `minimum_purity_floor` | Number | **Yes** | Strict minimum required purity (e.g., `90.0`) |
| `budget_ceiling_per_ton` | Number | **Yes** | Maximum acceptable landed cost (e.g., `95.0`) |
| `delivery_deadline` | String | **Yes** | Target date (`YYYY-MM-DD`) |
| `destination_latitude` | Number | **Yes** | Buyer plant latitude |
| `destination_longitude`| Number | **Yes** | Buyer plant longitude |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "top_recommendation": {
      "listing_id": "L1111111-1111-1111-1111-111111111111",
      "supplier_name": "Ahmedabad Cement Ltd",
      "match_score": 94,
      "confidence_score": 98.4,
      "compatibility_tier": "HIGH_MATCH",
      "purity_percentage": 96.50,
      "distance_km": 42.0,
      "total_landed_cost_ton": 79.20,
      "dimension_breakdown": {
        "purity_score": 96.0,
        "distance_score": 98.0,
        "price_score": 88.0,
        "quantity_score": 95.0,
        "delivery_score": 92.0,
        "reliability_score": 94.0
      },
      "explanation": "Ahmedabad Cement Ltd is recommended with a 94/100 score because its certified 96.5% purity exceeds your 90.0% threshold with zero sulfur content, and its 42 km proximity reduces cryogenic haulage costs by $34/ton compared to regional averages."
    },
    "ranked_alternatives": [
      {
        "listing_id": "L2222222-2222-2222-2222-222222222222",
        "supplier_name": "Baroda Bio-Refinery",
        "match_score": 88,
        "distance_km": 78.0,
        "total_landed_cost_ton": 85.40
      }
    ]
  }
}
```

---

## 7. Logistics Service APIs

---

### 7.1 `POST /api/v1/logistics/estimate`
* **Purpose:** Computes road haulage distance, cryogenic freight costs, and net transport carbon debt.
* **Authentication:** Protected.

#### Request Payload Table
| Field Name | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `origin_latitude` | Number | **Yes** | Emitter plant latitude |
| `origin_longitude` | Number | **Yes** | Emitter plant longitude |
| `destination_latitude` | Number | **Yes** | Buyer facility latitude |
| `destination_longitude`| Number | **Yes** | Buyer facility longitude |
| `volume_metric_tons` | Number | **Yes** | Transport volume |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "distance_km": 42.0,
    "transit_duration_hours": 1.2,
    "transport_cost_per_ton": 14.20,
    "total_freight_cost": 1136.00,
    "carbon_accounting": {
      "gross_co2_diverted_tons": 80.0,
      "diesel_haulage_emissions_tons": 0.0378,
      "net_abated_co2_tons": 79.9622,
      "emission_ratio_percentage": 0.047
    }
  }
}
```

---

## 8. Bidding & Negotiation APIs

---

### 8.1 `POST /api/v1/bids`
* **Purpose:** Submits a binding purchase bid against an available listing.
* **Authentication:** Protected (Role: `buyer`).

#### Request Payload Table
| Field Name | Type | Required | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `listing_id` | String | **Yes** | UUID | Target batch ID |
| `offered_price_ton` | Number | **Yes** | Float $> 0.0, \ge 0.70 \times \text{reserve}$| Bid unit price |
| `requested_quantity`| Number | **Yes** | Float $> 0.0, \le \text{batch volume}$ | Tons requested |
| `delivery_target` | String | **Yes** | ISO-8601 Date (`YYYY-MM-DD`) | Target date |

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "bid_id": "B1111111-1111-1111-1111-111111111111",
    "listing_id": "L1111111-1111-1111-1111-111111111111",
    "buyer_id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
    "offered_price_ton": 65.00,
    "requested_quantity": 80.00,
    "total_offered_value": 5200.00,
    "status": "pending",
    "created_at": "2026-09-12T01:40:00Z"
  }
}
```

---

### 8.2 `GET /api/v1/bids`
* **Purpose:** Retrieves bids filtered by user role:
  * *Seller:* Returns incoming bids on the seller's active listings.
  * *Buyer:* Returns outgoing bids placed by the buyer.
* **Authentication:** Protected.

---

### 8.3 `PATCH /api/v1/bids/{id}`
* **Purpose:** Allows a seller to accept or decline a pending commercial bid.
* **Authentication:** Protected (Role: `seller`).

#### Request Payload Table
| Field Name | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `action` | String | **Yes** | Enum: `'accept'`, `'reject'` |

#### Success Response (`200 OK` on Acceptance)
```json
{
  "success": true,
  "data": {
    "bid_id": "B1111111-1111-1111-1111-111111111111",
    "status": "accepted",
    "order_id": "O1111111-1111-1111-1111-111111111111",
    "message": "Bid accepted successfully. Commercial order generated."
  }
}
```

---

## 9. Order & Fulfillment APIs

---

### 9.1 `GET /api/v1/orders`
* **Purpose:** Returns confirmed commercial contracts for the authenticated user.
* **Authentication:** Protected (Both roles).

---

### 9.2 `GET /api/v1/orders/{id}`
* **Purpose:** Retrieves full order details, digital bill of lading, and verified gas assay sheet.
* **Authentication:** Protected (Authorized buyer or seller only).

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "order_id": "O1111111-1111-1111-1111-111111111111",
    "order_reference": "#CX-8842-OD",
    "status": "confirmed",
    "seller": { "name": "Ahmedabad Cement Ltd", "location": "Sanand, Gujarat" },
    "buyer": { "name": "GreenGrow Gujarat Ltd", "location": "Kheda, Gujarat" },
    "commercial_terms": {
      "quantity_metric_tons": 80.00,
      "commodity_price_ton": 65.00,
      "total_order_value": 5200.00,
      "scheduled_pickup_window": "Wednesday, 08:00 - 12:00 IST"
    },
    "technical_spec_sheet": {
      "purity_percentage": 96.50,
      "physical_state": "liquid"
    },
    "confirmed_at": "2026-09-12T01:42:00Z"
  }
}
```

---

### 9.3 `PATCH /api/v1/orders/{id}`
* **Purpose:** Updates order fulfillment state along the linear lifecycle.
* **Authentication:** Protected.
* **Allowed Transitions:** `confirmed` $\rightarrow$ `in_transit` $\rightarrow$ `completed`. Any out-of-order transition returns `400 Bad Request`.

---

## 10. Request & Response Entity Schemas

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              STANDARDIZED RESPONSE ENVELOPE                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SUCCESS: { "success": true, "data": { ... } }                                          │
│ ERROR:   { "success": false, "error": { "code": "...", "message": "..." } }           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 10.1 Schema: `ListingModel`
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique batch identifier |
| `seller_id` | UUID | User ID of the emitter operator |
| `purity_percentage` | Float | Certified CO₂ concentration (70.00–99.99%) |
| `volume_metric_tons`| Float | Available batch quantity in tons |
| `physical_state` | String | `'liquid'` or `'pressurized_gas'` |
| `reserve_price_ton` | Float | Base floor price |
| `status` | String | `'available'`, `'reserved'`, `'sold'` |

### 10.2 Schema: `BidModel`
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique bid identifier |
| `listing_id` | UUID | Associated batch listing ID |
| `buyer_id` | UUID | User ID of bidding procurement manager |
| `offered_price_ton` | Float | Buyer's offered price per ton |
| `requested_quantity`| Float | Desired volume in metric tons |
| `status` | String | `'pending'`, `'accepted'`, `'rejected'` |

### 10.3 Schema: `OrderModel`
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique order identifier |
| `order_reference` | String | Human-readable ID (e.g., `#CX-8842`) |
| `bid_id` | UUID | Unique originating bid ID |
| `final_price_ton` | Float | Agreed purchase price |
| `quantity_tons` | Float | Total delivered quantity |
| `order_status` | String | `'confirmed'`, `'in_transit'`, `'completed'` |

---

## 11. Error Handling & Standardized Error Envelope

All API errors return a uniform error object:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PURITY_THRESHOLD",
    "message": "Purity percentage must be between 70.00% and 99.99%.",
    "status_code": 422,
    "timestamp": "2026-09-12T01:45:00Z"
  }
}
```

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              HTTP STATUS CODE SPECIFICATION                            │
├─────────────┬──────────────────────────┬───────────────────────────────────────────────┤
│ Status Code │ Error Identifier         │ Typical API Trigger Condition                 │
├─────────────┼──────────────────────────┼───────────────────────────────────────────────┤
│ **400**     │ `BAD_REQUEST`            │ Malformed business action or invalid state    │
│             │                          │ transition (e.g., jumping order to completed).│
├─────────────┼──────────────────────────┼───────────────────────────────────────────────┤
│ **401**     │ `UNAUTHORIZED`           │ Missing, expired, or invalid JWT bearer token.│
├─────────────┼──────────────────────────┼───────────────────────────────────────────────┤
│ **403**     │ `FORBIDDEN`              │ Role mismatch (e.g., Buyer calling create     │
│             │                          │ listing endpoint).                            │
├─────────────┼──────────────────────────┼───────────────────────────────────────────────┤
│ **404**     │ `NOT_FOUND`              │ Resource ID does not exist in the database.   │
├─────────────┼──────────────────────────┼───────────────────────────────────────────────┤
│ **409**     │ `CONFLICT`               │ Race condition: modifying an already reserved │
│             │                          │ listing or accepting an expired bid.          │
├─────────────┼──────────────────────────┼───────────────────────────────────────────────┤
│ **422**     │ `UNPROCESSABLE_ENTITY`   │ Pydantic validation failure on field bounds.  │
├─────────────┼──────────────────────────┼───────────────────────────────────────────────┤
│ **500**     │ `INTERNAL_SERVER_ERROR`  │ Unhandled exception; logged with request ID.  │
└─────────────┴──────────────────────────┴───────────────────────────────────────────────┘
```

---

## 12. Role-Based Access Control (RBAC) Permissions Matrix

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              RBAC AUTHORIZATION MATRIX                                 │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│ Platform Operation       │ Industrial Seller        │ Circular Buyer                   │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ `POST /listings`         │ **YES (Permitted)**      │ NO (HTTP 403 Forbidden)          │
│ `GET /marketplace`       │ **YES (Permitted)**      │ **YES (Permitted)**              │
│ `POST /ai/recommend`     │ **YES (Permitted)**      │ **YES (Permitted)**              │
│ `POST /bids`             │ NO (HTTP 403 Forbidden)  │ **YES (Permitted)**              │
│ `PATCH /bids/{id}`       │ **YES (Accept/Reject)**  │ NO (HTTP 403 Forbidden)          │
│ `PATCH /orders/{id}`     │ **YES (Advance Status)** │ NO (Read-Only)                   │
└──────────────────────────┴──────────────────────────┴──────────────────────────────────┘
```

---

## 13. API Sequence Diagrams

```
+----------------------------------------------------------------------------------------------------+
|                                    END-TO-END TRANSACTION SEQUENCE                                 |
+----------------------------------------------------------------------------------------------------+

[ SELLER ]                  [ FASTAPI REST API ]               [ AI ENGINE ]               [ BUYER ]
    │                                 │                              │                         │
    │ 1. POST /api/v1/listings        │                              │                         │
    │    (120 t, 96.5% Purity, $65/t) │                              │                         │
    │────────────────────────────────►│                              │                         │
    │ 2. HTTP 201 Created (Batch ID)  │                              │                         │
    │◄────────────────────────────────│                              │                         │
    │                                 │                              │                         │
    │                                 │ 3. POST /api/v1/ai/recommend │                         │
    │                                 │    (Demand: 80 t, Min 90%)   │                         │
    │                                 │◄───────────────────────────────────────────────────────│
    │                                 │                              │                         │
    │                                 │ 4. Score Candidate Pool      │                         │
    │                                 │─────────────────────────────►│                         │
    │                                 │ 5. Returns Score: 94 + XAI   │                         │
    │                                 │◄─────────────────────────────│                         │
    │                                 │                                                        │
    │                                 │ 6. HTTP 200 OK (Ranked List with Top Match: 94/100)    │
    │                                 │───────────────────────────────────────────────────────►│
    │                                 │                                                        │
    │                                 │ 7. POST /api/v1/bids (80 t at $65/ton)                 │
    │                                 │◄───────────────────────────────────────────────────────│
    │                                 │                                                        │
    │ 8. Broadcasts New Bid Event     │ 9. HTTP 201 Created (Bid ID)                           │
    │◄────────────────────────────────│───────────────────────────────────────────────────────►│
    │                                 │                                                        │
    │ 10. PATCH /api/v1/bids/{id}     │                                                        │
    │     (action: 'accept')          │                                                        │
    │────────────────────────────────►│                                                        │
    │                                 │                                                        │
    │ 11. Executes ACID Transaction   │                                                        │
    │     - Locks Listing Row         │                                                        │
    │     - Generates Order #CX-8842  │                                                        │
    │                                 │                                                        │
    │ 12. HTTP 200 OK (Order Payload) │ 13. Emits Order Confirmed Event                        │
    │◄────────────────────────────────│───────────────────────────────────────────────────────►│
```

---

## 14. Backend Testing & Verification Checklist

Before certifying the API for frontend consumption, each verification step must pass:

* [x] **Authentication Cycle:** `POST /auth/register` creates account $\rightarrow$ `POST /auth/login` returns valid JWT $\rightarrow$ `GET /auth/me` decodes claims with 100% accuracy.
* [x] **Listing Creation & Bounds:** `POST /listings` accepts valid inputs ($70–99.99\%$); rejects purity $<70\%$ or volume $\le 0$ with `422 Unprocessable Entity`.
* [x] **Marketplace Filters:** `GET /marketplace?min_purity=90` excludes all batches below 90% purity in sub-10ms query execution.
* [x] **AI Recommendation Verification:** `POST /ai/recommend` outputs deterministic 0–100 scores and returns non-empty natural language rationale text.
* [x] **Logistics Validation:** `POST /logistics/estimate` outputs realistic road distance and positive net carbon avoided ($> 0$).
* [x] **Bidding Safeguards:** `POST /bids` rejects bids priced at $< 70\%$ of seller reserve price with `400 Bad Request`.
* [x] **ACID Acceptance Gate:** Accepting a bid atomically locks the listing volume and transitions the bid state to `accepted` without race conditions.
* [x] **Fulfillment State Machine:** `PATCH /orders/{id}` allows only linear progression (`confirmed` $\rightarrow$ `in_transit` $\rightarrow$ `completed`).
