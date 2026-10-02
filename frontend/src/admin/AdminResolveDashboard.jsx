import React from "react";
import { useNavigate } from "react-router-dom";
import { Activity, CheckCircle2, AlertTriangle, ShieldAlert, Users, FileText } from "lucide-react";

export default function AdminResolveDashboard() {
  const navigate = useNavigate();

  const kpis = [
    { label: "Total Issues", value: "284", icon: Activity, color: "#0F8B8D" },
    { label: "Automatically Resolved", value: "156", icon: CheckCircle2, color: "#128807" },
    { label: "Pending Officer Review", value: "87", icon: AlertTriangle, color: "#CC6D1D" },
    { label: "High Priority", value: "23", icon: AlertTriangle, color: "#CC6D1D" },
    { label: "Critical Issues", value: "7", icon: ShieldAlert, color: "#B4342A" },
    { label: "Repeated/Common Issues", value: "18", icon: Users, color: "#0F8B8D" },
  ];

  const issues = [
    {
      id: "ISS-1042",
      issue: "NSWS application stuck after submission",
      category: "Application Status",
      affectedUsers: 100,
      priority: "HIGH",
      status: "Pending Review",
      resolutionStatus: "Unresolved",
      lastUpdated: "2 hours ago",
    },
    {
      id: "ISS-1087",
      issue: "Unable to upload document",
      category: "Document Upload",
      affectedUsers: 64,
      priority: "LOW",
      status: "Automatically Resolved",
      resolutionStatus: "Verified",
      lastUpdated: "5 hours ago",
    },
    {
      id: "ISS-1091",
      issue: "MPCB application status not updated",
      category: "Application Status",
      affectedUsers: 42,
      priority: "HIGH",
      status: "Under Review",
      resolutionStatus: "In Progress",
      lastUpdated: "1 day ago",
    },
    {
      id: "ISS-1102",
      issue: "Unknown issue regarding Approval X",
      category: "Approval Portal",
      affectedUsers: 7,
      priority: "HIGH",
      status: "Unresolved",
      resolutionStatus: "Unresolved",
      lastUpdated: "3 days ago",
    },
    {
      id: "ISS-1031",
      issue: "Repeated approval portal failure",
      category: "Portal Stability",
      affectedUsers: 31,
      priority: "CRITICAL",
      status: "Escalated to Officer",
      resolutionStatus: "In Progress",
      lastUpdated: "6 hours ago",
    },
  ];

  const getPriorityBadge = (priority) => {
    const colors = {
      LOW: { bg: "#12880715", color: "#128807" },
      HIGH: { bg: "#CC6D1D15", color: "#CC6D1D" },
      CRITICAL: { bg: "#B4342A15", color: "#B4342A" },
    };
    const style = colors[priority] || colors.LOW;
    return (
      <span style={{
        padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
        backgroundColor: style.bg, color: style.color,
      }}>
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      "Automatically Resolved": { bg: "#12880715", color: "#128807" },
      "Pending Review": { bg: "#CC6D1D15", color: "#CC6D1D" },
      "Under Review": { bg: "#0F8B8D15", color: "#0F8B8D" },
      "Unresolved": { bg: "#B4342A15", color: "#B4342A" },
      "Escalated to Officer": { bg: "#B4342A15", color: "#B4342A" },
    };
    const style = colors[status] || colors["Pending Review"];
    return (
      <span style={{
        padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
        backgroundColor: style.bg, color: style.color,
      }}>
        {status}
      </span>
    );
  };

  const getResolutionBadge = (status) => {
    const colors = {
      Verified: { bg: "#12880715", color: "#128807" },
      "In Progress": { bg: "#0F8B8D15", color: "#0F8B8D" },
      Unresolved: { bg: "#B4342A15", color: "#B4342A" },
    };
    const style = colors[status] || colors.Unresolved;
    return (
      <span style={{
        padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
        backgroundColor: style.bg, color: style.color,
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
          PRAGATI RESOLVE — Issue Resolution Dashboard
        </h1>
        <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>
          Monitor and resolve user-reported issues. Resolve once, reuse everywhere.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 12, padding: 20,
            border: "1px solid #DADFDA", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: `${kpi.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <kpi.icon size={24} color={kpi.color} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif" }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 13, color: "#1C2A36", fontWeight: 500 }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Issues Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #DADFDA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
            Active Issues
          </h3>
          <button
            onClick={() => navigate("/admin/resolve/knowledge-base")}
            style={{
              background: "#0F8B8D", color: "#fff", border: "none", padding: "10px 20px",
              borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <FileText size={16} />
            View Knowledge Base
          </button>
        </div>
        <div style={{ padding: 24, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr>
                {["Issue", "Category", "Affected Users", "Priority", "Status", "Resolution Status", "Last Updated", "Action"].map((h) => (
                  <th key={h} style={{ paddingBottom: 16, color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "2px solid #DADFDA" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, i) => (
                <tr key={issue.id} style={{ borderBottom: i < issues.length - 1 ? "1px solid #DADFDA" : "none", cursor: "pointer" }} onClick={() => navigate(`/admin/resolve/issue/${issue.id}`)}>
                  <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 600, color: "#0B2036" }}>{issue.issue}</td>
                  <td style={{ padding: "16px 0", fontSize: 14, color: "#1C2A36" }}>{issue.category}</td>
                  <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 600, color: "#0B2036" }}>{issue.affectedUsers}</td>
                  <td style={{ padding: "16px 0" }}>{getPriorityBadge(issue.priority)}</td>
                  <td style={{ padding: "16px 0" }}>{getStatusBadge(issue.status)}</td>
                  <td style={{ padding: "16px 0" }}>{getResolutionBadge(issue.resolutionStatus)}</td>
                  <td style={{ padding: "16px 0", fontSize: 13, color: "#1C2A36" }}>{issue.lastUpdated}</td>
                  <td style={{ padding: "16px 0" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/resolve/issue/${issue.id}`);
                      }}
                      style={{
                        padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                        background: "#0B2036", color: "#fff", border: "none", cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* USP Banner */}
      <div style={{
        padding: 20, borderRadius: 12, border: "1px solid #0F8B8D40",
        background: "linear-gradient(135deg, #0F8B8D10, #12880710)", display: "flex", gap: 16, alignItems: "flex-start",
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: "#0F8B8D15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <CheckCircle2 size={24} color="#0F8B8D" />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0B2036", marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
            RESOLVE ONCE. REUSE EVERYWHERE.
          </div>
          <div style={{ fontSize: 14, color: "#1C2A36", lineHeight: 1.6 }}>
            When an officer resolves an issue, that solution is verified and added to the knowledge base.
            Future users with the same problem receive automatic answers without officer intervention.
          </div>
        </div>
      </div>
    </div>
  );
}
