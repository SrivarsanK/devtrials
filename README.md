# 🛡️ RideSuraksha — Parametric Income Insurance for India's Gig Delivery Workers

> **Guidewire DEVTrails 2026 | University Hackathon**
> *When the rain stops Raju from working, RideSuraksha pays — automatically, instantly, no questions asked.*

---

## 🎯 The Problem

India has over 11 million gig delivery workers on platforms like Zomato, Swiggy, and Zepto. These workers operate in an economic razor's edge with average monthly earnings of ₹14,000–₹18,000, savings buffer of ₹4,000–₹6,000, and income lost per major weather disruption of 20-30%.

Traditional insurance products are inaccessible — they require paperwork, bank accounts, fixed salaries, and weeks-long claim processing. When a worker loses a day's income to a flood, they have no recourse.

RideSuraksha solves this with a parametric income insurance product — one where payouts are triggered automatically by verified external disruptions (weather, pollution, civil events), with no claims form, no adjuster, and no waiting period for approval.

---

## ✨ What It Does

**RideSuraksha** is a fully automated parametric income insurance platform that protects food delivery workers from income loss caused by external disruptions beyond their control.

### Key Features

- **Zero-Touch Claims**: Payouts trigger automatically when verified disruption events occur
- **Instant Payouts**: Money hits worker's UPI account within 2-24 hours (tier-dependent)
- **Weekly Premiums**: Match the cadence of Zomato/Swiggy payout cycles, reduce commitment anxiety, and allow dynamic repricing based on upcoming forecast risk
- **AI-Powered Pricing**: Dynamic premium adjustment based on zone risk and weather forecasts
- **Fraud Detection**: Multi-layer validation using GPS, accelerometer, peer clustering, and behavioral analysis
- **Progressive Web App**: Mobile-optimized experience without Play Store friction

---

## 🏗️ Architecture

RideSuraksha is a three-sided platform serving three stakeholders simultaneously:

```text
┌─────────────────────────────────────────────────────────────┐
│                   RideSuraksha PLATFORM                     │
│                                                             │
│  [Worker App]      [Platform Portal]   [Insurer Dashboard]  │
│  Mobile PWA        Swiggy/Zomato       ShieldLife Admin     │
│  Enrollment        GPS verification    Premium deduction    │
│  Coverage view     Premium deduction   Loss ratio analytics │
│  Instant payout    Order data feed     Fraud detection      │
│                                                             │
│                  CORE BACKEND API                           │
│            Policy • Claims • Premium • Triggers             │
│                                                             │
│  [ML Models]      [Trigger Engine]     [Fraud Engine]       │
│  Dynamic pricing  Parametric APIs      GPS spoof +          │
│  Pricing Forecast Auto-claim firing    Anomaly Detection    │
└─────────────────────────────────────────────────────────────┘
```

---

## 💰 Premium Structure

Weekly premiums are structured across three zone risk tiers based on historical disruption data:

| Zone Risk Tier | Base Weekly Premium | Max Weekly Payout | Monthly Event Cap |
| --- | --- | --- | --- |
| **Low Risk** | ₹89 | ₹900 | 3 events |
| **Medium Risk** | ₹110 | ₹900 | 3 events |
| **High Risk** | ₹130 | ₹900 | 3 events |

- **Waiting Period**: 3 days from enrollment before first claim eligibility (anti-adverse selection).
- **Monthly Event Cap**: Maximum 3 payouts per calendar month per worker.
- **Auto-Collection**: Deducted from platform (Zomato/Swiggy) earnings every Friday.

---

## ⚡ Parametric Triggers

The 5 Parametric Triggers:

| # | Trigger | Data Source | Threshold | Payout |
| --- | --- | --- | --- | --- |
| 1 | Heavy Rainfall | OpenWeatherMap API | >50mm in 3hrs in worker's GPS zone | ₹800 |
| 2 | Air Quality Crisis | AQICN / OpenAQ API | AQI > 300 (Hazardous) sustained 4hrs | ₹600 |
| 3 | Flood Zone Alert | IMD Flood Warning API / Mock | Official flood alert in district | ₹800 |
| 4 | Civil Disruption | Mock curfew/bandh JSON feed | Section 144 or declared shutdown | ₹700 |
| 5 | Extreme Heat Index | OpenWeatherMap | Feels-like temp > 45°C, 3hrs in peak | ₹500 |

Eligibility Check (all 3 must pass for auto-payout): Worker GPS was verified in the trigger zone at alert time (platform data), Worker's order flow on platform dropped ≥ 80% during disruption window, Waiting period passed + monthly cap not exceeded

---

## 🤖 AI/ML Integration

### 6.1 Dynamic Premium Pricing (Phase 2)

Model: Gradient Boosted Regressor (XGBoost)

