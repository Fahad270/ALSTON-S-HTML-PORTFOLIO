import { getDb, mutateDb } from "../data/staticStore.js";

function ok(res, data) {
  return res.json({ success: true, data });
}

function slaLabelFor(app) {
  if (app.status === "Approved" || app.status === "Rejected") return app.status === "Approved" ? "Cleared" : "Closed";
  if (app.status === "Halted") return "Awaiting Doc";
  if (typeof app.slaDaysLeft === "number") {
    if (app.slaDaysLeft < 0) return `${app.slaDaysLeft} days (Breach)`;
    if (app.slaDaysLeft === 0 && app.slaLabel) return app.slaLabel;
    return `${app.slaDaysLeft} days left`;
  }
  return app.slaLabel || "—";
}

function recomputeKpis(db) {
  const openEsc = db.escalations.filter((e) => e.status === "Open").length;
  const deemed = db.escalations.filter((e) => e.status === "DeemedApproved").length;
  db.kpis.activeEscalations = openEsc;
  db.kpis.deemedApprovals = (db.kpis.deemedApprovalsBase ?? 14) + deemed;
  db.kpis.totalApplications = db.applications.length > 100 ? db.kpis.totalApplications : 2405;
}

export function getDashboard(req, res) {
  const db = getDb();
  const recentApps = [...db.applications]
    .sort((a, b) => String(b.submissionDate).localeCompare(String(a.submissionDate)))
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      business: a.business,
      dept: a.dept,
      status: a.status,
      sla: slaLabelFor(a),
    }));

  const kpis = [
    {
      title: "Total Applications",
      value: db.kpis.totalApplications.toLocaleString("en-IN"),
      trend: db.kpis.totalApplicationsTrend,
      trendUp: !String(db.kpis.totalApplicationsTrend).startsWith("-"),
      color: "#0F8B8D",
      icon: "Activity",
    },
    {
      title: "SLA Adherence Rate",
      value: `${db.kpis.slaAdherenceRate}%`,
      trend: db.kpis.slaAdherenceTrend,
      trendUp: !String(db.kpis.slaAdherenceTrend).startsWith("-"),
      color: "#128807",
      icon: "Clock",
    },
    {
      title: "Active Escalations",
      value: String(db.escalations.filter((e) => e.status === "Open").length),
      trend: db.kpis.activeEscalationsTrend,
      trendUp: false,
      color: "#B4342A",
      icon: "ShieldAlert",
    },
    {
      title: "Deemed Approvals",
      value: String(db.escalations.filter((e) => e.status === "DeemedApproved").length + 14),
      trend: db.kpis.deemedApprovalsTrend,
      trendUp: true,
      color: "#CC6D1D",
      icon: "CheckCircle2",
    },
  ];

  return ok(res, {
    kpis,
    recentApplications: recentApps,
    alerts: db.alerts,
    notificationCount: db.notifications.filter((n) => !n.read).length,
  });
}

export function listApplications(req, res) {
  const db = getDb();
  const q = String(req.query.q || "").trim().toLowerCase();
  const status = String(req.query.status || "").trim();

  let items = db.applications.map((a) => ({ ...a, sla: slaLabelFor(a) }));
  if (status && status !== "All") {
    items = items.filter((a) => a.status === status);
  }
  if (q) {
    items = items.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.business.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.dept.toLowerCase().includes(q) ||
        a.district?.toLowerCase().includes(q)
    );
  }
  items.sort((a, b) => String(b.submissionDate).localeCompare(String(a.submissionDate)));
  return ok(res, { items, statuses: ["All", "In Progress", "Halted", "Approved", "Escalated", "Rejected"] });
}

export function getApplication(req, res) {
  const db = getDb();
  const app = db.applications.find((a) => a.id === req.params.id);
  if (!app) return res.status(404).json({ success: false, message: "Application not found", code: "NOT_FOUND" });
  return ok(res, { ...app, sla: slaLabelFor(app) });
}

