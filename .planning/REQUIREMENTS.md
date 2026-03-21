# Milestone v1.0 Requirements: Core Parametric Engine

This document tracks the requirements specifically scoped for Milestone v1.0.

## Backend Infrastructure (BI)

- [ ] **BI-001**: RESTful API setup with Express and TypeScript.
- [ ] **BI-002**: JWT-based authentication for core service communication.
- [ ] **BI-003**: TimescaleDB setup for storing high-frequency trigger data.
- [ ] **BI-004**: Redis integration for caching and rate limiting.

## Parametric Trigger Monitoring (TM)

- [ ] **TM-001**: Implement Rainfall monitor pulling from OpenWeather API (>50mm/3hrs).
- [ ] **TM-002**: Implement AQI monitor (>300 sustained 4hrs).
- [ ] **TM-003**: Implement Heat Index monitor (>45°C sustained 3hrs).
- [ ] **TM-004**: Node-cron worker for 5-minute polling and logging to TimescaleDB.

## ML Core (ML)

- [ ] **ML-001**: FastAPI service for model serving.
- [ ] **ML-002**: XGBoost dynamic pricing inference endpoint.
- [ ] **ML-003**: Isolation Forest fraud detector inference endpoint.

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| BI-001 | 1 | Pending |
| BI-002 | 1 | Pending |
| BI-003 | 1 | Pending |
| BI-004 | 1 | Pending |
| TM-001 | 2 | Pending |
| TM-002 | 2 | Pending |
| TM-003 | 2 | Pending |
| TM-004 | 2 | Pending |
| ML-001 | 3 | Pending |
| ML-002 | 3 | Pending |
| ML-003 | 3 | Pending |
