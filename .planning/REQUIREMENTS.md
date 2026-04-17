# Requirements: Milestone v1.4

## Chennai Zone Classification Integration

### Zone Data & Risk Map (ZONE)

- [x] **ZONE-01**: Static zone classification dataset with geocoded coordinates, region label, and risk tier (red/orange/green) for all 62 Chennai localities
- [x] **ZONE-02**: Color-coded circle markers on the Leaflet risk map — Red zones pulsing, Orange zones steady, Green zones subtle — with interactive popups displaying zone name, region, and priority level
- [x] **ZONE-03**: Interactive zone tier legend and filter toggle controls on the risk map allowing users to show/hide Red, Orange, and Green zones independently
- [x] **ZONE-04**: Priority alerts sidebar populated with Red zone data showing zone name, region, risk classification, and appropriate severity styling
- [x] **ZONE-05**: Zones page displays all 62 zones grouped by risk classification (Red → Orange → Green) with color-coded badges and priority-sorted layout

## Future Requirements

(None deferred from this milestone)

## Out of Scope

- **Backend persistence of zone data** — Zone classification is static/hardcoded for this milestone
- **Dynamic zone risk calculation** — The red/orange/green classification is pre-determined, not computed from live data
- **Worker dashboard zones** — Strictly `apps/web` insurer dashboard only
- **Editable zone classifications** — Read-only display for this milestone

## Traceability

| REQ-ID  | Phase |
|---------|-------|
| ZONE-01 | 12    |
| ZONE-02 | 12    |
| ZONE-03 | 12    |
| ZONE-04 | 12    |
| ZONE-05 | 13    |
