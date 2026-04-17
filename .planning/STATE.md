# Project State

## Current Position

**Phase:** 13 (Milestone Complete)
**Plan:** `apps/web` zone implementation
**Status:** 🟢 Completed Zone integrations
**Last activity:** {{current_time}} — Requirements ZONE-01 through ZONE-05 implemented successfully

## Current Milestone: v1.4 Chennai Zone Classification Integration

**Goal:** Integrate 62 classified Chennai zones (18 Red, 28 Orange, 16 Green) with priority-based risk visualization into the live risk map and zones pages in the `apps/web` insurer dashboard.
**Phase:** 14 - Data Migration & Production Verification (Complete)
**Plan:** —
**Status:** Milestone v1.4 Complete. Ready for next.
**Last activity:** 2026-04-17 — Milestone v1.4 finished.

## Current Milestone: v1.4 Backend & ML Deployment

**Goal:** Containerize ML suite for production hosting, migrate API to Vercel, and establish end-to-end cloud connectivity.

**Target Features:**

- Zone data layer with geocoded coordinates for 62 Chennai localities
- Color-coded zone markers (Red/Orange/Green) on the Leaflet risk map
- Interactive legend and filter controls for zone tiers
- Zones page classification with priority-based visual styling
- Red zones integrated into priority alerts sidebar

## Accumulated Context

- **Project Type:** Parametric Insurance for Gig Workers
- **Stack:** Node.js/TypeScript (frontend), Node.js (backend), PostgreSQL
- **UI Progress:** Dashboard shell is complete and symmetrical.
- **Key Decision:** v1.3 used PhonePe Refund API; v1.4 focuses on zone classification visualization.
- **Scope Constraint:** Strictly `apps/web` dashboard only.
