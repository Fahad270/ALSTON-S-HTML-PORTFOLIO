import React, { useEffect, useState } from "react";
import { ShieldAlert, FileCheck, CheckCircle } from "lucide-react";
import { adminApi } from "../api/adminApi.js";
import { LoadingBlock, ErrorBlock, Modal, formatDate } from "./AdminUI.jsx";

export default function AdminEscalations() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("Open");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [evidence, setEvidence] = useState(null);
  const [busyId, setBusyId] = useState("");

  const load = (status = filter) => {
    setLoading(true);
    setError("");
    adminApi.listEscalations(status)
      .then((data) => setItems(data.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const viewEvidence = async (id) => {
    try {
      const data = await adminApi.getEvidence(id);
      setEvidence(data);
    } catch (e) {
      alert(e.message);
    }
  };

  const grantDeemed = async (id) => {
    if (!confirm("Grant deemed approval under the Right to Service Act for this escalation?")) return;
    setBusyId(id);
    try {
      await adminApi.grantDeemedApproval(id);
      load(filter);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId("");
    }
  };

  const critical = items.filter((e) => e.risk === "High" && e.status === "Open");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Escalations & Deemed Approvals</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Review SLA breaches escalated to Nodal Officers and process deemed approvals.</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {["Open", "DeemedApproved", "All"].map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); load(s); }}
              style={{
                padding: "8px 14px", borderRadius: 20, border: "1px solid #DADFDA", cursor: "pointer",
                background: filter === s ? "#0B2036" : "#fff", color: filter === s ? "#fff" : "#0B2036",
                fontWeight: 600, fontSize: 13,
              }}
            >
              {s === "DeemedApproved" ? "Deemed" : s}
            </button>
          ))}
          <button
            onClick={() => {
              if (critical[0]) grantDeemed(critical[0].id);
              else alert("No open critical escalations.");
            }}
            style={{
              background: "#B4342A", color: "#fff", border: "none", padding: "10px 20px",
              borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <ShieldAlert size={16} /> Process Critical Cases
          </button>
        </div>
      </div>

      {error && <ErrorBlock message={error} onRetry={() => load()} />}
      {loading ? <LoadingBlock /> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          {items.map((esc) => (
            <div key={esc.id} style={{
              background: "#fff", borderRadius: 12, border: "1px solid #DADFDA",
              borderLeft: `4px solid ${esc.status === "DeemedApproved" ? "#128807" : esc.risk === "High" ? "#B4342A" : "#CC6D1D"}`,
              padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap",
            }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ padding: "4px 8px", background: "#F5F6F3", borderRadius: 4, fontSize: 12, fontWeight: 600, color: "#0B2036" }}>{esc.id}</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#0B2036" }}>{esc.business}</span>
                  {esc.status === "DeemedApproved" ? (
                    <span style={{ color: "#128807", fontSize: 13, fontWeight: 600, background: "#12880715", padding: "2px 8px", borderRadius: 12 }}>Deemed Approved</span>
                  ) : (
                    <span style={{ color: "#B4342A", fontSize: 13, fontWeight: 600, background: "#B4342A15", padding: "2px 8px", borderRadius: 12 }}>Breached {esc.breachTime}</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 24, color: "#1C2A36", fontSize: 14, flexWrap: "wrap" }}>
                  <div><strong>App ID:</strong> {esc.appId}</div>
                  <div><strong>Department:</strong> {esc.dept}</div>
                  <div><strong>Current Owner:</strong> {esc.officer}</div>
                  <div><strong>Bottleneck:</strong> {esc.reason}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 200 }}>
                <button
                  onClick={() => viewEvidence(esc.id)}
                  style={{
                    background: "#F5F6F3", color: "#0B2036", border: "1px solid #DADFDA", padding: "8px 16px",
                    borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  <FileCheck size={16} /> View Evidence Package
                </button>
                {esc.status === "Open" && (
                  <button
                    disabled={busyId === esc.id}
                    onClick={() => grantDeemed(esc.id)}
                    style={{
                      background: "#0B2036", color: "#fff", border: "none", padding: "8px 16px",
                      borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      opacity: busyId === esc.id ? 0.6 : 1,
                    }}
                  >
                    <CheckCircle size={16} /> {busyId === esc.id ? "Processing…" : "Grant Deemed Approval"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", color: "#1C2A36", background: "#fff", borderRadius: 12, border: "1px solid #DADFDA" }}>
              No escalations in this view.
            </div>
          )}
        </div>
      )}

      {evidence && (
        <Modal title={`Evidence — ${evidence.id}`} onClose={() => setEvidence(null)} width={680}>
          <p style={{ marginTop: 0, color: "#1C2A36" }}>
            <strong>{evidence.business}</strong> ({evidence.appId}) — {evidence.reason}
          </p>
          <h4 style={{ color: "#0B2036", marginBottom: 8 }}>Timeline</h4>
          <ul style={{ paddingLeft: 18, color: "#1C2A36", lineHeight: 1.8, marginTop: 0 }}>
            {(evidence.evidence?.timeline || []).map((t, i) => (
              <li key={i}><strong>{formatDate(t.at)}</strong> — {t.event}</li>
            ))}
          </ul>
          <h4 style={{ color: "#0B2036", marginBottom: 8 }}>Documents</h4>
          <ul style={{ paddingLeft: 18, color: "#1C2A36", lineHeight: 1.8, marginTop: 0 }}>
            {(evidence.evidence?.documents || []).map((d) => <li key={d}>{d}</li>)}
          </ul>
          <h4 style={{ color: "#0B2036", marginBottom: 8 }}>Dependency context</h4>
          <p style={{ color: "#1C2A36", marginTop: 0 }}>{evidence.evidence?.dependencyContext}</p>
        </Modal>
      )}
    </div>
  );
}
