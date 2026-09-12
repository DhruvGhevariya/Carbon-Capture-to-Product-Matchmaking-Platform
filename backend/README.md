# CarbonX Backend API

AI-Powered Carbon Capture-to-Product Matchmaking Platform Backend Service.

---

## Technology Stack

* **Language:** Python 3.12+
* **Framework:** FastAPI (Asynchronous ASGI)
* **ORM:** SQLAlchemy 2.0 (Async)
* **Database:** PostgreSQL (with SQLite async compatibility for local zero-dependency testing)
* **Validation:** Pydantic v2
* **Security:** JWT (python-jose) + salted Bcrypt (passlib)
* **API Documentation:** OpenAPI / Swagger UI

---

## Directory Structure

```
backend/
├── app/
│   ├── api/                  # RESTful API routers
│   │   ├── auth.py           # Registration, login, profile
│   │   ├── seller.py         # Dashboard, listings CRUD
│   │   ├── marketplace.py    # Catalog feed & stream specs
│   │   ├── ai.py             # Matchmaking recommendation
│   │   ├── bids.py           # Bidding & acceptance workflow
│   │   ├── orders.py         # Order management & fulfillment
│   │   └── logistics.py      # Route & carbon calculation
│   ├── models/               # SQLAlchemy 2.0 ORM entities
│   │   ├── company.py
│   │   ├── user.py
│   │   ├── listing.py
│   │   ├── bid.py
│   │   ├── order.py
│   │   ├── ai_match.py
│   │   └── logistics.py
│   ├── schemas/              # Pydantic v2 request & response models
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── listing.py
│   │   ├── bid.py
│   │   ├── order.py
│   │   ├── ai.py
│   │   └── logistics.py
│   ├── services/             # Core business logic
│   │   ├── auth_service.py
│   │   ├── ai_service.py     # Deterministic AI recommendation engine
│   │   └── logistics_service.py # Geospatial & carbon calculation
│   ├── config.py             # Pydantic settings & environment variables
│   ├── database.py           # Async engine & session management
│   ├── security.py           # Password hashing & JWT token guards
│   └── main.py               # FastAPI application entry point
├── requirements.txt          # Production dependencies
├── .env.example              # Environment variables template
├── seed.py                   # Realistic Indian industrial seed script
└── README.md
```

---

## Local PostgreSQL Setup

Follow these steps to set up and run the CarbonX backend with PostgreSQL locally:

1. **Create and activate the virtual environment:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and set your PostgreSQL credentials:
   ```bash
   cp .env.example .env
   ```
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/carbonx
   SYNC_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/carbonx
   SECRET_KEY=change-this-secret-key
   ALLOWED_ORIGINS=http://localhost:5173
   ```

4. **Initialize the database (creates database and all tables):**
   ```bash
   python scripts/init_db.py
   ```

5. **Start the API server:**
   ```bash
   uvicorn app.main:app --reload
   ```

6. **Interactive Swagger Documentation:**
   Explore and test endpoints at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Getting Started

### 1. Prerequisites
* Python 3.10+ (Recommended: Python 3.12)
* PostgreSQL 15+

### 2. Run the API Server

```bash
uvicorn app.main:app --reload --port 8000
```

* **Interactive Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **ReDoc Documentation:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
* **Health Check:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## Core API Endpoints

| Domain | Method | Endpoint | Description |
| :--- | :---: | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Register new user and enterprise |
| | `POST` | `/api/v1/auth/login` | Issue 8-hour JWT Bearer token |
| | `GET` | `/api/v1/auth/me` | Fetch active user profile |
| **Seller** | `GET` | `/api/v1/seller/dashboard` | Plant buffer gauge & capture stats |
| | `POST` | `/api/v1/listings` | Publish new point-source CO₂ batch |
| | `GET` | `/api/v1/listings` | View active inventory |
| | `PUT` | `/api/v1/listings/{id}` | Update listing parameters |
| | `DELETE`| `/api/v1/listings/{id}` | Cancel active listing |
| **Marketplace** | `GET` | `/api/v1/marketplace` | Filtered CO₂ catalog with distances |
| | `GET` | `/api/v1/marketplace/{id}`| Gas spec sheet & emitter profile |
| **AI Match** | `POST` | `/api/v1/ai/recommend` | Multi-parametric scoring & XAI |
| **Logistics** | `POST` | `/api/v1/logistics/estimate`| Road freight & carbon accounting |
| **Bids** | `POST` | `/api/v1/bids` | Submit binding purchase bid |
| | `GET` | `/api/v1/bids` | View incoming / outgoing bids |
| | `PATCH`| `/api/v1/bids/{id}` | Accept or decline bid (generates order)|
| **Orders** | `GET` | `/api/v1/orders` | View confirmed contracts |
| | `GET` | `/api/v1/orders/{id}` | Digital Bill of Lading & specs |
| | `PATCH`| `/api/v1/orders/{id}` | Update status (`in_transit` $\rightarrow$ `completed`)|

---

## AI Match Score Engine

The recommendation engine (`app/services/ai_service.py`) evaluates candidate batches using the Phase 7 multi-criteria optimization model:
* **CO₂ Purity:** 30%
* **Distance & Logistics:** 25%
* **Delivered Landed Cost:** 20%
* **Quantity Fit:** 10%
* **Delivery Lead Time:** 10%
* **Supplier Reliability:** 5%

It enforces hard disqualification gates (e.g., purity deficiencies, $>500$ km distance) before computing normalized scores (0–100) and generating explainable natural language rationales.
