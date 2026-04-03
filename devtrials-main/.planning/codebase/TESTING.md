# Testing: apps/web

## Current State (Milestone v1.2 Early Phase)
Automated testing is currently a **gap** in the `apps/web` project. The development team relies on manual verification and mock resilience paths.

## Current Tooling
- **ESLint 9**: Standard linting rules and `@typescript-eslint` checks.
- **Next.js Dev Overlay**: Real-time hydration and runtime error reporting.

## Strategy
1. **Manual Visual Vetting**: Use the dashboard and public landing pages to check for responsive regressions and layout shifts.
2. **Mock Resilience**: The `fetch` fallback mechanism in `lib/api.ts` ensures components can be developed and visually tested without a backend.
3. **Clerk Dev Mode**: Using the sandbox environment for identity flow verification.

## Future Recommendations
- **Playwright**: End-to-end testing for the enrollment (KYC) and payout flows.
- **Vitest**: Unit testing for the `Payout` formula and API transformation logic in `lib/api.ts`.
- **Storybook**: Visual regression testing for the high-fidelity components like `HeroShield` and `RiskMap`.
