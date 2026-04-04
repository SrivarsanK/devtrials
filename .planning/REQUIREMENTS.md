# Project Requirements

This document tracks all validated, active, and out-of-scope requirements for GigShield.

## Milestone v1.1 Requirements: Worker Enrollment & Dashboard Experience

### Enrollment Flow
- [ ] **ENR-01**: User can enter their Partner ID to initiate verification.
- [ ] **ENR-02**: User can select between Guard Lite, Guard Plus, and Guard Max plans.
- [ ] **ENR-03**: User can securely input and verify their UPI ID.
- [ ] **ENR-04**: Entire flow includes input validation and error feedback.

### Worker Dashboard
- [ ] **WD-01**: User can view their active plan and next recurring premium date.
- [ ] **WD-02**: User can view a feed of active weather/system triggers for their zone.
- [ ] **WD-03**: User can view a historical list of processed and auto-approved claims.
- [ ] **WD-04**: PWA manifests are implemented mimicking Native App styling.

### Localization & UI Standardization
- [ ] **LOC-01**: All text routes through `LanguageContext` translating between EN/Tamil.
- [ ] **LOC-02**: The App Shell header includes a sticky navigation with EN/Tamil toggle.
- [ ] **LOC-03**: Shadcn/ui elements correctly adhere to the `0e0e0e` dark theme and `primary` tokens.

## Traceability Tracker

| REQ-ID | Phase | Status |
|--------|-------|--------|
| ENR-01 | Phase 4 | Pending |
| ENR-02 | Phase 4 | Pending |
| ENR-03 | Phase 4 | Pending |
| ENR-04 | Phase 4 | Pending |
| WD-01 | Phase 5 | Pending |
| WD-02 | Phase 5 | Pending |
| WD-03 | Phase 5 | Pending |
| WD-04 | Phase 5 | Pending |
| LOC-01 | Phase 6 | Pending |
| LOC-02 | Phase 6 | Pending |
| LOC-03 | Phase 6 | Pending |

## Future Extensibility / Out of Scope (This Milestone)
- Native Mobile Build (React Native) is excluded.
- Live external banking API connectivity is excluded.
- Language support beyond English / Tamil.
