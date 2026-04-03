# Integrations: apps/web

## Identity & Access
- **@clerk/nextjs**: Primary authentication provider. Handles enrollment, sign-in, and session management.
- **`dark` baseTheme**: Injected in `RootLayout` with heavy brand overrides.

## Data Sink (Backend)
- **GigShield API (`BASE_URL`)**: 
  - Dynamic discovery via `process.env.NEXT_PUBLIC_API_URL`.
  - Development fallback to `http://localhost:5678`.
  - Core endpoints:
    - `/api/triggers`: Historical and active parametric alerts.
    - `/api/triggers/zones`: Operational zone definitions.
    - `/api/heatmap`: GIS data for the Risk Map.
    - `/health`: backend availability check.

## GIS & Maps
- **Leaflet.js**: Client-side mapping engine.
- **`RiskMap.tsx`**: Specialized component for visualizing zone health (GREEN/AMBER/RED) with heatmap overlays.

## Webhooks
- **Svix**: Integrated in `package.json` for potential Clerk event handling or real-time payout alerts.

## Infrastructure
- **Deployment Targets**:
  - **Vercel**: Primary target (`vercel.json` present).
  - **Netlify**: Secondary fallback (`netlify.toml` present).
