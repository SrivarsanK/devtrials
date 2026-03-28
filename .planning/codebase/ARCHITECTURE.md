# System Architecture

**Analysis Date:** 2026-03-28

## High-Level Pattern

**Monorepo with Apps & Packages:**
- `apps/web`: Next.js frontend application
- `backend`: Express.js backend API service
- `packages/ui`: Shared UI library and component foundation

## Backend Architecture (Express)

**Layers & Patterns:**
- `app.ts` - Central Express configuration, middleware, and route registration
- `index.ts` - Application entry point (server initialization)
- `routes/` - HTTP endpoint definitions, divided by domain (e.g., `triggers/`, `heatmap/`)
- `middleware/` - Cross-cutting concerns like authentication (`auth.ts`) and logging
- `lib/` - Shared utilities and internal library abstractions
- `triggers/` - Business logic focus for parametric events and monitoring

## Frontend Architecture (Next.js)

**Layers & Patterns:**
- Next.js 16 `app` Router - Layout-based design system
- `app/` - Client and server components following modular layout
- `components/` - Atomic UI components, integrated with shadcn/ui
- `hooks/` - Custom React hooks for shared client-side logic
- `lib/` - Shared frontend utilities and API client abstractions
- `proxy.ts` - Centralized API abstraction for communicating with the backend

## Data Flow

**Authentication:**
1. User logs in via Clerk on `apps/web`.
2. Clerk provides a frontend session token.
3. Subsequent requests to `backend` include the bearer token.
4. `backend/src/middleware/auth.ts` validates the token.

**Real-time Logic:**
- `backend` emits events via `socket.io` based on monitoring or background jobs (`node-cron`).
- `apps/web` listens for specific events to update the UI (e.g., map updates, alert statuses).

## Abstractions

- `Zod` for schema validation (frontend & backend).
- `Leaflet` for geospatial visualization on the frontend.
- `Three.js` for optional 3D visual overlays.

---

*Architecture analysis: 2026-03-28*
*Update after major system design changes*
