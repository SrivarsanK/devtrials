# Technical Concerns & Debt

**Analysis Date:** 2026-04-04

## Core Concerns

- **External API Reliability:** The system depends on environmental data (`OpenWeather`, `AQICN`, `AccuWeather`). Robust error handling and logic are required for data gaps or API timeouts.
- **Frontend/Backend Synchronization:** `apps/web/src/lib/api.ts` implements **smart fallbacks** (mock data). While great for UI stability, it could mask integration issues if the backend is down during development or staging.
- **Parametric Trigger Logic:** Core logic in `backend/src/triggers/` must be highly reliable. Current tests (`triggers.test.ts`) are a start, but more edge cases (e.g., partial rain data) should be covered.
- **Redis Fail-Soft:** The backend handles Redis connection failures gracefully, but this might lead to missed deduplication in high-traffic scenarios if Redis is intermittently unavailable.

## Technical Debt

- **Frontend Testing:** Absence of automated UI tests (e.g., Playwright or Vitest) for `apps/web`. The complexity of 3D (Three.js) and Maps (Leaflet) makes manual testing labor-intensive.
- **Shared Code Maturity:** `packages/ui` is still in early stages. Many critical UI components (HeroShield, PriorityAlerts) remain in `apps/web/src/components` instead of being generalized in the shared package.
- **Database Migrations:** The project currently uses `scripts/db-init.ts` and raw SQL. A formal migration tool (e.g., Prisma or TypeORM migrations) would improve schema evolution consistency.
- **ML Integration:** The reliance on `http://localhost:8000` for an internal ML service indicates an area currently in development or dependent on local infrastructure.

## Strategic Observations

- **Modern Stack Overhead:** Using Next.js 16.2.1 and React 19.2.4 puts the project at the "bleeding edge," which is a strength but requires careful monitoring of experimental features or breaking changes.
- **Geospatial Performance:** Heavy reliance on `Leaflet` for heatmaps and zone rendering. As the number of monitored zones increases, client-side rendering performance will become a key UX bottleneck.
- **Real-time UX:** The use of `socket.io` for trigger alerts is great, but needs to be robust against client-side connection drops or tab hibernation in mobile browsers.

## TODOs & Roadmap Gaps

- [ ] **E2E Testing:** Set up Playwright for critical user journeys (e.g., checking active triggers).
- [ ] **Type Sharing:** Formalize shared types between `backend` and `apps/web` to avoid duplication in `api.ts`.
- [ ] **Auth Lockdown:** Finalize full backend route protection with Clerk JWT verification in production.
- [ ] **Load Testing:** Verify the trigger polling performance of `node-cron` with a large number of zones.

---

*Concerns analysis: 2026-04-04*
