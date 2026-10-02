import React, { useEffect, useState } from "react";
import { Search, Filter, Eye, FileText } from "lucide-react";
import { adminApi } from "../api/adminApi.js";
import { LoadingBlock, ErrorBlock, Modal, formatDate } from "./AdminUI.jsx";

export default function AdminApplications() {
  const [items, setItems] = useState([]);
  const [statuses, setStatuses] = useState(["All"]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = (query = q, st = status) => {
    setLoading(true);
    setError("");
    adminApi.listApplications({ q: query, status: st })
      .then((data) => {
        setItems(data.items);
        setStatuses(data.statuses || ["All"]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openDetails = async (id) => {
    try {
      const app = await adminApi.getApplication(id);
      setSelected(app);
    } catch (e) {
      setError(e.message);
    }
  };

  const changeStatus = async (newStatus) => {
    if (!selected) return;
    setBusy(true);
    try {
      const updated = await adminApi.updateApplicationStatus(selected.id, newStatus);
      setSelected(updated);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Application Management</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Monitor, filter, and review all clearance applications across the state.</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <form
            onSubmit={(e) => { e.preventDefault(); load(q, status); }}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #DADFDA", borderRadius: 8, padding: "8px 16px" }}
          >
            <Search size={16} color="#1C2A36" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Search Application ID, business…"
              style={{ border: "none", outline: "none", fontSize: 14, minWidth: 200 }}
            />
          </form>
          <button
            onClick={() => setShowFilter((v) => !v)}
            style={{
              background: "#fff", color: "#0B2036", border: "1px solid #DADFDA", padding: "8px 16px",
              borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {showFilter && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); load(q, s); }}
              style={{
                padding: "8px 14px", borderRadius: 20, border: "1px solid #DADFDA", cursor: "pointer",
                background: status === s ? "#0B2036" : "#fff", color: status === s ? "#fff" : "#0B2036",
                fontWeight: 600, fontSize: 13,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <ErrorBlock message={error} onRetry={() => load()} />}
      {loading ? <LoadingBlock /> : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#F5F6F3" }}>
                {["App ID", "Business & Type", "Department(s)", "Submitted", "Status", "SLA Timer", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA", textAlign: h === "Actions" ? "right" : "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((app, i) => (
                <tr key={app.id} style={{ borderBottom: i < items.length - 1 ? "1px solid #DADFDA" : "none" }}>
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
                  <td style={{ padding: "20px 24px", fontSize: 14, color: "#1C2A36" }}>{formatDate(app.submissionDate)}</td>
                  <td style={{ padding: "20px 24px" }}>
                    <span style={{
                      padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      backgroundColor: app.status === "Approved" ? "#12880715" : app.status === "Escalated" || app.status === "Rejected" ? "#B4342A15" : app.status === "Halted" ? "#DADFDA" : "#CC6D1D15",
                      color: app.status === "Approved" ? "#128807" : app.status === "Escalated" || app.status === "Rejected" ? "#B4342A" : app.status === "Halted" ? "#1C2A36" : "#CC6D1D",
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 500, color: String(app.sla).includes("Breach") ? "#B4342A" : "#1C2A36" }}>
                    {app.sla}
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <button onClick={() => openDetails(app.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#0F8B8D" }} title="View Details">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#1C2A36" }}>No applications match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <Modal title={`${selected.id} — ${selected.business}`} onClose={() => setSelected(null)} width={640}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 14, color: "#1C2A36" }}>
            <div><strong>Type:</strong> {selected.type}</div>
            <div><strong>Sector:</strong> {selected.sector}</div>
            <div><strong>District:</strong> {selected.district}</div>
            <div><strong>Department:</strong> {selected.dept}</div>
            <div><strong>Stage:</strong> {selected.stage}</div>
            <div><strong>Officer:</strong> {selected.officer}</div>
            <div><strong>Status:</strong> {selected.status}</div>
            <div><strong>SLA:</strong> {selected.sla}</div>
            <div><strong>Employees:</strong> {selected.employeeCount}</div>
            <div><strong>Investment:</strong> ₹{(selected.investment || 0).toLocaleString("en-IN")}</div>
          </div>
          <p style={{ marginTop: 20, fontSize: 14, color: "#1C2A36", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{selected.notes}</p>
          <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["In Progress", "Halted", "Approved", "Escalated", "Rejected"].map((s) => (
              <button
                key={s}
                disabled={busy || selected.status === s}
                onClick={() => changeStatus(s)}
                style={{
                  padding: "8px 12px", borderRadius: 8, border: "1px solid #DADFDA", cursor: busy ? "wait" : "pointer",
                  background: selected.status === s ? "#0B2036" : "#F5F6F3", color: selected.status === s ? "#fff" : "#0B2036",
                  fontWeight: 600, fontSize: 12, opacity: busy ? 0.6 : 1,
                }}
              >
                Mark {s}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
