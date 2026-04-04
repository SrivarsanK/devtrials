# Phase 8: Worker Experience Expansion - Plan

This phase implements three core pages to round out the worker PWA experience.

## 1. Zones Management (`/zones`)
- **Step 1.1:** Create `src/app/zones/page.tsx`.
- **Step 1.2:** Implement `ZoneCard` component with real-time status fetching.
- **Step 1.3:** Build a search bar to filter zones (Chennai Central, Adyar, Tambaram, etc.).
- **Step 1.4:** Add "Active Zone" indicator and change action.

## 2. Comprehensive Payout History (`/history`)
- **Step 2.1:** Create `src/app/history/page.tsx`.
- **Step 2.2:** Build a filter bar (Date Range, Trigger Type).
- **Step 2.3:** Map `TriggerEvent` history to a detailed list view.
- **Step 2.4:** Implement "Drill-down" to see trigger metadata (threshold vs actual).

## 3. Account Settings (`/settings`)
- **Step 3.1:** Create `src/app/settings/page.tsx`.
- **Step 3.2:** Implement Profile Header (Partner ID, Name).
- **Step 3.3:** Build Language Preference Selector (syncing with `LanguageContext`).
- **Step 3.4:** Add Notification Toggles (SMS/Push - currently UI-only mocks).
- **Step 3.5:** Include "About RideSuraksha" and "Help & Support" sections.

## 4. Navigation & Global Linking
- **Step 4.1:** Update `sidebar` or `dashboard` header to provide links to these new pages.
- **Step 4.2:** Ensure all three pages use the common layout/theme and back-navigation.

## 5. Verification
- **Step 5.1:** User can navigate to `/history` and see past triggers.
- **Step 5.2:** Language toggle in `/settings` updates the whole app immediately.
- **Step 5.3:** Zone switching updates the `RiskFeed` in the dashboard (mocked/simulated).
