# Project Roadmap: Milestone v1.2

## Milestone v1.2: High-Fidelity Real-time Dashboard

**Goal:** Implement detailed dashboard features with live API integration and modal-based claim triggers.

### Phase 9: Detailed Dashboard UI & Mock Fallback

**Goal:** Implement the new Policy Status Card and Recent Claim History with data fetching logic.

- **Requirements:** DB-01, DB-04, INT-01

- **Success Criteria:**
  1. Active Policy Status Card displays Tier, Zone, Expiry, and Premium status.
  2. Recent Claim History displays 5 latest events.
  3. UI falls back gracefully to Mock data if API fails.

### Phase 10: Performance Triggers & Automated Payouts

**Goal:** Implement the Trigger Alert Modal and Premium Tracker with sync logic.

- **Requirements:** DB-02, DB-03, INT-02

- **Success Criteria:**
  1. Modal triggers automatically when threshold is crossed (simulated/API).
  2. Premium tracker displays next due date.
  3. "Auto-deduct" toggle correctly synchronizes state with the backend.
