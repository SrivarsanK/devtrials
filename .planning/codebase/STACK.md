# Technology Stack

**Analysis Date:** 2026-04-04

## Languages

**Primary:**
- TypeScript 5.x - All application code across apps/web, backend, and shared packages
- JSX/TSX - React component development in apps/web

**Secondary:**
- JavaScript - Build scripts, CI config
- SQL - Database schema (PostgreSQL/TimescaleDB)

## Runtime

**Environment:**
- Node.js 24.x (apps/web)
- Node.js 22.x (backend)
- pnpm 10.x - Package management with workspace support

**Package Manager:**
- pnpm 10.x
- Lockfile: `pnpm-lock.yaml` present

## Frameworks

**Core:**
- Next.js 16.2.1 - Web application framework (App Router)
- React 19.2.4 - UI library
- Express 4.18.2 - Backend API framework

**Testing:**
- Jest 29.7.0 - Backend unit and integration testing
- ts-jest 29.1.1 - TypeScript support for Jest

**Build/Dev:**
- TypeScript 5.x - Static typing
- TailwindCSS 3.4.19 - Styling
- Shadcn/UI - UI component library foundation

## Key Dependencies

**Frontend (apps/web):**
- @clerk/nextjs 7.0.6 - Authentication/user management
- @base-ui/react 1.3.0 - Unstyled UI components
- Leaflet 1.9.4 & react-leaflet 5.0.0 - Map visualization
- Three.js 0.183.2 & @react-three/fiber 9.5.0 - 3D rendering
- Anime.js 3.2.2 - Animation library
- Lucide React 1.0.0-rc.1 - Icon library

**Backend (backend):**
- pg 8.11.3 - PostgreSQL client
- Redis 4.6.10 - Caching and session storage
- Socket.io 4.7.2 - Real-time communication
- Express Rate Limit 8.3.1 - API protection
- Helmet 8.1.0 - Backend security
- node-cron 3.0.3 - Task scheduling (Triggers)
- Zod 3.22.4 - Schema validation

## Configuration

**Environment:**
- `.env` files for secrets and environment-specific configs (backend, apps/web)
- `next.config.ts`, `tailwind.config.ts`, `tsconfig.json` for frontend
- `jest.config.js`, `tsconfig.json` for backend
- `pnpm-workspace.yaml` for monorepo management

## Platform Requirements

**Development:**
- Node.js 22+ and pnpm 10+
- Local PostgreSQL and Redis recommended
- Docker/Docker Compose for local orchestration

**Production:**
- Hybrid deployment: 
    - Next.js: Vercel or Netlify (config present)
    - Backend: Cloud Run or Docker-based host (Dockerfile present)
- Persistent Storage: PostgreSQL (TimescaleDB) and Redis

---

*Stack analysis: 2026-04-04*
