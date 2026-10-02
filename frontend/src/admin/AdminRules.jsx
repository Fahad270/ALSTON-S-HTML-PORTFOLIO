import React, { useEffect, useState } from "react";
import { Plus, Settings, Play, Database } from "lucide-react";
import { adminApi } from "../api/adminApi.js";
import { LoadingBlock, ErrorBlock, Modal } from "./AdminUI.jsx";

const emptyRule = {
  name: "",
  sector: "Manufacturing",
  state: "Maharashtra",
  departmentCode: "FIRE_SAFETY",
  conditions: "",
  slaDays: 15,
};

export default function AdminRules() {
  const [rules, setRules] = useState([]);
  const [stats, setStats] = useState({ activeRules: 0, proposedChanges: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyRule);
  const [simOpen, setSimOpen] = useState(false);
  const [simForm, setSimForm] = useState({
    sector: "Manufacturing",
    employeeCount: 25,
    hazardousMaterial: true,
    environmentalCategory: "Orange",
    buildingHeight: 18,
  });
  const [simResult, setSimResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");
    adminApi.listRules()
      .then((data) => {
        setRules(data.items);
        setStats(data.stats);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submitRule = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminApi.createRule(form);
      setShowAdd(false);
      setForm(emptyRule);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const runSim = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await adminApi.runSimulation(simForm);
      setSimResult(result);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Regulatory Rules Engine</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Manage approval graph configurations, KYA triggers, and dependency rules.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => { setSimOpen(true); setSimResult(null); }}
            style={{
              background: "#fff", color: "#0B2036", border: "1px solid #DADFDA", padding: "10px 20px",
              borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <Play size={16} /> Run Simulation
          </button>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: "#0B2036", color: "#fff", border: "none", padding: "10px 20px",
              borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <Plus size={16} /> Add New Rule
          </button>
        </div>
      </div>

      {error && <ErrorBlock message={error} onRetry={load} />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #DADFDA", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#0F8B8D15", color: "#0F8B8D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Database size={24} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif" }}>
              {stats.activeRules?.toLocaleString("en-IN")}
            </div>
            <div style={{ fontSize: 13, color: "#1C2A36", fontWeight: 500 }}>Active Rules in Database</div>
          </div>
        </div>
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #DADFDA", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#CC6D1D15", color: "#CC6D1D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Settings size={24} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif" }}>{stats.proposedChanges}</div>
            <div style={{ fontSize: 13, color: "#1C2A36", fontWeight: 500 }}>Proposed Changes Pending</div>
          </div>
        </div>
      </div>

      {loading ? <LoadingBlock /> : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #DADFDA", background: "#F5F6F3" }}>
            <h3 style={{ margin: 0, fontSize: 16, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Recently Modified Rules</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr>
                {["Rule ID", "Approval Name", "Trigger Conditions", "Statutory SLA"].map((h) => (
                  <th key={h} style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, i) => (
                <tr key={rule.id} style={{ borderBottom: i < rules.length - 1 ? "1px solid #DADFDA" : "none" }}>
                  <td style={{ padding: "20px 24px", fontSize: 13, fontWeight: 600, color: "#0B2036", fontFamily: "monospace" }}>{rule.id}</td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2036" }}>{rule.name}</div>
                    <div style={{ fontSize: 12, color: "#1C2A36", marginTop: 4 }}>{rule.sector} • {rule.state}</div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <span style={{ fontSize: 13, color: "#1C2A36", backgroundColor: "#F9FAF9", borderRadius: 4, padding: "6px 10px", border: "1px solid #DADFDA", display: "inline-block" }}>
                      {rule.conditions}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 600, color: "#128807" }}>{rule.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <Modal title="Add New Rule" onClose={() => setShowAdd(false)}>
          <form onSubmit={submitRule} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["name", "Approval Name"],
              ["conditions", "Trigger Conditions"],
            ].map(([key, label]) => (
              <label key={key} style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
                {label}
                <input
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }}
                />
              </label>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
                Sector
                <input value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
                SLA Days
                <input type="number" min="0" value={form.slaDays} onChange={(e) => setForm({ ...form, slaDays: Number(e.target.value) })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }} />
              </label>
            </div>
            <button disabled={busy} type="submit" style={{ marginTop: 8, background: "#0B2036", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              {busy ? "Saving…" : "Create Rule"}
            </button>
          </form>
        </Modal>
      )}

      {simOpen && (
        <Modal title="KYA / Rules Simulation" onClose={() => setSimOpen(false)} width={640}>
          <form onSubmit={runSim} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
              Sector
              <input value={simForm.sector} onChange={(e) => setSimForm({ ...simForm, sector: e.target.value })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
              Employees
              <input type="number" value={simForm.employeeCount} onChange={(e) => setSimForm({ ...simForm, employeeCount: Number(e.target.value) })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
              Env Category
              <select value={simForm.environmentalCategory} onChange={(e) => setSimForm({ ...simForm, environmentalCategory: e.target.value })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }}>
                {["White", "Green", "Orange", "Red"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
              Building Height (m)
              <input type="number" value={simForm.buildingHeight} onChange={(e) => setSimForm({ ...simForm, buildingHeight: Number(e.target.value) })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }} />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#1C2A36", gridColumn: "1 / -1" }}>
              <input type="checkbox" checked={simForm.hazardousMaterial} onChange={(e) => setSimForm({ ...simForm, hazardousMaterial: e.target.checked })} />
              Hazardous materials present
            </label>
            <button disabled={busy} type="submit" style={{ gridColumn: "1 / -1", background: "#0F8B8D", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              {busy ? "Running…" : "Run Simulation"}
            </button>
          </form>
          {simResult && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontWeight: 600, color: "#0B2036" }}>{simResult.summary}</p>
              <ul style={{ paddingLeft: 18, color: "#1C2A36", lineHeight: 1.7 }}>
                {simResult.matchedApprovals.map((a) => (
                  <li key={a.id}><strong>{a.name}</strong> ({a.id}) — {a.sla} · {a.reason}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
