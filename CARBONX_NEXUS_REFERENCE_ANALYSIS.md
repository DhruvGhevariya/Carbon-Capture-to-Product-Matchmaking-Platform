# CARBONX × NEXUS STUDIO REFERENCE ANALYSIS
**Version 1.0.0 — Comprehensive Design System & Pattern Mapping**

This document establishes the official visual and architectural mapping between the reference implementation (`/nexus-studio-main`) and the CarbonX Carbon Intelligence Operating System (`/frontend`).

---

## 1. DESIGN SYSTEM MAPPING

### A. Color System
| Token Name | Nexus Hex | CarbonX Role | CarbonX Hex | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `ink.950` | `#04040A` | `carbon-bg` | `#04040A` | Deep dark graphite main background |
| `ink.900` | `#080812` | `carbon-surface` | `#080812` | Container, card, and module background |
| `ink.800` | `#0D0D1F` | `carbon-elevated` | `#0D0D1F` | Elevated popovers, command center modal |
| `ink.700` | `#12122E` | `carbon-border` | `#12122E` | Divider lines and subtle card borders |
| `ink.600` | `#1A1A3E` | `carbon-border-bright` | `#1A1A3E` | Hover state borders and active focus rings |
| `signal` | `#E8FF47` | `carbon-green` | `#E8FF47` | Electric carbon green primary signal CTA & match score |
| `signal.dim` | `#B8CC38` | `carbon-green-muted` | `#B8CC38` | Secondary carbon badges, verified indicators |
| `ember` | `#FF6B35` | `carbon-amber` | `#FF6B35` | Financial ROI metrics, warnings, risk callouts |
| — | — | `carbon-cyan` | `#00F0FF` | Purity telemetry, spectrographic data, AI state |
| `mist.100` | `#F0F0F8` | `carbon-text-primary` | `#F0F0F8` | High-contrast hero display typography |
| `mist.500` | `#DCDCEC` | `carbon-text-body` | `#DCDCEC` | High readability body copy |
| `mist.700` | `#C4C4D8` | `carbon-text-subtle` | `#C4C4D8` | Technical sub-labels & descriptions |
| `mist.900` | `#9898B8` | `carbon-text-muted` | `#9898B8` | Mono metadata, timestamps, units, IDs |

---

### B. Typography System
- **Display Role**: `Space Grotesk` (Nexus: Clash Display) for major headlines, oversized numbers, hero metrics (`10xl`, `9xl`, `8xl`).
- **Body Role**: `Inter` (Nexus: Cabinet Grotesk) for clean UI, descriptions, navigation, forms.
- **Mono Role**: `JetBrains Mono` for chemical formulas, stack temperatures, purity %, algorithm versions, timestamps.

#### Contrast Formula
```
         94
     MATCH SCORE

     18,420
   tCO₂ / YEAR
```

---

### C. Interaction & Component Mapping

| Nexus Component | Nexus Implementation | CarbonX Recreation | CarbonX Purpose |
| :--- | :--- | :--- | :--- |
| `CustomCursor` | Dual spring dot + ring with `mix-blend-mode` | `CarbonXCursor` | Contextual indicator (`VIEW`, `SEARCH`, `COPILOT`) for desktop |
| `MagneticButton` | Pointer offset spring physics | `CarbonXMagneticButton` | Primary action CTAs (`Create Match`, `Run Calculation`) |
| `AnimatedCounter` | CountUp upward reveal | `CarbonXAnimatedMetric` | Oversized display numbers for CO₂ capacity & ROI |
| `ScrollReveal` | IntersectionObserver fade/translate | `CarbonXReveal` | Section entrance animations with 16px vertical motion |
| `ParallaxImage` | Motion scroll transform | `CarbonXParallax` | Subtle hero atmospheric depth container |
| `NoiseBg` / `.grain` | SVG turbulence overlay 1.5-2.5% | `CarbonXNoiseOverlay` | Film grain background overlay across app shell |
| `Navbar` | Backdrop blur translucent header | `CarbonXNavigation` | Top navigation with role toggle & `Ctrl+K` trigger |
| `Hero` | Asymmetric editorial headline | `CarbonXIntelligenceHero` | Command center hero area with active metrics |
| `ServicesGrid` / Bento | Asymmetric bento grid | `CarbonXOpportunityBento` | High-priority match cards with variable visual weight |
| `ProcessTimeline` | Vertical illuminating line | `CarbonXIndustrialTimeline` | Project lifecycle stage progression (Draft → Active) |
| `StatsSection` | Oversized metrics row | `CarbonXMetricsRow` | Tonnage, purity, match score, economic NPV cards |

---

## 2. SIGNATURE CARBONX SCIENTIFIC VISUALIZATIONS

1. **`CarbonFlow`**:
   `CO₂ SOURCE → CAPTURE → TREATMENT → CONVERSION → PRODUCT SINK → AVOIDED EMISSIONS`
   - Animated directional particles, mass balance efficiency %, real-time stage status indicators.

2. **`CO2Fingerprint`**:
   - Spectrographic matrix for flue gas specifications (Purity %, Volume t/yr, Stack Temp °C, Pressure bar, Moisture %, SOx/NOx ppm).

3. **`MatchScore` & Breakdown**:
   - Animated count-up score halo (0 → 94) with sequential sub-score progress bars (Technical, Economic, Environmental, Geographic, TRL).

4. **`MatchExplanation`**:
   - Sticky storytelling narrative detailing compatibility logic, risks/warnings, and financial revenue.

5. **`CommandCenter`**:
   - Global `Ctrl+K` palette for instant search across emitters, sinks, pathways, and platform commands.

---

## 3. NON-NEGOTIABLE UX RULES
- **No Mock Production Data**: All stats, scores, and names map directly from backend APIs.
- **Graceful Mobile Degradation**: Custom cursor is disabled on touch/mobile screens (< 1024px); bento grids stack single-column.
- **Strict Motion Scoping**: Respects `prefers-reduced-motion` queries.
