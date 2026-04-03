# GigShield

## Current Milestone: v1.0 Core Parametric Engine

**Goal:** Establish the technical foundation and the automated parametric trigger system.

**Target features:**
- Backend Infrastructure (API, TimescaleDB, Redis, Cron)
- Parametric Trigger Monitoring (Rainfall, AQI, Heat)
- Core ML Inference (Dynamic Premium, Fraud Scoring)

## What This Is

**GigShield** is a parametric income insurance platform for India's 11+ million gig delivery workers (Zomato, Swiggy, Zepto). When verified external disruptions occur — heavy rainfall, floods, air quality crises, civil disruptions, or extreme heat — workers receive automatic payouts to their UPI accounts within 2-24 hours. No claims forms, no adjusters, no waiting for approval.

This is a **Guidewire DEVTrails 2026 Hackathon** project being built to **production-ready, startup-quality standards**. Every feature must work end-to-end.

## Core Value

**Zero-touch claim processing.** A worker loses income to a flood, they get paid automatically. No paperwork, no phone calls, no delays. The parametric trigger fires, eligibility verifies, payout lands.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Reserve Health Widget**
- [x] RHW-001: Global status banner (GREEN/AMBER/RED) based on overall coverage ratio.
- [x] RHW-002: Render six core metric cards: Total Reserve Balance, Active Liability, Coverage Ratio, Loss Ratio, Weekly Premium Inflow, Weekly Claims Outflow.
- [x] RHW-003: Expandable city cards for Chennai, Mumbai, and Delhi with status and metrics.
- [x] RHW-004: Individual zone rows showing status dot, coverage ratio, reserve vs liability, and mock predicted claims.
- [x] RHW-005: Circuit Breaker toggle button per zone to pause/resume new policy sign-ups, synchronized with global Zustand store.

**Live Trigger Status Panel**
- [x] LTS-001: Real-time status of 6 parametric triggers.
- [x] LTS-002: Progress bar visualizing current value vs threshold for each trigger.
- [x] LTS-003: Status (NORMAL, WATCH, TRIGGERED) dynamic via simulated Socket.io events.
- [x] LTS-004: Affected worker count and estimated payout liability upon TRIGGERED state.
- [x] LTS-005: Pre-warning alert for forecast bounds crossing.

**Loss Ratio Chart**
- [x] LRC-001: 30-day rolling time-series area chart using D3.js and React.
- [x] LRC-002: React rendering SVG elements, D3 handling math and scales only.
- [x] LRC-003: Area with gradient fill changing color on 65% and 80% thresholds.
- [x] LRC-004: Standard reference dashed lines and an interactive hover tooltip.

**Fraud Detection Panel**
- [x] FDP-001: Flagged claims queue for manual review based on fraud score rules (>0.6 held).
- [x] FDP-002: Highlight severe risks such as GPS spoofing clusters.
- [x] FDP-003: Admin actions to Approve, Reject, or Flag for deep investigation.
- [x] FDP-004: Sync resolved claims with fraud status count in Zustand store to reflect in metrics.

**72-Hour Forecast & Circuit Breaker Controls**
- [x] FCB-001: Predicted payout liability, claim count and zone risk status utilizing mock LSTM outputs for all zones.
- [x] FCB-002: Identify and map circuit breaker functionality status per zone.
- [x] FCB-003: Render manual pause/active controls for AMBER zones; visualize system auto-pauses when exceeding thresholds.
- [x] FCB-004: Reinsurance Status Alert capability notifying Munich Re of significant risk exposures.

**Zone Risk Map**
- [x] ZRM-001: Interactive Leaflet.js map of Chennai, Mumbai, and Delhi.
- [x] ZRM-002: Custom GeoJSON polygons colored green/amber/red based on zone status.
- [x] ZRM-003: Clickable zones revealing detail popup.
- [x] ZRM-004: Polygon fill dynamically updated based on global state.

### Out of Scope

- **Native mobile app** — PWA only, no Play Store friction
- **Real Swiggy/Zomato API** — Mocked for hackathon
- **Production payment processing** — Razorpay test mode only
- **Multi-language beyond Tamil** — English fallback only
- **Vehicle/health/accident coverage** — Income protection only
- **IRDAI regulatory approval** — Hackathon prototype

## Context

**Target User**: Raju (Ramesh Kumar), 26, Chennai Zomato delivery partner. ₹16,500/month earnings, ₹5,500 savings buffer, Tamil speaker, Android phone.

**Platform**: Three-sided:
1. **Worker PWA** — Enrollment, coverage status, claims history (Tamil-first)
2. **Platform Portal** — Swiggy/Zomato view for GPS verification, premium deduction
3. **Insurer Dashboard** — ShieldLife admin, reserve monitoring, fraud detection

**Key Business Rules**:
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
|----------|-----------|---------|
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

*Last updated: 2026-03-21 after starting Milestone v1.0*