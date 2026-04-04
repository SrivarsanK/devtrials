# Phase 7: Backend Integration & Live Dashboard Data - Plan

This phase connects the `user-dashboard` frontend to the `backend` trigger API.

## 1. Setup API Infrastructure
- **Step 1.1:** Add `BACKEND_URL` to `.env.local` in `apps/user-dashboard`.
- **Step 1.2:** Create `apps/user-dashboard/src/lib/api.ts` with base fetch configuration and a `TriggerService` class.

## 2. Integrated Trigger Poll
- **Step 2.1:** Implement `TriggerService.pollTriggers()` to call `POST /api/triggers/poll`.
- **Step 2.2:** Update `handleRefresh` in `RiskFeed.tsx` to use this method and show a loading toast.

## 3. Dynamic Risk Feed
- **Step 3.1:** Implement `TriggerService.getTriggers()` to fetch recent events from `/api/triggers`.
- **Step 3.2:** Update `RiskFeed.tsx` to use the fetched data instead of hardcoded `alerts`.
- **Step 3.3:** Map `TriggerEvent` metadata (e.g. `weatherDescription`) to the UI display.

## 4. Live Statistics & History
- **Step 4.1:** Update `StatsHistory.tsx` to aggregate payouts from the backend events.
- **Step 4.2:** Replace static `historySteps` with real historical outcomes from the trigger engine.

## 5. Verification & Testing
- **Step 5.1:** E2E test: Trigger a mock rainfall event via backend script or `/api/triggers/poll` with mock data.
- **Step 5.2:** Verify dashboard auto-updates to show the new trigger event in the feed and history.
- **Step 5.3:** Check Tamil translations for dynamically returned API metadata.
