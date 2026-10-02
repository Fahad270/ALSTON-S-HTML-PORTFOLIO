import React, { useEffect, useState } from "react";
import { Shield, UserPlus, Search } from "lucide-react";
import { adminApi } from "../api/adminApi.js";
import { LoadingBlock, ErrorBlock, Modal } from "./AdminUI.jsx";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Department Officer", dept: "" });
  const [busy, setBusy] = useState(false);

  const load = (query = q) => {
    setLoading(true);
    setError("");
    adminApi.listUsers(query)
      .then((data) => {
        setUsers(data.items);
        setRoles(data.roles || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submitAdd = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminApi.createUser(form);
      setShowAdd(false);
      setForm({ name: "", email: "", role: "Department Officer", dept: "" });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminApi.updateUser(editUser.id, {
        role: editUser.role,
        status: editUser.status,
        dept: editUser.dept,
      });
      setEditUser(null);
      load();
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
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Role-Based Access Control</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Manage platform users, officers, and administrative privileges.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: "#0F8B8D", color: "#fff", border: "none", padding: "10px 20px",
            borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      {error && <ErrorBlock message={error} onRetry={() => load()} />}

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #DADFDA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <form
            onSubmit={(e) => { e.preventDefault(); load(q); }}
            style={{
              display: "flex", alignItems: "center", gap: 8, background: "#F5F6F3",
              border: "1px solid #DADFDA", borderRadius: 8, padding: "8px 16px", width: 320,
            }}
          >
            <Search size={16} color="#1C2A36" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Search users by name or role…"
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, width: "100%" }}
            />
          </form>
        </div>

        {loading ? <LoadingBlock /> : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#F5F6F3" }}>
                {["User Name", "Role", "Department Scope", "Status", "Last Login", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA", textAlign: h === "Actions" ? "right" : "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? "1px solid #DADFDA" : "none" }}>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0B2036", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold" }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2036" }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: "#1C2A36" }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
                      <Shield size={16} color={user.role.includes("Admin") || user.role.includes("Chief") ? "#0F8B8D" : "#CC6D1D"} />
                      {user.role}
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px", fontSize: 14, color: "#1C2A36" }}>{user.dept}</td>
                  <td style={{ padding: "20px 24px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      backgroundColor: user.status === "Active" ? "#12880715" : "#1C2A3615",
                      color: user.status === "Active" ? "#128807" : "#1C2A36",
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px", fontSize: 13, color: "#1C2A36" }}>{user.lastLogin}</td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <button onClick={() => setEditUser({ ...user })} style={{ color: "#0F8B8D", background: "none", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                      Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <Modal title="Add New User" onClose={() => setShowAdd(false)}>
          <form onSubmit={submitAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["name", "Full Name"], ["email", "Email"], ["dept", "Department Scope"]].map(([key, label]) => (
              <label key={key} style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
                {label}
                <input required={key !== "dept"} type={key === "email" ? "email" : "text"} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }} />
              </label>
            ))}
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
              Role
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }}>
                {roles.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <button disabled={busy} type="submit" style={{ marginTop: 8, background: "#0F8B8D", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              {busy ? "Saving…" : "Create User"}
            </button>
          </form>
        </Modal>
      )}

      {editUser && (
        <Modal title={`Edit — ${editUser.name}`} onClose={() => setEditUser(null)}>
          <form onSubmit={submitEdit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
              Role
              <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }}>
                {roles.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
              Department
              <input value={editUser.dept} onChange={(e) => setEditUser({ ...editUser, dept: e.target.value })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
              Status
              <select value={editUser.status} onChange={(e) => setEditUser({ ...editUser, status: e.target.value })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #DADFDA", fontWeight: 400 }}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
            <button disabled={busy} type="submit" style={{ marginTop: 8, background: "#0B2036", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              {busy ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
