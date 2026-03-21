"use client";

import React, { useEffect, useState } from "react";
import ZoneCard from "@/components/ZoneCard";
import { fetchZones, Zone } from "@/lib/api";

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchZones();
        setZones(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <header>
        <h2 style={{ fontSize: "3rem", fontWeight: 900, textTransform: "uppercase", color: "var(--accent-yellow)" }}>Monitored Zones</h2>
        <p style={{ color: "var(--muted)", fontWeight: 700 }}>6 Strategic clusters across India.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
        {loading ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem" }}>Loading zone data...</p>
        ) : zones.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem" }}>No monitored zones registered.</p>
        ) : (
          zones.map((z) => (
            <ZoneCard key={z.id} zone={z} />
          ))
        )}
      </div>
    </div>
  );
}
