# External Integrations

**Analysis Date:** 2026-04-04

## Core Services

**Authentication:**
- **Clerk (Next.js):** Primary identity provider with dark mode theme integration.
- **Internal Auth Middleware (backend):** Handles JWT verification for protected routes.

**Database:**
- **PostgreSQL / TimescaleDB (`DATABASE_URL`):** Primary persistence for application state, triggers, and zone definitions.
- **Redis (`REDIS_URL`):** Caching and background job deduplication for triggers. Fail-soft integration in backend.

## External APIs

**Natural Language Processing:**
- **ML_API_URL (`http://localhost:8000`):** Dedicated internal ML service for trigger analysis.

**Environmental Data:**
- **OpenWeather API (`OPENWEATHER_API_KEY`):** Real-time weather data for Rainfall and HeatIndex triggers.
- **AQICN (Air Quality) API (`AQICN_API_KEY`):** Global air quality monitoring.
- **AccuWeather API (`ACCUWEATHER_API_KEY`):** Weather forecasting and minute-by-minute precipitation tracking.

## Communications

**Real-time Updates:**
- **Socket.io:** Bi-directional real-time communication between the backend and web application for trigger alerts.

**Webhooks:**
- **Svix (`svix` 1.89.0):** Used for reliable webhook delivery and event handling (likely for payout processing).

## Configuration

**Secrets Management:**
- **Local .env files:** Present in both root, backend, and apps/web.
- **CI/CD:** Environment variables in GitHub Actions, Vercel, and Netlify dashboards.

---

*Integrations analysis: 2026-04-04*
