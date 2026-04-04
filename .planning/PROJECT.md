# GigShield

## Current Milestone: v1.1 Worker Enrollment & Dashboard Experience

**Goal:** Complete the worker-facing user experience including the multi-step enrollment flow and the main PWA dashboard view.

**Target features:**

- Enrollment Wizard (`/page`) for Partner ID, Plan Selection, and UPI linking
- PWA Worker Dashboard for viewing coverage status and claims
- Fully functional EN/Tamil Localization Integration

## What This Is

**GigShield** is a parametric income insurance platform for India's 11+ million gig delivery workers (Zomato, Swiggy, Zepto). When verified external disruptions occur — heavy rainfall, floods, air quality crises, civil disruptions, or extreme heat — workers receive automatic payouts to their UPI accounts within 2-24 hours. No claims forms, no adjusters, no waiting for approval.

This is a **Guidewire DEVTrails 2026 Hackathon** project being built to **production-ready, startup-quality standards**. Every feature must work end-to-end.

## Core Value

**Zero-touch claim processing.** A worker loses income to a flood, they get paid automatically. No paperwork, no phone calls, no delays. The parametric trigger fires, eligibility verifies, payout lands.

## Requirements

### Validated

- [x] WE-001: Worker registration with Swiggy/Zomato Partner ID (Phase 4)
- [x] WE-002: Risk profile calculation from GPS and earning history (Simulated in Phase 4)
- [x] WE-003: Plan selection (Guard Lite/Plus/Max) (Phase 4)
- [x] WE-004: 3-day waiting period enforcement (Mocked in Success screen)
- [x] DW-001: Live zone risk alerts (Phase 5)
- [x] DW-002: Real-time coverage status (Phase 5)
- [x] DW-003: Earnings and claims history (Phase 5)
- [x] PWA-001: Mobile-first installable experience (Phase 5)

### Active

#### Worker Enrollment & Onboarding

- [ ] WE-001: Worker registration with Swiggy/Zomato Partner ID
- [ ] WE-002: Risk profile calculation from GPS and earning history
- [ ] WE-003: Plan selection (Guard Lite/Plus/Max)
- [ ] WE-004: 3-day waiting period enforcement

#### Premium Management

- [ ] PM-001: Zone-based premium tiers (₹89/₹110/₹130)
- [ ] PM-002: Auto-deduction from platform payout
- [ ] PM-003: Dynamic pricing via XGBoost model

#### Parametric Trigger Monitoring

- [ ] TM-001: Monitor 5 trigger types (rainfall, AQI, flood, civil, heat)
- [ ] TM-002: 5-minute API polling with deduplication
- [ ] TM-003: Zone-based trigger matching

#### Claims Processing

- [ ] CP-001: Eligibility verification (GPS, order flow, waiting period)
- [ ] CP-002: Fraud detection (Isolation Forest + rules)
- [ ] CP-003: Payout calculation (BHE × DH × PHM × CR × ZF)
- [ ] CP-004: Razorpay UPI payout execution
- [ ] CP-005: Monthly event cap enforcement (3 events/month)

#### Worker Dashboard (PWA)

- [ ] WD-001: Coverage status view
- [ ] WD-002: Claims history
- [ ] WD-003: Earnings protection summary
- [ ] WD-004: PWA with offline support, Tamil language UI

#### Insurer Dashboard

- [ ] ID-001: Real-time monitoring panel
- [ ] ID-002: Zone risk map (Leaflet.js)
- [ ] ID-003: Predictive analytics (LSTM forecasting)
- [ ] ID-004: Fraud intelligence panel
- [ ] ID-005: Reserve management

#### Platform Portal (Swiggy/Zomato)

- [ ] PP-001: Worker data integration (GPS, order flow)
- [ ] PP-002: Premium deduction coordination
- [ ] PP-003: GigShield banner in partner app

#### Backend Infrastructure

- [ ] RESTful API with JWT authentication
- [ ] TimescaleDB for trigger event time-series
- [ ] Redis for caching and session management
- [ ] Node-cron for scheduled jobs

#### ML/AI Services

- [ ] Dynamic premium calculation (XGBoost)
- [ ] Fraud detection scoring (Isolation Forest)
- [ ] Reserve forecasting (LSTM)

### Out of Scope

- **Native mobile app** — PWA only, no Play Store friction
- **Real Swiggy/Zomato API** — Mocked for hackathon
- **Production payment processing** — Razorpay test mode only
- **Multi-language beyond Tamil** — English fallback only
- **Vehicle/health/accident coverage** — Income protection only
- **IRDAI regulatory approval** — Hackathon prototype

## Context

### Target User

Raju (Ramesh Kumar), 26, Chennai Zomato delivery partner. ₹16,500/month earnings, ₹5,500 savings buffer, Tamil speaker, Android phone.

### Platform

Three-sided:

1. **Worker PWA** — Enrollment, coverage status, claims history (Tamil-first)
2. **Platform Portal** — Swiggy/Zomato view for GPS verification, premium deduction
3. **Insurer Dashboard** — ShieldLife admin, reserve monitoring, fraud detection

### Key Business Rules

- 3-day waiting period from enrollment
- 3 events/month maximum payout cap
- Weekly auto-deduction aligned to platform payout cycles (Fridays)
- Peak hour multipliers: 2.0× dinner rush, 1.5× lunch rush, 0.7× afternoon lull
- Zone risk factors: 0.85× (low) to 1.40× (very high)

**Payout Formula**: `Payout = BHE × DH × PHM × CR × ZF`

## Constraints

- **Timeline**: Guidewire DEVTrails 2026 Hackathon (March-April 2026)
- **Quality**: Production-ready, startup-quality — everything must work end-to-end
- **Tech Stack**: Next.js + React + TypeScript (frontend), Node.js + Express (backend), PostgreSQL + TimescaleDB (database), Python + FastAPI (ML)
- **Deployment**: Vercel (frontend), Render (backend + DB)
- **Demo**: Must be demoable with realistic mock data

## Key Decisions

| Decision | Rationale | Outcome |
| --- | --- | --- |
| PWA over native app | No Play Store friction, Zomato partner app deep link, single codebase for 3 portals | — Pending |
| Weekly premium cycle | Matches Zomato/Swiggy payout cadence, reduces commitment anxiety | — Pending |
| Mock platform APIs | Hackathon scope, real APIs require partnership agreements | — Pending |
| Razorpay test mode | Production-quality integration without real money | — Pending |
| TimescaleDB for triggers | Time-series queries for historical disruption patterns | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):

1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):

1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

*Last updated: 2026-03-22 after cleaning up planning files*