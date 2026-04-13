'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + Next.js
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

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

const RiskMap: React.FC<RiskMapProps> = ({ 
  center = [13.0827, 80.2707], // Chennai
  zoom = 11,
  heatmapData = [] 
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
    </div>
  );
};

export default RiskMap;
