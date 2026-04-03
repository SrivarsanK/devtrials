# 🛡️ GigShield — Parametric Income Insurance for India's Gig Delivery Workers

> **Guidewire DEVTrails 2026 | University Hackathon**  
> *When the rain stops Raju from working, GigShield pays — automatically, instantly, no questions asked.*

---

## 🎯 The Problem

<cite index="1-0,1-1">India has over 11 million gig delivery workers on platforms like Zomato, Swiggy, and Zepto. These workers operate in an economic razor's edge with average monthly earnings of ₹14,000–₹18,000, savings buffer of ₹4,000–₹6,000, and income lost per major weather disruption of 20-30%.</cite>

<cite index="1-2">Traditional insurance products are inaccessible — they require paperwork, bank accounts, fixed salaries, and weeks-long claim processing.</cite> When a worker loses a day's income to a flood, they have no recourse.

<cite index="1-3">GigShield solves this with a parametric income insurance product — one where payouts are triggered automatically by verified external disruptions (weather, pollution, civil events), with no claims form, no adjuster, and no waiting period for approval.</cite>

---

## ✨ What It Does

**GigShield** is a fully automated parametric income insurance platform that protects food delivery workers from income loss caused by external disruptions beyond their control.

### Key Features

- **Zero-Touch Claims**: Payouts trigger automatically when verified disruption events occur
- **Instant Payouts**: Money hits worker's UPI account within 2-24 hours (tier-dependent)
- **Weekly Premiums**: <cite index="5-0,5-1,5-2">Match the cadence of Zomato/Swiggy payout cycles, reduce commitment anxiety, and allow dynamic repricing based on upcoming forecast risk</cite>
- **AI-Powered Pricing**: Dynamic premium adjustment based on zone risk and weather forecasts
- **Fraud Detection**: Multi-layer validation using GPS, accelerometer, peer clustering, and behavioral analysis
- **Progressive Web App**: Mobile-optimized experience without Play Store friction

---

## 🏗️ Architecture

<cite index="3-0">GigShield is a three-sided platform serving three stakeholders simultaneously</cite>:

```
┌─────────────────────────────────────────────────────────────┐
│                   GIGSHIELD PLATFORM                        │
│                                                             │
│  [Worker App]      [Platform Portal]   [Insurer Dashboard]  │
│  Mobile PWA        Swiggy/Zomato       ShieldLife Admin     │
│  Enrollment        GPS verification    Reserve monitoring   │
│  Coverage view     Premium deduction   Loss ratio analytics │
│  Instant payout    Order data feed     Fraud detection      │
│                                                             │
│                  CORE BACKEND API                           │
│            Policy • Claims • Premium                        │
│                                                             │
│  [ML Engine]      [Trigger Engine]     [Fraud Engine]       │
│  Dynamic pricing  Parametric APIs      GPS spoof +          │
│  Zone risk score  Auto-claim firing    anomaly detection    │
└─────────────────────────────────────────────────────────────┘
```

---

## 💰 Premium Structure

<cite index="5-3">Weekly premiums are structured across three zone risk tiers</cite>:

| Zone Risk Tier | Base Weekly Premium | Max Weekly Payout | Monthly Event Cap |
|---|---|---|---|
| <cite index="5-3">Low risk (e.g., Coimbatore)</cite> | <cite index="5-3">₹89</cite> | <cite index="5-3">₹900</cite> | <cite index="5-3">3 events</cite> |
| <cite index="5-3">Medium risk (e.g., Bengaluru)</cite> | <cite index="5-3">₹110</cite> | <cite index="5-3">₹900</cite> | <cite index="5-3">3 events</cite> |
| <cite index="5-3">High risk (e.g., Chennai, Mumbai)</cite> | <cite index="5-3">₹130</cite> | <cite index="5-3">₹900</cite> | <cite index="5-3">3 events</cite> |

<cite index="5-4">Waiting Period: 3 days from enrollment before first claim eligibility.</cite>

<cite index="5-5">Monthly Event Cap: Maximum 3 payouts per calendar month per worker. Prevents the product from becoming a guaranteed income supplement during extended monsoon seasons.</cite>

<cite index="5-6">Premium Collection: Auto-deducted from platform payout every Friday. Worker never handles cash or makes a manual transfer.</cite>

---

## ⚡ Parametric Triggers

<cite index="5-7">The 5 Parametric Triggers</cite>:

