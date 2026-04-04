# Phase 7: Backend Integration & Live Dashboard Data - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase bridges the gap between the high-fidelity UI built in Phases 4-5 and the parametric trigger engine in the `backend` service. It transitions the Worker Dashboard from static "mock" data to live API-driven content.

- **Scope:** `apps/user-dashboard`, `backend/src/routes/triggers.ts`.
- **Primary Goal:** Connect the Dashboard's Risk Feed, Stats, and History to the Backend API.
- **Secondary Goal:** Implement a "Manual Poll" capability for testing the trigger lifecycle from the UI.

</domain>

<decisions>
## Implementation Decisions

### INT-01: API Service Layer
- Create a central `api.ts` or `TriggerService.ts` in the dashboard to encapsulate fetch logic.
- Use environment variables for the Backend URL.

### INT-02: Polling Strategy
- The Dashboard should poll `/api/triggers` every 30 seconds (or use SWR/React Query for caching).
- Manual "Refresh" button in UI must trigger the backend `/api/triggers/poll` endpoint.

### INT-03: Data Normalization
- Map backend `TriggerEvent` objects to the existing `RiskFeed` and `StatsHistory` component props.
- Ensure Tamil localization handles dynamic strings returned by the API (or fallback to dictionary).

</decisions>

<canonical_refs>
## Canonical References
- `apps/user-dashboard/src/app/dashboard/page.tsx` — Target for integration.
- `backend/src/routes/triggers.ts` — API source.
- `apps/user-dashboard/src/components/dashboard/RiskFeed.tsx` — UI component to update.
- `apps/user-dashboard/src/components/dashboard/StatsHistory.tsx` — UI component to update.
</canonical_refs>

<specifics>
## Specific Integration Targets
- **Live Feed:** Pull latest 3-5 triggers from `/api/triggers?limit=5`.
- **Stats:** Calculate "Total Protected" by summing payouts in the trigger history.
- **Manual Trigger:** The refresh icon in `RiskFeed` should trigger a full system poll.
</specifics>
