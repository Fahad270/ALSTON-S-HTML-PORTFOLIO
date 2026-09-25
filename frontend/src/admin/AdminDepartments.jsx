import React from "react";
import { Building2, Search, Filter, MoreVertical, AlertCircle } from "lucide-react";

export default function AdminDepartments() {
  const departments = [
    { code: "IND_LABOUR", name: "Industry, Energy & Labour Department", nodalOfficer: "Vikram Deshmukh", activeApps: 8, avgSla: "14 Days", status: "Healthy" },
    { code: "URBAN_DEV", name: "Urban Development & Municipal Corp.", nodalOfficer: "Sunita Patil", activeApps: 12, avgSla: "7 Days", status: "Healthy" },
    { code: "MPCB", name: "Maharashtra Pollution Control Board", nodalOfficer: "Dr. Anand Kulkarni", activeApps: 5, avgSla: "21 Days", status: "Warning" },
    { code: "FIRE_SAFETY", name: "Fire & Emergency Services Directorate", nodalOfficer: "R. K. Shinde", activeApps: 3, avgSla: "10 Days", status: "Healthy" },
    { code: "FSSAI", name: "Food Safety and Standards Authority", nodalOfficer: "Meena Iyer", activeApps: 15, avgSla: "30 Days", status: "Critical" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Integrated State Departments</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Government bodies integrated into the BeeSetu single-window gateway.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ 
            display: "flex", alignItems: "center", gap: 8, background: "#fff", 
            border: "1px solid #DADFDA", borderRadius: 8, padding: "8px 16px" 
          }}>
            <Search size={16} color="#1C2A36" />
            <input type="text" placeholder="Search departments..." style={{ border: "none", outline: "none", fontSize: 14 }} />
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
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Dept Code</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Department Name</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Nodal Officer</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Active Approvals</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Average SLA</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, i) => (
              <tr key={i} style={{ borderBottom: i < departments.length - 1 ? "1px solid #DADFDA" : "none", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAF9"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "20px 24px", fontSize: 13, fontWeight: 600, color: "#1C2A36", fontFamily: "monospace", letterSpacing: 0.5 }}>{dept.code}</td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2036", display: "flex", alignItems: "center", gap: 8 }}>
                    {dept.status === "Critical" && <AlertCircle size={16} color="#B4342A" />}
                    {dept.status === "Warning" && <AlertCircle size={16} color="#CC6D1D" />}
                    {dept.name}
                  </div>
                </td>
                <td style={{ padding: "20px 24px", fontSize: 14, color: "#1C2A36", fontWeight: 500 }}>{dept.nodalOfficer}</td>
                <td style={{ padding: "20px 24px", fontSize: 14, color: "#1C2A36", fontWeight: 600 }}>{dept.activeApps}</td>
                <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 600, color: dept.status === "Critical" ? "#B4342A" : dept.status === "Warning" ? "#CC6D1D" : "#128807" }}>
                  {dept.avgSla}
                </td>
                <td style={{ padding: "20px 24px", textAlign: "right" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#1C2A36" }}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
