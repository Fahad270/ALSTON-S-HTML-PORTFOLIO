import React from "react";
import { Activity, Clock, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const kpis = [
    { title: "Total Applications", value: "2,405", trend: "+12%", trendUp: true, icon: Activity, color: "#0F8B8D" },
    { title: "SLA Adherence Rate", value: "94.2%", trend: "-1.1%", trendUp: false, icon: Clock, color: "#128807" },
    { title: "Active Escalations", value: "38", trend: "+5", trendUp: false, icon: ShieldAlert, color: "#B4342A" },
    { title: "Deemed Approvals", value: "14", trend: "0", trendUp: true, icon: CheckCircle2, color: "#CC6D1D" },
  ];

  const recentAlerts = [
    { id: "APP-9021", dept: "Fire & Emergency", issue: "SLA Deadline Approaching (< 24h)", time: "2 hours ago", critical: true },
    { id: "APP-8834", dept: "Pollution Control", issue: "Escalated to Nodal Officer (SLA Breached)", time: "5 hours ago", critical: true },
    { id: "APP-9102", dept: "Labour Dept", issue: "Joint Inspection Scheduling Conflict", time: "1 day ago", critical: false },
  ];

  const applications = [
    { id: "APP-9145", business: "Demo Manufacturing Pvt Ltd", dept: "Multiple (3)", status: "In Progress", sla: "12 days left" },
    { id: "APP-9142", business: "EcoTech Solutions", dept: "Pollution Control", status: "Halted", sla: "Awaiting Doc" },
    { id: "APP-9130", business: "Apex Logistics", dept: "Transport Dept", status: "Approved", sla: "Cleared" },
    { id: "APP-9118", business: "Sunrise Foods", dept: "FSSAI / Health", status: "Escalated", sla: "-2 days (Breach)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      {/* Welcome Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Platform Overview</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Monitor state-wide compliance, SLA adherence, and departmental performance.</p>
        </div>
        <button style={{ 
          background: "#CC6D1D", color: "#fff", border: "none", padding: "10px 20px", 
          borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(204, 109, 29, 0.3)"
        }}>
          <AlertTriangle size={16} />
          View Critical Breaches
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ 
            background: "#fff", borderRadius: 12, padding: 24, 
            border: "1px solid #DADFDA", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, backgroundColor: kpi.color }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: `${kpi.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <kpi.icon size={20} color={kpi.color} />
              </div>
              <div style={{ 
                display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600,
                color: kpi.trendUp ? "#128807" : "#B4342A", backgroundColor: kpi.trendUp ? "#12880715" : "#B4342A15",
                padding: "4px 8px", borderRadius: 20
              }}>
                {kpi.trend} {kpi.trendUp ? "↑" : "↓"}
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 14, color: "#1C2A36", fontWeight: 500 }}>
              {kpi.title}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Applications Table */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #DADFDA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Recent Applications</h3>
            <a href="#" style={{ color: "#0F8B8D", fontSize: 14, textDecoration: "none", fontWeight: 600 }}>View All</a>
          </div>
          <div style={{ padding: 24, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>
                  <th style={{ paddingBottom: 16, color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "2px solid #DADFDA" }}>App ID</th>
                  <th style={{ paddingBottom: 16, color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "2px solid #DADFDA" }}>Business</th>
                  <th style={{ paddingBottom: 16, color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "2px solid #DADFDA" }}>Department(s)</th>
                  <th style={{ paddingBottom: 16, color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "2px solid #DADFDA" }}>Status</th>
                  <th style={{ paddingBottom: 16, color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "2px solid #DADFDA" }}>SLA Timer</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => (
                  <tr key={i} style={{ borderBottom: i < applications.length - 1 ? "1px solid #DADFDA" : "none" }}>
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
                    <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 500, color: app.sla.includes("Breach") ? "#B4342A" : "#1C2A36" }}>
                      {app.sla}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts / Escalations */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #DADFDA" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>RTS Act Escalations</h3>
          </div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {recentAlerts.map((alert, i) => (
              <div key={i} style={{ 
                display: "flex", gap: 16, alignItems: "flex-start",
                padding: 16, borderRadius: 8, border: `1px solid ${alert.critical ? "#B4342A40" : "#DADFDA"}`,
                backgroundColor: alert.critical ? "#B4342A05" : "#fff"
              }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: "50%", 
                  backgroundColor: alert.critical ? "#B4342A15" : "#CC6D1D15", 
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 
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
