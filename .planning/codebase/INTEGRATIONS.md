# External Integrations

**Analysis Date:** 2026-03-21

## APIs & External Services

**Parametric Trigger Sources:**
- OpenWeatherMap API - Heavy rainfall and extreme heat detection (Free tier limit 1000 calls/day)
- IMD API - Official flood warnings and alerts
- CPCB API / AQICN - Air Quality Index (AQI) data
- Google Maps Traffic API - Waterlogging detection via traffic anomalies
- Mock JSON Feed - Civil disruption (Section 144) scenarios

**Payment Processing:**
- Razorpay - UPI disbursements for instant claim payouts (Test Mode for hackathon)

**Platform Portals (Mocked):**
- Swiggy / Zomato APIs - Worker GPS location, login status, and order flow metrics

## Data Storage

**Databases:**
- PostgreSQL - Primary relational data store (Policies, Claims, Workers)
  - Extensions: TimescaleDB for time-series trigger events tracking
- Redis - Deduplication, API rate limiting, and session cache

## Authentication & Identity

**Auth Provider:**
- Custom JWT + bcrypt - Multi-role session management (worker, insurer, admin)
- Identification: Zomato/Swiggy Partner ID

## Monitoring & Observability

*(Pending implementation in later phases - typically Sentry, Datadog or similar)*

## CI/CD & Deployment

**Hosting:**
- Vercel - Next.js frontend applications deployment
- Render - Node.js Express backend and Python FastAPI ML services

**CI Pipeline:**
- GitHub Actions - Automated testing (pytest, npm test) and continuous integration

## Environment Configuration

**Development:**
- Required env vars: DATABASE_URL, REDIS_URL, OPENWEATHER_API_KEY, AQICN_API_KEY, RAZORPAY_KEY*, ML_API_URL
- Secrets location: `.env` file (copied from `.env.example`)

## Webhooks & Callbacks

**Incoming:**
- Platform webhook syncs for worker location and order status (Mocked)

**Outgoing:**
- Real-time Socket.io events pushed to Insurer Dashboard for triggers
- Direct API disbursements to Razorpay for payouts

---

*Integration audit: 2026-03-21*
*Update when adding/removing external services*
