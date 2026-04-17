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
# Roadmap - Milestone v1.4

## Phase 12: ML Containerization & Local Orchestration
**Goal:** Create a unified ML suite and orchestrate the full stack locally via Docker.

- [ ] **ML-01**: Build `backend/ML-Dockerfile` bundling Gateway + 3 models.
- [ ] **ML-02**: Create root `docker-compose.yml` for Node API, ML Suite, and DB.
- [ ] **Success Criteria:** 
  - `docker compose up` starts all services.
  - Gateway correctly proxies requests to Pricing, Fraud, and Reserve models.

## Phase 13: Cloud Deployment Prep (Render & Vercel)
**Goal:** Configure deployments for external hosting.

- [ ] **ML-03**: Create `render.yaml` for ML Suite deployment.
- [ ] **API-01**: Refine `vercel.json` for Node.js API.
- [ ] **API-02**: Update API config to use Render service URL in production.
- [ ] **Success Criteria:** 
  - ML Suite builds and deploys to Render.
  - API functions on Vercel reach the ML Suite.

## Phase 14: Data Migration & Production Verification
**Goal:** Provision production DB and verify full stack connectivity.

- [ ] **DB-01**: Set up Render PostgreSQL and execute schema `.sql` files.
- [ ] **CON-01**: End-to-end verification of Dashboard -> Vercel API -> Render ML Suite -> DB.
- [ ] **Success Criteria:** 
  - Production DB contains all necessary schemas.
  - Real-time claims flow through the entire cloud infrastructure.
