# Phase 6: Full Application Localization - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase ensures all user-facing strings across the Enrollment Flow and the Worker Dashboard are wrapped in `<Translate />` and have high-quality Tamil translations in the offline fallback dictionary.

- **Scope:** `/onboarding`, `/dashboard`, and all sub-components.
- **Languages:** English (EN), Tamil (TA).

</domain>

<decisions>
## Implementation Decisions

### LOC-01: Comprehensive Dictionary
- All strings from the PWA dashboard (Status, Risk, Stats) must be present in `offlineDict`.
- All onboarding step descriptions and button labels must be present.

### LOC-02: Layout Integrity
- Tamil text can be 20-30% longer than English. 
- Component containers must handle overflow or wrap gracefully.
- Test "Active" badge and "Moderate Risk" badge with Tamil content.

### LOC-03: Dictionary Synchronization
- Keep `LanguageContext` as the single source of truth for the offline fallback.
- Ensure any new strings added to the UI are parity-checked in the dictionary.

</decisions>

<canonical_refs>
## Canonical References
- `apps/user-dashboard/src/contexts/LanguageContext.tsx` — The translation engine.
- `apps/user-dashboard/src/components/ui/translate.tsx` — The wrapper component.
- `apps/user-dashboard/src/app/dashboard/page.tsx` — Primary validation target.
- `apps/user-dashboard/src/app/onboarding/page.tsx` — Secondary validation target.
</canonical_refs>

<specifics>
## Specific Lexicon Targets
- **Enrollment:** "Partner ID", "Swiggy", "Zomato", "Deduction agreement", "Coverage starts in 3 days".
- **Dashboard:** "Disruption Probability", "Keep your GPS active", "View Full Payout History".
</specifics>
