# Technical Concerns & Debt

**Analysis Date:** 2026-03-28

## Core Concerns

- **External API Dependencies:** Weather and environmental data (`OpenWeather`, `AQICN`) are primary dependencies that may require robust error handling and fallback logic.
- **Parametric Trigger Logic:** Core logic for insurance triggers must be highly reliable and thoroughly tested (`triggers.test.ts` is a good start).
- **Security:** CSRF and XSS protection on the frontend (Next.js 16 should handle much of this) and strict rate-limiting on sensitive backend routes are critical.

## Technical Debt

- **Monorepo Complexity:** `pnpm` workspaces and Next.js 16/React 19 migration (recent) may introduce build or compatibility issues.
- **Frontend Testing:** Absence of unit and E2E tests for the frontend application (`apps/web`) is a significant gap.
- **Shared Code:** `packages/ui` is relatively empty, suggest moving shared components from `apps/web/src/components` to `packages/ui` as the codebase grows.
- **ML Integration:** The reliance on a local ML service (`http://localhost:8000`) and placeholder environment variables indicates this is an area of ongoing development.

## Strategic Observations

- **Modern Stack:** The use of very modern technologies (Next.js 16, React 19, TypeScript 5.x) is a strength but may require careful management of breaking changes in edge case scenarios.
- **Geospatial Focus:** The heavy reliance on `Leaflet` and `react-leaflet` suggests that spatial performance and map rendering are key UX concerns.

## TODOs & Roadmap Gaps

- **Auth Middleware:** Ensure backend auth middleware is robustly integrated with Clerk.
- **Database Migrations:** Formalize a migration strategy (currently using `sync-db.ts` or raw SQL).
- **Frontend Tests:** Set up a frontend testing framework (e.g., Vitest or Playwright).

---

*Concerns analysis: 2026-03-28*
*Maintain after addressing major technical debt items*
