# CarbonX — UI/UX Design Specification
**Project Name:** CarbonX  
**Tagline:** Transform Captured Carbon into Industrial Value  
**Event:** HackOut'26 (36-Hour Hackathon)  
**Document Version:** 4.0 (Phase 4 — Enterprise Design System & UI/UX Specification)  
**Target Audience:** Frontend Engineers, UI/UX Designers, Product Architects, Hackathon Evaluators  

---

## 1. Design System

The CarbonX visual language is calibrated for enterprise B2B mission-critical operations. Taking direct inspiration from high-utility industrial platforms such as Stripe Dashboard, Flexport, and Linear, the design emphasizes data density, legibility under varied lighting conditions, structured hierarchy, and functional restraint.

---

### 1.1 Color Palette

The color tokens are structured into semantic tiers using an Emerald Green sustainability anchor complemented by an industrial Blue secondary tier and high-contrast Slate/Gray neutrals.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               COLOR PALETTE OVERVIEW                                   │
├───────────────────┬───────────┬────────────────────────────────────────────────────────┤
│ Token Name        │ Hex Value │ Semantic Role                                          │
├───────────────────┼───────────┼────────────────────────────────────────────────────────┤
│ Primary 900       │ #064E3B   │ Deep Emerald - Active headers, high-emphasis branding  │
│ Primary 700       │ #047857   │ Brand Emerald - Primary button hover, active links     │
│ Primary 600       │ #059669   │ Core Brand Emerald - Primary CTA, badges, checkmarks   │
│ Primary 500       │ #10B981   │ Light Emerald - High-score indicators, accents         │
│ Primary 50        │ #ECFDF5   │ Mint Tint - Card highlight backgrounds, tag fills      │
├───────────────────┼───────────┼────────────────────────────────────────────────────────┤
│ Secondary 700     │ #1D4ED8   │ Deep Blue - Secondary action active, analytical charts │
│ Secondary 600     │ #2563EB   │ Tech Blue - Data links, secondary CTAs, focus rings    │
│ Secondary 50      │ #EFF6FF   │ Ice Blue Tint - Informational banners, filter pills    │
├───────────────────┼───────────┼────────────────────────────────────────────────────────┤
│ Neutral 950       │ #0F172A   │ Slate 950 - Primary headings, extreme contrast text    │
│ Neutral 800       │ #1E293B   │ Slate 800 - Standard body text, card titles            │
│ Neutral 600       │ #475569   │ Slate 600 - Secondary text, table headers, captions    │
│ Neutral 400       │ #94A3B8   │ Slate 400 - Placeholder text, disabled icon fills      │
│ Neutral 200       │ #E2E8F0   │ Slate 200 - Primary borders, dividers, subtle outlines │
│ Neutral 100       │ #F1F5F9   │ Slate 100 - Table zebra rows, secondary button fills   │
│ Neutral 50        │ #F8FAFC   │ Slate 50 - Canvas background, inactive card surfaces   │
│ Surface White     │ #FFFFFF   │ Pure White - Card background, modal surface, inputs    │
├───────────────────┼───────────┼────────────────────────────────────────────────────────┤
│ Success 600       │ #16A34A   │ Forest Green - Confirmed orders, high purity tags      │
│ Success 50        │ #F0FDF4   │ Success Green Tint - Success notification banner fills │
│ Warning 600       │ #D97706   │ Amber - Moderate score badge, storage 75%+ alerts      │
│ Warning 50        │ #FFFBEB   │ Amber Tint - Flaring warning banners, caution notices  │
│ Error 600         │ #DC2626   │ Crimson - Incompatible gas alerts, rejected bids       │
│ Error 50          │ #FEF2F2   │ Error Tint - Hard validation failure backgrounds       │
└───────────────────┴───────────┴────────────────────────────────────────────────────────┘
```

---

### 1.2 Typography Hierarchy

The typographic system utilizes **Inter** via Google Fonts, selected for its tall x-height, neutral geometric construction, and legibility in dense data tables and numerical telemetry readouts.

| Style Tier | Font Family | Size | Weight | Line Height | Tracking | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | Inter | 36px | 700 (Bold) | 44px | -0.025em | Landing Page Hero, Macro Impact Numbers |
| **H1** | Inter | 28px | 700 (Bold) | 36px | -0.02em | Main Page Titles (e.g., "Seller Inventory") |
| **H2** | Inter | 22px | 600 (Semi-Bold) | 28px | -0.015em | Section Titles, Modal Headers |
| **H3** | Inter | 18px | 600 (Semi-Bold) | 24px | -0.01em | Card Titles, Drawer Headers |
| **Body Large** | Inter | 16px | 500 (Medium) | 24px | 0.0em | Featured Summaries, Hero Subtitles |
| **Body Regular** | Inter | 14px | 400 (Regular) | 20px | 0.0em | Standard Body, Form Inputs, Table Cells |
| **Body Medium** | Inter | 14px | 500 (Medium) | 20px | 0.0em | Table Headers, Button Labels, Strong Text |
| **Caption** | Inter | 12px | 500 (Medium) | 16px | +0.01em | Metadata, Timestamp, Tooltip, Input Helper |
| **Mono Number** | Inter Tabular | 14px | 600 (Semi-Bold) | 20px | -0.01em | Purity %, Metric Tons, Dollar Amounts |

---

### 1.3 Spacing Scale (8px Grid)

CarbonX adheres to an 8-point base spatial grid to ensure layout rhythm across all enterprise views:

| Token | Dimension | Practical Layout Application |
| :--- | :--- | :--- |
| `space-1` | 4px | Tight badge padding, icon-to-label gaps, border offsets |
| `space-2` | 8px | Button inline padding, input field inner padding, pill gaps |
| `space-3` | 12px | Compact cell padding, tag groupings |
| `space-4` | 16px | Standard card inner padding, input margin bottom, grid gutters |
| `space-5` | 20px | Form field vertical rhythm |
| `space-6` | 24px | Large card padding, dashboard widget gaps, modal body padding |
| `space-8` | 32px | Section vertical spacing, table bottom separation |
| `space-10`| 40px | Header bar height offsets, major module divisions |
| `space-12`| 48px | Page-level top and bottom padding |
| `space-16`| 64px | Landing page hero vertical rhythm |

---

### 1.4 Border Radius Scale

```
┌─────────────────┬───────────┬──────────────────────────────────────────┐
│ Token           │ Radius    │ Element Target                           │
├─────────────────┼───────────┼──────────────────────────────────────────┤
│ `radius-sm`     │ 4px       │ Badges, status tags, table cell pills    │
│ `radius-md`     │ 8px       │ Buttons, input fields, dropdown menus    │
│ `radius-lg`     │ 12px      │ Standard dashboard cards, list items     │
│ `radius-xl`     │ 16px      │ Modal containers, AI recommendation hero │
│ `radius-full`   │ 9999px    │ Avatars, circular match gauges, pills    │
└─────────────────┴───────────┴──────────────────────────────────────────┘
```

---

### 1.5 Elevation & Shadow System

All shadows are rendered using cool Slate undertones (`rgba(15, 23, 42, X)`) rather than harsh pure black, providing subtle structural depth without visual distraction:

* **Level 1 (Card Default):**  
  `0px 1px 3px rgba(15, 23, 42, 0.08), 0px 1px 2px rgba(15, 23, 42, 0.04)`  
  *Usage:* Static dashboard cards, table containers, search bars.
* **Level 2 (Card Hover / Active):**  
  `0px 4px 12px rgba(15, 23, 42, 0.08), 0px 2px 4px rgba(15, 23, 42, 0.04)`  
  *Usage:* Marketplace card hover state, selectable supplier items.
* **Level 3 (Floating Panel / Dropdown):**  
  `0px 10px 25px rgba(15, 23, 42, 0.10), 0px 4px 10px rgba(15, 23, 42, 0.05)`  
  *Usage:* Filter popovers, date picker dropdowns, persistent bottom action bars.
* **Level 4 (Modal Dialog):**  
  `0px 20px 35px rgba(15, 23, 42, 0.16), 0px 8px 16px rgba(15, 23, 42, 0.08)`  
  *Usage:* Create listing modal, bid submission confirmation drawer.

---

## 2. Component Library Specifications

---

### 2.1 Buttons

```
┌────────────────────────────────────────────────────────────────────────┐
│                            BUTTON STATES                               │
├───────────┬──────────────┬──────────────┬──────────────┬───────────────┤
│ Variant   │ Default      │ Hover        │ Disabled     │ Loading       │
├───────────┼──────────────┼──────────────┼──────────────┼───────────────┤
│ Primary   │ Bg: #059669  │ Bg: #047857  │ Bg: #E2E8F0  │ Spinner +     │
│           │ Text: White  │ Text: White  │ Text: #94A3B8│ Opacity: 0.8  │
├───────────┼──────────────┼──────────────┼──────────────┼───────────────┤
│ Secondary │ Bg: #F1F5F9  │ Bg: #E2E8F0  │ Bg: #F8FAFC  │ Spinner +     │
│           │ Text: #1E293B│ Text: #0F172A│ Text: #94A3B8│ Opacity: 0.8  │
├───────────┼──────────────┼──────────────┼──────────────┼───────────────┤
│ Outline   │ Border: #E2E8│ Border: #94A3│ Border: #E2E8│ Spinner +     │
│           │ Text: #1E293B│ Text: #0F172A│ Text: #94A3B8│ Opacity: 0.8  │
├───────────┼──────────────┼──────────────┼──────────────┼───────────────┤
│ Danger    │ Bg: #DC2626  │ Bg: #B91C1C  │ Bg: #FEE2E2  │ Spinner +     │
│           │ Text: White  │ Text: White  │ Text: #FCA5A5│ Opacity: 0.8  │
└───────────┴──────────────┴──────────────┴──────────────┴───────────────┘
```

* **Physical Dimensions:** Height: 40px (Standard Desktop), Padding: 0 16px, Border Radius: 8px, Font: 14px Semi-Bold (Inter).
* **Focus Ring:** 2px solid `#2563EB` with 2px offset on keyboard tab navigation.

