# Technology Stack

**Analysis Date:** 2026-03-21

## Languages

**Primary:**
- TypeScript - Frontend and Backend API code
- Python - ML/AI Service
- SQL - Database migrations and queries

## Runtime

**Environment:**
- Node.js (for Next.js and Express)
- Python 3.10+ (for FastAPI and ML models)

**Package Manager:**
- npm
- pip

## Frameworks

**Core:**
- Next.js + React - Frontend application framework (Worker PWA, Platform Portal, Insurer Dashboard)
- Express.js - Backend API framework
- FastAPI - Python ML Model serving framework

**Build/Dev:**
- Docker & Docker Compose - Local development and containerization
- TypeScript compiler

## Key Dependencies

**Frontend:**
- TailwindCSS + shadcn/ui - UI styling and component library
- Zustand - State management
- Recharts + D3.js - Data visualization for Insurer Dashboard
- Leaflet.js - Interactive maps

**Backend:**
- Socket.io - Real-time events and trigger alerts
- Node-cron - Scheduled jobs and API polling
- JWT + bcrypt - Authentication and security

**ML/AI:**
- scikit-learn + XGBoost - Dynamic premium calculation
- Isolation Forest - Fraud detection scoring
- TensorFlow / Keras (LSTM) - Reserve forecasting
- Pandas + NumPy - Feature engineering and data processing

## Configuration

**Environment:**
- `.env` files for environment variables configuration
- Key configs: DATABASE_URL, REDIS_URL, OPENWEATHER_API_KEY, AQICN_API_KEY, RAZORPAY_KEY_ID, ML_API_URL

## Platform Requirements

**Development:**
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+
- Redis

**Production:**
- Vercel - Frontend hosting (Next.js applications)
- Render - Backend APIs and worker services hosting
- Managed PostgreSQL + Redis (e.g. Supabase, Upstash)

---

*Stack analysis: 2026-03-21*
*Update after major dependency changes*
