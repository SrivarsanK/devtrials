# Phase 9: Detailed Dashboard UI & Mock Fallback

**Goal:** Implement high-fidelity dashboard components for policy status and claim history with live API integration.

## Tasks

### 1. Data Modeling & API Wrapper
- [ ] Create `src/lib/types/dashboard.ts` defining `UserPolicy`, `ClaimEvent`, and `DashboardSummary`.
- [ ] Create `src/lib/api/dashboard.ts` to fetch dashboard summary with `TriggerService` fallback.
- [ ] Ensure mock data supports all new fields (Zone, Expiry, Premium Paid).

### 2. Component: Policy Status Card
- [ ] Create `src/components/dashboard/PolicyStatusCard.tsx`.
- [ ] Move logic from `page.tsx` interactive card to this component.
- [ ] Add display for: Plan Tier, Zone (Active), Expiry Date, and Total Premium Paid.
- [ ] Maintain glassmorphism aesthetic and animations.

### 3. Component: Recent Claim History
- [ ] Create `src/components/dashboard/claims/RecentClaims.tsx`.
- [ ] Implement list view for the 5 most recent claims.
- [ ] Show payout amount, trigger type, and verification status.

### 4. Integration
- [ ] Update `src/app/(dashboard)/dashboard/page.tsx`.
- [ ] Replace hardcoded `enrollmentData` with data fetched from `DashboardAPI`.
- [ ] Integrate `PolicyStatusCard` and `RecentClaims` into the main layout.
- [ ] Add loading skeletons for better UX.

## Verification

### Automated Tests
- [ ] `npm run lint` passes.
- [ ] Build verification: `npm run build` (optional).

### Manual Verification
- [ ] Dashboard lands with loading state -> transitions to data.
- [ ] Policy Status Card shows correct tier and zone.
- [ ] Recent claims shows max 5 items.
- [ ] "Premium Paid" updates if data exists.
