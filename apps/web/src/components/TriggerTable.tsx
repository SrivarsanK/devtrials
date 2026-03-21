"use client";

import React from "react";
import { Trigger } from "@/lib/api";

interface TriggerTableProps {
  triggers: Trigger[];
  loading: boolean;
}

export default function TriggerTable({ triggers, loading }: TriggerTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Zone</th>
          <th>Magnitude</th>
          <th>Status</th>
          <th>Payout</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={6} style={{ textAlign: "center", padding: "3rem" }}>Loading...</td></tr>
        ) : triggers.length === 0 ? (
          <tr><td colSpan={6} style={{ textAlign: "center", padding: "3rem" }}>No activity detected.</td></tr>
        ) : (
          triggers.map((t) => (
            <tr key={t.id}>
              <td style={{ fontWeight: 800 }}>{t.type}</td>
              <td style={{ color: "var(--muted)" }}>{t.zone}</td>
              <td>{t.magnitude}</td>
              <td>
                <span className="badge" style={{ 
                  backgroundColor: t.status === 'PROCESSED' ? 'var(--success)' : 'var(--warning)', 
                  color: 'black',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem'
                }}>
                  {t.status}
                </span>
              </td>
              <td style={{ color: "var(--accent-yellow)", fontWeight: 900 }}>₹{t.payoutAmount}</td>
              <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{new Date(t.timestamp).toLocaleString()}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
