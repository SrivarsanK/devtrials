# Project Requirements

This document tracks all validated, active, and out-of-scope requirements for RideSuraksha.

## Milestone v1.4 Requirements: Backend & ML Deployment

### ML Suite Infrastructure
- [ ] **ML-01**: Build unified Dockerfile for all ML services (Gateway, Pricing, Fraud, Reserve).
- [ ] **ML-02**: Orchestrate local environment using `docker-compose.yml` (App, ML, DB).
- [ ] **ML-03**: Configure `render.yaml` for automated deployment to Render.com.

### API Deployment
- [ ] **API-01**: Configure `vercel.json` for hosting Node.js/Express API.
- [ ] **API-02**: Implement environment-aware networking (prod URLs vs local).

### Data & Connectivity
- [ ] **DB-01**: Provision production PostgreSQL on Render and verify connectivity.
- [ ] **CON-01**: Cross-cloud communication between Vercel (API) and Render (ML Suite).

## Traceability Tracker

| REQ-ID | Phase | Status |
|--------|-------|--------|
| ML-01  | Phase 12 | Pending |
| ML-02  | Phase 12 | Pending |
| ML-03  | Phase 13 | Pending |
| API-01 | Phase 13 | Pending |
| API-02 | Phase 13 | Pending |
| DB-01  | Phase 14 | Pending |
| CON-01 | Phase 14 | Pending |

## Future Extensibility / Out of Scope (This Milestone)
- Autoscaling ML instances (manual for now).
- Multi-region deployment.
