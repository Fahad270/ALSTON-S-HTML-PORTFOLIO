import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Users, Clock, CheckCircle2, FileText, ShieldAlert, Send } from "lucide-react";

export default function AdminResolveIssueDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [resolutionText, setResolutionText] = useState("");

  // Mock data - in production this would come from API
  const issue = {
    id: "ISS-1042",
    issue: "NSWS application stuck after submission",
    category: "Application Status",
    detectedIssue: "Status not updated",
    priority: "HIGH",
    affectedUsers: 100,
    similarReports: 37,
    daysUnresolved: 3,
    userProblem: "My NSWS application was submitted successfully but the status has not changed. The application shows as 'Submitted' for over 48 hours with no progress.",
    hasVerifiedResolution: false,
  };

  const similarIssues = [
    { id: "ISS-1083", issue: "NSWS application status remains unchanged", reports: 37 },
    { id: "ISS-1095", issue: "Application not moving forward in NSWS", reports: 12 },
    { id: "ISS-1078", issue: "NSWS submission completed but no status update", reports: 8 },
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={() => navigate("/admin/resolve")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 8, background: "#fff",
            border: "1px solid #DADFDA", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#0B2036",
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 4px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
            Issue Detail
          </h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 14, fontFamily: "monospace" }}>
            {issue.id}
          </p>
        </div>
        {getPriorityBadge(issue.priority)}
      </div>

      {/* User Problem Section */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", padding: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036", display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={20} color="#0B2036" />
          User Problem
        </h3>
        <div style={{ padding: 16, borderRadius: 8, background: "#F5F6F3", fontSize: 15, color: "#1C2A36", lineHeight: 1.6 }}>
          {issue.userProblem}
        </div>
      </div>

      {/* Issue Classification */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", padding: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
          Issue Classification
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4, fontWeight: 600 }}>Application</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2036" }}>NSWS</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4, fontWeight: 600 }}>Category</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2036" }}>{issue.category}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4, fontWeight: 600 }}>Detected Issue</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2036" }}>{issue.detectedIssue}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4, fontWeight: 600 }}>Priority</div>
            {getPriorityBadge(issue.priority)}
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", padding: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036", display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={20} color="#CC6D1D" />
          Impact
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: "#CC6D1D15", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={24} color="#CC6D1D" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif" }}>
                {issue.affectedUsers}
              </div>
              <div style={{ fontSize: 13, color: "#1C2A36", fontWeight: 500 }}>Affected Users</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: "#0F8B8D15", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={24} color="#0F8B8D" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif" }}>
                {issue.similarReports}
              </div>
              <div style={{ fontSize: 13, color: "#1C2A36", fontWeight: 500 }}>Similar Reports</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: "#B4342A15", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={24} color="#B4342A" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif" }}>
                {issue.daysUnresolved} days
              </div>
              <div style={{ fontSize: 13, color: "#1C2A36", fontWeight: 500 }}>Unresolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Issues */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", padding: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
          Similar Issues
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {similarIssues.map((similar, i) => (
            <div key={i} style={{
              padding: 16, borderRadius: 8, border: "1px solid #DADFDA",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", transition: "all 0.2s ease",
            }} onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F6F3"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2036", marginBottom: 4 }}>{similar.issue}</div>
                <div style={{ fontSize: 12, color: "#1C2A36", fontFamily: "monospace" }}>{similar.id}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0F8B8D" }}>
                {similar.reports} reports
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Resolution (if exists) */}
      {issue.hasVerifiedResolution ? (
        <div style={{
          padding: 20, borderRadius: 12, border: "2px solid #128807",
          background: "#12880708", display: "flex", gap: 16, alignItems: "flex-start",
        }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#128807", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CheckCircle2 size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#128807", marginBottom: 8 }}>
              ✓ VERIFIED RESOLUTION
            </div>
            <div style={{ fontSize: 14, color: "#1C2A36", marginBottom: 12 }}>
              Verified instructions for resolving/checking the issue.
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#1C2A36" }}>
              <div><strong>Department:</strong> NSWS / Relevant Department</div>
              <div><strong>Verified:</strong> 01 Oct 2026</div>
            </div>
          </div>
        </div>
      ) : (
        /* Officer Actions - Create Resolution */
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", padding: 24 }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
            Officer Actions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#0B2036", marginBottom: 8 }}>
                Create Resolution
              </label>
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Enter the correct resolution for this issue. This will be added to the knowledge base for future automatic resolution."
                style={{
                  width: "100%", minHeight: 120, padding: 12, borderRadius: 8,
                  border: "1px solid #DADFDA", fontSize: 14, fontFamily: "inherit",
                  resize: "vertical", lineHeight: 1.5,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                style={{
                  padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  background: "#128807", color: "#fff", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <CheckCircle2 size={16} />
                Verify Resolution
              </button>
              <button
                style={{
                  padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  background: "#0F8B8D", color: "#fff", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <Send size={16} />
                Create Resolution
              </button>
              <button
                style={{
                  padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  background: "#fff", color: "#0B2036", border: "1px solid #DADFDA", cursor: "pointer",
                }}
              >
                Mark Resolved
              </button>
              <button
                style={{
                  padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  background: "#B4342A", color: "#fff", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <ShieldAlert size={16} />
                Escalate to Critical
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
