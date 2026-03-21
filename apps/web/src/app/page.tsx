"use client";

import React, { useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";
import TriggerTable from "@/components/TriggerTable";
import { fetchTriggers, fetchZones, checkHealth, Trigger, Zone } from "@/lib/api";

export default function DashboardPage() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [health, setHealth] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [t, z, h] = await Promise.all([fetchTriggers(), fetchZones(), checkHealth()]);
        setTriggers(t);
        setZones(z);
        setHealth(h);
      } catch (err) {
        console.error("Data fetch error", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "3rem", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, color: "var(--accent-yellow)" }}>GigShield Dashboard</h2>
          <p style={{ color: "var(--muted)", fontWeight: 700, marginTop: "0.5rem" }}>Triggers, payout status, and live monitoring.</p>
        </div>
        <button className="btn-primary" onClick={() => window.location.reload()}>🔄 Refresh Monitor</button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <StatsCard 
          title="Active Triggers" 
          value={triggers.length} 
          icon="⚡" 
          status={health ? "active" : "danger"} 
          subtitle="Real-time alert feed"
        />
        <StatsCard 
          title="Monitored Zones" 
          value={zones.length} 
          icon="📍" 
          subtitle="6 Regions across India"
        />
        <StatsCard 
          title="Avg Scale Factor" 
          value="1.2x" 
          icon="🛡️" 
          subtitle="Current payout level"
        />
      </div>

      <section style={{ marginTop: "1rem" }}>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "1.5rem", textTransform: "uppercase" }}>Live Activity Feed</h3>
        <div className="card" style={{ padding: 0 }}>
          <TriggerTable triggers={triggers} loading={loading} />
        </div>
      </section>
    </div>
  );
}
