# Phase 3: Setup & Reserve Health Widget (Day 1) - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning
**Source:** User-provided comprehensive specification (milestone kick-off payload)

<domain>
## Phase Boundary

This phase delivers:
1. **Next.js project scaffold** — create-next-app with TypeScript, TailwindCSS, App Router, src directory
2. **Shared types and constants** — TypeScript interfaces and threshold constants importable across all components
3. **Zustand global store** — dashboardStore.ts for cross-component state synchronization
4. **Mock data modules** — realistic mock data matching real API response shapes with simulated delays
5. **API service layer** — api.ts with all REST endpoint stubs, socket.ts with Socket.io event stubs
6. **Custom hooks** — useReserveHealth, useTriggers, useFraudAlerts, useForecasts, useLossRatio, useSocket — all with USE_MOCK environment variable switch
7. **Reserve Health Widget** — Component 1 of 6: the financial heartbeat of the entire insurer operation

</domain>

<decisions>
## Implementation Decisions

### Project Setup
- Framework: Next.js@latest with TypeScript, ESLint, TailwindCSS, src directory, App Router
- State Management: Zustand with devtools and subscribeWithSelector middleware
- Icons: lucide-react
- Charts: Recharts (simple charts), D3.js (loss ratio — future phase)
- Maps: Leaflet.js + react-leaflet (future phase)
- Real-time: Socket.io client
- Install: `npm install recharts d3 leaflet react-leaflet socket.io-client lucide-react zustand`
- Dev Install: `npm install @types/leaflet @types/d3 --save-dev`
- shadcn/ui for component library

### Folder Structure
- `src/app/dashboard/page.tsx` — Main dashboard page
- `src/app/page.tsx` — Redirects to /dashboard
- `src/components/insurer/ReserveHealthWidget.tsx` — Component 1
- `src/services/api.ts` — ALL REST API calls
- `src/services/socket.ts` — ALL Socket.io events
- `src/store/dashboardStore.ts` — Zustand shared state
- `src/hooks/useReserveHealth.ts` — Mock to real switch hook
- `src/hooks/useSocket.ts` — Socket.io connection lifecycle
- `src/data/mock/reserves.ts` — Mock GlobalReserveHealth
- `src/types/index.ts` — All TypeScript types
- `src/constants/thresholds.ts` — All threshold constants
- `src/constants/zones.ts` — All zone definitions
- `src/constants/tiers.ts` — All tier definitions

### Environment Variables
- `NEXT_PUBLIC_USE_MOCK=true` — Mock mode for development
- `NEXT_PUBLIC_API_URL=http://localhost:4000` — Backend API URL

### Mock-to-Real Switch Pattern
- Every custom hook checks `NEXT_PUBLIC_USE_MOCK` env var
- Mock mode returns local data with simulated 600ms delay
- Real mode calls actual API service functions
- If real API fails, falls back to mock data (demo protection)
- Zero component changes required when switching

### Reserve Health Widget — Four Visual Layers

**Layer 1: Global Banner**
- Single GREEN/AMBER/RED colored banner at top of dashboard
- Mock status: AMBER
- Mock message: "Chennai northeast monsoon active — Delhi AQI rising"
- RED status shows pulsing dot animation

**Layer 2: Six Metric Cards**
- Total Reserve Balance: ₹4.2 Cr (green)
- Active Liability: ₹3.1 Cr (white)
- Coverage Ratio: 135% (green)
- Loss Ratio: 61.3% (amber)
- Weekly Premium Inflow: ₹48.3 L (blue)
- Weekly Claims Outflow: ₹29.6 L (white)

**Layer 3: City Cards (Expandable)**
- Chennai: AMBER, 12,450 policies, Reserve ₹142L, Liability ₹168L (expanded by default)
- Mumbai: GREEN, 18,230 policies, Reserve ₹198L, Liability ₹142L
- Delhi: AMBER, 9,870 policies, Reserve ₹80L, Liability ₹96L

**Layer 4: Zone Rows (inside city cards)**
| Zone | City | Status | Coverage | Reserve | Liability | Policies | Predicted 7d | Paused |
|------|------|--------|----------|---------|-----------|----------|-------------|--------|
| Anna Nagar | Chennai | RED | 75% | ₹18.4L | ₹24.6L | 1,840 | ₹22.1L | YES |
| T Nagar | Chennai | AMBER | 110% | ₹31.2L | ₹28.4L | 2,210 | ₹18.6L | No |
| Tambaram | Chennai | GREEN | 144% | ₹44.8L | ₹31.2L | 3,100 | ₹8.2L | No |
| Dharavi | Mumbai | AMBER | 109% | ₹42.1L | ₹38.6L | 3,860 | ₹12.4L | No |
| Andheri | Mumbai | GREEN | 155% | ₹68.4L | ₹44.2L | 4,420 | ₹6.8L | No |
| Laxmi Nagar | Delhi | AMBER | 88% | ₹28.6L | ₹32.4L | 2,840 | ₹14.2L | No |
| Karol Bagh | Delhi | GREEN | 119% | ₹34.2L | ₹28.8L | 2,880 | ₹7.6L | No |

### Circuit Breaker
- Toggle button per zone that pauses new policy sign-ups when reserves are stressed
- Active state: green, "Active" — new policies can be sold
- Paused state: red, "Paused" — no new sign-ups, existing policyholders fully covered
- Currently paused: CHN_ANNA_NAGAR only
- Updates Zustand store → all components stay in sync
- Highest-impact demo moment for hackathon judges

### Coverage Ratio Thresholds
- GREEN: >= 120% — Safe
- AMBER: 90% to 120% — Watch carefully
- RED: Below 90% — Critical

### Loss Ratio Thresholds
- GREEN: 65% or below
- AMBER: 65% to 80%
- RED: Above 80%

### Zustand Store Shape
- Data state: reserveHealth, activeTriggers, fraudAlerts, forecasts
- UI state: pausedZones (Set<string>), selectedCity, socketConnected, lastUpdated
- Actions: setReserveHealth, addTrigger, clearTrigger, addFraudAlert, resolveFraudAlert, toggleZonePause, setSelectedCity, setSocketConnected
- Computed: getZoneStatus(zoneId), getPendingFraudCount(), getActiveTriggerCount()

### Agent's Discretion
- Exact TailwindCSS utility classes and visual styling approach
- shadcn/ui component selection and composition
- Animation implementation details for pulsing dots
- Dashboard layout/grid arrangement
- Responsive breakpoint handling
- Error boundary placement

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<specifics>
## Specific Ideas

- Use `'use client'` directive on every component using React hooks (required by Next.js App Router)
- Reserve Health Widget is the single most important component — financial heartbeat of entire operation
- Circuit breaker toggle is the highest-impact demo moment for hackathon judges
- Pulsing red dot animation on RED zones — must be impossible to miss even from across the room
- Dashboard optimized for desktop viewing (insurer operations team)
- All threshold values MUST be imported from shared constants — never hardcoded in components

</specifics>

<deferred>
## Deferred Ideas

- Live Trigger Status Panel (Phase 4)
- Loss Ratio Area Chart with D3.js (Phase 4)
- Fraud Detection Panel (Phase 5)
- 72-Hour Forecast & Circuit Breaker Controls (Phase 5)
- Zone Risk Map with Leaflet.js (Phase 6)
- Hidden demo control panel for live judge demonstration
- State persistence to localStorage for demo recovery

</deferred>

---

*Phase: 03-setup-reserve-health-widget-day-1*
*Context gathered: 2026-04-02 via user-provided milestone specification*
