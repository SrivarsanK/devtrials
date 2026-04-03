# Phase 4: Live Trigger Status & Loss Ratio Chart (Day 2) - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning
**Source:** Milestone v1.1 specification + Phase 3 completed codebase

<domain>
## Phase Boundary

This phase delivers two new dashboard components that plug into the existing scaffold from Phase 3:

1. **Live Trigger Status Panel (LTS)** — Real-time monitoring of 6 parametric triggers with progress bars, status badges, and simulated Socket.io event updates
2. **Loss Ratio Area Chart (LRC)** — 30-day D3.js area chart with gradient fills that change color at threshold boundaries, interactive hover tooltips, and reference lines

Both components use the existing Zustand store, mock data modules, hooks, and services layer built in Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Live Trigger Status Panel

**Component Location:** `src/components/insurer/TriggerStatusPanel.tsx`
**Sub-components:**
- `TriggerCard.tsx` — Individual trigger with progress bar, status badge, affected workers
- `TriggerStatusPanel.tsx` — Container listing all 6 triggers

**The 6 Parametric Triggers:**
| # | Trigger | Threshold | Mock Current | Mock Progress | Mock Status |
|---|---------|-----------|--------------|---------------|-------------|
| 1 | Rainfall | 35mm / 3hr | 28mm | 80% | WATCH |
| 2 | Extreme Heat | 42°C / HI 54°C | 41°C | 90% | WATCH |
| 3 | Flood Alert | IMD Red Alert | Clear | 20% | NORMAL |
| 4 | Air Quality Index | AQI > 300 | 187 | 62% | WATCH |
| 5 | Curfew / Bandh | Official Order | None | 5% | NORMAL |
| 6 | Platform Outage | Swiggy/Zomato Down | None | 5% | NORMAL |

**Progress Bar Colors:**
- NORMAL: shield-green fill
- WATCH: shield-amber fill with pulse animation
- TRIGGERED: shield-red fill with pulse animation + expanded detail card

**Status Badge Styling:**
- NORMAL: `bg-shield-green/15 text-shield-green border-shield-green/40`
- WATCH: `bg-shield-amber/15 text-shield-amber border-shield-amber/40`
- TRIGGERED: `bg-shield-red/15 text-shield-red border-shield-red/40`

**Extra Detail (TRIGGERED state only):**
- Affected workers count
- Estimated payout liability in lakhs
- Cities affected

**Socket.io Simulation:**
- Enhance the existing mock socket simulator in `socket.ts` to periodically update trigger progress
- Every 5-8 seconds, randomly bump one trigger's progress by 2-5%
- If progress crosses 100%, switch status to TRIGGERED and show expanded detail
- Update via `useDashboardStore.addTrigger()` to keep store in sync

**LTS-005 (Pre-warning Alert):**
- When a WATCH trigger's progress exceeds 85%, show a small orange "FORECAST" chip below the progress bar
- Text: "Forecast: may cross threshold in ~4 hrs"
- This is a static mock label, not a real calculation

### Loss Ratio Area Chart

**Component Location:** `src/components/insurer/LossRatioChart.tsx`

**Tech: D3.js math + React SVG rendering**
- D3 handles: scales, area generator, line generator, axis ticks
- React handles: SVG element rendering, hover state, tooltips
- NO direct D3 DOM manipulation (no d3.select on SVG) — React owns the SVG DOM

**Chart Specifications:**
- X-axis: 30 days (date labels every 5 days)
- Y-axis: Loss ratio percentage (0%-100%, gridlines at 20% intervals)
- Area fill: gradient that changes color at threshold boundaries
  - Below 65%: shield-green with 20% opacity
  - 65%-80%: shield-amber with 25% opacity  
  - Above 80%: shield-red with 30% opacity
- Line stroke: 2px white with slight transparency

**Threshold Reference Lines:**
- 65% line: dashed, shield-green, label "Target (65%)"
- 80% line: dashed, shield-red, label "Alert (80%)"

**Hover Tooltip:**
- Vertical crosshair line on hover
- Tooltip card showing:
  - Date
  - Loss Ratio: XX.X%
  - Premiums: ₹X.X L
  - Claims: ₹X.X L
- Tooltip positioned to avoid edge overflow

**Mock Data Source:** Already exists at `src/data/mock/lossRatio.ts` (30 days, monsoon spike pattern)
**Hook:** Already exists at `src/hooks/useLossRatio.ts`

### Dashboard Integration

- Add both components to `src/app/dashboard/page.tsx`
- Layout: LTS panel and LRC chart side by side below the Reserve Health Widget
- LTS takes ~40% width, LRC takes ~60% width
- Below md breakpoint: stack vertically

### Agent's Discretion
- Exact SVG dimensions and viewBox for the chart
- D3 scale padding and margin conventions
- Tooltip animation/transition details
- Mobile-responsive chart resize approach
- Trigger card spacing and grid layout
- Progress bar height and border radius

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 3 Foundation (MUST READ)
- `apps/insurer-dashboard/src/types/index.ts` — TriggerEvent, LossRatioDataPoint types  
- `apps/insurer-dashboard/src/store/dashboardStore.ts` — addTrigger, clearTrigger actions
- `apps/insurer-dashboard/src/data/mock/triggers.ts` — Mock trigger data (6 triggers)
- `apps/insurer-dashboard/src/data/mock/lossRatio.ts` — Mock 30-day loss ratio data
- `apps/insurer-dashboard/src/hooks/useTriggers.ts` — Trigger data hook
- `apps/insurer-dashboard/src/hooks/useLossRatio.ts` — Loss ratio data hook
- `apps/insurer-dashboard/src/services/socket.ts` — Socket.io service + mock simulator
- `apps/insurer-dashboard/src/app/globals.css` — Shield color tokens + pulse animations
- `apps/insurer-dashboard/src/constants/thresholds.ts` — RAINFALL_THRESHOLD_3HR, LOSS_RATIO_GREEN, LOSS_RATIO_AMBER

</canonical_refs>

<specifics>
## Specific Ideas

- The LRC chart should use `<linearGradient>` SVG elements with three color stops matching the threshold boundaries — green below 65%, transitioning to amber at 65%, transitioning to red at 80%
- D3 `d3.area()` generator computes the path string, but React renders `<path d={areaPath} />` — never let D3 touch the DOM
- For axis rendering, compute tick positions with D3 scales, render `<text>` and `<line>` elements with React
- The trigger panel should feel "alive" — the Socket.io simulator making progress bars creep up creates tension during the demo
- Use `useCallback` and `useMemo` for D3 computations to avoid recalculating on every render
- Chart must render at 0 width gracefully (SSR/initial mount) — use a ref-based resize observer or fixed aspect ratio

</specifics>

<deferred>
## Deferred Ideas

- Real Socket.io connection to backend trigger service (mock simulator for now)
- Trigger history timeline (scrollable log of past trigger events)
- Loss ratio breakdown by city (single aggregate chart for now)
- Premium vs claims dual-axis overlay chart
- Export chart as PNG

</deferred>

---

*Phase: 04-live-trigger-loss-ratio-day-2*
*Context gathered: 2026-04-02 from milestone spec + Phase 3 codebase analysis*
