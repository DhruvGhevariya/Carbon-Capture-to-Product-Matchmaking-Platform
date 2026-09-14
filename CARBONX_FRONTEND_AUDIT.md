# CARBONX FRONTEND ARCHITECTURE & COMPONENT AUDIT
**Version 2.0.0 — Comprehensive Pre-Rebuild Assessment**

---

## 1. EXECUTIVE SUMMARY

The CarbonX frontend is built with **React 19**, **Vite 6**, **TypeScript 5.7**, **Tailwind CSS 3.4**, **Motion v13 (Framer Motion)**, and **Recharts**. The backend API is production-ready, fully locked, and exposes complete RESTful endpoints for seller listings, buyer marketplace sinks, algorithmic AI match recommendations, order management, transport logistics, and carbon intelligence data.

This audit evaluates the current frontend architecture to guide the Nexus Studio × Industrial Carbon Intelligence design overhaul without breaking backend contracts or user workflows.

---

## 2. SYSTEM ARCHITECTURE & LIBRARIES

### Framework & Build Tooling
- **React 19.0.0**: Functional components with hooks and React Router v7.
- **Vite 6.0.7**: Fast HMR and bundle compilation.
- **TypeScript 5.7.2**: Strict mode type checking across all models and services.
- **Tailwind CSS 3.4.17**: Utility-first CSS engine.

### Data Fetching & State
- **@tanstack/react-query 5.62.8**: Server-state management, cache invalidation, and optimistic mutations.
- **Axios 1.7.9**: Configured HTTP client with request/response interceptors (`src/services/api.ts`).

### Animation & Icons
- **Motion (Framer Motion) 13.2.0**: Spring physics, layout animations, exit transitions.
- **Lucide React 0.469.0**: Technical icon set.

---

## 3. ROUTING & PAGE INVENTORY

| Route Path | Page Component | Functional Purpose | Audit Classification |
| :--- | :--- | :--- | :--- |
| `/` | `LandingPage.tsx` | Platform overview & marketing hero | Redesign with Nexus Editorial Hero |
| `/login` | `LoginPage.tsx` | Auth portal (JWT/Demo login) | Upgrade to dark editorial card |
| `/seller/dashboard` | `SellerDashboardPage.tsx` | Point-Source Emitter control room | Redesign with Bento + CarbonFlow |
| `/seller/listings` | `SellerListingsPage.tsx` | Storage inventory ledger | Redesign with IndustrialDataTable |
| `/seller/listings/new` | `CreateListingPage.tsx` | Stack specs & flue gas form | Upgrade to multi-step technical form |
| `/discovery` | `DiscoveryFingerprintPage.tsx` | CO₂ spectrographic discovery | Upgrade with CO2Fingerprint radar |
| `/marketplace` | `MarketplacePage.tsx` | Off-Taker feedstock market | Redesign with Bento grid cards |
| `/marketplace/:id` | `SupplierDetailsPage.tsx` | Supplier stream deep-dive | Upgrade with sticky match storytelling |
| `/ai/recommend` | `AIRecommendationPage.tsx` | Matchmaking recommendation engine | Upgrade with MatchScore & breakdown |
| `/intelligence` | `CarbonIntelligencePage.tsx` | CCUS technologies & pathways DB | Upgrade with interactive pathway cards |
| `/logistics` | `LogisticsPage.tsx` | Transport & pipeline routing | Upgrade dark map & freight ledger |
| `/bids` & `/seller/bids` | `BidsPage.tsx` | Commercial offer negotiation | Upgrade with bid status badges |
| `/projects` | `PartnershipProjectsPage.tsx` | Joint venture execution | Redesign with IndustrialTimeline |
| `/orders` | `OrdersPage.tsx` | Offtake contract ledger | Upgrade with IndustrialDataTable |

---

## 4. COMPONENT EVALUATION

### A. Core Reusable Foundation Primitives (Worth Keeping & Enhancing)
- `NoiseOverlay.tsx`: 1.5% film grain overlay for editorial visual depth.
- `TechnicalGrid.tsx`: Low-opacity background grid overlay (`rgba(255,255,255,0.03)`).
- `Spotlight.tsx`: Radial spotlight element following pointer movement.
- `CustomCursor.tsx`: Desktop contextual cursor with spring physics and attribute states (`VIEW`, `SEARCH`, `COPILOT`).
- `MagneticButton.tsx`: Magnetic spring pull button for primary actions.
- `CommandCenter.tsx`: Global `Ctrl+K` command & search modal palette.

### B. Signature Scientific Components (Newly Built for CarbonX)
- `CarbonFlow.tsx`: CO₂ transformation pipeline (Source → Capture → Treatment → Utilization → Product → Avoided Emissions).
- `CO2Fingerprint.tsx`: Diagnostic spectrographic matrix for flue gas specifications.
- `MatchScore.tsx` & `MatchScoreBreakdown.tsx`: Count-up score hero with sub-score breakdown (Technical, Economic, Environmental, Geographic, TRL).
- `MatchExplanation.tsx`: Sticky storytelling narrative card explaining compatibility logic and technical warnings.
- `OpportunityBento.tsx`: Asymmetric bento grid layout for dashboard visual hero.
- `IndustrialTimeline.tsx`: Progressive milestone line illuminating active project lifecycle stages.
- `AIProcessingState.tsx` & `CopilotContext.tsx`: Native climate AI assistant reasoning state view.
- `IndustrialDataTable.tsx`: Enterprise dark table with sorting and `tabular-nums`.

---

## 5. TECHNICAL RISKS & MITIGATION STRATEGY

1. **Backend Non-Disruption Guarantee**: All API endpoints (`/api/v1/seller/dashboard`, `/api/v1/bids`, `/api/v1/listings`, `/api/v1/recommendations`) remain 100% untouched. Frontend components strictly map existing JSON response schemas.
2. **Performance Maintenance**: Heavy WebGL canvas or video backgrounds are avoided. Visual depth is created using GPU-accelerated CSS transforms, radial gradients, and lightweight noise overlays.
3. **Accessibility**: All interactive elements maintain keyboard accessibility (`Tab`, `Enter`, `Esc`, `Ctrl+K`), ARIA roles, and `prefers-reduced-motion` compliance.
