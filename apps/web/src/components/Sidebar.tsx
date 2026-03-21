"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", path: "/", icon: "📊" },
  { name: "Triggers", path: "/dashboard", icon: "⚡" },
  { name: "Monitored Zones", path: "/zones", icon: "📍" },
  { name: "Coverage Plans", path: "/plans", icon: "🛡️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "var(--nav-width)",
        borderRight: "4px solid var(--foreground)",
        height: "100vh",
        position: "sticky",
        top: 0,
        backgroundColor: "var(--surface)",
        padding: "2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 900,
            textTransform: "uppercase",
            color: "var(--accent-yellow)",
            letterSpacing: "-0.02em",
          }}
        >
          GigShield
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.8rem", fontWeight: 600 }}>
          Parametric Protection v1.0
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            style={{
              textDecoration: "none",
              color: pathname === item.path ? "var(--background)" : "var(--foreground)",
              backgroundColor: pathname === item.path ? "var(--accent-yellow)" : "transparent",
              padding: "1rem",
              fontWeight: 800,
              fontSize: "1.1rem",
              border: pathname === item.path ? "3px solid var(--foreground)" : "3px solid transparent",
              boxShadow: pathname === item.path ? "3px 3px 0px 0px var(--foreground)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: "auto", borderTop: "2px solid rgba(249, 244, 218, 0.1)", paddingTop: "1.5rem" }}>
        <div className="card" style={{ padding: "1rem", boxShadow: "2px 2px 0px 0px var(--accent-purple)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="status-dot status-active" />
            <span style={{ fontWeight: 700, fontSize: "0.8rem" }}>NODE-BACKEND OK</span>
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--muted)" }}>5-minute polling active</p>
        </div>
      </div>
    </aside>
  );
}
