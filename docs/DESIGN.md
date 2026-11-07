---
name: Merchant Pulse Analytics
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#5b598c'
  on-secondary: '#ffffff'
  secondary-container: '#c7c3fe'
  on-secondary-container: '#514f81'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c4c1fb'
  on-secondary-fixed: '#181445'
  on-secondary-fixed-variant: '#444173'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  metric-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  metric-display-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system serves independent e-commerce founders and merchant operators who need instant clarity over high-volume transactional data. The brand posture balances operational rigor with reassuring calm: it must feel as authoritative as an enterprise ERP, yet as intuitive and approachable as a consumer financial utility. 

The aesthetic is Modern Corporate with a precision-instrument feel. High data density is achieved without visual claustrophobia by strictly pairing structured card modules, generous micro-whitespace, and an intentional information hierarchy. Surfaces remain crisp and tactile, eliminating ornamental noise to let numerical trends, velocity indicators, and decision-support signals lead the interface.

## Colors

The palette uses deliberate chromatic zoning to separate operational infrastructure from commercial telemetry:

- **Primary Canvas & Text:** The base canvas lives on an airy cool grey (`#F8FAFC`), establishing contrast against raised `#FFFFFF` card containers. Text hierarchy anchors onto Deep Slate (`#0F172A`) for high-legibility headings and tabular figures, descending to `#64748B` for secondary meta-labels.
- **Brand & Interaction:** Active interactive elements, focused input states, and primary navigational wayfinding employ Indigo (`#4F46E5`), balanced by Midnight Navy (`#1E1B4B`) for high-order sidebar anchoring and structural commands.
- **Metric Telemetry:**
  - **Growth & Yield:** Emerald Green (`#10B981`) indicates positive revenue delta, successful checkouts, and margin expansion.
  - **Drop-off & Attrition:** Coral Rose (`#F43F5E`) and Crimson (`#EF4444`) are reserved strictly for checkout abandonment, revenue dips, and critical inventory stockouts.
  - **Traffic & Discovery:** Soft Blue (`#3B82F6`) surfaces store sessions, impression reach, and funnel entrances.
  - **Alerts & Warnings:** Amber (`#F59E0B`) highlights delayed fulfillment SLAs, gateway retries, and low-stock warnings.
- **Structural Outlines:** Subtle dividing lines and card perimeters use `#E2E8F0`, keeping grid divisions quiet.

## Typography

The typography pairs **Plus Jakarta Sans** for display surfaces, high-level headers, and KPI readouts with **Inter** for data-heavy utility, data grids, and systemic labels:

- **Tabular Alignment:** When rendering currency, conversion rates, and volume changes inside data grids and metric headers, activate tabular figures (`font-variant-numeric: tabular-nums`) within Inter to prevent jitter during real-time data streaming.
- **Optical Hierarchy:** Top-level KPIs utilize `metric-display` with tight tracking to emphasize absolute numbers, while corresponding trends (`+12.4%`) use `label-sm` encased in pill containers.
- **Reading Comfort:** Body copy defaults to `body-md` (14px) with a 20px line height to allow multi-column merchant tables, transaction timelines, and alert panels to fit comfortably above the fold.

## Layout & Spacing

The layout is built upon a 12-column responsive fluid grid designed around dashboard widget modularity:

- **Desktop (1280px+):** Employs a persistent 260px navigation rail paired with a fluid 12-column grid. Main section padding uses `margin-desktop` (2rem) and `gutter-desktop` (1.5rem). Standard analytical widgets span 3 columns (quarter-width KPI cards), 6 columns (mid-tier graphs), or 12 columns (transactional data tables).
- **Tablet (768px - 1279px):** Sidebar collapses to an icon-only docking rail (72px). Layout transitions to an 8-column grid with 1.25rem gutters. KPI metrics wrap to 4-column blocks (2 per row).
- **Mobile (<768px):** Layout converts to a single-column stack with `margin` (1rem). Dense metric cards snap horizontally into swipeable carousels to preserve vertical screen space.
- **Micro Rhythm:** Component gaps use a baseline 4px scale. Data table cell padding strictly leverages `space-sm` vertically (8px) and `space-md` horizontally (12px) to maximize row visibility without truncation.

## Elevation & Depth

