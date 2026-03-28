# Testing Strategy

**Analysis Date:** 2026-03-28

## Core Principles

- **Testing Framework:** `Jest` for backend API and internal libraries.
- **Language Support:** `ts-jest` for TypeScript integration.

## Backend Testing (Jest)

- **Test Files:** `*.test.ts` located alongside the source code in the `src/` directory.
- **Unit Tests:** Individual logic tests (e.g., `triggers.test.ts`).
- **Integration Tests:** Endpoint testing (`app.test.ts`) using `supertest`.
- **Mocking:** Likely mock responses for external APIs (weather, payments) and databases (PostgreSQL/Redis).

## Frontend Testing (Next.js)

- Currently, no dedicated frontend tests (e.g., React Testing Library or Playwright) are present in the `apps/web` directory structure.
- **Verification:** Manual UAT and browser testing are currently used for UI development.

## Quality Assurance

- **Static Analysis:** `eslint` for code quality and `typescript` for type safety.
- **CI/CD:** GitHub Actions (likely present in `.github/`) for automated build and test runs on PRs.
- **Environment Management:** `.env.example` provides the starting point for test environment configuration.

## Tooling

- `jest`: Test runner and assertion library.
- `ts-jest`: TypeScript support for Jest.
- `supertest`: HTTP assertions for Express application testing.

---

*Testing strategy analysis: 2026-03-28*
*Maintain after adding new testing layers*
