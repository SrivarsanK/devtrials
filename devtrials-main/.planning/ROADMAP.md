# Project Roadmap: Milestone v1.1

## Milestone v1.1: ShieldGuard Insurer Dashboard
**Goal:** Build the desktop command center that ShieldLife General Insurance operations team uses to monitor the entire parametric insurance operation in real time.

### Phase 3: Setup & Reserve Health Widget (Day 1)
**Goal:** Initialize the Next.js scaffold and construct the financial heart of the operation.
- **Requirements:** RHW-001, RHW-002, RHW-003, RHW-004, RHW-005
- **Success Criteria:**
  1. Next.js app scaffold created with Zustand store and shared mock data modules.
  2. Global status banner highlights coverage status.
  3. Six core metric cards and expandable city cards render accurately.
  4. Circuit breaker toggle button changes global state via Zustand successfully.

### Phase 4: Live Trigger Status & Loss Ratio Chart (Day 2)
**Goal:** Implement real-time monitoring of triggers and financial flow analysis.
- **Requirements:** LTS-001, LTS-002, LTS-003, LTS-004, LTS-005, LRC-001, LRC-002, LRC-003, LRC-004
- **Success Criteria:**
  1. Simulated Socket.io events successfully feed real-time trigger status.
  2. LTS displays dynamic alerts and thresholds bounds appropriately.
  3. D3.js calculates the area chart path rendering a dynamic gradient fill based on threshold checks.
  4. React cleanly mounts the chart SVG without DOM clashing.

### Phase 5: Fraud Intelligence & 72-Hour Forecast (Day 3)
**Goal:** Equip administrators with AI-assisted foresight and fraud queue management.
- **Requirements:** FDP-001, FDP-002, FDP-003, FDP-004, FCB-001, FCB-002, FCB-003, FCB-004
- **Success Criteria:**
  1. Mock fraud alerts are triaged effectively via UI queue interactions.
  2. Forecast logic dynamically renders projected risk for zones based on LSTM output constraints.
  3. Actions in FCB successfully trigger system pausing and emit notifications.

### Phase 6: Zone Risk Map Validation (Day 4)
**Goal:** Map operations visually using interactive Leaflet map components.
- **Requirements:** ZRM-001, ZRM-002, ZRM-003, ZRM-004
- **Success Criteria:**
  1. Client-side Leaflet loads without SSR `window is not defined` crash.
  2. GeoJSON polygons correctly draw boundaries mapping map metrics.
  3. Map polygons reactively colorize (GREEN/AMBER/RED) based on status changes triggered globally.
