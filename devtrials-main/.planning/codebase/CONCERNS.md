# Concerns: apps/web

## Technical Criticality
- **Hydration Mismatches**: Visible in current development logs; common with SSR-unsupported libraries like Three.js/Leaflet. Needs `ssr: false` or `dynamic()` imports to stabilize.
- **Bundle Bloat**: Heavy dependencies (`three`, `leaflet`, `animejs`, `@clerk/nextjs`) could lead to slow mobile performance for Raju and other gig workers.
- **Clerk Dependency**: The entire auth/dashboard flow is deeply coupled with Clerk. Migrating to another provider would be a multi-week refactor.

## Potential Bottlenecks
- **Mock Reliance**: The `fetch` fallback strategy (resilient API) might mask backend connectivity issues during production.
- **Client-Side GIS**: Large zone datasets or high-frequency trigger updates could impact Leaflet's UI performance on lower-end Android devices.
- **Visual Performance**: Excessive Three.js/Anime.js visual effects on the landing page/dashboard might degrade the core utility for those in a low-signal OR low-battery environment.

## Logic Risks
- **Payout Parsing**: The `inferredPayoutByType` in `lib/api.ts` is hardcoded. This needs to be moved to a configuration file or actual backend values to avoid financial discrepancies.
- **State desync**: No global state management (besides Clerk) is explicitly mentioned; potential for `triggers` and `zones` components to get out of sync without a store (Zustand/SWR/React Query).
