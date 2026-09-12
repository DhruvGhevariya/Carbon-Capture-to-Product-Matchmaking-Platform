# CarbonX — Carbon Capture-to-Product Matchmaking Platform

CarbonX (CarbonLink AI) is an enterprise marketplace connecting industrial CO₂ emitters with off-takers and conversion innovators. It pairs suppliers and commercial buyers by chemical purity grade, liquefaction pressure, geographical proximity, real-time logistics feasibility, pricing thresholds, and circular carbon impact metrics.

---

## ⚡ Quick Start (1-Click Run on Windows)

Simply double-click or run:
```cmd
run.bat
```

This automated launcher will:
1. Detect **Python** (3.10+) and **Node.js / npm** (v18+).
2. Set up the Python virtual environment in `backend\.venv` and install all dependencies.
3. Configure `backend\.env` with database settings.
4. Verify and initialize PostgreSQL database tables (`carbonx`).
5. Install frontend `npm` dependencies.
6. Launch the **Backend FastAPI server** at `http://127.0.0.1:8000`.
7. Launch the **Frontend Vite React app** at `http://localhost:5173`.
8. Automatically open `http://localhost:5173` in your default browser.

To stop all servers at any time, run:
```cmd
stop.bat
```

---

## 👥 Seeded Demo Accounts

You can immediately test the platform using the pre-seeded enterprise accounts:

| Role | Company | Email | Password |
|---|---|---|---|
| **Seller (Emitter)** | UltraTech Cement | `rajesh.verma@ultratech.com` | `password123` |
| **Seller (Emitter)** | Ambuja Cement | `suresh.s@ambujacement.com` | `password123` |
| **Seller (Emitter)** | Tata Steel | `p.patnaik@tatasteel.com` | `password123` |
| **Buyer (Off-Taker)** | GreenGrow Chemicals | `ananya.s@greengrow.in` | `password123` |
| **Buyer (Off-Taker)** | EcoBuild Materials | `vikram.m@ecobuild.in` | `password123` |
| **Buyer (Off-Taker)** | CarbonFuel Labs | `rohan.d@carbonfuel.tech` | `password123` |

---

## 🏗️ Architecture & Technology Stack

- **Backend**: FastAPI, SQLAlchemy 2.0 (asyncpg / psycopg2), Pydantic v2, Python-Jose (JWT Auth), Bcrypt.
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, TanStack React Query, Lucide Icons, Leaflet Maps, Recharts.
- **Database**: PostgreSQL 13+ (Database name: `carbonx`).
- **Interactive Documentation**: Available at `http://127.0.0.1:8000/docs` when the backend is running.
