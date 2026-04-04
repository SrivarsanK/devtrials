# Project Roadmap: Milestone v1.0

## Milestone v1.0: Core Parametric Engine

**Goal:** Build the high-performance data engine that powers GigShield's parametric triggers and ML pricing.

### Phase 1: Foundation & Infrastructure

**Goal:** Setup the core backend services, database, and authentication.

- **Requirements:** BI-001, BI-002, BI-003, BI-004

- **Success Criteria:**
  1. REST API is alive and reachable.
  2. TimescaleDB is provisioned with initial trigger tables.
  3. JWT auth successfully protects a test endpoint.
  4. Redis is connected and caching a test key.

**Target features:**

- Backend Infrastructure (API, TimescaleDB, Redis, Cron)
- Parametric Trigger Monitoring (Rainfall, AQI, Heat)
- Core ML Inference (Dynamic Premium, Fraud Scoring)

## What This Is

### Phase 2: Parametric Trigger Monitoring

**Goal:** Implement the automated data fetching and logging system.

- **Requirements:** TM-001, TM-002, TM-003, TM-004

- **Success Criteria:**
  1. Cron job runs every 5 minutes.
  2. Weather/AQI data is successfully stored in TimescaleDB.
  3. Anomalies (threshold breaches) are logged correctly.

### Phase 3: ML Inference Service

**Goal:** Deploy the Python-based intelligence layer.

- **Requirements:** ML-001, ML-002, ML-003
- **Success Criteria:**
  1. FastAPI service returns scores for mock pricing/fraud requests.
  2. Integration tests between Node.js and FastAPI pass.
