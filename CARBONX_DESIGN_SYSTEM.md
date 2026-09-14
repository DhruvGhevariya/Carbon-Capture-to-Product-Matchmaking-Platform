# CARBONX DESIGN SYSTEM CONSTITUTION
**Version 2.0.0 — Official UI/UX Design & Architecture Guidelines**
**Identity**: Carbon Intelligence Operating System (Nexus Studio × Industrial Carbon Intelligence)

---

## 1. BRAND PHILOSOPHY & VISUAL IDENTITY

CarbonX is an enterprise-grade Carbon Intelligence Operating System bridging industrial carbon emitters with chemical, building material, and fuel utilization partners.

### Core Visual Principles
- **Dark Luxury Editorial**: High-contrast, dark-first editorial layout with dramatic typographic hierarchy, tight letter spacing, and restrained electric signal accents.
- **Scientific Control Room**: Interface elements evoke precision industrial instrumentation, lab telemetry, and clean plant command centers.
- **Atmospheric Depth**: Deep `#04040A` graphite foundation, dark slate borders (`#1A1A3E`), low-opacity grid lines, and soft noise overlays create realistic depth without distraction.
- **Data as Visual Hero**: Key metrics (CO₂ tonnage, purity %, match scores, ROI) dominate the screen visually with dramatic oversized numbers.
- **Restrained Motion**: Animations are micro, intentional, fast (150ms-300ms), and communicate state transitions.

### Anti-Generic Rules (Strict Prohibitions)
- ❌ NO generic white/light dashboard grids with soft grey cards.
- ❌ NO rounded-xl generic light cards with huge drop shadows.
- ❌ NO rainbow colors or random neon gradients.
- ❌ NO cartoonish icons, 3D floating spheres, or generic AI sparkle graphics.
- ❌ NO forced custom cursor on mobile, touch, or reduced-motion contexts.

---

## 2. COLOR TOKEN SYSTEM

### Dark Foundation (Dominant Palette - 85% of UI)
| Token Name | HEX Value | Usage |
| :--- | :--- | :--- |
| `carbon-bg` | `#04040A` | Deep dark graphite main page background |
| `carbon-surface` | `#080812` | Deep charcoal card & container surface |
| `carbon-surface-elevated` | `#0D0D1F` | Elevated surface (popovers, active cards, modals) |
| `carbon-border` | `#12122E` | Technical divider & card borders |
| `carbon-border-bright` | `#1A1A3E` | Hover state border & active focus rings |
| `carbon-text-primary` | `#F0F0F8` | High-contrast soft white primary headers & values |
| `carbon-text-secondary` | `#DCDCEC` | Secondary body text and labels |
| `carbon-text-subtle` | `#C4C4D8` | Technical sub-labels & descriptions |
| `carbon-text-muted` | `#9898B8` | Low-emphasis metadata, timestamps, IDs |

### Signal Accents (Selective - 15% of UI)
| Signal Role | HEX Value | Usage |
| :--- | :--- | :--- |
| **Primary Signal** (Electric Carbon Green) | `#E8FF47` | Positive carbon impact, high match score (80%+), primary CTA, active states |
| **Secondary Signal** (Muted Climate Green) | `#B8CC38` | Supporting carbon metrics, verified indicators, secondary CTAs |
| **Warning / Economic** (Warm Ember) | `#FF6B35` | Economic opportunity, pending reviews, warnings, TRL gaps |
| **Technical Signal** (Cyan / Blue) | `#00F0FF` / `#06B6D4` | Scientific telemetry, purity ratings, data flows, Copilot intelligence |
| **Critical Signal** (Alert Crimson) | `#FF4B4B` | Impurity risks, geographic mismatch, system errors |

---

## 3. TYPOGRAPHY SYSTEM

CarbonX uses three distinct typography roles to create high visual contrast:

```
DISPLAY:     Space Grotesk / Syne (Dramatic headings, oversized numbers, hero metrics)
BODY:        Inter (Clean UI, forms, tables, body text)
MONO:        JetBrains Mono (Technical IDs, chemical formulas, units, timestamps, algorithm versions)
```

### Typographic Contrast Hierarchy Example
```
         94
     MATCH SCORE

     18,420
   tCO₂ / YEAR
```
- **Number**: 48px – 72px bold display font (`font-display font-bold tracking-tight text-[#F0F0F8]`).
- **Label**: 10px – 12px uppercase mono font (`font-mono text-xs font-semibold tracking-wider text-[#9898B8]`).

---

## 4. SIGNATURE INTERACTION PATTERNS

### A. Global Noise & Technical Grid
- **Noise Texture**: Fixed overlay with 1.5% - 2.5% opacity, `pointer-events: none`, `z-index: 50`.
- **Technical Grid**: Low-opacity horizontal and vertical grid lines (`rgba(255,255,255,0.03)`), scoped to heroes, dashboards, and analytical cards.

### B. Refined Contextual Cursor (Desktop Only)
- **Default State**: 6px precision dot with smooth spring movement.
- **Hover Interactive**: Expands into 24px subtle ring.
- **Hover Magnetic CTA**: Magnetic pull towards button center (max 8px offset).
- **Disabled On**: Touch screens, mobile viewports (< 1024px), `prefers-reduced-motion`.

### C. Sequential Match Score Reveal
When viewing a match:
1. Animate score number upward (0 → 94).
2. Reveal sub-score breakdown (Technical, Economic, Environmental, Geographic, TRL) sequentially with short staggered intervals (60ms).
3. Reveal narrative card: "Why This Match?", Warnings, Carbon Tonnage, Economic ROI.

### D. Global Command Center (`Ctrl+K` / `Cmd+K`)
- Instant keyboard palette for quick search across CO₂ sources, product sinks, technologies, projects, and executing platform actions.

### E. Native AI Copilot Interface
- Displays structured reasoning states (`ANALYZING`, `RETRIEVING SPECTRA`, `CALCULATING SCENARIOS`, `GENERATING PATHWAY`).
- Uses mono metadata tags, source citations, and direct actionable buttons.

---

## 5. REUSABLE SIGNATURE COMPONENTS

1. `CarbonFlow`: Animated CO₂ pathway pipeline (Source → Capture → Treatment → Utilization → Product).
2. `CO2Fingerprint`: Radial scientific diagnostic matrix for gas specifications (Purity, Volume, Temp, Pressure, Impurities).
3. `MatchScore`: Animated match score with color-coded signal ring and breakdown drawers.
4. `CarbonImpactCard`: Oversized carbon metrics with avoided emissions calculator preview.
5. `EconomicScenarioCard`: Payback timeline and CAPEX/OPEX financial scenario analysis.
6. `OpportunityBento`: Asymmetric bento grid layout for dashboard highlights.
7. `IndustrialTimeline`: Illuminating milestone line tracking project stages (Draft → Active → Completed).
8. `CommandCenter`: Global palette modal for navigation and direct commands.
9. `IndustrialDataTable`: Dark high-density data table with sorting, filtering, and tabular-nums.
10. `ProvenanceBadge`: Small mono badges indicating data origin (`USER_PROVIDED`, `CALCULATED`, `AI_ESTIMATED`).

---

## 6. RESPONSIVE & ACCESSIBILITY GUARANTEES
- All interactive controls are fully accessible via keyboard (`tab`, `enter`, `space`, `esc`).
- Respects `prefers-reduced-motion` media queries (disables cursor springs, marquee, and complex entry animations).
- Graceful degradation on mobile viewports: stacked single-column layouts, hidden custom cursor, touch-optimized hit targets (min 44px).
