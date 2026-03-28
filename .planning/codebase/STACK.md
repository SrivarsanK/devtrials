# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- TypeScript 5.x - All application code across apps/web, backend, and shared packages
- JSX/TSX - React component development in apps/web

**Secondary:**
- JavaScript - Build scripts, CI config
- SQL - Database schema and migration scripts

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
- Next.js 16.2.1 - Web application framework
- React 19.x - UI library
- Express 4.18.2 - Backend API framework

**Testing:**
- Jest 29.7.0 - Backend unit and integration testing
- ts-jest 29.1.1 - TypeScript support for Jest

**Build/Dev:**
- TypeScript 5.x - Static typing
- TailwindCSS 3.4.19 - Styling
- Shadcn/UI - UI component library

## Key Dependencies

**Critical:**
- @clerk/nextjs 7.0.6 - Authentication/user management
- Leaflet 1.9.4 & react-leaflet 5.0.0 - Map visualization
- Three.js 0.183.2 - 3D rendering
- Anime.js 3.2.2 - Animation library
- Socket.io 4.7.2 - Real-time communication
- PostgreSQL (pg 8.11.3) & TimescaleDB - Primary database

**Infrastructure:**
- Zod 3.22.4 - Data validation/schema
- Redis 4.6.10 - Caching and session storage
- Helmet 8.1.0 & cors 2.8.5 - Backend security

## Configuration

**Environment:**
- `.env` files for secrets and environment-specific configs
- `next.config.ts`, `tailwind.config.ts`, `tsconfig.json` for frontend
- `jest.config.js`, `tsconfig.json` for backend

## Platform Requirements

**Development:**
- Any platform with Node.js and pnpm
- Local PostgreSQL and Redis recommended

**Production:**
- Hybrid deployment: Next.js (likely Vercel/Netlify), API (likely Docker/Docker Compose/GCP)
- Vercel and Netlify config files present

---

*Stack analysis: 2026-03-28*
*Update after major dependency changes*
