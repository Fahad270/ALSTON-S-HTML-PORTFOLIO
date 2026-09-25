import React from "react";
import { ShieldAlert, ArrowRight, FileCheck, CheckCircle } from "lucide-react";

export default function AdminEscalations() {
  const escalations = [
    { 
      id: "ESC-8012", appId: "APP-8990", business: "SolarTech India", 
      dept: "Energy Dept", officer: "M. Sharma", breachTime: "12 hours ago",
      reason: "Pending Site Inspection Document", risk: "High" 
    },
    { 
      id: "ESC-8011", appId: "APP-8975", business: "Global Logistics", 
      dept: "Transport Dept", officer: "A. Patel", breachTime: "1 day ago",
      reason: "Awaiting Committee Approval", risk: "Medium" 
    },
    { 
      id: "ESC-8009", appId: "APP-8910", business: "Urban Eats Chain", 
      dept: "Health Dept", officer: "S. Rao", breachTime: "2 days ago",
      reason: "Document Verification Delayed", risk: "High" 
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Escalations & Deemed Approvals</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Review SLA breaches escalated to Nodal Officers and process deemed approvals.</p>
        </div>
        <button style={{ 
          background: "#B4342A", color: "#fff", border: "none", padding: "10px 20px", 
          borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8
        }}>
          <ShieldAlert size={16} /> Process Critical Cases
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        {escalations.map((esc, i) => (
          <div key={i} style={{ 
            background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", 
            borderLeft: `4px solid ${esc.risk === "High" ? "#B4342A" : "#CC6D1D"}`,
            padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ padding: "4px 8px", background: "#F5F6F3", borderRadius: 4, fontSize: 12, fontWeight: 600, color: "#0B2036" }}>{esc.id}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#0B2036" }}>{esc.business}</span>
                <span style={{ color: "#B4342A", fontSize: 13, fontWeight: 600, background: "#B4342A15", padding: "2px 8px", borderRadius: 12 }}>Breached {esc.breachTime}</span>
              </div>
              <div style={{ display: "flex", gap: 24, color: "#1C2A36", fontSize: 14 }}>
                <div><strong>App ID:</strong> {esc.appId}</div>
                <div><strong>Department:</strong> {esc.dept}</div>
                <div><strong>Current Owner:</strong> {esc.officer}</div>
                <div><strong>Bottleneck:</strong> {esc.reason}</div>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 200 }}>
              <button style={{ 
                background: "#F5F6F3", color: "#0B2036", border: "1px solid #DADFDA", padding: "8px 16px", 
                borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}>
                <FileCheck size={16} /> View Evidence Package
              </button>
              <button style={{ 
                background: "#0B2036", color: "#fff", border: "none", padding: "8px 16px", 
                borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}>
                <CheckCircle size={16} /> Grant Deemed Approval
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
