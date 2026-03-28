# External Integrations

**Analysis Date:** 2026-03-28

## Core Services

**Authentication:**
- Clerk (Next.js) - Primary identity provider
- Auth middleware (backend) - Handles JWT verification for protected routes

**Database:**
- PostgreSQL / TimescaleDB (`DATABASE_URL`) - Primary persistence for application state
- Redis (`REDIS_URL`) - Caching and background job queue storage

**Payments:**
- Razorpay (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) - Payment gateway integration

## External APIs

**Natural Language Processing:**
- ML_API_URL (`http://localhost:8000`) - Dedicated internal ML service

**Weather & Environmental Data:**
- OpenWeather API (`OPENWEATHER_API_KEY`) - Real-time weather data
- AQICN (Air Quality) API (`AQICN_API_KEY`) - Air quality monitoring
- AccuWeather API (`ACCUWEATHER_API_KEY`) - Weather forecasting

## Communications

**Real-time Updates:**
- Socket.io - Bi-directional real-time communication between server and web app

**Webhooks:**
- Svix (`svix` 1.89.0) - Likely used for reliable webhook delivery and event handling

## Configuration

**Secrets Management:**
- `.env` files locally
- Environment variables in CI/CD (GitHub Actions/Vercel/Netlify)

---

*Integrations analysis: 2026-03-28*
*Update after adding new external services*
