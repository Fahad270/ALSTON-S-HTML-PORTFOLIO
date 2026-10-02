// Prefer same-origin /api (Vite proxy) so CORS is never an issue in local demo.
const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message = body?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body?.data;
}

export const adminApi = {
  getDashboard: () => request("/admin/dashboard"),
  listApplications: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.status) qs.set("status", params.status);
    const q = qs.toString();
    return request(`/admin/applications${q ? `?${q}` : ""}`);
  },
  getApplication: (id) => request(`/admin/applications/${id}`),
  updateApplicationStatus: (id, status, notes) =>
    request(`/admin/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    }),
  listDepartments: (q) => request(`/admin/departments${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  listRules: () => request("/admin/rules"),
  createRule: (payload) =>
    request("/admin/rules", { method: "POST", body: JSON.stringify(payload) }),
  runSimulation: (payload) =>
    request("/admin/rules/simulate", { method: "POST", body: JSON.stringify(payload) }),
  getSla: () => request("/admin/sla"),
  sendReminders: () => request("/admin/sla/reminders", { method: "POST", body: "{}" }),
  listEscalations: (status = "Open") =>
    request(`/admin/escalations?status=${encodeURIComponent(status)}`),
  getEvidence: (id) => request(`/admin/escalations/${id}/evidence`),
  grantDeemedApproval: (id) =>
    request(`/admin/escalations/${id}/deemed-approval`, { method: "POST", body: "{}" }),
  listUsers: (q) => request(`/admin/users${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  createUser: (payload) =>
    request("/admin/users", { method: "POST", body: JSON.stringify(payload) }),
  updateUser: (id, payload) =>
    request(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  listNotifications: () => request("/admin/notifications"),
};
