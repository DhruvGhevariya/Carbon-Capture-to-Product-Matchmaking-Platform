# CarbonX Backend Platform Architecture

> **Modular, Scalable, Domain-Engine Powered Backend Service**

The CarbonX backend is an asynchronous Python service built on **FastAPI**, **SQLAlchemy 2.0 (Async)**, and **Pydantic v2**. It powers multi-criteria CO₂ matchmaking, Life Cycle Assessment (LCA) carbon accounting, financial scenario modeling, B2B marketplace trading, and conversational AI copilot workflows.

---

## 🏛️ Architecture Overview

```text
                               ┌─────────────────────┐
                               │     REST Clients    │
                               │ (React 19 Frontend) │
                               └──────────┬──────────┘
                                          │ Async REST JSON
                                          ▼
                               ┌─────────────────────┐
                               │      FastAPI        │
                               │     API Gateway     │
                               └──────────┬──────────┘
                                          │
             ┌────────────────────────────┼────────────────────────────┐
             │                            │                            │
             ▼                            ▼                            ▼
      Authentication                Domain Engines               Services Layer
   (JWT, Bcrypt, Roles)          (Matching, Carbon, Econ)     (Auth, CO2, Marketplace)
             │                            │                            │
             └────────────────────────────┼────────────────────────────┘
                                          │
                                          ▼
                               ┌─────────────────────┐
                               │  SQLAlchemy 2.0 ORM │
                               └──────────┬──────────┘
                                          │
                                          ▼
                               ┌─────────────────────┐
                               │ PostgreSQL / SQLite │
                               └─────────────────────┘
```

---

## 🧠 Domain Engines Summary

### 1. CO₂ Fingerprint Engine (`app/engines/fingerprint/fingerprint_engine.py`)
- Evaluates raw CO₂ stream attributes (`purity`, `volume`, `pressure`, `temperature`).
- Computes normalized quality sub-scores and readiness tiers (`READY`, `CONDITIONALLY_READY`, `REQUIRES_TREATMENT`, `NOT_READY`).
- Maps stream purity to industrial utilization grades (*Food Grade*, *Chemical Synthesis*, *Concrete Mineralization*).

### 2. Multi-Criteria Matchmaking Engine (`app/engines/matching/match_engine.py`)
- Evaluates hard constraints (*Minimum Purity Floor*, *Minimum Volume Threshold*, *600 km Max Distance Radius*).
- Applies configurable weighted scoring:
  - **Technical Purity Fit**: 30%
  - **Economic Landed Price**: 25%
  - **Environmental Footprint**: 20%
  - **Geographic Distance**: 15%
  - **TRL Maturity**: 10%
- Generates Explainable AI (XAI) natural language rationales, confidence ratings, and warnings.

### 3. LCA Carbon Balance Engine (`app/engines/carbon/carbon_engine.py`)
- Deterministic calculation of gross CO₂ captured, conversion efficiency yield, transport heavy trucking emissions, and net avoided carbon.

### 4. Financial Scenario Engine (`app/engines/economics/economic_engine.py`)
- Models CAPEX, OPEX, freight cost, annual revenue, gross margin, payback period, and 10-year NPV across **Conservative**, **Base**, and **Optimistic** scenarios.

---

## 📂 Backend Folder Structure

```text
backend/
├── app/
│   ├── core/                  # Configuration, Database Engine, Security, Exceptions, Dependencies
│   │   ├── config.py          # Pydantic Settings & Environment Variables
│   │   ├── database.py        # Async Session Engine & Lifecycle
│   │   ├── security.py        # Bcrypt Password Hashing & JWT Tokens
│   │   ├── exceptions.py      # Standardized Error Handling
│   │   └── dependencies.py    # Role Authorization & Current User Injectors
│   ├── models/                # SQLAlchemy 2.0 ORM Entities
│   │   ├── domain.py          # Organization, User, CO2Source, Profile, Listing, Bid, Order, Match
│   │   └── __init__.py        # Export Aliases
│   ├── schemas/               # Pydantic v2 Request/Response Validation Schemas
│   │   ├── domain_schemas.py  # Input/Output Data Contracts
│   │   └── __init__.py
│   ├── engines/               # Core Domain Engines
│   │   ├── fingerprint/       # Stream Quality & Grade Classification
│   │   ├── matching/          # Deterministic Multi-Criteria Matchmaker
│   │   ├── carbon/            # LCA Carbon Balance
│   │   └── economics/         # Financial Scenario Simulator
│   ├── api/                   # REST API Routers
│   │   ├── v1/
│   │   │   ├── auth.py
│   │   │   ├── co2_sources.py
│   │   │   ├── technologies_products_pathways.py
│   │   │   ├── matching.py
│   │   │   ├── calculations.py
│   │   │   ├── marketplace.py
│   │   │   └── copilot_analytics_notifications.py
│   │   └── __init__.py
│   └── main.py                # FastAPI Entry point, CORS & Error Handlers
├── tests/                     # Pytest Test Suite
│   ├── test_engines.py
│   └── test_api.py
├── alembic/                   # Database Migrations Setup
├── alembic.ini
├── Dockerfile                 # Backend Container Build Script
├── requirements.txt           # Python Dependencies
└── seed.py                    # Idempotent Database Seeder
```

---

## ⚡ Quick Start & Commands

### 1. Initialize & Seed Database
```bash
python seed.py
```

### 2. Run API Dev Server
```bash
uvicorn app.main:app --reload --port 8000
```
*API Documentation available at `http://127.0.0.1:8000/docs`.*

### 3. Run Test Suite
```bash
pytest tests/
```

---

## 🐳 Docker Deployment

To launch the full backend stack with PostgreSQL and Redis:

```bash
docker-compose up --build -d
```
