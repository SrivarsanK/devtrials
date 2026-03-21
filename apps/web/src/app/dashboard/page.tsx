"use client";

import React, { useEffect, useState } from "react";
import { fetchTriggers, manualPoll, Trigger } from "@/lib/api";

export default function TriggersDashboard() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const data = await fetchTriggers();
      setTriggers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleManualPoll() {
    try {
      setPolling(true);
      await manualPoll();
      await loadData();
    } catch (err) {
      alert("Poll failed - internal server error");
    } finally {
      setPolling(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase" }}>Trigger Logs</h2>
          <p style={{ color: "var(--muted)", fontWeight: 700 }}>Exploration of historical and recent disaster triggers.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleManualPoll}
          disabled={polling}
          style={{ opacity: polling ? 0.5 : 1 }}
        >
          {polling ? "⚡ Polling..." : "📡 Request Manual Poll"}
        </button>
      </header>

      <div className="card" style={{ padding: "0" }}>
        <table className="data-table" style={{ border: "none" }}>
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Type</th>
              <th>Zone</th>
              <th>Magnitude</th>
              <th>Status</th>
              <th>Payout</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>Fetching logs...</td></tr>
            ) : triggers.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>No events found.</td></tr>
            ) : (
              triggers.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>{t.id.slice(0, 8)}</td>
                  <td style={{ fontWeight: 800 }}>{t.type}</td>
                  <td>{t.zone}</td>
                  <td style={{ fontWeight: 700 }}>{t.magnitude}</td>
                  <td>
                    <span style={{ 
                      color: t.status === 'PROCESSED' ? 'var(--success)' : 'var(--warning)',
                      fontWeight: 800,
                      fontSize: "0.8rem"
                    }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--accent-yellow)", fontWeight: 900 }}>₹{t.payoutAmount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