Features: Historical rainfall/AQI/flood frequency per pin-code (last 3 years), Season flag (monsoon / summer / winter), Worker's zone (derived from GPS cluster), Day-of-week order volume baseline

Output: Zone risk score (0-1) → mapped to premium tier (₹89 / ₹110 / ₹130)

Training Data: IMD historical weather records (public), OpenWeatherMap historical API, mock order volume data.

### 6.2 Fraud Detection Engine (Phase 3)

Rule-Based Layer (fast, real-time): GPS cluster density: >20 workers within 100m radius claiming simultaneously → flag, Claim velocity: Worker with <5 orders/week claiming income loss → flag, Device fingerprint: Multiple accounts from same device → flag

ML Layer (async, pattern learning): Isolation Forest on claim feature vectors (GPS spread, order drop %, timing), Anomaly score 0-100 → above 75: hold for review, above 90: auto-reject + alert

False Positive Protection: Genuine mass disruptions (actual flood) will show GPS variance across a wide zone. Fraud rings show GPS clustering. The distinguishing signal is spatial spread, not count.

### 6.3 Predictive Claims Forecast (Phase 3)

Model: LSTM time-series on weather forecast + historical claim patterns

Output: "Expected claims in next 72 hours: ₹6.8L across 3 zones"

Used by: Insurer dashboard — reserve adequacy warning system

---

## 🛠️ Tech Stack

### Frontend

| Layer | Technology | Reason |
| --- | --- | --- |
| Framework | Next.js + React + TypeScript | Single repo for all 3 portals, SSR for performance, type safety |
| Styling | TailwindCSS + shadcn/ui | Rapid UI development, consistent design system |
| Charts | Recharts + D3.js | Insurer dashboard visualizations, reserve monitoring |
| State | Zustand | Lightweight, no boilerplate |
| Maps | Leaflet.js | GPS zone visualization, fraud heatmap |

### Backend

| Layer | Technology | Reason |
| --- | --- | --- |
| API Server | Node.js + Express | Fast development, JSON-native |
| Real-time | Socket.io | Live trigger alerts to insurer dashboard |
| Scheduling | Node-cron | Weekly premium calculations, trigger polling |
| Auth | JWT + bcrypt | Secure multi-role access (insurer/worker) |
| Database | PostgreSQL + TimescaleDB | Relational data + time-series trigger events |
| Cache | Redis | API rate limit, trigger dedup, session management |

### ML/AI

| Component | Technology | Purpose |
| --- | --- | --- |
| ML Framework | Python + scikit-learn + XGBoost | Premium calculation + fraud detection |
| Time Series | TensorFlow + LSTM | Reserve forecasting model |
| Anomaly Detection | Isolation Forest | Fraud scoring engine |
| Model Serving | FastAPI | REST API bridge to Node.js backend |
| Data Processing | Pandas + NumPy | Feature engineering pipeline |

### External APIs

| API | Purpose | Cost |
| --- | --- | --- |
| OpenWeatherMap | Rain + heat triggers | Free tier (1000 calls/day) |
| IMD API | Rainfall, temperature, Red Alert data | Free (government) |
| CPCB API | AQI data | Free (government) |
| Google Maps Traffic API | Waterlogging detection | Free tier |
| Razorpay Test Mode | Payment simulation | Free sandbox |

### Infrastructure

| Component | Technology |
| --- | --- |
| Hosting | Vercel (frontend) + Render (backend + DB) |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Version Control | GitHub |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 15+ (or Supabase account)
- Redis (or Upstash account)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/devtrials.git
cd RideSuraksha

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install ML dependencies
cd ../ml
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# External APIs
OPENWEATHER_API_KEY=your_key_here
AQICN_API_KEY=your_key_here

# Payment
RAZORPAY_KEY_ID=your_test_key
RAZORPAY_KEY_SECRET=your_test_secret

# ML Service
ML_API_URL=http://localhost:8000
```

---

### Repository Structure

```text
RideSuraksha/
├── apps/
│   ├── worker-app/          # Next.js — Worker PWA
│   ├── platform-portal/     # Next.js — Swiggy/Zomato view
│   └── insurer-dashboard/   # Next.js — ShieldLife admin
├── packages/
│   ├── ui/                  # Shared components
│   └── types/               # Shared TypeScript types
├── backend/
│   ├── api/                 # FastAPI core backend
│   ├── ml/                  # ML models + training scripts
│   └── triggers/            # Parametric trigger engine
├── supabase/
│   ├── migrations/          # DB schema
│   └── functions/           # Edge functions
├── mock-data/               # Simulated GPS, order, weather data
└── README.md
```

---

## 🎯 Core Workflows

### Worker Enrollment Flow

```text
1. Worker opens Zomato partner app → sees RideSuraksha banner
2. Taps "Protect my earnings" → redirected to RideSuraksha PWA
3. Tamil-language onboarding — 3 screens, 2 min 45 sec avg
4. Selects weekly plan (₹99 – ₹130 based on zone risk)
5. Confirms auto-deduction from weekly Zomato payout (Fridays)
6. 3-day waiting period begins (anti-adverse-selection)
7. Coverage active — worker receives SMS + WhatsApp confirmation
```

### Disruption Event Flow

```text
1. ML / OpenWeatherMap API detects rainfall > 60mm/hr in Tambaram
2. Trigger Engine flags: ZONE_TAMBARAM_RAIN_ALERT
3. Platform Portal confirms: Raju was GPS-active in zone at trigger time,
   order flow dropped to 0 for 4+ consecutive hours