Visual hierarchy uses a refined hybrid approach combining low-contrast outlines with soft ambient shadows to keep complex analytics readable:

- **Base Layer (Level 0):** The `#F8FAFC` page backdrop serves as the root plane.
- **Card Tier (Level 1):** Widgets, summary metric blocks, and tables sit on a pure white surface (`#FFFFFF`). Each card is defined by a 1px structural outline of `#E2E8F0` coupled with a gentle ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`. This anchors the element without creating visual weight.
- **Raised & Interactive (Level 2):** Hovered cards, segmented control popovers, and sticky filtering headers elevate via `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)` alongside border highlighting (`#CBD5E1`).
- **Overlays & Drawers (Level 3):** Modal diagnostic drawers, cart-abandonment inspect panels, and date-range pickers float above the workspace with `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`, complemented by a 24% slate backdrop scrim.

## Shapes

The design system adopts a balanced roundedness profile to maintain a crisp software feel while softening analytical density:

- **Dashboard Containers & Cards:** Card perimeters, diagnostic modules, and data grid wraps strictly implement `rounded-lg` (1rem) for an approachable, self-contained silhouette.
- **Controls & Form Elements:** Input fields, buttons, dropdown triggers, and filter chips use baseline roundedness (0.5rem / 8px). This creates an ergonomic target that aligns with input bounding boxes.
- **Telemetry Badges & Indicators:** Status chips, delta tags (`+4.2%`), and cart status indicators use fully rounded pill geometry (`rounded-full` / 9999px) to differentiate actionable meta-tags from rectangular content cards.

## Components

- **Buttons:**
  - *Primary:* Solid Indigo (`#4F46E5`) fill, pure white text, 8px radius, subtle hover shift to `#4338CA`. Active states produce an inner shadow.
  - *Secondary / Neutral:* Crisp `#FFFFFF` surface with a 1px `#E2E8F0` border and `#0F172A` text. Hover shifts to `#F8FAFC`.
  - *Destructive:* Rose-tinted subtle base (`#FFF1F2`) with `#E11D48` text for low-urgency actions, elevating to solid `#EF4444` fill for irreversible merchant actions.
- **Telemetry Chips & Status Badges:**
  - Designed as pill shapes (9999px) using semi-transparent backgrounds with deep colored text. 
  - *Success (Revenue/Conversion):* Background `#ECFDF5`, text `#065F46`, paired with an upward-pointing micro icon.
  - *Critical (Abandonment/Drop):* Background `#FFF1F2`, text `#9F1239`, paired with a downward trend icon.
  - *Notice (Traffic/Visits):* Background `#EFF6FF`, text `#1E40AF`.
  - *Warning (Inventory/SLA):* Background `#FFFBEB`, text `#92400E`.
- **Metric Cards (KPI Tiles):**
  - White surface, `rounded-lg`, 1px border (`#E2E8F0`).
  - Top row: 13px muted label (`#64748B`) left-aligned, actionable secondary menu right-aligned.
  - Core row: Bold numeric value in `metric-display`, aligned beside the trend pill.
  - Bottom row: Micro sparkline chart or baseline comparison copy (e.g., "vs. prior 30 days").
- **Data Tables & Lists:**
  - Outer enclosure carries a 1px border with rounded corners.
  - Table headers sit on `#F8FAFC` background with uppercase `label-sm` text (`#64748B`).
  - Alternating rows avoid striped fills; separation is maintained purely via 1px `#F1F5F9` bottom borders and a subtle hover tint of `#F8FAFC`.
  - Tabular numbers are right-aligned; text entities are left-aligned.
- **Form Controls & Date Range Pickers:**
  - Input fields feature a `#FFFFFF` fill, 1px `#CBD5E1` border, 8px radius, and standard 36px/40px heights.
  - Focused state applies a 2px outer ring in Indigo (`#4F46E5` at 20% opacity) and sets the border to `#4F46E5`.
  - Checkboxes use a 4px radius; checked state fills with Indigo `#4F46E5` displaying a white geometric check.
- **Recommendation & Decision Support Cards:**
  - Specialized cards delivering actionable insights (e.g., "Cart Abandonment Spike Detected"). 
  - Features an accented 3px left border in the severity color (Amber, Coral, or Indigo), accompanied by a high-contrast action link to execute instant remediation.