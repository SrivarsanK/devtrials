# Tech Stack: apps/web

## Core Framework
- **Next.js 16.2.1**: App Router architecture with route grouping (`(auth)`, `(dashboard)`).
- **React 19.2.4**: Using cutting-edge React features and 19-release patterns.
- **TypeScript**: Strict typing across all components and API layers.

## Styling & UI
- **Tailwind CSS 3.4.19**: Utility-first styling with custom dark theme config.
- **Shadcn UI**: Modern primitive-based UI components (Tabs, Hero, Cards).
- **Base UI**: Radix-compatible React primitives.
- **Fonts**: Inter (Sans), Nunito (Display), JetBrains Mono (Code) via `next/font`.

## Authentication & Security
- **Clerk (@clerk/nextjs)**: Enterprise-grade auth with deep server-side integration.
- **@clerk/themes**: Using `dark` theme base with extensive CSS overrides for "glassmorphism".

## GIS & Visualization
- **Leaflet 1.9.4**: Core mapping library for coverage zones.
- **React-Leaflet 5.0.0**: React wrappers for the map.
- **Three.js (@react-three/fiber/@react-three/drei)**: 3D visual elements (HeroShield).

## Animation
- **Anime.js**: High-performance keyframe animations.
- **tw-animate-css**: Tailwind integration for common animations.
- **tailwindcss-animate**: Utility-based transitions.

## Data & State
- **Fetch API**: Centralized in `lib/api.ts` with custom resilient fallback logic.
- **Clerk Context**: Manages session-persistent user state.
