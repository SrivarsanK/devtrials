# Architecture: apps/web

The Worker PWA is a modern **Next.js 16 (App Router)** application optimized for mobile first performance and high-fidelity UI.

## Structural Paradigms
- **Route Groups**: 
  - `(auth)`: Isolates Clerk auth pages from the main dashboard logic.
  - `(dashboard)`: Contains the protected experience, ensuring shared layout and auth middleware context.
- **Client Components**: Pervasive use of `'use client'` for interactive elements like `HeroShield` (Three.js) and `RiskMap` (Leaflet).
- **Server Components**: Used for static page shells where hydration isn't the priority.

## Data Flow: "Resilient API Pattern"
Implemented in `lib/api.ts`:
1. **Fetch**: Attempt to reach the real backend (`http://localhost:5678` or `NEXT_PUBLIC_API_URL`).
2. **Handle Errors**: If the backend is unreachable or returns `!res.ok`, it silently falls back to local `MOCK_` constants.
3. **Log Warnings**: Uses `console.warn` so developers/users know when they are in "resilience mode".

## Component Design
- **Primitive Based**: Built on top of `shadcn/ui` and `lucide-react`.
- **Compound Components**: Layouts are composed from reusable parts like `app-header.tsx`, `app-sidebar.tsx`, and specialized cards (`StatsCard.tsx`, `ZoneCard.tsx`).

## GIS Logic
- **`RiskMap.tsx`**: Dynamic Leaflet component with heatmap support.
- **`RegisterZoneModal.tsx`**: Interactive flow for geographic registration, using geo-coordinates.

## Visual Fidelity
- **Three.js Layer**: `HeroShield.tsx` provides a high-end 3D landing experience.
- **Theme Engine**: Centralized in `globals.css` using Tailwind variables and `ClerkProvider` appearance customizations.
