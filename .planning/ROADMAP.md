# Project Roadmap: Milestone v1.1

## Milestone v1.1: Worker Enrollment & Dashboard Experience

**Goal:** Complete the worker-facing user experience including the multi-step enrollment flow and the main PWA dashboard view.

### Phase 4: Enrollment Flow Implementation

**Goal:** Build the `/page` enrollment wizard allowing workers to enter ID, select plan, and link UPI.

- **Requirements:** ENR-01, ENR-02, ENR-03, ENR-04

- **Success Criteria:**
  1. User can land on `/page` and enter a mock Partner ID securely.
  2. The UI allows selection of Guard Lite, Plus, or Max tiers dynamically.
  3. Form validation triggers correctly on the UPI linkage screen.

### Phase 5: Worker Dashboard & PWA Capabilities

**Goal:** Create the authenticated view where workers check coverage status and recent triggers.

- **Requirements:** WD-01, WD-02, WD-03, WD-04

- **Success Criteria:**
  1. The dashboard correctly displays active Guard plan data.
  2. The active claims / weather triggers feed is populated via dummy state.
  3. PWA manifest correctly serves standard icons and layout config.

### Phase 6: Full Application Localization

**Goal:** Connect all new pages to the global `LanguageContext`.

- **Requirements:** LOC-01, LOC-02, LOC-03

- **Success Criteria:**
  1. The dashboard and enrollment pages translate completely when "தமிழ்" is toggled in the header.
  2. Translations persist reasonably, or default dictionary is expanded for structural texts.
  3. No visual layout breaking occurs when Tamil is rendered.