---

### 2.2 Form Input Fields

* **Text & Number Fields:**
  - *Height:* 40px | *Border:* 1px solid `#E2E8F0` | *Background:* `#FFFFFF` | *Radius:* 8px.
  - *Default State:* Text `#1E293B`, Placeholder `#94A3B8`.
  - *Focus State:* Border `#2563EB`, Box Shadow: `0 0 0 3px rgba(37, 99, 235, 0.15)`.
  - *Error State:* Border `#DC2626`, Background `#FEF2F2`, Error helper text rendered in 12px Crimson below input.
* **Search Input:**
  - *Leading Icon:* Search lens icon in `#94A3B8` aligned left (padding-left: 36px).
  - *Clear Trigger:* "×" clear button appears dynamically when field contains text.
* **Dropdown Select:**
  - Displays selected value with Chevron Down icon aligned right.
  - Menu surface opens at Elevation 3 with 4px margin top; maximum height: 280px with scrollbar.
* **Date Picker:**
  - Single-click calendar popover displaying day-grid with current date circled and selected date range highlighted in Primary Emerald tint (`#ECFDF5`).

---

### 2.3 Key Performance Indicator (KPI) Card

```
┌────────────────────────────────────────────────────────────────┐
│  KPI CARD SPECIFICATION                                        │
├────────────────────────────────────────────────────────────────┤
│  [ ICON: Storage Tank ]                 [ STATUS BADGE: Live ] │
│                                                                │
│  CURRENT BUFFER CAPACITY                                       │
│  74.2%  (178 / 240 Metric Tons)                                │
│                                                                │
│  ═════════════════════════════════════════[ PROGRESS BAR: 74% ]│
│                                                                │
│  ▲ +4.2% from yesterday               Max limit: 80% (Warning) │
└────────────────────────────────────────────────────────────────┘
```

