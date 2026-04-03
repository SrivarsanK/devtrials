# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GigShield** is a parametric income insurance platform for India's gig delivery workers (Zomato, Swiggy, Zepto). It provides automatic payouts triggered by verified external disruptions (weather, pollution, civil events) - no claims forms, instant payouts via UPI.

This is a **Guidewire DEVTrails 2026 Hackathon** project currently in Phase 1 (ideation & documentation). The codebase has detailed specifications in README.md, REQUIREMENTS.md, and DESIGN.md.

## Three-Sided Platform

```
Worker PWA (mobile-first)     Platform Portal              Insurer Dashboard
- Enrollment flow             - Swiggy/Zomato view         - ShieldLife admin
- Coverage status              - GPS verification          - Reserve monitoring
- Claims history               - Order data feed           - Loss ratio analytics
- Tamil language UI           - Premium deduction          - Fraud detection
```

## Tech Stack

### Frontend
- **Framework**: Next.js + React + TypeScript (monorepo for all 3 portals)
- **Styling**: TailwindCSS + shadcn/ui
- **Charts**: Recharts + D3.js (insurer dashboard)
- **State**: Zustand
- **Maps**: Leaflet.js (GPS zone visualization)

### Backend
- **API**: Node.js + Express
- **Real-time**: Socket.io (live trigger alerts)
- **Scheduling**: Node-cron (trigger polling, weekly premiums)
- **Auth**: JWT + bcrypt
- **Database**: PostgreSQL + TimescaleDB (time-series trigger events)
- **Cache**: Redis (API rate limit, trigger dedup, sessions)

### ML/AI Service
- **Framework**: Python + FastAPI
- **Models**: XGBoost (premium pricing), Isolation Forest (fraud detection), LSTM (reserve forecasting)
- **Data Processing**: Pandas + NumPy

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Docker Compose

## Architecture Patterns

### Parametric Trigger Flow
```
External API (OpenWeatherMap/IMD/CPCB) → Trigger Engine → Zone Matching
    → Eligibility Check (GPS + order flow + waiting period + cap)
    → Fraud Detection (Isolation Forest scoring)
    → Payout Calculation (BHE × DH × PHM × CR × ZF)
    → Razorpay UPI Payout
```

### Key Services
- **Policy Service**: CRUD for worker policies, plan tiers, enrollment
- **Claims Service**: Claims processing pipeline, eligibility verification, payout execution
- **Trigger Service**: Parametric API polling (5-min intervals), event logging to TimescaleDB
- **Fraud Detection**: GPS spoofing detection, Isolation Forest scoring, manual review queue
- **Premium Service**: Dynamic weekly pricing via XGBoost, auto-deduction coordination

## Development Commands

```bash
# Frontend (from apps/worker-app, apps/platform-portal, apps/insurer-dashboard)
npm install
npm run dev        # Start Next.js dev server
npm test           # Run tests

# Backend (from backend/api)
npm install
npm run dev        # Start Express server
npm run db:migrate # Run database migrations
npm test           # Run tests

# ML Service (from backend/ml)
pip install -r requirements.txt
uvicorn main:app --reload  # Start FastAPI server
pytest                      # Run ML tests

# Docker (from root)
docker-compose up --build   # Start all services

# Mock Data Generation
npm run mock:workers        # Generate 100 mock workers
npm run mock:trigger -- --type=rainfall --zone=chennai --intensity=high
```

## Repository Structure (Planned)

```
gigshield/
├── apps/
│   ├── worker-app/           # Next.js — Worker PWA (Tamil-first)
│   ├── platform-portal/      # Next.js — Swiggy/Zomato integration
│   └── insurer-dashboard/   # Next.js — ShieldLife admin
├── packages/
│   ├── ui/                   # Shared shadcn/ui components
│   └── types/                # Shared TypeScript types
├── backend/
│   ├── api/                  # Express REST API
│   ├── ml/                   # FastAPI + ML models
│   └── triggers/            # Parametric trigger engine
├── supabase/
│   ├── migrations/          # DB schema (PostgreSQL + TimescaleDB)
│   └── functions/           # Edge functions
└── mock-data/               # Simulated GPS, order, weather data
```

## Core Business Rules

### Payout Formula
```
Payout = BHE × DH × PHM × CR × ZF
```
- **BHE**: Baseline Hourly Earning (4-week rolling average)
- **DH**: Disrupted Hours (verified by order flow drop)
- **PHM**: Peak Hour Multiplier (0.5× to 2.0× based on time)
- **CR**: Coverage Rate (50%/70%/80% by plan tier)
- **ZF**: Zone Factor (0.85× to 1.40× by risk score)

### Fixed Payouts by Trigger
| Trigger | Payout |
|---------|--------|
| Heavy Rainfall (>50mm/3hr) | ₹800 |
| Flood Zone Alert | ₹800 |
| Civil Disruption | ₹700 |
| Air Quality Crisis (AQI >300) | ₹600 |
| Extreme Heat (>45°C feels-like) | ₹500 |

### Eligibility (all 3 must pass)
1. Worker GPS verified in trigger zone at alert time
2. Worker's order flow dropped ≥80% during disruption
3. 3-day waiting period passed, monthly cap (3 events) not exceeded

### Plan Tiers
| Tier | Weekly Premium | Coverage | Monthly Cap | Payout Speed |
|------|---------------|----------|-------------|--------------|
| Guard Lite | ₹89 | 50% | 3 events | 24 hours |
| Guard Plus | ₹110 | 70% | 3 events | 12 hours |
| Guard Max | ₹130 | 80% | 3 events | 2 hours |

## Key Constraints

### Out of Scope (Phase 1)
- Native mobile app (PWA only)
- Real Swiggy/Zomato API integration (mocked)
- Production payment processing (Razorpay test mode)
- Multi-language beyond Tamil (English fallback)
- Vehicle/health/accident coverage

### Performance Requirements
- Worker PWA: <3s load on 4G
- API response: <500ms (p95)
- Payout processing: 2-24 hours by tier
- Scale: 100K active policies, 5K claims/hour

### Security Requirements
- JWT + bcrypt authentication
- Role-based access control (worker/insurer/admin)
- Three-layer fraud detection (GPS spoofing, Isolation Forest, behavioral patterns)

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# External APIs
OPENWEATHER_API_KEY=your_key_here
AQICN_API_KEY=your_key_here
IMD_API_KEY=your_key_here (optional)

# Payment
RAZORPAY_KEY_ID=your_test_key
RAZORPAY_KEY_SECRET=your_test_secret

# ML Service
ML_API_URL=http://localhost:8000
```

## Documentation References

- **README.md**: Project overview, architecture, quick start
- **REQUIREMENTS.md**: Functional/non-functional requirements, data models, compliance
- **DESIGN.md**: Technical architecture, API design, database schema, ML models