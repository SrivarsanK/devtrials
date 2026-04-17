# Project Roadmap: Milestone v1.3

## Milestone v1.3: Claim Application & PhonePe Payouts

**Goal:** Implement UI for the latest disruption trigger with an opt-in claim application, backed by a simulated auto-payout via PhonePe Refund API.

### Phase 11: Claim Application UI Integration

**Goal:** Build the Latest Trigger dashboard section and the Application confirmation UI.

- **Requirements:** CLM-01, CLM-02

- **Success Criteria:**
  1. A new "Latest Trigger" visual section appears in the `/dashboard`.
  2. The section clearly describes the recent parameter breach.
  3. A robust "Apply for Claim" call-to-action button allows users to initiate the payout process.

### Phase 12: PhonePe Refund Flow & Auto-Payout Simulation

**Goal:** Implement the PhonePe Refund transaction API to simulate automated payouts and verify status reconciliation.

- **Requirements:** PAY-01, PAY-02

- **Success Criteria:**
  1. Hitting "Apply for Claim" triggers a backend call making a mock refund request to PhonePe for the policy's premium equivalent/amount.
  2. System receives the refund success via SDK polling or webhook.
  3. Dashboard reflects the new "PAID" status of the fresh claim gracefully.