* **Container:** Background `#FFFFFF`, Border: 1px solid `#E2E8F0`, Radius: 12px, Padding: 20px, Shadow: Level 1.
* **Header Row:** 12px Uppercase Tracking +0.05em Caption (`#64748B`) + 20px Lucide Icon.
* **Value Row:** 28px Bold Mono Number (`#0F172A`) with unit suffix in 14px Regular (`#475569`).
* **Visual Anchor:** Horizontal multi-tier progress bar (Green up to 60%, Amber 60–80%, Crimson >80%).
* **Footer Subtext:** 12px Semi-Bold showing directional trend indicator with percentage change.

---

### 2.4 Supplier Marketplace Card

```
┌────────────────────────────────────────────────────────────────┐
│  Mahanadi Cement Works — Kiln 4          [ AI SCORE: 94/100 ]  │
│  Heavy Industrial Portland Cement • Jharsuguda, Odisha         │
├────────────────────────────────────────────────────────────────┤
│  Purity: 96.5% Liquid CO₂         Available: 120 Metric Tons   │
│  Distance: 42 km (Local Cluster)  Base Price: $65.00 / Ton     │
├────────────────────────────────────────────────────────────────┤
│  Est. Freight: $18.00/t           Total Landed: $83.00 / Ton   │
│                                                                │
│  [ Secondary CTA: View Details ]    [ PRIMARY CTA: Run Match ] │
└────────────────────────────────────────────────────────────────┘
```

