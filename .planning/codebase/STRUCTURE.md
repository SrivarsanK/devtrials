# Directory Structure

**Analysis Date:** 2026-04-04

## Root Directory

```text
.
├── .github/              # CI/CD (GitHub Actions workflows)
├── .planning/            # Project planning, state, and codebase maps
├── apps/                 # Primary applications (Next.js web app)
│   └── web/              # Next.js 16.2.1 frontend
├── backend/              # Core Express.js API (logic, data, triggers)
├── packages/             # Shared libraries
│   └── ui/               # Core UI foundation
├── docker-compose.yml    # Development environment orchestration (pg, redis)
├── pnpm-workspace.yaml   # Monorepo workspace configuration
├── README.md             # Project overview
└── package.json          # Monorepo scripts and global devDependencies
```

## `apps/web/` Structure

```text
apps/web/
├── app/                  # Next.js App Router (layouts, pages, routes)
│   ├── dashboard/        # Main dashboard pages
│   ├── triggers/         # Trigger monitoring pages
│   ├── layout.tsx        # Root layout with ClerkProvider
│   └── globals.css       # Global styles with Tailwind layers
├── src/
│   ├── components/       # Custom React components (HeroBox, PriorityAlerts, etc.)
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Shared frontend utilities (api.ts, utils.ts)
├── public/               # Static assets (fonts, images)
├── components.json       # shadcn/ui configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── next.config.ts        # Next.js framework configuration
```

## `backend/` Structure

```text
backend/
├── src/
│   ├── config/           # App configuration (environment variables)
│   ├── lib/              # Database and Redis client abstractions
│   ├── middleware/       # Express middleware (auth.ts)
│   ├── routes/           # Domain-specific route handlers
│   ├── scripts/          # DB initialization and sync scripts (db-init.ts)
│   ├── triggers/         # Business logic engine for environmental events
│   ├── app.ts            # Central Express application setup
│   └── index.ts          # Server entry point
├── Dockerfile            # Container definition for the backend
├── jest.config.js        # Test runner configuration
└── tsconfig.json         # TypeScript compiler configuration
```

## `packages/ui/` Structure

```text
packages/ui/
├── src/
│   └── components/       # Shared unstyled or base UI components
├── package.json          # Library definition
└── tsconfig.json         # TypeScript configuration
```

## Naming & Style Conventions

- **React Components:** PascalCase (e.g., `HeroShield.tsx`) inside `components/`.
- **Logic Files:** kebab-case (e.g., `sync-db.ts`, `api.ts`).
- **Styles:** **Tailwind CSS Utility-First** with shadcn/ui configuration for consistency.
- **API Design:** RESTful endpoints on `backend`, consumed via the `apps/web/src/lib/api.ts` proxy with smart mock fallback.

---

*Structure analysis: 2026-04-04*