export function updateApplicationStatus(req, res) {
  const { status, notes } = req.body || {};
  const allowed = ["In Progress", "Halted", "Approved", "Escalated", "Rejected"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status", code: "BAD_REQUEST" });
  }

  const updated = mutateDb((db) => {
    const app = db.applications.find((a) => a.id === req.params.id);
    if (!app) return null;
    app.status = status;
    if (notes) app.notes = `${app.notes || ""}\n[Admin] ${notes}`.trim();
    if (status === "Approved" || status === "Rejected") {
      app.slaDaysLeft = 0;
      app.slaLabel = status === "Approved" ? "Cleared" : "Closed";
      app.stage = "Closed";
    }
    return { ...app, sla: slaLabelFor(app) };
  });

  if (!updated) return res.status(404).json({ success: false, message: "Application not found", code: "NOT_FOUND" });
  return ok(res, updated);
}

export function listDepartments(req, res) {
  const db = getDb();
  const q = String(req.query.q || "").trim().toLowerCase();
  let items = db.departments.map((d) => ({
    ...d,
    avgSla: `${d.avgSlaDays} Days`,
  }));
  if (q) {
    items = items.filter(
      (d) =>
        d.code.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.nodalOfficer.toLowerCase().includes(q)
    );
  }
  return ok(res, { items });
}

export function listRules(req, res) {
  const db = getDb();
  return ok(res, {
    items: db.rules,
    stats: db.ruleStats,
  });
}

export function createRule(req, res) {
  const { name, sector, state, departmentCode, conditions, slaDays } = req.body || {};
  if (!name || !conditions) {
    return res.status(400).json({ success: false, message: "name and conditions are required", code: "BAD_REQUEST" });
  }

  const rule = mutateDb((db) => {
    const n = db.rules.length + 1;
    const id = `RULE-NEW-${String(n).padStart(2, "0")}`;
    const days = Number(slaDays) || 0;
    const created = {
      id,
      name,
      sector: sector || "Any",
      state: state || "Maharashtra",
      departmentCode: departmentCode || "IND_LABOUR",
      conditions,
      slaDays: days,
      sla: days === 0 ? "Instant" : `${days} Days`,
      status: "Active",
      version: 1,
      lastModified: new Date().toISOString().slice(0, 10),
    };
    db.rules.unshift(created);
    db.ruleStats.activeRules += 1;
    return created;
  });

  return res.status(201).json({ success: true, data: rule });
}

export function runSimulation(req, res) {
  const db = getDb();
  const { sector, employeeCount, hazardousMaterial, environmentalCategory, buildingHeight } = req.body || {};

  const matched = db.rules.filter((rule) => {
    const cond = rule.conditions.toLowerCase();
    if (rule.sector !== "Any" && sector && rule.sector !== sector) return false;
    if (cond.includes("employees") && Number(employeeCount || 0) < 5 && cond.includes(">= 5")) return false;
    if (cond.includes("hazardous") && !hazardousMaterial) return false;
    if (cond.includes("orange") && environmentalCategory && environmentalCategory !== "Orange") return false;
    if (cond.includes("height") && Number(buildingHeight || 0) <= 15 && !hazardousMaterial) return false;
    return true;
  });

  return ok(res, {
    profile: { sector, employeeCount, hazardousMaterial, environmentalCategory, buildingHeight },
    matchedApprovals: matched.map((r) => ({
      id: r.id,
      name: r.name,
      departmentCode: r.departmentCode,
      sla: r.sla,
      reason: r.conditions,
    })),
    summary: `${matched.length} approval(s) would be triggered for this profile.`,
  });
}

export function getSlaMonitor(req, res) {
  const db = getDb();
  const atRisk = db.applications
    .filter((a) => a.slaRisk === "at_risk" && a.status === "In Progress")
    .map((a) => ({
      id: a.id,
      business: a.business,
      stage: a.stage,
      officer: a.officer,
      deadline: a.slaLabel?.replace(" left", "") || "soon",
      progress: a.progress || 50,
    }));

  return ok(res, {
    stats: db.slaStats,
    atRiskApplications: atRisk,
    remindersSent: db.remindersSent?.length || 0,
  });
}

