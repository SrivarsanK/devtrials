'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + Next.js
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import { ChennaiZone, ZoneTier, ZONE_TIER_CONFIG } from '@/lib/chennaiZones';

/**
 * OpenWeatherMap Layer Definitions
 */
const OWM_LAYERS = [
  { name: 'Rain', id: 'precipitation_new' },
  { name: 'Clouds', id: 'clouds_new' },
  { name: 'Wind', id: 'wind_new' },
  { name: 'Temp', id: 'temp_new' },
];

interface HeatPoint {
  lat: number;
  lng: number;
  weight: number;
}

interface RiskMapProps {
  center?: [number, number];
  zoom?: number;
  heatmapData?: HeatPoint[];
  zones?: ChennaiZone[];
  visibleTiers?: Record<ZoneTier, boolean>;
}

/**
 * HeatmapOverlay component that hooks into the Leaflet map state
 */
const HeatmapOverlay = ({ data }: { data: HeatPoint[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const layerGroup = L.layerGroup();

    data.forEach((point) => {
      // Create a nice glow effect using multiple circles
      const color = point.weight > 3.5 ? '#ff0055' : point.weight > 2 ? '#ffcc00' : '#00ffff';
      
      // Outer glow
      L.circle([point.lat, point.lng], {
        radius: 800 + point.weight * 400,
        fillColor: color,
        color: 'transparent',
        fillOpacity: 0.15,
        interactive: false,
      }).addTo(layerGroup);

      // Inner core
      L.circle([point.lat, point.lng], {
        radius: 200 + point.weight * 100,
        fillColor: color,
        color: 'transparent',
        fillOpacity: 0.4,
        interactive: false,
      }).addTo(layerGroup);
    });

    layerGroup.addTo(map);

    // Auto-center on top risk if it's far from current center
    const sorted = [...data].sort((a, b) => b.weight - a.weight);
    if (sorted.length > 0) {
      const top = sorted[0];
      const center = map.getCenter();
      const dist = Math.sqrt(Math.pow(center.lat - top.lat, 2) + Math.pow(center.lng - top.lng, 2));
      if (dist > 0.4) {
        map.setView([top.lat, top.lng], 11, { animate: true });
      }
    }

    return () => {
      map.removeLayer(layerGroup);
    };
  }, [data, map]);

  return null;
};

/**
 * ZoneMarkers renders classified zone circles on the map
 */
const ZoneMarkers = ({ zones, visibleTiers }: { zones: ChennaiZone[]; visibleTiers: Record<ZoneTier, boolean> }) => {
  const filteredZones = zones.filter(z => visibleTiers[z.zone]);

  return (
    <>
      {filteredZones.map((zone) => {
        const config = ZONE_TIER_CONFIG[zone.zone];
        const isRed = zone.zone === 'red';
        const isGreen = zone.zone === 'green';

        return (
          <CircleMarker
            key={`${zone.name}-${zone.zone}`}
            center={[zone.lat, zone.lng]}
            radius={isRed ? 9 : isGreen ? 6 : 7}
            pathOptions={{
              fillColor: config.color,
              color: config.color,
              weight: isRed ? 2.5 : 1.5,
              opacity: isRed ? 0.9 : 0.7,
              fillOpacity: isRed ? 0.55 : isGreen ? 0.3 : 0.4,
              className: isRed ? 'zone-marker-pulse' : '',
            }}
          >
            <Popup
              closeButton={false}
              className="zone-popup"
            >
              <div style={{
                background: '#0a0a12',
                border: `1px solid ${config.color}40`,
                borderRadius: '16px',
                padding: '16px 20px',
                minWidth: '200px',
                boxShadow: `0 0 30px ${config.glowColor}, inset 0 0 20px ${config.glowColor}`,
                fontFamily: 'var(--font-display, system-ui)',
              }}>
                <div style={{
                  fontSize: '8px',
                  fontWeight: 900,
                  letterSpacing: '0.2em',
                  color: config.color,
                  textTransform: 'uppercase' as const,
                  marginBottom: '6px',
                  opacity: 0.8,
                }}>
                  {config.priority}
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#fff',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: '8px',
                }}>
                  {zone.name}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: config.color,
                    boxShadow: `0 0 8px ${config.color}`,
                  }} />
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#888',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.1em',
                  }}>
                    {zone.region}
                  </span>
                </div>
                <div style={{
                  marginTop: '10px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: config.bgColor,
                  border: `1px solid ${config.borderColor}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <div style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: config.color,
                  }} />
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 900,
                    color: config.color,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.15em',
                  }}>
                    {config.label}
                  </span>
                </div>
              </div>
            </Popup>
            <Tooltip
              direction="top"
              offset={[0, -8]}
              opacity={0.95}
              className="zone-tooltip"
            >
              <span style={{
                fontWeight: 800,
                fontSize: '11px',
                color: '#fff',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
              }}>
                {zone.name}
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
};

const RiskMap: React.FC<RiskMapProps> = ({ 
  center = [13.0827, 80.2707], // Chennai
  zoom = 11,
  heatmapData = [],
  zones = [],
  visibleTiers = { red: true, orange: true, green: true },
}) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  useEffect(() => {
    // Standard Leaflet fix for missing markers
    const DefaultIcon = L.Icon.Default as unknown as { prototype: { _getIconUrl?: unknown } };
    delete DefaultIcon.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetinaUrl.src,
      iconUrl: iconUrl.src,
      shadowUrl: shadowUrl.src,
    });
  }, []);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl relative border border-white/10">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
      >
        {/* Base Layer - CartoDB Dark Matter */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Custom Risk Heatmap */}
        <HeatmapOverlay data={heatmapData} />

        {/* Classified Zone Markers */}
        {zones.length > 0 && (
          <ZoneMarkers zones={zones} visibleTiers={visibleTiers} />
        )}

        {/* OpenWeatherMap Overlays */}
        <LayersControl position="topright">
          {OWM_LAYERS.map((layer) => (
            <LayersControl.Overlay 
              name={layer.name} 
              key={layer.id}
              checked={layer.name !== 'Temp'}
            >
              <TileLayer
                url={apiKey ? `https://tile.openweathermap.org/map/${layer.id}/{z}/{x}/{y}.png?appid=${apiKey}` : ''}
                opacity={0.6}
              />
            </LayersControl.Overlay>
          ))}
        </LayersControl>
      </MapContainer>

      {/* Zone pulse animation CSS */}
      <style jsx global>{`
        .zone-marker-pulse {
          animation: zonePulse 2s ease-in-out infinite;
        }
        @keyframes zonePulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.85; }
        }

        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 16px !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-tip {
          background: #0a0a12 !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
        }

        .zone-tooltip .leaflet-tooltip-content {
          background: #0d0d15 !important;
        }
        .leaflet-tooltip.zone-tooltip {
          background: #0d0d15 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 8px !important;
          padding: 4px 10px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
          color: #fff !important;
        }
        .leaflet-tooltip.zone-tooltip::before {
          border-top-color: #0d0d15 !important;
        }
      `}</style>
    </div>
  );
};

export default RiskMap;