| # | Trigger | Data Source | Threshold | Payout |
|---|---|---|---|---|
| 1 | <cite index="5-7">Heavy Rainfall</cite> | <cite index="5-7">OpenWeatherMap API</cite> | <cite index="5-7">>50mm in 3hrs in worker's GPS zone</cite> | <cite index="5-7">₹800</cite> |
| 2 | <cite index="5-7">Air Quality Crisis</cite> | <cite index="5-7">AQICN / OpenAQ API</cite> | <cite index="5-7">AQI > 300 (Hazardous) sustained 4hrs</cite> | <cite index="5-7">₹600</cite> |
| 3 | <cite index="5-7">Flood Zone Alert</cite> | <cite index="5-7">IMD Flood Warning API / Mock</cite> | <cite index="5-7">Official flood alert in district</cite> | <cite index="5-7">₹800</cite> |
| 4 | <cite index="6-0">Civil Disruption</cite> | <cite index="6-0">Mock curfew/bandh JSON feed</cite> | <cite index="6-0">Section 144 or declared shutdown</cite> | <cite index="6-0">₹700</cite> |
| 5 | <cite index="6-0">Extreme Heat Index</cite> | <cite index="6-0">OpenWeatherMap</cite> | <cite index="6-0">Feels-like temp > 45°C, 3hrs in peak</cite> | <cite index="6-0">₹500</cite> |

<cite index="6-0">Eligibility Check (all 3 must pass for auto-payout): Worker GPS was verified in the trigger zone at alert time (platform data), Worker's order flow on platform dropped ≥ 80% during disruption window, Waiting period passed + monthly cap not exceeded</cite>

---

## 🤖 AI/ML Integration

### <cite index="6-1">6.1 Dynamic Premium Pricing (Phase 2)</cite>

<cite index="6-1">Model: Gradient Boosted Regressor (XGBoost)</cite>

<cite index="6-1">Features: Historical rainfall/AQI/flood frequency per pin-code (last 3 years), Season flag (monsoon / summer / winter), Worker's zone (derived from GPS cluster), Day-of-week order volume baseline</cite>

<cite index="6-1">Output: Zone risk score (0-1) → mapped to premium tier (₹89 / ₹110 / ₹130)</cite>

<cite index="6-1">Training Data: IMD historical weather records (public), OpenWeatherMap historical API, mock order volume data.</cite>

### <cite index="6-2">6.2 Fraud Detection Engine (Phase 3)</cite>

<cite index="6-2">Rule-Based Layer (fast, real-time): GPS cluster density: >20 workers within 100m radius claiming simultaneously → flag, Claim velocity: Worker with <5 orders/week claiming income loss → flag, Device fingerprint: Multiple accounts from same device → flag</cite>

Content was rephrased for compliance with licensing restrictions.

<cite index="7-0">ML Layer (async, pattern learning): Isolation Forest on claim feature vectors (GPS spread, order drop %, timing), Anomaly score 0-100 → above 75: hold for review, above 90: auto-reject + alert</cite>

<cite index="7-1">False Positive Protection: Genuine mass disruptions (actual flood) will show GPS variance across a wide zone. Fraud rings show GPS clustering. The distinguishing signal is spatial spread, not count.</cite>

### <cite index="7-2">6.3 Predictive Claims Forecast (Phase 3)</cite>

<cite index="7-2">Model: LSTM time-series on weather forecast + historical claim patterns</cite>

<cite index="7-2">Output: "Expected claims in next 72 hours: ₹6.8L across 3 zones"</cite>

<cite index="7-2">Used by: Insurer dashboard — reserve adequacy warning system</cite>

---

## 🛠️ Tech Stack

### Frontend

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js + React + TypeScript | Single repo for all 3 portals, SSR for performance, type safety |
| Styling | TailwindCSS + shadcn/ui | Rapid UI development, consistent design system |
| Charts | Recharts + D3.js | Insurer dashboard visualizations, reserve monitoring |
| State | Zustand | Lightweight, no boilerplate |
| Maps | Leaflet.js | GPS zone visualization, fraud heatmap |

### Backend

| Layer | Technology | Reason |
|---|---|---|
| API Server | Node.js + Express | Fast development, JSON-native |
| Real-time | Socket.io | Live trigger alerts to insurer dashboard |
| Scheduling | Node-cron | Weekly premium calculations, trigger polling |
| Auth | JWT + bcrypt | Secure multi-role access (insurer/worker) |
| Database | PostgreSQL + TimescaleDB | Relational data + time-series trigger events |
| Cache | Redis | API rate limit, trigger dedup, session management |

### ML/AI

| Component | Technology | Purpose |
|---|---|---|
| ML Framework | Python + scikit-learn + XGBoost | Premium calculation + fraud detection |
| Time Series | TensorFlow + LSTM | Reserve forecasting model |
| Anomaly Detection | Isolation Forest | Fraud scoring engine |
| Model Serving | FastAPI | REST API bridge to Node.js backend |
| Data Processing | Pandas + NumPy | Feature engineering pipeline |

### External APIs

| API | Purpose | Cost |
|---|---|---|
| OpenWeatherMap | Rain + heat triggers | Free tier (1000 calls/day) |
| IMD API | Rainfall, temperature, Red Alert data | Free (government) |
| CPCB API | AQI data | Free (government) |
| Google Maps Traffic API | Waterlogging detection | Free tier |
| Razorpay Test Mode | Payment simulation | Free sandbox |

### Infrastructure

| Component | Technology |
|---|---|
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
cd gigshield

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

## 📁 Repository Structure

