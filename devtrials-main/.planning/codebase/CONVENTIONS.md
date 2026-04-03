# Conventions: apps/web

## Coding Standards
- **TypeScript First**: Strict types for all API responses and component props. No `any` (except for specific edge-case API parsing).
- **Component Based**: Complex views are decomposed into reusable parts in `src/components`.
- **Client/Server Hygiene**: explicit `'use client'` for interactive or stateful components.

## UI & UX Conventions
- **Shadcn Primitives**: New components should extend existing `src/components/ui/` primitives to maintain design consistency.
- **Lucide Icons**: Standardized iconography library for all dashboard actions.
- **Interactive UI**: Heavy use of `framer-motion` (via shadcn) and `anime.js` for premium transitions.
- **Glassmorphism**: Defined in `globals.css` (.glass-strong) and applied widely to cards and modals.

## Data Layer Conventions
- **Resilient Fetching**: Use `lib/api.ts` for all external communication. Always include a mock fallback to ensure the app works in disconnected or backend-down scenarios.
- **Type-Centric**: Interfaces for `Trigger`, `Zone`, and `Alert` are centralized and reused across components.

## Authentication
- **Clerk Centric**: Use `ClerkProvider` for all auth-related context. Never handle raw tokens; rely on `@clerk/nextjs` hooks and middleware.
- **Theme Overrides**: Custom branding (GigShield orange/black) is applied via the `appearance` prop in the root `ClerkProvider`.

## Naming
- **Components**: PascalCase (e.g., `RegisterZoneModal.tsx`).
- **Icons**: Standardized naming (`LucideIconName`).
- **Hooks**: `use` prefix (e.g., `useTriggers.ts`).
