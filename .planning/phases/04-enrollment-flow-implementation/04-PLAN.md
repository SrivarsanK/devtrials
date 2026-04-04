---
wave: 1
depends_on: []
files_modified:
  - apps/user-dashboard/src/app/page/page.tsx
  - apps/user-dashboard/src/components/enrollment/StepIndicator.tsx
  - apps/user-dashboard/src/components/enrollment/PlanSelection.tsx
  - apps/user-dashboard/src/components/enrollment/VerificationStep.tsx
  - apps/user-dashboard/src/components/enrollment/UPIStep.tsx
autonomous: true
---

# Phase 4 Plan: Enrollment Flow Implementation

## Objective
Build the multi-step enrollment wizard (`/page`) in `apps/user-dashboard` with Partner ID verification, plan selection, and UPI linking.

## Tasks

<task>
<read_first>
- apps/user-dashboard/src/app/page.tsx (Reference for UI patterns)
- apps/user-dashboard/src/contexts/LanguageContext.tsx (Translation reference)
- .planning/phases/04-enrollment-flow-implementation/04-CONTEXT.md
</read_first>
<action>
Create the step indicator component `src/components/enrollment/StepIndicator.tsx` using the `primary` accent.
Implement standard localized labels for Step 1, 2, 3.
</action>
<acceptance_criteria>
- File exists: `apps/user-dashboard/src/components/enrollment/StepIndicator.tsx`
- Contains UI steps: "Verification", "Plan Selection", "UPI Setup"
- Every string uses `<Translate />`
</acceptance_criteria>
</task>

<task>
<read_first>
- apps/user-dashboard/src/app/page.tsx
</read_first>
<action>
Implement `VerificationStep.tsx` for Step 1.
Include a text input for Partner ID and a "Verify ID" button.
Simulate a loading state for 1s.
</action>
<acceptance_criteria>
- File exists: `apps/user-dashboard/src/components/enrollment/VerificationStep.tsx`
- Includes input for `Partner ID`
- Includes button: `<Translate text="Verify ID" />`
</acceptance_criteria>
</task>

<task>
<read_first>
- apps/user-dashboard/src/app/page.tsx (Replicate card styles)
</read_first>
<action>
Implement `PlanSelection.tsx` for Step 2.
Replicate the pricing cards for Guard Lite (₹79), Guard Plus (₹119), and Guard Max (₹159).
Capture selection state at component level.
</action>
<acceptance_criteria>
- File exists: `apps/user-dashboard/src/components/enrollment/PlanSelection.tsx`
- Displays 3 pricing tiers aligned with Landing Page data.
</acceptance_criteria>
</task>

<task>
<read_first>
- .planning/phases/04-enrollment-flow-implementation/04-CONTEXT.md
</read_first>
<action>
Implement `UPIStep.tsx` for Step 3.
Collect UPI ID (worker@upi) and a disclaimer checkbox for auto-deduction.
</action>
<acceptance_criteria>
- File exists: `apps/user-dashboard/src/components/enrollment/UPIStep.tsx`
- Includes input field for UPI ID.
- Includes checkbox for Auto-deduction agreement.
</acceptance_criteria>
</task>

<task>
<read_first>
- apps/user-dashboard/src/app/layout.tsx
- apps/user-dashboard/src/app/page.tsx
</read_first>
<action>
Assemble the wizard in `apps/user-dashboard/src/app/page/page.tsx`.
Handle step state management (1, 2, 3).
Ensure a "Success" view after completing step 3.
Include the global sticky nav component (copied from landing) if possible.
</action>
<acceptance_criteria>
- File exists: `apps/user-dashboard/src/app/page/page.tsx`
- Toggling steps works seamlessly.
- Final step displays a success badge and "Dashboard" link.
</acceptance_criteria>
</task>

## Verification Criteria
1. Navigation to `/page` works (requires correct Next.js build-time folder structure).
2. Step transitions are smooth.
3. Every UI element translates when EN/Tamil is toggled in the header.
4. Total 0e0e0e background consistency.