* **Container:** 1px solid `#E2E8F0`, Radius: 12px, Background `#FFFFFF`, Hover Transition: 150ms ease to Shadow Level 2 with border color `#10B981`.
* **Badges:**
  - *AI Score Badge:* Upper right, 32px height, pill radius, Green `#ECFDF5` background with `#047857` text in 14px Bold.
  - *Cluster Proximity Tag:* 12px Medium, Ice Blue `#EFF6FF` background with `#1D4ED8` text.

---

### 2.5 AI Recommendation Card (Signature Component)

The signature UI component designed to establish immediate jury confidence in the algorithmic engine:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [ AI ICON ]  TOP ALGORITHMIC MATCH RECOMMENDATION           [ CONFIDENCE: 98.4% ]     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│     ╭──────────╮    Mahanadi Cement Works — Industrial Amine Capture Stream            │
│     │    94    │    42 km from your concrete batching facility (Cuttack Cluster)       │
│     │  / 100   │                                                                       │
│     ╰──────────╯    "Recommended because this stream exceeds your 90% purity threshold │
│   MATCH QUALITY     by +6.5%, and short road transit saves $34/ton in cryo-freight."   │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  SCORE DIMENSION BREAKDOWN                                                             │
│  Purity Fit (96.5% vs 90.0% min)   ██████████████████████████████░░  96%               │
│  Distance & Route (42 km)          ████████████████████████████████  98%               │
│  Price Competitiveness ($65/t)     ████████████████████████░░░░░░░░  88%               │
│  Supplier Reliability Index        ██████████████████████████████░░  94%               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Landed Cost: $83.00/t (vs $220 Market)   │ Net Carbon Avoided: +76.8 tCO₂e            │
│  [ PRIMARY CTA: Proceed to Logistics Breakdown & Commercial Bid ]                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Visual Identity:** 2px subtle solid border in `#10B981`, surface tint `#F0FDF4` fading to `#FFFFFF` white, Radius: 16px, Padding: 28px, Shadow: Level 3.
* **Match Score Meter:** 64px diameter circular badge with 28px bold tabular number.
* **Score Dimension Breakdown:** 4 horizontal micro-progress bars (Height: 6px, Radius: 9999px) rendering multi-factor distribution.

---

### 2.6 Data Tables (Inventory, Bids, Orders)

* **Structure:** Flush table layout with border-collapse, fixed header bar (`#F8FAFC`), and 1px solid border bottom (`#E2E8F0`).
* **Header Cells:** Height: 44px, Font: 12px Semi-Bold Uppercase (`#64748B`), Padding: 0 16px.
* **Data Rows:** Height: 52px, Font: 14px Regular (`#1E293B`), Zebra hover: background `#F8FAFC`, Action column right-aligned.
* **Status Badges:**
  - *Active / Available:* `#ECFDF5` background, `#047857` text, 4px rounded radius.
  - *Pending Bid:* `#FFFBEB` background, `#B45309` text.
  - *Reserved / In-Transit:* `#EFF6FF` background, `#1D4ED8` text.
  - *Completed / Dispatched:* `#F1F5F9` background, `#475569` text.

---

## 3. Information Architecture & Navigation

The navigation architecture separates enterprise operational responsibilities into distinct role-tailored workspaces while providing a unified global header for role switching.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] CarbonX    [ROLE SWITCHER: Seller (Mahanadi) ▼]    [NOTIFICATIONS]  [USER AVATAR]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Seller Navigation Workspace
* **Dashboard:** Buffer tank telemetry, real-time capture rates, flaring risk alerts, active batch summary.
* **Listings & Inventory:** Tabular catalog of all published CO₂ batches with live status, reserve pricing, and editing tools.
* **Incoming Bids:** Prioritized queue of purchase offers sorted by AI Match Score with one-click acceptance actions.
* **Dispatched Orders:** Commercial history, bills of lading, and delivery confirmations.
* **Plant Profile & Telemetry:** Physical plant location, scrubber specifications, and certified gas assay defaults.

### 3.2 Buyer Navigation Workspace
* **Marketplace Catalog:** Searchable, filterable directory of regional point-source captured CO₂ streams.
* **AI Recommendations:** Prioritized feed of mathematically optimal emitter pairings based on buyer production constraints.
* **Logistics & Orders:** Tracking active bids, delivery schedules, landed cost ledgers, and verified LCA certificates.
* **Facility Sourcing Profile:** Minimum purity thresholds, weekly tonnage targets, storage coupling specifications.

