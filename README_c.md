# RideSuraksha

Parametric income insurance for India's gig delivery workers.

RideSuraksha protects food delivery workers from income loss caused by external disruptions (heavy rainfall, floods, air quality crises, and extreme heat). By integrating with APIs from OpenWeatherMap and IMD, it triggers zero-touch, instant payouts directly to workers' UPI accounts without the need for manual claims.

> [!NOTE]
> RideSuraksha is a prototype created for Guidewire DEVTrails 2026.

## Architecture

RideSuraksha operates as a three-sided platform:

- **Worker App (PWA):** Geared toward gig workers for enrollment, coverage views, and receiving instant payouts.
- **Platform Portal:** Interfaces with aggregators (Swiggy/Zomato) for GPS verification, premium deductions, and order data feed.
- **Insurer Dashboard:** ShieldLife Admin panel for managing premium deductions, loss ratio analytics, and fraud detection.

The core Backend API orchestrates policy, claims, and premium management across the ML Engine (dynamic pricing), Trigger Engine (parametric APIs), and Fraud Engine.

## Stack

- **Frontend:** Next.js, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend:** Node.js, Express, PostgreSQL, TimescaleDB, Redis, Socket.io
- **ML / AI:** Python, scikit-learn, XGBoost, TensorFlow, LSTM

## Getting Started

> [!IMPORTANT]
> The database requires PostgreSQL 15+ and the server runs on Node.js 18+.

1. Clone the repository:
   ```bash
   git clone https://github.com/SrivarsanK/devtrials.git
   cd devtrials/RideSuraksha
   ```
2. Install dependencies for all services:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   cd ../ml && pip install -r requirements.txt
   ```
3. Set up the environment settings based on the example configuration:
   ```bash
   cp .env.example .env
   ```
4. Run migrations and start the development servers:
   ```bash
   npm run db:migrate
   npm run dev
   ```

## Development

The project structure is organized as follows:

- `apps/`: Next.js frontend applications
- `packages/`: Shared workspace components and types
- `backend/`: Core Node.js services and Python ML engines
- `supabase/`: Database schema and edge functions
- `mock-data/`: Simulation scripts

### Testing

Testing across the distinct services can be run natively using standard framework commands.

```bash
# Frontend UI tests
cd frontend && npm test

# Backend API tests
cd backend && npm test

# Python ML algorithm tests
cd ml && pytest

# Full system integration
npm run test:integration
```
