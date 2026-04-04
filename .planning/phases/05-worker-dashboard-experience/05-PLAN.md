---
wave: 1
depends_on: []
files_modified:
  - apps/user-dashboard/public/manifest.json
  - apps/user-dashboard/src/app/layout.tsx
  - apps/user-dashboard/src/app/dashboard/page.tsx
  - apps/user-dashboard/src/components/dashboard/StatusBadge.tsx
  - apps/user-dashboard/src/components/dashboard/RiskFeed.tsx
  - apps/user-dashboard/src/components/dashboard/StatsHistory.tsx
autonomous: true
---

# Phase 5 Plan: Worker Dashboard & PWA Capabilities

## Objective
Implement the main authenticated dashboard (`/dashboard`) for delivery workers, including PWA identity markers and real-time coverage status/alerts.

## Tasks

<task>
<read_first>
- apps/user-dashboard/src/app/layout.tsx
</read_first>
<action>
Create `apps/user-dashboard/public/manifest.json` with RideSuraksha branding.
Update `apps/user-dashboard/src/app/layout.tsx` with PWA meta tags: `theme-color: #0e0e0e`, `application-name: RideSuraksha`.
</action>
<acceptance_criteria>
- `manifest.json` exists with correct icons/name.
- Layout.tsx has mobile-web-app-capable meta tags.
</acceptance_criteria>
</task>

<task>
<read_first>
- apps/user-dashboard/src/app/onboarding/page.tsx
- apps/user-dashboard/src/components/ui/card.tsx
</read_first>
<action>
Implement `StatusBadge.tsx` for current coverage display.
Show "Active" in green/orange with the plan name (e.g. Guard Plus) and Zone ID.
</action>
<acceptance_criteria>
- Success view matches the landing/onboarding aesthetics.
- Badge correctly displays status and active tier.
</acceptance_criteria>
</task>

<task>
<read_first>
- apps/user-dashboard/src/components/ui/badge.tsx
</read_first>
<action>
Implement `RiskFeed.tsx` to display real-time zone risk levels.
Include a simple interactive list showing "Current Risk: LOW" and alerts for upcoming rain.
Add a "Refresh" button simulation.
</action>
<acceptance_criteria>
- Displays status levels: Low (Green), Moderate (Yellow), High (Red).
- Includes translation-wrapped strings for all states.
</acceptance_criteria>
</task>

<task>
<read_first>
- apps/user-dashboard/src/app/page.tsx (Replicate stats card styles)
</read_first>
<action>
Implement `StatsHistory.tsx` to show recent claim payouts.
Use a list format: "Payout - Mar 28 - ₹240 (Heavy Rain)".
Display a summary card: "Total Protected Income Saved: ₹1,200".
</action>
<acceptance_criteria>
- List of mock historical claims is displayed.
- Summary card uses the primary accent.
</acceptance_criteria>
</task>

<task>
<read_first>
- apps/user-dashboard/src/app/dashboard/page.tsx
</read_first>
<action>
Finalize the main dashboard route `/dashboard`.
Assemble all components into a sleek, mobile-optimized grid.
Ensure the header is present with the same EN/Tamil toggle.
</action>
<acceptance_criteria>
- Dashboard accessible at `/dashboard`.
- Layout is responsive and premium (dark mode `#0e0e0e`).
- All text uses `<Translate />`.
</acceptance_criteria>
</task>

## Verification Criteria
1. Navigation from Onboarding success page to `/dashboard` works.
2. PWA manifest is detected (can use Chrome DevTools for verification check).
3. The "Active" status and risk alerts update visually when mock state is toggled (if applicable).
4. EN/Tamil localization toggle works correctly across the whole dashboard.