---

## 4. High-Fidelity Screen Specifications (10 Screens)

---

### Screen 1: Landing Page
* **User:** Public Evaluator, HackOut Jury, Prospective Enterprise Customer.
* **Purpose:** Introduce the CarbonX circular carbon proposition, display aggregate impact metrics, and provide direct single-click access to the demo sandbox.
* **Layout:**
  - *Header:* Fixed top navigation (40px) with logo, "How it Works" link, "Market Impact" link, and "Launch Demo" button.
  - *Hero Section:* High-contrast centered display typography: "Transform Captured Carbon into Industrial Value", supported by an explainable B2B value proposition subtitle.
  - *Metric Banner:* 3 prominent KPI counters: Total CO₂ Diverted (14,820 Metric Tons), Active Industrial Emitters (28 Plants), Average Landed Cost Savings (48%).
  - *Dual Persona Access Cards:* Two interactive cards allowing immediate entry: "I am an Industrial Emitter" (Seller) vs. "I am a Circular Off-Taker" (Buyer).
* **Components Used:** Primary Button, Outline Button, Impact Counter Widget, Persona Selector Cards.
* **Primary CTA:** "Launch Seller Workspace" or "Launch Buyer Workspace".
* **Empty State:** N/A (Static marketing and entry interface).
* **Error State:** Network failure toast if live aggregate stats fail to hydrate.
* **Success State:** Instant modal transition or direct routing to Role Selection upon clicking CTA.

---

### Screen 2: Login & Role Selection
* **User:** All Users / Jury Evaluators.
* **Purpose:** Provide an authentication screen that enables zero-friction, one-click persona switching for hackathon evaluation.
* **Layout:**
  - Centered clean card modal on a subtle Slate 50 background.
  - Header: CarbonX symbol with "Select Enterprise Workspace to Continue".
  - Two high-fidelity persona profile cards:
    1. *Seller Profile:* Rajesh K. Verma (VP Operations, Mahanadi Cement Works, Odisha).
    2. *Buyer Profile:* Dr. Ananya Sengupta (Head of Sourcing, EcoCure Precast Concrete, Tamil Nadu).
  - "Quick Demo Mode: Bypass Credentials" checkbox checked by default.
* **Components Used:** Role Selector Radio Cards, Primary Action Button, Help Text Link.
* **Primary CTA:** "Enter Platform as Selected Role".
* **Empty State:** None.
* **Error State:** Input validation border highlight if custom credentials mode is toggled with empty fields.
* **Success State:** Direct redirection to Screen 3 (Seller Dashboard) or Screen 5 (Buyer Marketplace).

---

### Screen 3: Seller Dashboard
* **User:** Industrial Seller (Rajesh Verma).
* **Purpose:** Serve as the central operational command center displaying buffer tank capacity, capture volume, and pending commercial bids.
* **Layout:**
  - *Top Nav Bar:* Plant selector dropdown ("Mahanadi Cement Works — Kiln 4 Amine Unit"), quick role-switch toggle, alert bell.
  - *Alert Strip:* High-visibility Amber banner: "Buffer tank at 74.2% capacity. Venting risk in 14 hours. 1 listing recommended."
  - *Metrics Grid (3 KPI Cards):*
    1. Storage Buffer Capacity (74.2% - Gauge display).
    2. Daily Capture Run-Rate (240 Tons/Day - Monitored live).
    3. Monetized Revenue Realized ($18,400 this cycle).
  - *Active Batches Table:* List of current plant batches with Status, Volume, Purity %, and Reserve Price.
  - *Right Rail / Drawer:* Incoming bid notifications highlighting high-score buyer inquiries.
* **Components Used:** Alert Banner, KPI Progress Cards, Data Table with Status Badges, Primary Action Button.
* **Primary CTA:** "Create New CO₂ Listing".
* **Empty State:** If no batches are active: Neutral placeholder card displaying "No active inventory listed. Buffer tanks filling." with secondary action "Create Batch".
* **Error State:** Red toast if telemetry feed disconnects: "Sensor feed offline. Displaying cached tank volume."
* **Success State:** Dynamic progress bar reflecting updated storage levels upon batch creation or dispatch.

---

