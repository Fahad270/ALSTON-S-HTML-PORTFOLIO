import React, { useEffect, useState } from "react";
import { Search, Filter, AlertCircle } from "lucide-react";
import { adminApi } from "../api/adminApi.js";
import { LoadingBlock, ErrorBlock, Modal } from "./AdminUI.jsx";

export default function AdminDepartments() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (query = q) => {
    setLoading(true);
    setError("");
    adminApi.listDepartments(query)
      .then((data) => setItems(data.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filterStatus === "All" ? items : items.filter((d) => d.status === filterStatus);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Integrated State Departments</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Government bodies integrated into the PragatiSetu single-window gateway.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <form
            onSubmit={(e) => { e.preventDefault(); load(q); }}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #DADFDA", borderRadius: 8, padding: "8px 16px" }}
          >
            <Search size={16} color="#1C2A36" />
            <input value={q} onChange={(e) => setQ(e.target.value)} type="text" placeholder="Search departments…" style={{ border: "none", outline: "none", fontSize: 14 }} />
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
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Healthy", "Warning", "Critical"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: "8px 14px", borderRadius: 20, border: "1px solid #DADFDA", cursor: "pointer",
                background: filterStatus === s ? "#0B2036" : "#fff", color: filterStatus === s ? "#fff" : "#0B2036",
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
                {["Dept Code", "Department Name", "Nodal Officer", "Active Approvals", "Average SLA", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA", textAlign: h === "Actions" ? "right" : "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept, i) => (
                <tr key={dept.id || dept.code} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #DADFDA" : "none" }}>
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
                    <button onClick={() => setSelected(dept)} style={{ color: "#0F8B8D", background: "none", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                      View services
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <p style={{ marginTop: 0, color: "#1C2A36" }}>
            <strong>Code:</strong> {selected.code} · <strong>Nodal:</strong> {selected.nodalOfficer} · <strong>Health:</strong> {selected.status}
          </p>
          <h4 style={{ margin: "16px 0 8px", color: "#0B2036" }}>Integrated services</h4>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#1C2A36", lineHeight: 1.8 }}>
            {(selected.services || []).map((s) => <li key={s}>{s}</li>)}
          </ul>
        </Modal>
      )}
    </div>
  );
}