export function sendSlaReminders(req, res) {
  const result = mutateDb((db) => {
    const targets = db.applications.filter((a) => a.slaRisk === "at_risk" && a.status === "In Progress");
    const batch = {
      id: `REM-${Date.now()}`,
      sentAt: new Date().toISOString(),
      count: targets.length,
      applicationIds: targets.map((t) => t.id),
    };
    db.remindersSent = db.remindersSent || [];
    db.remindersSent.unshift(batch);
    targets.forEach((t) => {
      db.notifications.unshift({
        id: `n-${Date.now()}-${t.id}`,
        title: `SLA reminder — ${t.id}`,
        body: `${t.business}: deadline ${t.slaLabel}. Officer ${t.officer} notified.`,
        read: false,
      });
    });
    return batch;
  });

  return ok(res, {
    message: `Reminders sent to ${result.count} officer(s)`,
    batch: result,
  });
}

export function listEscalations(req, res) {
  const db = getDb();
  const status = String(req.query.status || "Open");
  let items = db.escalations;
  if (status !== "All") items = items.filter((e) => e.status === status);
  return ok(res, { items });
}

export function getEscalationEvidence(req, res) {
  const db = getDb();
  const esc = db.escalations.find((e) => e.id === req.params.id);
  if (!esc) return res.status(404).json({ success: false, message: "Escalation not found", code: "NOT_FOUND" });
  return ok(res, {
    id: esc.id,
    appId: esc.appId,
    business: esc.business,
    reason: esc.reason,
    evidence: esc.evidence,
  });
}

export function grantDeemedApproval(req, res) {
  const updated = mutateDb((db) => {
    const esc = db.escalations.find((e) => e.id === req.params.id);
    if (!esc) return null;
    if (esc.status === "DeemedApproved") return esc;

    esc.status = "DeemedApproved";
    esc.deemedApprovedAt = new Date().toISOString();
    esc.deemedApprovedBy = "Amit Joshi (Chief Nodal Officer)";

    const app = db.applications.find((a) => a.id === esc.appId);
    if (app) {
      app.status = "Approved";
      app.stage = "Deemed Approved (RTS)";
      app.slaDaysLeft = 0;
      app.slaLabel = "Cleared";
      app.notes = `${app.notes || ""}\n[Deemed Approval] Granted via ${esc.id} under Right to Service Act.`.trim();
    }

    db.notifications.unshift({
      id: `n-deemed-${Date.now()}`,
      title: `Deemed approval — ${esc.appId}`,
      body: `${esc.business} cleared via ${esc.id}.`,
      read: false,
    });

    recomputeKpis(db);
    return esc;
  });

  if (!updated) return res.status(404).json({ success: false, message: "Escalation not found", code: "NOT_FOUND" });
  return ok(res, updated);
}

export function listUsers(req, res) {
  const db = getDb();
  const q = String(req.query.q || "").trim().toLowerCase();
  let items = db.users;
  if (q) {
    items = items.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.dept.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }
  return ok(res, { items, roles: ["Super Admin", "Chief Nodal Officer", "Nodal Officer", "Department Officer"] });
}

export function createUser(req, res) {
  const { name, email, role, dept } = req.body || {};
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: "name, email and role are required", code: "BAD_REQUEST" });
  }

  const user = mutateDb((db) => {
    const created = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      dept: dept || "All Departments",
      status: "Active",
      lastLogin: "Never",
    };
    db.users.unshift(created);
    return created;
  });

  return res.status(201).json({ success: true, data: user });
}

export function updateUser(req, res) {
  const { role, status, dept } = req.body || {};
  const updated = mutateDb((db) => {
    const user = db.users.find((u) => u.id === req.params.id);
    if (!user) return null;
    if (role) user.role = role;
    if (status) user.status = status;
    if (dept) user.dept = dept;
    return user;
  });

  if (!updated) return res.status(404).json({ success: false, message: "User not found", code: "NOT_FOUND" });
  return ok(res, updated);
}

export function listNotifications(req, res) {
  const db = getDb();
  return ok(res, { items: db.notifications.slice(0, 20) });
}