### Screen 4: Create Listing Wizard
* **User:** Industrial Seller.
* **Purpose:** Provide a streamlined, step-by-step form to publish a captured batch to the marketplace in under 60 seconds.
* **Layout:**
  - Centered modal container (Width: 680px, Radius: 16px, Elevation: Level 4) with clear close trigger.
  - *Form Fields Grid:*
    - Row 1: Batch Volume (Input with "Metric Tons" suffix) + Physical State (Segmented control: Liquid vs. Pressurized Gas).
    - Row 2: CO₂ Purity Slider (70.0% to 99.9%, current value displayed in real-time) + Moisture Limit ($H_2O \text{ ppm}$).
    - Row 3: Minimum Reserve Price ($/ton) + Availability Window (Date Range Picker).
    - Row 4: Contaminant Thresholds ($SO_x < 5 \text{ ppm}$, $NO_x < 10 \text{ ppm}$).
  - *Quick-Fill Demo Button:* "Auto-Populate Cement Amine Specs" (one-click helper for jury demonstration).
* **Components Used:** Text Inputs, Number Steppers, Segmented Controls, Range Sliders, Date Picker, Primary Button, Ghost Cancel Button.
* **Primary CTA:** "Publish Batch to Marketplace".
* **Empty State:** All fields blank or populated with default plant template values.
* **Error State:** Field-level error messages in Crimson `#DC2626` when volume is $\le 0$ or purity is outside valid bounds ($70–99.9\%$).
* **Success State:** Instant modal dismissal, success toast ("Batch #CX-902 published successfully"), and immediate row insertion in Screen 3 table.

---

### Screen 5: Buyer Marketplace
* **User:** Circular Buyer (Dr. Ananya Sengupta).
* **Purpose:** Browse, search, and filter all available point-source captured CO₂ batches across regional industrial clusters.
* **Layout:**
  - *Header Bar:* Search input ("Search by plant name, city, or emitter industry"), sort dropdown ("Sort by: AI Match Score").
  - *Left Filter Sidebar (Width: 280px):*
    - Minimum Required Purity (Slider: 70%–99.9%).
    - Maximum Haulage Radius (Slider: 10 km–500 km).
    - Physical Phase Checkbox Group (Liquid CO₂, Compressed Gaseous CO₂).
    - Emitter Industry Filter (Cement, Steel, Thermal Power, Chemical).
  - *Right Content Grid:* 2-column responsive grid rendering Supplier Marketplace Cards with prominent AI Match Score tags.
* **Components Used:** Search Input, Range Sliders, Checkbox Groups, Supplier Cards, Sort Dropdown.
* **Primary CTA:** "View Match & Details" (located on individual supplier cards).
* **Empty State:** Illustration showing no results with text: "No point-source emitters match these criteria. Try lowering the minimum purity or expanding the transport radius."
* **Error State:** Search timeout message with retry button.
* **Success State:** Cards dynamically filter without page reloads within $< 50\text{ms}$.

---

### Screen 6: Supplier & Stream Details
* **User:** Circular Buyer.
* **Purpose:** Review technical, geographic, and chemical assay details of a specific emitter batch before initiating match analysis.
* **Layout:**
  - Two-column detail view (Width: 1040px container).
  - *Left Column (60%):* Emitter facility overview, plant photography/diagram, certified laboratory gas assay table ($CO_2$, $N_2$, $O_2$, $SO_x$, $NO_x$, moisture), and storage loading bay specifications.
  - *Right Column (40%):* Commercial summary card: Available Tons, Reserve Price, Physical Phase, Distance from Buyer Facility (e.g., "42 km via NH-49"), Supplier Reliability Score (4.9 / 5.0).
* **Components Used:** Gas Assay Data Table, Specification Grid, Badges, Primary Action Button, Secondary "Back to Catalog" link.
* **Primary CTA:** "Run AI Match Analysis".
* **Empty State:** N/A (Directly populated from selected batch ID).
* **Error State:** Warning badge if gas assay cert is pending laboratory re-validation.
* **Success State:** Smooth transition to Screen 7 with calculated match metrics.

---

### Screen 7: AI Recommendation & Match Analysis
* **User:** Circular Buyer.
* **Purpose:** Transparently explain why the selected emitter represents an optimal supply pairing using the multi-parametric AI Match Score.
* **Layout:**
  - Full-width feature layout centered on the **AI Recommendation Card** (Component 2.5).
  - *Top Hero Section:* Large Match Score Meter (e.g., 94/100) alongside verified emitter identity and cluster distance.
  - *Middle Rationale Section:* Highlighted callout box detailing the natural language rationale behind the algorithmic score.
  - *Bottom Analytics Grid:* Four horizontal breakdown meters detailing:
    1. Purity Compatibility (96.5% vs. 90.0% min required).
    2. Logistics & Proximity (42 km - Low freight overhead).
    3. Commercial Alignment ($65/t vs. $80/t buyer budget).
    4. Operational Cadence Fit (Weekly batch schedule aligned).
