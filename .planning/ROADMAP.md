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
