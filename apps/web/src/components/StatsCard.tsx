"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  status?: 'active' | 'warning' | 'danger';
}

export default function StatsCard({ title, value, subtitle, icon, status }: StatsCardProps) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <span style={{ fontSize: "1.5rem" }}>{icon}</span>
        {status && <span className={`status-dot status-${status}`} />}
      </div>
      <h3 style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.25rem" }}>{title}</h3>
      <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--accent-yellow)" }}>{value}</p>
      {subtitle && <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>{subtitle}</p>}
    </div>
  );
}