* **Components Used:** AI Recommendation Card, Radial Match Score Gauge, Multi-Bar Analytics Grid, Primary Action Button.
* **Primary CTA:** "Proceed to Logistics & Landed Cost Breakdown".
* **Empty State:** If score is $< 70$: Warning banner stating "Low Algorithmic Compatibility. High transport distance or chemical disparity detected."
* **Error State:** Fallback message if parametric weights fail to calculate.
* **Success State:** High-score green glow accent around the score gauge.

---

### Screen 8: Logistics & Landed Cost Breakdown
* **User:** Circular Buyer.
* **Purpose:** Eliminate hidden freight surprises by calculating cryogenic haulage costs, transit duration, and net carbon balance prior to bid submission.
* **Layout:**
  - *Top Segment:* Geographic routing summary showing origin (Mahanadi Works, Jharsuguda) to destination (Sriperumbudur Precast Plant) with driving distance (42 km) and estimated road transit time (1.2 hours).
  - *Cost Breakdown Table:*
    - Base Gas Commodity Cost: $65.00 / Ton
    - Specialized Cryogenic Road Freight: $14.20 / Ton
    - Loading & Unloading Handling Surcharge: $3.80 / Ton
    - **Total Landed Unit Cost: $83.00 / Ton** (vs. $220.00 Commercial Distributor baseline $\rightarrow$ **62% Savings**).
  - *Net Carbon Ledger Widget:* Diverted Point-Source CO₂ (+1.00 t) minus Diesel Tanker Transport Debt (-0.038 t) = **Net Abated Carbon: +0.962 tCO₂e per ton delivered**.
* **Components Used:** Route Summary Bar, Landed Cost Comparison Table, Net Carbon Balance Indicator, Primary Action Button.
* **Primary CTA:** "Place Commercial Purchase Bid".
* **Empty State:** Prompt to confirm delivery location if address is unverified.
* **Error State:** Red flag if haulage distance exceeds 400 km: "Warning: Transport emissions exceed sustainability threshold (15% of sequestered volume)."
* **Success State:** Live recalculation of total cost when buyer toggles order quantity.

---

### Screen 9: Bid Management & Submission
* **User:** Dual Screen (Buyer submits bid; Seller reviews and accepts).
* **Purpose:** Structured bidding interface where buyer locks in purchase terms and seller confirms dispatch.
* **Layout:**
  - *Buyer View (Submission):* Clean two-column modal:
    - Left: Order parameter inputs (Volume requested: e.g., 80 tons, Unit bid price: $65.00/t, Target delivery date picker).
    - Right: Dynamic order value calculator (Total Commodity Value: $5,200, Total Landed Value: $6,640, Simulated Escrow Lock authorization checkbox).
  - *Seller View (Review & Acceptance):* Incoming Bids Table displayed on Seller Dashboard:
    - Columns: Buyer Enterprise, Requested Tons, Offered Price/Ton, Delivery Window, AI Match Score, Action.
* **Components Used:** Number Steppers, Date Picker, Checkbox, Primary "Submit Bid" Button, "Accept Bid" Button, "Decline" Button.
* **Primary CTA:** 
  - *Buyer:* "Submit Binding Purchase Bid".
  - *Seller:* "Accept Bid & Lock Order".
* **Empty State:** "No incoming bids pending review."
* **Error State:** Input error if bid price is $< 70\%$ of seller reserve price: "Offer cannot be lower than $45.50/ton."
* **Success State:** Instant visual state transition from "Pending" to "Confirmed & Locked".

---

### Screen 10: Order Confirmation & Summary
* **User:** Both Buyer and Seller.
* **Purpose:** Display confirmed commercial terms, issue unique transaction reference ID, and provide downloadable digital bill of lading and spec sheets.
* **Layout:**
  - Centered confirmation card (Width: 720px, Radius: 16px, Border: 2px solid `#10B981`).
  - *Header:* Success checkmark circle in Emerald Green with "Commercial Order Confirmed & Locked".
  - *Transaction Reference Banner:* Order ID: `#CX-8842-OD` | Timestamped with live local time.
  - *Commercial Summary Grid:*
    - Total Volume: 80.0 Metric Tons (Liquid CO₂)
    - Agreed Landed Price: $83.00 / Metric Ton (Total: $6,640.00)
    - Guaranteed Purity: $\ge 96.5\%$
    - Scheduled Loading Window: Wednesday, 08:00 – 12:00 IST
  - *Action Bar:* "Download Digital Bill of Lading (PDF)", "Export Net-Carbon Certificate", "Return to Dashboard".
