# Phase 8: Worker Experience Expansion - Context

**Gathered:** 2026-04-04
**Goal:** Expand worker dashboard to include Zones, History, and Settings views.

<domain>
## Design System Alignment
- **Theme**: Obsidian Dark (`#0e0e0e`).
- **Accent**: Primary Emerald (`#10b981`).
- **Typography**: Manrope for data/headings, Inter for body.
- **Glassmorphism**: Cards use `bg-surface-card` with subtle border/blur.

## UX Principles (UI/UX Pro Max)
1. **Consistency**: Use existing `Card`, `Badge`, and `Translate` components.
2. **Mobile First**: Optimize for one-handed operation (bottom actions).
3. **Information Hierarchy**: Prioritize active states in Zones and most recent in History.
4. **Localization**: Every string must route through `LanguageContext`.

</domain>

<decisions>

### DEC-01: Navigation Context
- Each new page will use the existing `AppShell` (once implemented) or simple header back-navigation.
- We will add a bottom navigation bar or link these pages from the main dashboard "View All" buttons.

### DEC-02: Data Management
- Use `TriggerService` for fetching zone list and historical logs.
- Use `LanguageContext` for setting language preference.

</decisions>