<cite index="9-1">Repository Structure</cite> (content rephrased for compliance):

```
gigshield/
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

```
1. Worker opens Zomato partner app → sees GigShield banner
2. Taps "Protect my earnings" → redirected to GigShield PWA
3. Tamil-language onboarding — 3 screens, 2 min 45 sec avg
4. Selects weekly plan (₹99 – ₹130 based on zone risk)
5. Confirms auto-deduction from weekly Zomato payout (Fridays)
6. 3-day waiting period begins (anti-adverse-selection)
7. Coverage active — worker receives SMS + WhatsApp confirmation
```

### Disruption Event Flow

```
1. ML / OpenWeatherMap API detects rainfall > 60mm/hr in Tambaram
2. Trigger Engine flags: ZONE_TAMBARAM_RAIN_ALERT
3. Platform Portal confirms: Raju was GPS-active in zone at trigger time,
   order flow dropped to 0 for 4+ consecutive hours
4. 3-day waiting period passed ✓ [Monthly cap: 1/3 events used ✓]
5. Claim auto-approved — no form, no phone call
6. ₹800 credited to Raju's UPI within 90 minutes
7. Raju receives SMS in Tamil: "GigShield ge ₹800 credit pannachi 🛡️"
```

### Insurer Monitoring Flow

```
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

<cite index="9-2">Decision: Progressive Web App (PWA) via Next.js</cite>

<cite index="9-3">Rationale: Raju already has the Zomato partner app — we embed GigShield as a linked PWA, not a separate native app download. PWA works on Android without Play Store approval delays. Single codebase serves worker (mobile-first), platform admin (tablet/desktop), and insurer (desktop). Offline-capable: worker can view coverage status without internet. For Phase 2/3: if native features are needed (push notifications), Next.js PWA supports them.</cite>

---

## 📊 Business Model

### Revenue Model (content rephrased for compliance)

Based on document data:

- Premium collected per worker/week: ₹110 (avg)
- Expected claims rate: ~18% of worker-weeks
- Avg payout per claim: ₹750
- Loss ratio target: 63% (industry healthy = 60-65%)
- Break-even portfolio size: ~2,500 active workers

### Unit Economics (per 1,000 workers, per month)

| Item | Amount |
|---|---|
| Premiums collected | ₹4,40,000 |
| Expected claims (18%) | ₹2,70,000 |
| Operating costs (est.) | ₹60,000 |
| **Net margin** | **₹1,10,000 (25%)** |

### Risk Controls (content rephrased for compliance)

- 3-day waiting period eliminates opportunistic sign-up at forecast
- 3-event monthly cap limits catastrophic monsoon season exposure
- Zone-based pause: new issuances auto-halt in RED zones
- Reinsurance trigger alerts when reserve ratio drops below 2×

---

## 🗺️ Roadmap

### <cite index="10-0">Phase 1 (March 4-20): Ideation & Foundation</cite>

- [x] <cite index="10-0">Problem definition and persona research</cite>
- [x] <cite index="10-0">Solution architecture design</cite>
- [x] <cite index="10-0">README.md (this document)</cite>
- [ ] <cite index="10-0">GitHub repository setup</cite>
- [ ] <cite index="10-0">2-minute strategy video</cite>

### <cite index="11-0">Phase 2 (March 21 - April 4): Automation & Protection</cite>

- [ ] <cite index="11-0">Worker registration flow (Tamil language UI)</cite>
- [ ] <cite index="11-0">Dynamic premium calculator (ML model v1)</cite>
- [ ] <cite index="11-0">3-5 live parametric trigger integrations</cite>
- [ ] <cite index="11-0">Zero-touch claim processing pipeline</cite>
- [ ] <cite index="11-0">Basic insurer dashboard (policy count, active claims)</cite>
- [ ] <cite index="11-0">2-minute demo video</cite>

### <cite index="11-1">Phase 3 (April 5-17): Scale & Optimise</cite>

- [ ] <cite index="11-1">Advanced fraud detection (GPS spoof + Isolation Forest)</cite>
- [ ] <cite index="11-1">Razorpay test mode — instant payout simulation</cite>
- [ ] <cite index="11-1">Full insurer dashboard (loss ratio, 72hr forecast, reserve monitor)</cite>
- [ ] <cite index="11-1">Worker dashboard (earnings protected, coverage history)</cite>
- [ ] <cite index="11-1">5-minute final demo video</cite>
- [ ] <cite index="11-1">Pitch deck (PDF)</cite>

---

## 👥 Team

**DEVTrails 2026 — GigShield**

<cite index="11-2">Built with the belief that a delivery worker's income deserves the same protection as a corporate executive's salary.</cite>

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/SrivarsanK/devtrials?tab=MIT-1-ov-file#readme)

---

## 🛡️ Disclaimer

<cite index="11-3">GigShield is a hackathon prototype. Insurance products in production would require IRDAI regulatory approval, actuarial certification, and platform partnership agreements.</cite>

---

**GigShield — Because every delivery partner deserves a safety net.**
