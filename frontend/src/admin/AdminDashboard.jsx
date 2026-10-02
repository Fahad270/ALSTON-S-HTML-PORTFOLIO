import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Clock, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { adminApi } from "../api/adminApi.js";
import { LoadingBlock, ErrorBlock } from "./AdminUI.jsx";

const ICONS = { Activity, Clock, ShieldAlert, CheckCircle2 };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError("");
    adminApi.getDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <LoadingBlock label="Loading platform overview…" />;
  if (error) return <ErrorBlock message={error} onRetry={load} />;

  const { kpis, recentApplications, alerts } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Platform Overview</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Monitor state-wide compliance, SLA adherence, and departmental performance.</p>
        </div>
        <button
          onClick={() => navigate("/admin/escalations")}
          style={{
            background: "#CC6D1D", color: "#fff", border: "none", padding: "10px 20px",
            borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(204, 109, 29, 0.3)",
          }}
        >
          <AlertTriangle size={16} />
          View Critical Breaches
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
        {kpis.map((kpi, i) => {
          const Icon = ICONS[kpi.icon] || Activity;
          return (
            <div key={i} style={{
              background: "#fff", borderRadius: 12, padding: 24,
              border: "1px solid #DADFDA", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, backgroundColor: kpi.color }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: `${kpi.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color={kpi.color} />
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600,
                  color: kpi.trendUp ? "#128807" : "#B4342A", backgroundColor: kpi.trendUp ? "#12880715" : "#B4342A15",
                  padding: "4px 8px", borderRadius: 20,
                }}>
                  {kpi.trend} {kpi.trendUp ? "↑" : "↓"}
                </div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 14, color: "#1C2A36", fontWeight: 500 }}>{kpi.title}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #DADFDA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Recent Applications</h3>
            <button onClick={() => navigate("/admin/applications")} style={{ color: "#0F8B8D", fontSize: 14, background: "none", border: "none", fontWeight: 600, cursor: "pointer" }}>
              View All
            </button>
          </div>
          <div style={{ padding: 24, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>
                  {["App ID", "Business", "Department(s)", "Status", "SLA Timer"].map((h) => (
                    <th key={h} style={{ paddingBottom: 16, color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "2px solid #DADFDA" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app, i) => (
                  <tr key={app.id} style={{ borderBottom: i < recentApplications.length - 1 ? "1px solid #DADFDA" : "none" }}>
                    <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 600, color: "#0B2036", fontFamily: "monospace" }}>{app.id}</td>
                    <td style={{ padding: "16px 0", fontSize: 14, color: "#1C2A36", fontWeight: 500 }}>{app.business}</td>
                    <td style={{ padding: "16px 0", fontSize: 14, color: "#1C2A36" }}>{app.dept}</td>
                    <td style={{ padding: "16px 0" }}>
                      <span style={{
                        padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                        backgroundColor: app.status === "Approved" ? "#12880715" : app.status === "Escalated" ? "#B4342A15" : app.status === "Halted" ? "#DADFDA" : "#CC6D1D15",
                        color: app.status === "Approved" ? "#128807" : app.status === "Escalated" ? "#B4342A" : app.status === "Halted" ? "#1C2A36" : "#CC6D1D",
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 500, color: String(app.sla).includes("Breach") ? "#B4342A" : "#1C2A36" }}>
                      {app.sla}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #DADFDA" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>RTS Act Escalations</h3>
          </div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {alerts.map((alert, i) => (
              <div key={i} style={{
                display: "flex", gap: 16, alignItems: "flex-start",
                padding: 16, borderRadius: 8, border: `1px solid ${alert.critical ? "#B4342A40" : "#DADFDA"}`,
                backgroundColor: alert.critical ? "#B4342A05" : "#fff", cursor: "pointer",
              }}
                onClick={() => navigate("/admin/escalations")}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  backgroundColor: alert.critical ? "#B4342A15" : "#CC6D1D15",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {alert.critical ? <ShieldAlert size={16} color="#B4342A" /> : <AlertTriangle size={16} color="#CC6D1D" />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2036", marginBottom: 4 }}>{alert.issue}</div>
                  <div style={{ fontSize: 13, color: "#1C2A36", marginBottom: 8 }}>{alert.id} • {alert.dept}</div>
                  <div style={{ fontSize: 11, color: "#1C2A36", fontWeight: 600 }}>{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
