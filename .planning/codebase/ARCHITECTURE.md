# System Architecture

**Analysis Date:** 2026-04-04

## High-Level Pattern

**Monorepo Structure (pnpm workspaces):**
- **`apps/web`**: Next.js 16.2.1 frontend application (UI/UX).
- **`backend`**: Express.js API service (Core Logic & Data).
- **`packages/ui`**: Shared UI foundation and design tokens.

## Backend Architecture (Express)

**Layers & Patterns:**
- **`app.ts`**: Express configuration, middleware setup (CORS, Helmet, Rate Limiting), and route registration.
- **`index.ts`**: Entry point. Verifies DB/Redis connectivity before starting the server and trigger scheduler.
- **`routes/`**: Domain-specific HTTP endpoints (e.g., `/api/triggers`, `/api/heatmap`).
- **`middleware/`**: Cross-cutting concerns like JWT authentication and logging.
- **`triggers/`**: **Core Business Logic Engine**. Handles node-cron based polling of environmental APIs (Rainfall, AQI, HeatIndex) and logic for parametric payouts.
- **`lib/`**: Database (PostgreSQL/pg) and Redis client abstractions.

## Frontend Architecture (Next.js)

**Layers & Patterns:**
- **App Router (Next.js 16)**: Modular layouts and pages.
- **`app/`**: Mix of server and client components.
- **`components/`**: Atomic UI components using shadcn/ui and Radix primitives.
- **`hooks/`**: Custom hooks for real-time state management.
- **`lib/api.ts`**: Centralized API abstraction. Includes **smart fallback logic** using mock data when the backend is unreachable, ensuring a seamless UI demo experience.

## Data & Communication Flow

**Authentication:**
1. User authenticates via **Clerk** on `apps/web`.
2. Frontend manages the session/JWT.
3. Backend middleware validates the token for protected routes.

**Real-time Updates:**
- **Socket.io**: Used for pushed updates from backend (e.g., a trigger event) to the frontend dashboard.
- **Manual Poll**: Frontend can trigger a manual poll of environmental data via the `/api/triggers/poll` endpoint.

**Visualization:**
- **Leaflet**: Geospatial data rendering (Zones and Heatmaps).
- **Three.js / React Three Fiber**: Premium 3D visual elements (e.g., HeroShield).

---

*Architecture analysis: 2026-04-04*
