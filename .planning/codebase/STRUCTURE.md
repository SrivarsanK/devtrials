# Directory Structure

**Analysis Date:** 2026-03-28

## Root Directory

```text
.
├── .github/              # CI/CD (GitHub Actions)
├── .planning/            # System-wide project planning and codebase maps
├── apps/                 # Primary applications (Next.js web app)
├── backend/              # Core Express.js API and logic
├── packages/             # Shared libraries (UI foundation)
├── docker-compose.yml    # Local development orchestration
├── pnpm-workspace.yaml   # Monorepo configuration
└── package.json          # Root package definitions and shared scripts
```

## `apps/web/` Structure

```text
apps/web/
├── app/                  # Next.js 16 app router (layouts, pages, routes)
├── src/
│   ├── components/       # UI components (shadcn/ui based)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Shared frontend utilities (API proxy)
│   └── proxy.ts          # Central API abstraction
├── public/               # Static assets (images, icons)
├── components.json       # shadcn/ui configuration
├── tailwind.config.ts    # Styling configuration
└── next.config.ts        # Next.js framework configuration
```

## `backend/` Structure

```text
backend/
├── src/
│   ├── config/           # App configuration (environment variables)
│   ├── lib/              # Internal libraries and helpers
│   ├── middleware/       # Express middleware (auth, logging)
│   ├── routes/           # Domain-specific route definitions
│   ├── scripts/          # Database sync and utility scripts
│   ├── triggers/         # Core business logic for events
│   ├── app.ts            # Central application definition
│   └── index.ts          # Web server entry point
├── Dockerfile            # Container definition for deployment
├── jest.config.js        # Test runner configuration
└── tsconfig.json         # TypeScript compiler configuration
```

## `packages/ui/` Structure

```text
packages/ui/
├── package.json          # Library definition
└── tsconfig.json         # TypeScript configuration for UI library
```

## Naming Conventions

- **React Components:** PascalCase (e.g., `Button.tsx`).
- **Files/Folders:** kebab-case (e.g., `user-service.ts`, `auth/`).
- **Styles:** Tailwind utility classes directly in `className`.
- **Backend Routes:** Focus on plural nouns for resources (e.g., `/api/triggers`, `/api/heatmap`).

---

*Structure analysis: 2026-03-28*
*Maintain after major directory reorganization*
