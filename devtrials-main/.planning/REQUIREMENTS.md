# Milestone v1.1 Requirements: ShieldGuard Insurer Dashboard

This document tracks the requirements specifically scoped for Milestone v1.1: Insurer Dashboard.

## Reserve Health Widget (RHW)

- [ ] **RHW-001**: Display global status banner (GREEN/AMBER/RED) based on overall coverage ratio.
- [ ] **RHW-002**: Render six core metric cards: Total Reserve Balance, Active Liability, Coverage Ratio, Loss Ratio, Weekly Premium Inflow, Weekly Claims Outflow.
- [ ] **RHW-003**: Create expandable city cards for Chennai, Mumbai, and Delhi with status and metrics.
- [ ] **RHW-004**: Implement individual zone rows showing status dot, coverage ratio, reserve vs liability, and mock predicted claims.
- [ ] **RHW-005**: Provide Circuit Breaker toggle button per zone to pause/resume new policy sign-ups, synchronized with global Zustand store.

## Live Trigger Status Panel (LTS)

- [ ] **LTS-001**: Display real-time status of 6 parametric triggers (Rainfall, Extreme Heat, Flood/Waterlogging, Severe Air Pollution, Curfew/Section 144, Platform Force Majeure).
- [ ] **LTS-002**: Show progress bar visualizing current value vs threshold for each trigger.
- [ ] **LTS-003**: Update trigger status (NORMAL, WATCH, TRIGGERED) dynamically via simulated Socket.io events.
- [ ] **LTS-004**: Display affected worker count and estimated payout liability upon TRIGGERED state.
- [ ] **LTS-005**: Display pre-warning alert for forecast bounds crossing (e.g., rainfall crossing threshold in 4 hours).

## Loss Ratio Chart (LRC)

- [ ] **LRC-001**: Implement 30-day rolling time-series area chart of ShieldLife loss ratio using D3.js and React.
- [ ] **LRC-002**: Manage state with React for SVG DOM, rely on D3 for math and scale calculations only.
- [ ] **LRC-003**: Render area with gradient fill that changes color correctly when crossing 65% and 80% thresholds.
- [ ] **LRC-004**: Include standard reference dashed lines and an interactive hover tooltip showing precise daily metrics.

## Fraud Detection Panel (FDP)

- [ ] **FDP-001**: List mock flagged claims held for manual review based on fraud score rules (>0.6 held).
- [ ] **FDP-002**: Highlight severe risks such as GPS spoofing clusters (e.g., FRD-0441 matching GPS data of 34 workers in 50 meters).
- [ ] **FDP-003**: Provide Admin actions to Approve, Reject, or Flag for deep investigation.
- [ ] **FDP-004**: Sync resolved claims with fraud status count in Zustand store to reflect in the UI header/metrics in real time.

## 72-Hour Forecast & Circuit Breaker Controls (FCB)

- [ ] **FCB-001**: Show predicted payout liability, claim count and zone risk status utilizing mock LSTM outputs for all zones.
- [ ] **FCB-002**: Expose Circuit Breaker status per zone.
- [ ] **FCB-003**: Render manual pause/active controls for AMBER zones; visualize system auto-pauses when exceeding thresholds.
- [ ] **FCB-004**: Include Reinsurance Status Alert capability notifying Munich Re of significant risk exposures.

## Zone Risk Map (ZRM)

- [ ] **ZRM-001**: Embed interactive map of Chennai, Mumbai, and Delhi using Leaflet.js with client-side dynamic loading to prevent SSR error.
- [ ] **ZRM-002**: Render custom GeoJSON coverage polygons colored green/amber/red based on zone status.
- [ ] **ZRM-003**: Enable clickable zones that reveal a detail popup (reserve balance, active liability, status, active policies, circuit breaker status).
- [ ] **ZRM-004**: Dynamically update polygon fills based on `zone:status-changed` events via Zustand.

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| RHW-001 | 3 | Pending |
| RHW-002 | 3 | Pending |
| RHW-003 | 3 | Pending |
| RHW-004 | 3 | Pending |
| RHW-005 | 3 | Pending |
| LTS-001 | 4 | Pending |
| LTS-002 | 4 | Pending |
| LTS-003 | 4 | Pending |
| LTS-004 | 4 | Pending |
| LTS-005 | 4 | Pending |
| LRC-001 | 4 | Pending |
| LRC-002 | 4 | Pending |
| LRC-003 | 4 | Pending |
| LRC-004 | 4 | Pending |
| FDP-001 | 5 | Pending |
| FDP-002 | 5 | Pending |
| FDP-003 | 5 | Pending |
| FDP-004 | 5 | Pending |
| FCB-001 | 5 | Pending |
| FCB-002 | 5 | Pending |
| FCB-003 | 5 | Pending |
| FCB-004 | 5 | Pending |
| ZRM-001 | 6 | Pending |
| ZRM-002 | 6 | Pending |
| ZRM-003 | 6 | Pending |
| ZRM-004 | 6 | Pending |
