import React from "react";
import { Plus, Settings, Play, Database } from "lucide-react";

export default function AdminRules() {
  const rules = [
    { id: "RULE-FC-01", name: "Fire Safety NOC", sector: "Manufacturing", state: "Maharashtra", conditions: "Building Height > 15m or Hazardous Materials", sla: "15 Days" },
    { id: "RULE-PCB-02", name: "Consent to Establish (Orange)", sector: "Any", state: "Maharashtra", conditions: "Category: Orange", sla: "30 Days" },
    { id: "RULE-LB-03", name: "Labour Welfare Fund", sector: "Any", state: "Central", conditions: "Employees >= 5", sla: "Instant" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Regulatory Rules Engine</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Manage approval graph configurations, KYA triggers, and dependency rules.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ 
            background: "#fff", color: "#0B2036", border: "1px solid #DADFDA", padding: "10px 20px", 
            borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8
          }}>
            <Play size={16} /> Run Simulation
          </button>
          <button style={{ 
            background: "#0B2036", color: "#fff", border: "none", padding: "10px 20px", 
            borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8
          }}>
            <Plus size={16} /> Add New Rule
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #DADFDA", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#0F8B8D15", color: "#0F8B8D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Database size={24} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif" }}>1,248</div>
            <div style={{ fontSize: 13, color: "#1C2A36", fontWeight: 500 }}>Active Rules in Database</div>
          </div>
        </div>
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #DADFDA", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#CC6D1D15", color: "#CC6D1D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Settings size={24} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif" }}>12</div>
            <div style={{ fontSize: 13, color: "#1C2A36", fontWeight: 500 }}>Proposed Changes Pending</div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #DADFDA", background: "#F5F6F3" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Recently Modified Rules</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Rule ID</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Approval Name</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Trigger Conditions</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Statutory SLA</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, i) => (
              <tr key={i} style={{ borderBottom: i < rules.length - 1 ? "1px solid #DADFDA" : "none" }}>
                <td style={{ padding: "20px 24px", fontSize: 13, fontWeight: 600, color: "#0B2036", fontFamily: "monospace" }}>{rule.id}</td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2036" }}>{rule.name}</div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginTop: 4 }}>{rule.sector} • {rule.state}</div>
                </td>
                <td style={{ padding: "20px 24px", fontSize: 13, color: "#1C2A36", backgroundColor: "#F9FAF9", borderRadius: 4, margin: "10px 24px", display: "inline-block", border: "1px solid #DADFDA" }}>
                  {rule.conditions}
                </td>
                <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 600, color: "#128807" }}>{rule.sla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
