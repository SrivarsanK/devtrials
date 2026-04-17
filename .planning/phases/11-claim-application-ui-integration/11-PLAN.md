---
wave: 1
depends_on: []
files_modified:
  - "apps/user-dashboard/src/lib/types/dashboard.ts"
  - "apps/user-dashboard/src/lib/api/dashboard.ts"
  - "apps/user-dashboard/src/components/dashboard/LatestTrigger.tsx"
  - "apps/user-dashboard/src/app/(dashboard)/dashboard/page.tsx"
autonomous: true
---

# Phase 11: Claim Application UI Integration

## Objective
Build the "Latest Trigger" dashboard section allowing users to initiate a claim for a recently breached parametric threshold.

<must_haves>
- A new `LatestTrigger` component added to the dashboard.
- Button inside `LatestTrigger` labeled "Apply for Claim" / "Initiate Payout".
- Dashboard API typing updated to support `latestTrigger`.
</must_haves>

<task>
<read_first>
- `apps/user-dashboard/src/lib/types/dashboard.ts`
- `apps/user-dashboard/src/lib/api/dashboard.ts`
</read_first>
<action>
1. In `apps/user-dashboard/src/lib/types/dashboard.ts`, update `DashboardSummary` interface to include `latestTrigger: ClaimHistoryItem | null;`
2. In `apps/user-dashboard/src/lib/api/dashboard.ts`, inside `getSummary` function, add a mock `latestTrigger: { id: "trg_99", type: "RAINFALL", amount: 250, timestamp: new Date().toISOString(), status: "PENDING_APP", zone: "Chennai South" }`. Return it in the mapped data summary.
</action>
<acceptance_criteria>
- `DashboardSummary` typing enforces `latestTrigger` presence.
- `DashboardAPI.getSummary()` returns a valid `latestTrigger` object of type `ClaimHistoryItem`.
</acceptance_criteria>
</task>

<task>
<read_first>
- `apps/user-dashboard/src/app/(dashboard)/dashboard/page.tsx`
- `apps/user-dashboard/src/components/dashboard/DisruptionHistory.tsx`
</read_first>
<action>
1. Create `apps/user-dashboard/src/components/dashboard/LatestTrigger.tsx`.
2. The component should accept `trigger: ClaimHistoryItem | null`. Provide a high-fidelity glass UI card showing an alert icon (`AlertCircle` or `CloudRain`), the trigger type (e.g., "Heavy Rainfall Detected"), and the payout amount available ("₹250.00").
3. Include an "Apply for Claim" `Button` component that, when clicked, triggers a loading state `isApplying`, and makes a `POST` fetch call to `/api/payout/apply` (which will be built in Phase 12). Add a `setTimeout` fallback if the endpoint is 404 to revert loading and show a success toast.
4. Export the component for use.
5. In `apps/user-dashboard/src/app/(dashboard)/dashboard/page.tsx`, import `LatestTrigger`.
6. Add `<LatestTrigger trigger={data.latestTrigger} />` immediately above `<DisruptionHistory history={data.recentClaims} />` inside the `.lg:col-span-6` left-hand column grid.
</action>
<acceptance_criteria>
- `LatestTrigger.tsx` file exists and exports a valid React component.
- The `LatestTrigger` card displays a primary colored "Apply for Claim" button.
- `page.tsx` successfully imports and renders `LatestTrigger`.
</acceptance_criteria>
</task>

## Verification
- Run the UI and ensure the `LatestTrigger` component visibly renders above the `DisruptionHistory` log.
- Clicking "Apply for Claim" correctly enters a loading state (`<Loader2 className="animate-spin" />`).
