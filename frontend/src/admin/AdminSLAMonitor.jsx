import React, { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { adminApi } from "../api/adminApi.js";
import { LoadingBlock, ErrorBlock } from "./AdminUI.jsx";

export default function AdminSLAMonitor() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");
    adminApi.getSla()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const sendReminders = async () => {
    setBusy(true);
    try {
      const result = await adminApi.sendReminders();
      setToast(result.message);
      load();
      setTimeout(() => setToast(""), 4000);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading SLA monitor…" />;
  if (error) return <ErrorBlock message={error} onRetry={load} />;

  const { stats, atRiskApplications } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>SLA & Service Guarantee Monitor</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Live tracking of Right to Service Act statutory deadlines.</p>
        </div>
        {toast && (
          <div style={{ background: "#12880715", color: "#128807", padding: "10px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
            {toast}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #DADFDA" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#1C2A36" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: stat.color }} />
                {stat.label}
              </div>
              <div style={{ fontSize: 13, color: stat.color, fontWeight: 600, backgroundColor: `${stat.color}15`, padding: "4px 8px", borderRadius: 12 }}>
                {stat.percentage}
              </div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif" }}>
              {stat.count.toLocaleString("en-IN")}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #DADFDA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AlertTriangle size={20} color="#CC6D1D" />
            <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>At Risk Applications</h3>
          </div>
          <button
            disabled={busy}
            onClick={sendReminders}
            style={{ color: "#CC6D1D", background: "none", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: busy ? 0.6 : 1 }}
          >
            {busy ? "Sending…" : "Send Reminders"}
          </button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {atRiskApplications.map((app) => (
            <div key={app.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2036", marginBottom: 4 }}>
                    <span style={{ fontFamily: "monospace", color: "#1C2A36", marginRight: 8 }}>{app.id}</span>
                    {app.business}
                  </div>
                  <div style={{ fontSize: 13, color: "#1C2A36" }}>Stage: <strong>{app.stage}</strong> • Assigned: {app.officer}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#B4342A", fontWeight: 600, fontSize: 14 }}>
                  <Clock size={16} /> Deadline in {app.deadline}
                </div>
              </div>
              <div style={{ height: 6, backgroundColor: "#F5F6F3", borderRadius: 3, overflow: "hidden", display: "flex" }}>
                <div style={{ width: `${app.progress}%`, backgroundColor: "#CC6D1D" }} />
              </div>
            </div>
          ))}
          {atRiskApplications.length === 0 && (
            <div style={{ color: "#1C2A36", fontSize: 14 }}>No at-risk applications right now.</div>
          )}
        </div>
      </div>
    </div>
  );
}
