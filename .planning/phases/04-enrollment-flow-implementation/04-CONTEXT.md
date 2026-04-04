# Phase 4: Enrollment Flow Implementation - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the multi-step enrollment wizard for delivery workers. It's the primary conversion point from the landing page.

- **URL:** `/page` (Requested by USER for Step 1)
- **Start:** Enrollment landing / ID entry
- **End:** Successful UPI linking and plan activation

</domain>

<decisions>
## Implementation Decisions

### Step 1: Verification (ENR-01)
- Input field for Partner ID (Swiggy/Zomato/Zepto).
- Mock verification logic (show success for IDs > 5 digits).

### Step 2: Plan Selection (ENR-02)
- Replicate the 3 tiers from the landing page: Lite (₹79), Plus (₹119), Max (₹159).
- Selection state must be captured.

### Step 3: UPI Integration (ENR-03)
- Input field for UPI ID (e.g., worker@upi).
- Checkbox for "Auto-deduction agreement".

### UI/UX (LOC-01, LOC-03)
- Background: Strict `#0e0e0e`.
- Accent: Tailwind `primary` (#f97316).
- Localization: Every label must use the `<Translate />` component.
- Stepper: Visual progress indicator (1, 2, 3).

</decisions>

<canonical_refs>
## Canonical References
- `apps/user-dashboard/src/app/page.tsx` — Reference for plan prices and descriptions.
- `apps/user-dashboard/src/app/globals.css` — Design system constants.
- `apps/user-dashboard/src/contexts/LanguageContext.tsx` — I18n implementation.
</canonical_refs>

<specifics>
## Specific Ideas
- Use Framer Motion (already in project?) for step transitions.
- Ensure the header with the EN/Tamil toggle remains visible.
</specifics>

<deferred>
## Deferred Ideas
- Real API integration with Swiggy/Zomato.
- Production payment processing.
</deferred>