4. 3-day waiting period passed ✓ [Monthly cap: 1/3 events used ✓]
5. Claim auto-approved — no form, no phone call
6. ₹800 credited to Raju's UPI within 90 minutes
7. Raju receives SMS in Tamil: "RideSuraksha ge ₹800 credit pannachi 🛡️"
```

### Insurer Monitoring Flow

```text
1. Real-time dashboard shows: 847 active policies, Chennai zone RED
2. AI forecast: 36.8L in claims expected next 72 hours (monsoon window)
3. Current reserve balance: ₹22.4L — SAFE (3.3× coverage ratio)
4. System auto-alerts reinsurance partner if reserve drops below 2×
5. Admin can pause new policy issuance in flagged zones — one click
```

---

## 🧪 Testing & Development

### Run Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# ML model tests
cd ml
pytest

# Integration tests
npm run test:integration
```

### Mock Data Generation

```bash
# Generate 100 mock workers across 3 cities
npm run mock:workers

# Simulate weather disruption event
npm run mock:trigger -- --type=rainfall --zone=chennai --intensity=high
```

---

## 🎨 Design Philosophy

### Decision: Progressive Web App (PWA) via Next.js

Rationale: Raju already has the Zomato partner app — we embed RideSuraksha as a linked PWA, not a separate native app download. PWA works on Android without Play Store approval delays. Single codebase serves worker (mobile-first), platform admin (tablet/desktop), and insurer (desktop). Offline-capable: worker can view coverage status without internet. For Phase 2/3: if native features are needed (push notifications), Next.js PWA supports them.

---

## 📊 Business Model

### Revenue Model

Based on document data:

- Premium collected per worker/week: ₹110 (avg)
- Expected claims rate: ~18% of worker-weeks
- Avg payout per claim: ₹750
- Loss ratio target: 63% (industry healthy = 60-65%)
- Break-even portfolio size: ~2,500 active workers

### Unit Economics (per 1,000 workers, per month)

| Item | Amount |
| --- | --- |
| Premiums collected | ₹4,40,000 |
| Expected claims (18%) | ₹2,70,000 |
| Operating costs (est.) | ₹60,000 |
| **Net margin** | **₹1,10,000 (25%)** |

### Risk Controls

- 3-day waiting period eliminates opportunistic sign-up at forecast
- 3-event monthly cap limits catastrophic monsoon season exposure
- Zone-based pause: new issuances auto-halt in RED zones
- Reinsurance trigger alerts when reserve ratio drops below 2×

---

## 🗺️ Roadmap

### Phase 1 (March 4-20): Ideation & Foundation

- [x] Problem definition and persona research
- [x] Solution architecture design
- [x] README.md (this document)
- [ ] GitHub repository setup
- [ ] 2-minute strategy video

### Phase 2 (March 21 - April 4): Automation & Protection

- [ ] Worker registration flow (Tamil language UI)
- [ ] Dynamic premium calculator (ML model v1)
- [ ] 3-5 live parametric trigger integrations
- [ ] Zero-touch claim processing pipeline
- [ ] Basic insurer dashboard (policy count, active claims)
- [ ] 2-minute demo video

### Phase 3 (April 5-17): Scale & Optimise

- [ ] Advanced fraud detection (GPS spoof + Isolation Forest)
- [ ] Razorpay test mode — instant payout simulation
- [ ] Full insurer dashboard (loss ratio, 72hr forecast, reserve monitor)
- [ ] Worker dashboard (earnings protected, coverage history)
- [ ] 5-minute final demo video
- [ ] Pitch deck (PDF)

---

## 👥 Team

### DEVTrails 2026 — RideSuraksha

Built with the belief that a delivery worker's income deserves the same protection as a corporate executive's salary.

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/SrivarsanK/devtrials?tab=MIT-1-ov-file#readme)

---

## 🛡️ Disclaimer

RideSuraksha is a hackathon prototype. Insurance products in production would require IRDAI regulatory approval, actuarial certification, and platform partnership agreements.

---

**RideSuraksha — Because every delivery partner deserves a safety net.**
