# Coding Conventions

**Analysis Date:** 2026-04-04

## Core Principles

- **Developer Priorities:** Modular code, consistent naming, and clear error handling.
- **Language:** TypeScript 5.x throughout the entire codebase.
- **Reliability:** Smart fallbacks to mock data on the frontend to maintain UX during backend downtime.

## Frontend Conventions (Next.js)

- **Component Style:** Functional components using React 19 features (e.g., hooks, server/client separation).
- **Styling:** **Tailwind CSS Utility-First** with dynamic class merging via `clsx` and `tailwind-merge`.
- **UI Foundation:** shadcn/ui components (`class-variance-authority`, `lucide-react`).
- **Data Fetching:** Centralized fetch logic in `apps/web/src/lib/api.ts` with local interface definitions for `Trigger` and `Zone`.
- **Animations:** `Anime.js` and `tailwindcss-animate` for consistent motion design.
- **3D Logic:** `Three.js` and `@react-three/fiber` for premium visual elements.

## Backend Conventions (Express)

- **Express Logic:** Separation of application configuration (`app.ts`) and server initialization (`index.ts`).
- **RESTful Endpoints:** Resource-based routing in the `routes/` directory (e.g., `/api/triggers`, `/api/heatmap`).
- **Validation:** `Zod` for all incoming JSON request bodies and schema validation.
- **Security:** `helmet` for HTTP headers, `cors` for cross-origin management, and `express-rate-limit` for request throttling.
- **Trigger Logic:** `triggers/` directory contains standard polling logic with `node-cron` for periodic environmental data checks.
- **Real-time:** `socket.io` for event-driven updates from backend to frontend.

## Code Style

- **Naming:** kebab-case for files and directories (e.g., `middleware/auth.ts`, `sync-db.ts`).
- **React Components:** PascalCase filenames (e.g., `HeroShield.tsx`).
- **Types:** Interfaces or Types for all structured data (e.g., `interface Trigger { id: string; }`).
- **Errors:** Consistent JSON error response format (e.g., `{ error: "Not found", message: "..." }`).
- **Async:** `async/await` syntax preferred for all asynchronous operations.

## Tooling

- **Linting:** `eslint` with Next.js and custom rules.
- **Package Management:** `pnpm` exclusively (using `pnpm-workspace.yaml`).
- **Database:** `pg` for PostgreSQL/TimescaleDB and `redis` for fail-soft caching.

---

*Conventions analysis: 2026-04-04*
