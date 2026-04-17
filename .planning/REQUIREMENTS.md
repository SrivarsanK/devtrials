# Project Requirements

This document tracks all validated, active, and out-of-scope requirements for RideSuraksha.

## Milestone v1.3 Requirements: Claim Application & PhonePe Payouts

### Claims & Payouts
- [ ] **CLM-01**: "Latest Trigger" section in `/dashboard` displaying the most recent actionable parameter breach.
- [ ] **CLM-02**: "Apply for Claim" actionable UI allowing the user to initiate payout requests for the latest trigger.
- [ ] **PAY-01**: Execute mocked payouts using the PhonePe Standard Checkout Refund API.
- [ ] **PAY-02**: Reconcile PhonePe Refund status via webhook or status API to verify successful payout.

## Traceability Tracker

| REQ-ID | Phase | Status |
|--------|-------|--------|
| CLM-01 | Phase 11 | Completed |
| CLM-02 | Phase 11 | Completed |
| PAY-01 | Phase 12 | Pending |
| PAY-02 | Phase 12 | Pending |

## Future Extensibility / Out of Scope (This Milestone)
- Native Mobile Build (React Native) is excluded.
- Live external banking API connectivity is excluded.
- Language support beyond English / Tamil.
