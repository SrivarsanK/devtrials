# Project Roadmap: Milestone v1.4

## Milestone v1.4: Chennai Zone Classification Integration

**Goal:** Integrate 62 classified Chennai zones (18 Red, 28 Orange, 16 Green) with priority-based risk visualization into the live risk map and zones pages in the `apps/web` insurer dashboard.

### Phase 12: Zone Data Layer & Risk Map Integration

**Goal:** Create the zone classification dataset with geocoded coordinates and render color-coded zone markers on the Leaflet risk map with interactive controls.

- **Requirements:** ZONE-01, ZONE-02, ZONE-03, ZONE-04

- **Success Criteria:**
  1. A `chennaiZones.ts` data module exports all 62 zones with name, region, lat/lng coordinates, and risk tier
  2. The live risk map renders colored circle markers — Red zones with pulsing glow, Orange zones steady, Green zones subtle
  3. Clicking a zone marker shows a popup with zone name, region, and priority classification
  4. An interactive legend with toggle controls allows showing/hiding zones by tier
  5. Red zones appear in the priority alerts sidebar with appropriate severity styling (critical glow)

### Phase 13: Zones Page Classification & Polish

**Goal:** Update the Zones page to display all 62 zones grouped by risk classification with color-coded priority styling.

- **Requirements:** ZONE-05

- **Success Criteria:**
  1. The Zones page displays 62 zones grouped into Red, Orange, Green sections with clear visual separation
  2. Each zone card shows a color-coded badge (Red/Orange/Green) matching its classification
  3. Risk tier summary statistics appear at top of the page (18 Red, 28 Orange, 16 Green)
  4. Zone search filters correctly across all classification groups
  5. The existing zone card component shows the region label from the classification data
