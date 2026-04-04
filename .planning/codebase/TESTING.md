# Testing Strategy

**Analysis Date:** 2026-04-04

## Core Principles

- **Primary Logic Testing:** `Jest` for backend API and business logic.
- **Support:** `ts-jest` for TypeScript integration and `supertest` for HTTP assertions.

## Backend Testing (Jest)

- **Unit Tests:** `backend/src/triggers.test.ts` – Tests the parametric trigger monitoring and payout logic.
- **Integration Tests:** `backend/src/app.test.ts` – Tests full request-response cycles and API availability.
- **Mocking Strategy:** Uses `jest.fn()` to mock external environmental APIs (Rainfall, AQI, HeatIndex) ensuring tests are deterministic and independent of network conditions.

## Frontend Testing (Next.js)

- **Status:** Currently, no dedicated automated UI tests (e.g., Playwright) are present.
- **Manual QA:** UAT is performed via the browser, focusing on the responsive UI, 3D Hero effects, and real-time dashboard updates.
- **Smart Fallbacks:** The frontend `lib/api.ts` includes built-in mock fallback logic to ensure visual consistency when the backend is disconnected during development.

## Quality Assurance

- **Type Safety:** Strict `typescript` configurations across the monorepo.
- **Static Analysis:** `eslint` with Next.js specific rules for the frontend.
- **Environment Management:** `backend/.env.example` provides the starting point for test environment configuration.
- **CI/CD:** Automated build and test runs are executed in GitHub Actions for PR verification.

## Tooling

- **jest**: Test runner and assertion library (~v29.7.0).
- **ts-jest**: TypeScript support for Jest.
- **supertest**: HTTP assertions for testing Express endpoints.
- **clerk**: Integrated at the layout level for identity verification.

---

*Testing strategy analysis: 2026-04-04*
