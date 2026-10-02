import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertTriangle, FileText, Search, Plus } from "lucide-react";

export default function AdminResolveKnowledgeBase() {
  const navigate = useNavigate();

  const knowledgeBase = [
    {
      id: "KB-001",
      issue: "NSWS Application Stuck",
      resolution: "Verified instructions for resolving/checking the issue. Check application status in the NSWS portal, verify submission timestamp, and contact NSWS support if status remains unchanged beyond 48 hours.",
      department: "NSWS / Relevant Department",
      status: "VERIFIED",
      priority: "HIGH",
      verifiedDate: "01 Oct 2026",
    },
    {
      id: "KB-002",
      issue: "Document Upload Failure",
      resolution: "Verified instructions. Ensure document format is PDF/JPG/PNG and file size is under 5MB. Clear browser cache and retry. If issue persists, check network connectivity and try a different browser.",
      department: "Technical Support",
      status: "VERIFIED",
      priority: "LOW",
      verifiedDate: "28 Sep 2026",
    },
    {
      id: "KB-003",
      issue: "MPCB Status Not Updated",
      resolution: "Verified instructions. Check MPCB portal for real-time status updates. If status shows pending beyond SLA, escalate to MPCB officer through the escalation channel.",
      department: "MPCB",
      status: "VERIFIED",
      priority: "HIGH",
      verifiedDate: "25 Sep 2026",
    },
    {
      id: "KB-004",
      issue: "Unknown Approval Issue",
      resolution: "No verified solution available. This issue requires further investigation by the department officer.",
      department: "Pending Assignment",
      status: "UNRESOLVED",
      priority: "HIGH",
      verifiedDate: null,
    },
    {
      id: "KB-005",
      issue: "Fire NOC Portal Timeout",
      resolution: "Verified instructions. Portal timeout occurs during peak hours. Try submitting during off-peak hours (6 AM - 10 AM or 8 PM - 10 PM). Ensure stable internet connection.",
      department: "Fire Department",
      status: "VERIFIED",
      priority: "MEDIUM",
      verifiedDate: "20 Sep 2026",
    },
    {
      id: "KB-006",
      issue: "Shop & Establishment Registration Error",
      resolution: "Verified instructions. Error occurs when PAN verification fails. Ensure PAN details match exactly with government records. Use uppercase for PAN input.",
      department: "Labour Department",
      status: "VERIFIED",
      priority: "LOW",
      verifiedDate: "15 Sep 2026",
    },
  ];

  const getStatusBadge = (status) => {
    if (status === "VERIFIED") {
      return (
        <span style={{
          padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
          backgroundColor: "#12880715", color: "#128807", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <CheckCircle2 size={12} />
          VERIFIED
        </span>
      );
    }
    return (
      <span style={{
        padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
        backgroundColor: "#B4342A15", color: "#B4342A", display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        <AlertTriangle size={12} />
        UNRESOLVED
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      LOW: { bg: "#12880715", color: "#128807" },
      MEDIUM: { bg: "#0F8B8D15", color: "#0F8B8D" },
      HIGH: { bg: "#CC6D1D15", color: "#CC6D1D" },
    };
    const style = colors[priority] || colors.MEDIUM;
    return (
      <span style={{
        padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
        backgroundColor: style.bg, color: style.color,
      }}>
        {priority}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
            PRAGATI RESOLVE — Knowledge Base
          </h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>
            Verified issue-to-resolution mappings. These solutions are automatically provided to users.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/resolve")}
          style={{
            background: "#0F8B8D", color: "#fff", border: "none", padding: "10px 20px",
            borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <FileText size={16} />
          Back to Dashboard
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={20} color="#647082" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search knowledge base by issue, resolution, or department..."
            style={{
              width: "100%", padding: "12px 14px 12px 44", borderRadius: 8,
              border: "1px solid #DADFDA", fontSize: 14, fontFamily: "inherit",
            }}
          />
        </div>
        <button
          style={{
            padding: "12px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
            background: "#0B2036", color: "#fff", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <Plus size={16} />
          Add New Entry
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        {[
          { label: "Total Entries", value: "6", color: "#0F8B8D" },
          { label: "Verified Solutions", value: "5", color: "#128807" },
          { label: "Unresolved Issues", value: "1", color: "#B4342A" },
          { label: "Departments Covered", value: "4", color: "#0F8B8D" },
        ].map((stat, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 12, padding: 20,
            border: "1px solid #DADFDA", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: "#1C2A36", fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Knowledge Base Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {knowledgeBase.map((entry, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 12, border: entry.status === "VERIFIED" ? "1px solid #12880740" : "1px solid #B4342A40",
            padding: 24, display: "flex", gap: 20, alignItems: "flex-start",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: entry.status === "VERIFIED" ? "#12880715" : "#B4342A15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {entry.status === "VERIFIED" ? <CheckCircle2 size={24} color="#128807" /> : <AlertTriangle size={24} color="#B4342A" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0B2036", marginBottom: 6 }}>
                    {entry.issue}
                  </div>
                  <div style={{ fontSize: 12, color: "#1C2A36", fontFamily: "monospace", marginBottom: 8 }}>
                    {entry.id}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {getStatusBadge(entry.status)}
                    {getPriorityBadge(entry.priority)}
                  </div>
                </div>
                {entry.verifiedDate && (
                  <div style={{ fontSize: 13, color: "#1C2A36", textAlign: "right" }}>
                    <div style={{ fontWeight: 600 }}>Verified</div>
                    <div>{entry.verifiedDate}</div>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "#1C2A36", fontWeight: 600, marginBottom: 4 }}>Resolution</div>
                <div style={{ fontSize: 14, color: "#1C2A36", lineHeight: 1.6 }}>
                  {entry.resolution}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #DADFDA" }}>
                <div style={{ fontSize: 13, color: "#1C2A36" }}>
                  <strong>Department:</strong> {entry.department}
                </div>
                <button
                  onClick={() => navigate(`/admin/resolve/issue/${entry.id.replace("KB", "ISS")}`)}
                  style={{
                    padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                    background: "#0B2036", color: "#fff", border: "none", cursor: "pointer",
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
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
            How This Works
          </div>
          <div style={{ fontSize: 14, color: "#1C2A36", lineHeight: 1.6 }}>
            <strong>1.</strong> User reports an issue → <strong>2.</strong> System searches knowledge base → <strong>3.</strong> If match found, user gets automatic answer → <strong>4.</strong> If no match, officer investigates → <strong>5.</strong> Resolution is verified and added to knowledge base → <strong>6.</strong> Future users get automatic answers.
          </div>
        </div>
      </div>
    </div>
  );
}
