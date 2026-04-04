# Milestone v1.0 Requirements: Core Parametric Engine

This document tracks the requirements specifically scoped for Milestone v1.0.

## Backend Infrastructure (BI)

- [x] **BI-001**: RESTful API setup with Express and TypeScript.
- [x] **BI-002**: JWT-based authentication for core service communication.
- [x] **BI-003**: TimescaleDB setup for storing high-frequency trigger data.
- [x] **BI-004**: Redis integration for caching and rate limiting.

## Parametric Trigger Monitoring (TM)

- [x] **TM-001**: Implement Rainfall monitor pulling from OpenWeather API (>50mm/3hrs).
- [x] **TM-002**: Implement AQI monitor (>300 sustained 4hrs).
- [x] **TM-003**: Implement Heat Index monitor (>45°C sustained 3hrs).
- [x] **TM-004**: Node-cron worker for 5-minute polling and logging to TimescaleDB.

## ML Core (ML)

- [ ] **ML-001**: FastAPI service for model serving.
- [ ] **ML-002**: XGBoost dynamic pricing inference endpoint.
- [ ] **ML-003**: Isolation Forest fraud detector inference endpoint.

## Traceability

| REQ-ID | Phase | Status |
| --- | --- | --- |
| BI-001 | 1 | Completed |
| BI-002 | 1 | Completed |
| BI-003 | 1 | Completed |
| BI-004 | 1 | Completed |
| TM-001 | 2 | Completed |
| TM-002 | 2 | Completed |
| TM-003 | 2 | Completed |
| TM-004 | 2 | Completed |
| ML-001 | 3 | Pending |
| ML-002 | 3 | Pending |
| ML-003 | 3 | Pending |