* **Components Used:** Success Hero Icon, Reference Tag, Two-Column Summary Grid, Action Buttons.
* **Primary CTA:** "Return to Dashboard".
* **Empty State:** N/A.
* **Error State:** N/A.
* **Success State:** Persistent record saved across both Seller and Buyer dashboards under "Active Orders".

---

## 5. Interaction Guidelines

* **Hover Behavior:**  
  Interactive cards elevate from Shadow Level 1 to Shadow Level 2 with a 150ms ease-in-out transition. Borders shift from `#E2E8F0` to `#10B981` (Primary Emerald) or `#2563EB` (Tech Blue) to provide immediate tactile feedback.
* **Card Selection:**  
  When a supplier card is selected, it maintains a persistent 2px solid `#059669` ring with an inner `#F0FDF4` tint, signaling active state to the user.
* **Table Interactions:**  
  Rows highlight with a subtle `#F8FAFC` background on hover. Clicking any row navigates directly to the associated batch or order detail view.
* **Filter Behavior:**  
  Marketplace filters update the catalog dynamically without requiring an explicit "Apply" click. Filter adjustments are debounced by 200ms to preserve UI responsiveness.
* **Search UX:**  
  The search input provides instant predictive filtering on key attributes (Plant Name, Location, Emitter Industry) with an immediate clear button.
* **Loading Skeletons:**  
  During data fetching or algorithmic recalculation, cards render animated shimmering skeleton blocks in `#F1F5F9` rather than jarring circular spinners, preserving layout structure.
* **Toast Notifications:**  
  Toasts emerge from the top-right viewport corner (offset: 24px), displaying an icon, title, description, and auto-dismissing after 4 seconds. Toasts use semantically tinted backgrounds (`#ECFDF5` for success, `#FEF2F2` for errors).

---

## 6. Responsive Rules & Layout Breakpoints

CarbonX is designed **Desktop First** to support the data-rich, multi-column analytical needs of enterprise plant engineers and procurement officers:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                RESPONSIVE ADAPTATIONS                                  │
├───────────────────┬───────────────┬────────────────────────────────────────────────────┤
│ Viewport          │ Resolution    │ Layout Behavior                                    │
├───────────────────┼───────────────┼────────────────────────────────────────────────────┤
│ Large Desktop     │ 1440px and up │ Fixed 1280px content container; full 3-column grids;│
│ (Primary Target)  │               │ permanent left filter sidebar on marketplace.      │
├───────────────────┼───────────────┼────────────────────────────────────────────────────┤
│ Standard Laptop   │ 1280px        │ Fluid 100% width with 32px side padding; 2-column  │
│                   │               │ marketplace card layout; table font stays 14px.    │
├───────────────────┼───────────────┼────────────────────────────────────────────────────┤
│ Tablet / Small PC │ 768px – 1024px│ Filter sidebar collapses into slide-over drawer;   │
│                   │               │ KPI cards collapse from 3-column to 1-column grid; │
│                   │               │ tables gain horizontal scrolling with sticky ID.   │
└───────────────────┴───────────────┴────────────────────────────────────────────────────┘
```

---

## 7. Design Review & Consistency Checklist

Before any screen or component is approved for development, it must satisfy all 6 review gates:

* [ ] **Accessibility & Contrast:** All text elements meet or exceed WCAG 2.1 AA contrast requirements (minimum 4.5:1 for body copy against `#FFFFFF` or `#F8FAFC`).
* [ ] **Strict Spacing Compliance:** Every margin, padding, and gutter strictly uses an 8px grid token (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).
* [ ] **Typography Uniformity:** All textual elements use **Inter** with specified sizes and weights; no ad-hoc inline font sizes.
* [ ] **Component Reusability:** Every screen leverages the standard component library (Buttons, KPI Cards, Status Badges, Input Fields) without creating one-off variants.
* [ ] **State Completeness:** Every interactive screen explicitly handles Default, Hover, Active, Loading, Error, and Empty states.
* [ ] **Color Semantic Discipline:** Emerald Green is reserved strictly for sustainability wins, primary actions, and high match scores; Crimson is reserved strictly for hard incompatibilities or safety warnings.
