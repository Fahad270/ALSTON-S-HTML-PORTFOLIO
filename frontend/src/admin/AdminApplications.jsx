import React from "react";
import { Search, Filter, Eye, MoreVertical, FileText } from "lucide-react";

export default function AdminApplications() {
  const applications = [
    { id: "APP-9145", business: "Demo Manufacturing Pvt Ltd", type: "New Business Setup", dept: "Multiple (3)", submissionDate: "12 Oct 2026", status: "In Progress", sla: "12 days left" },
    { id: "APP-9142", business: "EcoTech Solutions", type: "Consent to Operate", dept: "Pollution Control", submissionDate: "10 Oct 2026", status: "Halted", sla: "Awaiting Doc" },
    { id: "APP-9130", business: "Apex Logistics", type: "Commercial Transport", dept: "Transport Dept", submissionDate: "05 Oct 2026", status: "Approved", sla: "Cleared" },
    { id: "APP-9118", business: "Sunrise Foods", type: "FSSAI License", dept: "FSSAI / Health", submissionDate: "28 Sep 2026", status: "Escalated", sla: "-2 days (Breach)" },
    { id: "APP-9092", business: "BlueWave Tech", type: "IT Park Clearance", dept: "Urban Dev", submissionDate: "25 Sep 2026", status: "Approved", sla: "Cleared" },
    { id: "APP-9085", business: "SteelForge Industries", type: "Factory Expansion", dept: "Industry & Labour", submissionDate: "20 Sep 2026", status: "Rejected", sla: "Closed" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Application Management</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Monitor, filter, and review all clearance applications across the state.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ 
            display: "flex", alignItems: "center", gap: 8, background: "#fff", 
            border: "1px solid #DADFDA", borderRadius: 8, padding: "8px 16px" 
          }}>
            <Search size={16} color="#1C2A36" />
            <input type="text" placeholder="Search Application ID..." style={{ border: "none", outline: "none", fontSize: 14 }} />
          </div>
          <button style={{ 
            background: "#fff", color: "#0B2036", border: "1px solid #DADFDA", padding: "8px 16px", 
            borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8
          }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F5F6F3" }}>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>App ID</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Business & Type</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Department(s)</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Submitted</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Status</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>SLA Timer</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, i) => (
              <tr key={i} style={{ borderBottom: i < applications.length - 1 ? "1px solid #DADFDA" : "none", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAF9"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 600, color: "#0B2036", fontFamily: "monospace" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FileText size={16} color="#CC6D1D" />
                    {app.id}
                  </div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2036" }}>{app.business}</div>
                  <div style={{ fontSize: 13, color: "#1C2A36", marginTop: 4 }}>{app.type}</div>
                </td>
                <td style={{ padding: "20px 24px", fontSize: 14, color: "#1C2A36" }}>{app.dept}</td>
                <td style={{ padding: "20px 24px", fontSize: 14, color: "#1C2A36" }}>{app.submissionDate}</td>
                <td style={{ padding: "20px 24px" }}>
                  <span style={{ 
                    padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    backgroundColor: app.status === "Approved" ? "#12880715" : app.status === "Escalated" || app.status === "Rejected" ? "#B4342A15" : app.status === "Halted" ? "#DADFDA" : "#CC6D1D15",
                    color: app.status === "Approved" ? "#128807" : app.status === "Escalated" || app.status === "Rejected" ? "#B4342A" : app.status === "Halted" ? "#1C2A36" : "#CC6D1D",
                  }}>
                    {app.status}
                  </span>
                </td>
                <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 500, color: app.sla.includes("Breach") ? "#B4342A" : "#1C2A36" }}>
                  {app.sla}
                </td>
                <td style={{ padding: "20px 24px", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#0F8B8D" }} title="View Details">
                      <Eye size={18} />
                    </button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#1C2A36" }}>
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
