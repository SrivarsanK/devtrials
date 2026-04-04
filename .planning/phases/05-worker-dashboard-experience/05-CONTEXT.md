# Phase 5: Worker Dashboard & PWA Capabilities - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the main authenticated "command center" for the worker. It's designed to be used as a PWA on a mobile device while they are out for deliveries.

- **URL:** `/dashboard`
- **Key Views:** Status badge, Zone Risk alerts, Recent Claims.

</domain>

<decisions>
## Implementation Decisions

### WD-01: Active Coverage Status
- Large, bold "Active" badge with the current plan (e.g. Guard Plus) displayed.
- "Next Payment" date and "Zone" id (e.g. TN-CHE-CENTRAL).

### WD-02: Live Zone Risk Alerts
- Interactive component showing "current risk level" (Low, Medium, High).
- Weather alerts (e.g. "Heavy Rain in 2 hours") from a mock source.

### WD-03: Claims History
- Simple list of recent payments or triggers (e.g. "₹240 Payout - Cyclone Alert - Mar 28").

### WD-04: PWA Dashboard
- Add `manifest.json` and `apple-touch-icon`.
- Set background to `#0e0e0e` for splash screens.
- Mobile-first layout (430px container focus within the larger dashboard context?).

### UI/UX Consistency
- Must use the same Header/Nav as the landing/onboarding (with EN/Tamil toggle).
- Stick to the `#f97316` (orange) accent for actionable alerts.

</decisions>

<canonical_refs>
## Canonical References
- `apps/user-dashboard/src/app/onboarding/page.tsx` — Transition point after enrollment.
- `apps/user-dashboard/src/components/ui/` — Shared UI components.
- `apps/user-dashboard/public/` — Asset location for icons/manifest.
</canonical_refs>

<specifics>
## Specific Ideas
- Use dynamic charts (simple lines/bars) for "Weekly Coverage Stats" (already present in landing page mockup?).
- Reuse the "Plan Cards" style for the dashboard stats.
</specifics>

<deferred>
## Deferred Ideas
- Real GPS tracking integration.
- Real-time notification system (Push APIs).
</deferred>
