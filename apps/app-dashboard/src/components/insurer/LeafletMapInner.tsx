'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZONE_GEO_DATA } from '@/data/zones';
import { useDashboardStore } from '@/store/dashboardStore';
import type { ZoneReserve } from '@/types';

// Status → Leaflet circle color
const STATUS_COLORS: Record<string, string> = {
  RED:   '#ff2d55',
  AMBER: '#ffc800',
  GREEN: '#00c896',
};

function buildPopupHtml(zone: ZoneReserve, isPaused: boolean): string {
  const statusColor = STATUS_COLORS[zone.status] || '#6b7280';
  const statusLabel = zone.status === 'RED' ? 'INTERVENTION' : zone.status === 'AMBER' ? 'WATCH' : 'STABLE';
  const cbStatus = isPaused ? '⏸ HALTED' : '▶ ACTIVE';

  return `
    <div style="font-family: 'Freeroad', sans-serif; min-width: 240px; color: #f0f0f5; background: #0d0d0d; border-radius: 1.5rem; padding: 0; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
      <div style="background: ${statusColor}15; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; flex-direction: column;">
            <strong style="font-size: 14px; text-transform: uppercase; letter-spacing: -0.02em; font-weight: 900; color: #fff">${zone.name}</strong>
            <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); font-weight: 700; margin-top: 2px;">NODE CLUSTER</span>
        </div>
        <span style="font-size: 9px; color: ${statusColor}; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; background: ${statusColor}10; padding: 4px 10px; border-radius: 999px; border: 1px solid ${statusColor}33;">${statusLabel}</span>
      </div>
      <div style="padding: 1.25rem; font-size: 11px; color: rgba(240,240,245,0.6); display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 0.5rem;">
            <span style="text-transform: uppercase; font-weight: 900; font-size: 9px; letter-spacing: 0.05em;">Metropolitan Hub</span>
            <strong style="color:#fff; text-transform: uppercase;">${zone.city}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 0.5rem;">
            <span style="text-transform: uppercase; font-weight: 900; font-size: 9px; letter-spacing: 0.05em;">Active Policies</span>
            <strong style="color:#fff; font-family: monospace;">${zone.policies.toLocaleString('en-IN')}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 0.5rem;">
            <span style="text-transform: uppercase; font-weight: 900; font-size: 9px; letter-spacing: 0.05em;">Liquidity / Liability</span>
            <strong style="color:#fff; font-family: monospace;">₹${zone.reserveLakhs}L / ₹${zone.liabilityLakhs}L</strong>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 0.75rem;">
            <span style="text-transform: uppercase; font-weight: 900; font-size: 9px; letter-spacing: 0.05em;">Protocol Control</span>
            <strong style="color:${isPaused ? '#ff2d55' : '#00c896'}; font-size: 10px; font-weight: 900;">${cbStatus}</strong>
        </div>
      </div>
    </div>
  `;
}

export default function LeafletMapInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const circlesRef = useRef<Record<string, L.CircleMarker>>({});
  const reserveHealth = useDashboardStore((s) => s.reserveHealth);
  const pausedZones = useDashboardStore((s) => s.pausedZones);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20.5, 78.9],   // center of India
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    // Center and fit bounds for Chennai
    const bounds = L.latLngBounds([
      [12.8, 80.0],   // SW Chennai
      [13.3, 80.4],  // NE Chennai
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Small delay for resizing to ensure all tiles load correctly in dynamic layouts
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          circlesRef.current = {};
      }
    };
  }, []);

  // Update circles whenever reserveHealth or pausedZones changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !reserveHealth) return;

    // Use a LayerGroup for stable marker management
    let layerGroup = (map as any)._riskLayerGroup as L.LayerGroup;
    if (!layerGroup) {
      layerGroup = L.layerGroup().addTo(map);
      (map as any)._riskLayerGroup = layerGroup;
    }

    // Build flat zone lookup from reserveHealth
    const zoneMap: Record<string, ZoneReserve> = {};
    for (const city of reserveHealth.cities) {
      for (const zone of city.zones) {
        zoneMap[zone.id] = zone;
      }
    }

    ZONE_GEO_DATA.forEach((geo) => {
      const zone = zoneMap[geo.id];
      if (!zone) return;

      const color = STATUS_COLORS[zone.status] || '#6b7280';
      const isPaused = pausedZones.has(zone.id) || zone.issuancesPaused;

      // Clear existing marker if it exists in this layer group
      if (circlesRef.current[geo.id]) {
        layerGroup.removeLayer(circlesRef.current[geo.id]);
      }

      // Create new circle marker with a slightly larger, more visible radius
      const marker = L.circleMarker([geo.lat, geo.lng], {
        radius: 15, // Prominent fixed size
        color,
        fillColor: color,
        fillOpacity: 0.6, // Stronger visibility
        weight: 3,
        className: 'map-risk-marker',
      })
        .addTo(layerGroup)
        .bindPopup(buildPopupHtml(zone, isPaused), {
          maxWidth: 320,
          className: 'shield-popup',
        });

      // Maintain visual order
      marker.bringToFront();
      
      circlesRef.current[geo.id] = marker;
    });

    console.log(`Risk Map: Synchronized ${ZONE_GEO_DATA.length} nodes.`);
  }, [reserveHealth, pausedZones]);

  return <div ref={containerRef} className="w-full h-full min-h-[900px] rounded-[1.5rem] bg-[#0d0d0d]" />;
}
