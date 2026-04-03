# Phase 5: Fraud Intelligence & 72-Hour Forecast (Day 3) - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning
**Source:** Milestone v1.1 specification + Phase 3 mock data

<domain>
## Phase Boundary

This phase delivers two advanced AI-assisted dashboard components:
1. **Fraud Detection Panel (FDP)** — Interactive triage queue for mocked AI-flagged claims (e.g., GPS spoofing, anomalies).
2. **72-Hour Forecast & Circuit Breaker (FCB)** — Predictive zone liability projection based on mock LSTM outputs, with integrated circuit breaker controls.

Both plug directly into the existing `DashboardClient.tsx` grid layout below the Real-Time Monitoring block.
</domain>

<decisions>
## Implementation Decisions

### Component 1: Fraud Detection Panel (FDP)
**Component Location:** `src/components/insurer/FraudPanel.tsx`

**Requirements:**
- Mount side-by-side with Forecast Panel.
- Read `fraudAlerts` from Zustand (`useDashboardStore`).
- Display list of distinct fraud flags:
  - `GPS_SPOOF` (Severe - High Score > 0.9)
  - `ANOMALY` (Moderate/Watch)
  - `DUPLICATE` (Moderate)
- For each item, show ID, Score (colored red/orange depending on severity), Description, and pending action buttons (Approve, Reject, Investigate).
- Hook up "Approve`/`Reject`/`Investigate`" buttons to a mock `resolveFraudAlert(id)` action in Zustand Store (needs to be added if not fully structured yet).
- Show total "Pending Review" count in the header.

### Component 2: 72-Hour Forecast & Circuit Breaker (FCB)
**Component Location:** `src/components/insurer/ForecastPanel.tsx`

**Requirements:**
- Map over `mockForecasts` data.
- Display each zone's `predictedPayoutLakhs`, `dominantTrigger`, and `riskStatus` (Green, Amber, Red).
- **Circuit Breaker Integration:** Each row has a toggle switch or button mapping to the current circuit breaker status of the zone (using Zustand's `pausedZones` state).
  - Admins can manually click "Pause" for AMBER zones.
  - RED zones appear locked/Auto-paused for emphasis on system safety.
- **Reinsurance Alert:** Include a discrete "Reinsurance Status" warning badge at the top if the total predicted payout across all zones exceeds ₹50 Lakhs (mock calculation).

### Dashboard Integration
- Build a new horizontal row in `DashboardClient.tsx`.
- Include a section title "AI Risk Intelligence & Controls".
- Placed below the "Real-Time Monitoring" line.
- Grid: FDP takes `lg:col-span-2`, FCB takes `lg:col-span-3`.
</decisions>

<canonical_refs>
## Canonical References
- `src/data/mock/fraud.ts`
- `src/data/mock/forecasts.ts`
- `src/types/index.ts`
</canonical_refs>

<specifics>
## Specific Ideas
- The fraud scores (e.g., 0.94) can be rendered as a circular mini progress ring or a stark red badge.
- The circuit breaker buttons should mirror the styling logic of the Phase 3 `CircuitBreakerToggle.tsx`, but visually suited for a list/table view.
</specifics>
