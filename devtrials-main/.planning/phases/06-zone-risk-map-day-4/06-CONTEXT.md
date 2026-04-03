# Phase 6: Zone Risk Map (Day 4) — Context

**Gathered:** 2026-04-02
**Status:** Ready for planning
**Source:** Milestone v1.1 spec + existing zone data (reserves.ts)

## Phase Boundary

This phase delivers the **interactive zone risk map** — the visual crown jewel of the dashboard. It renders clickable GeoJSON coverage polygons for Chennai, Mumbai, and Delhi, color-coded by zone risk status, with live Zustand reactivity.

## Key Technical Challenge: SSR-safe Leaflet

Leaflet.js directly accesses `window`, `document`, and `navigator` at import time — all unavailable during Next.js server-side rendering. The canonical solution is **Next.js dynamic import with `ssr: false`**:

```tsx
// ZoneRiskMap.tsx (server-safe wrapper)
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMapInner'), { ssr: false });
```

The inner component (`LeafletMapInner.tsx`) contains all Leaflet imports and GeoJSON rendering — it only executes in the browser. This is the single most important pattern for ZRM-001.

## Data Architecture

**Zones to map** (from `mockReserveHealth`):
| Zone ID         | Zone Name   | City    | Status | Lat/Lng center (approx.) |
|-----------------|-------------|---------|--------|--------------------------|
| CHN_ANNA_NAGAR  | Anna Nagar  | Chennai | RED    | 13.0850, 80.2101         |
| CHN_T_NAGAR     | T Nagar     | Chennai | AMBER  | 13.0418, 80.2341         |
| CHN_TAMBARAM    | Tambaram    | Chennai | GREEN  | 12.9249, 80.1000         |
| MUM_DHARAVI     | Dharavi     | Mumbai  | AMBER  | 19.0330, 72.8570         |
| MUM_ANDHERI     | Andheri     | Mumbai  | GREEN  | 19.1136, 72.8697         |
| DEL_LAXMI_NAGAR | Laxmi Nagar | Delhi   | AMBER  | 28.6310, 77.2780         |
| DEL_KAROL_BAGH  | Karol Bagh  | Delhi   | GREEN  | 28.6520, 77.1900         |

**GeoJSON approach:** Use `L.circle()` radius markers (800m) to represent coverage zones — avoids needing complex GeoJSON polygon files while still looking geographically accurate. This is the pragmatic hackathon choice.

## Popup Content (ZRM-003)

Clicking a zone circle shows an `L.popup()` with:
- Zone name + City
- Status badge (GREEN/AMBER/RED)
- Reserve Balance (₹L)
- Active Liability (₹L)
- Policies count
- Circuit Breaker Status

## Reactivity Pattern (ZRM-004)

The inner map component subscribes to `useDashboardStore` to get `pausedZones` and `reserveHealth`. It uses a `useEffect` to re-render circle colors whenever those values change. Since Leaflet owns the DOM, we maintain a `circleRef` map (`Record<string, L.Circle>`) and call `.setStyle()` directly instead of re-mounting.

## Implementation Plan

**2 plans:**
1. **Plan 01:** SSR-safe map shell + `LeafletMapInner.tsx` with static circles + popup detail.
2. **Plan 02:** Zustand reactivity layer — circles re-colorize on `pausedZones` or `reserveHealth` changes + wiring into `DashboardClient`.
