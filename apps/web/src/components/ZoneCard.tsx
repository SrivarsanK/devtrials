"use client";

import React from "react";
import { Zone } from "@/lib/api";

interface ZoneCardProps {
  zone: Zone;
}

export default function ZoneCard({ zone }: ZoneCardProps) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontSize: "2rem" }}>📍</span>
        <span className="status-dot status-active" style={{ width: 16, height: 16 }} />
      </div>
      <h3 style={{ fontSize: "1.75rem", fontWeight: 900, textTransform: "uppercase", color: "var(--accent-yellow)", marginBottom: "0.5rem" }}>{zone.name}</h3>
      <p style={{ color: "var(--muted)", fontWeight: 800, fontSize: "0.9rem", marginBottom: "1.5rem" }}>REGION: {zone.state.toUpperCase()}</p>
      
      <div style={{ borderTop: "2px solid rgba(249, 244, 218, 0.1)", paddingTop: "1rem", marginTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>LAT/LNG:</span>
          <span style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>{zone.center.lat.toFixed(4)}, {zone.center.lng.toFixed(4)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>RADIUS:</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 800 }}>{zone.radius}km</span>
        </div>
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        {zone.monitoredServices.map(s => (
          <span className="badge" key={s} style={{ 
            backgroundColor: "var(--background)", 
            color: "var(--muted)", 
            border: "1px solid var(--muted)",
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem' 
          }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
