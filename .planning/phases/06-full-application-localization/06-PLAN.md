---
wave: 1
depends_on: []
files_modified:
  - apps/user-dashboard/src/contexts/LanguageContext.tsx
  - apps/user-dashboard/src/app/onboarding/page.tsx
  - apps/user-dashboard/src/app/dashboard/page.tsx
  - apps/user-dashboard/src/components/enrollment/StepIndicator.tsx
  - apps/user-dashboard/src/components/enrollment/VerificationStep.tsx
  - apps/user-dashboard/src/components/enrollment/PlanSelection.tsx
  - apps/user-dashboard/src/components/enrollment/UPIStep.tsx
  - apps/user-dashboard/src/components/dashboard/StatusBadge.tsx
  - apps/user-dashboard/src/components/dashboard/RiskFeed.tsx
  - apps/user-dashboard/src/components/dashboard/StatsHistory.tsx
autonomous: true
---

# Phase 6 Plan: Full Application Localization

## Objective
Establish 100% localization parity for the GigShield worker experience (Enrollment & Dashboard) between English and Tamil, ensuring structural integrity and visual excellence in both modes.

## Tasks

<task>
<read_first>
- apps/user-dashboard/src/contexts/LanguageContext.tsx
- apps/user-dashboard/src/app/onboarding/page.tsx
- apps/user-dashboard/src/app/dashboard/page.tsx
</read_first>
<action>
Audit and expand the `offlineDict` in `LanguageContext.tsx` to include all remaining unique strings in the enrollment and dashboard routes.
Add missing strings like "Current Risk:", "Disruption Probability", "Payout", "Automatic Verification", "UPI ID", "Auto-deduction agreement".
</action>
<acceptance_criteria>
- `offlineDict` contains all found keys.
- Translations are accurate and colloquial (standard Tamil for gig workers).
</acceptance_criteria>
</task>

<task>
<read_first>
- apps/user-dashboard/src/components/enrollment/PlanSelection.tsx
- apps/user-dashboard/src/components/enrollment/UPIStep.tsx
</read_first>
<action>
Systematically wrap remaining hardcoded strings in `StepIndicator.tsx`, `VerificationStep.tsx`, `PlanSelection.tsx`, and `UPIStep.tsx` with the `<Translate />` component.
Ensure tooltips and interactive labels (buttons, inputs) are included.
</action>
<acceptance_criteria>
- No bare strings left in components.
- Onboarding flow translates completely on toggle.
</acceptance_criteria>
</task>

<task>
<read_first>
- apps/user-dashboard/src/components/dashboard/StatusBadge.tsx
- apps/user-dashboard/src/components/dashboard/RiskFeed.tsx
- apps/user-dashboard/src/components/dashboard/StatsHistory.tsx
</read_first>
<action>
Ensure all dashboard components are 100% wrapped.
Check that complex strings with sub-spans or iconography are handled correctly (either via multiple `<Translate />` calls or nested translation).
</action>
<acceptance_criteria>
- Dashboard translates completely on toggle.
- Icon alignment remains consistent in both modes.
</acceptance_criteria>
</task>

<task>
<read_first>
- apps/user-dashboard/src/app/dashboard/page.tsx
</read_first>
<action>
Verify layout integrity for Tamil.
Check if the long Tamil translation for "Worker Dashboard" (பணியாளர் டாஷ்போர்டு) or "Protection Status" (பாதுகாப்பு நிலை) causes any container overflow.
Adjust CSS gaps/flex-wrap if necessary.
</action>
<acceptance_criteria>
- No horizontal scrolling or visual layout breaks in Tamil mode.
- Mobile view (430px) is elegant in both languages.
</acceptance_criteria>
</task>

## Verification Criteria
1. Full walkthrough of Onboarding (Step 1 -> Success) in Tamil mode.
2. Full exploration of Dashboard in Tamil mode.
3. Verify that changing language in the header persists through component updates (Next.js state).
4. No console errors related to `Failed to fetch` or missing keys (original text remains as fallback).
