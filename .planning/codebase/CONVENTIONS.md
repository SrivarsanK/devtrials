# Coding Conventions

**Analysis Date:** 2026-03-28

## Core Principles

- **Developer Priorities:** Modular code, consistent naming, and clear error handling.
- **Language:** TypeScript 5.x throughout the entire codebase.

## Frontend Conventions (Next.js)

- **Component Style:** Functional components using React 19 features (e.g., hooks).
- **Styling:** TailwindCSS 3.x with dynamic class merging via `clsx` and `tailwind-merge`.
- **UI library:** shadcn/ui components (`class-variance-authority`, `lucide-react`).
- **Data Fetching:** Hybrid approach (some client components with `lib/proxy.ts`, some server components).
- **Animations:** `Anime.js` and `tailwindcss-animate` for consistent motion design.
- **Maps:** `Leaflet` and `react-leaflet` for all geospatial visualizations.

## Backend Conventions (Express)

- **Express Logic:** separation of application configuration (`app.ts`) and server initialization (`index.ts`).
- **RESTful Endpoints:** Resource-based routing in the `routes/` directory.
- **Validation:** `Zod` for all incoming JSON request bodies and environment configs.
- **Security:** `helmet` for HTTP headers, `cors` for cross-origin management, and `express-rate-limit` for DDoS protection.
- **Authentication:** Bearer token-based auth with a dedicated middleware (`middleware/auth.ts`).
- **Middleware:** Chain-based logic for cross-cutting concerns (e.g., rate-limiting applied at the route level).

## Code Style

- **Naming:** kebab-case for files and directories (e.g., `middleware/auth-handler.ts`).
- **Types:** Interfaces or Types for all structured data (e.g., `interface User { id: string; }`).
- **Errors:** Consistent JSON error response format (e.g., `{ error: "Not found", message: "..." }`).
- **Async:** `async/await` syntax for all asynchronous operations (avoid promise chains).

## Tooling

- **Linting:** `eslint` with Next.js and custom rules (`eslint.config.mjs`).
- **Package Management:** `pnpm` exclusively (no `npm` or `yarn`).

---

*Conventions analysis: 2026-03-28*
*Maintain consistency during new development*
