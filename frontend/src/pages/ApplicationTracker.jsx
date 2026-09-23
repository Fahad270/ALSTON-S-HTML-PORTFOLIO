import React, { useEffect, useMemo, useState } from "react";
import {
  Flame, Shield, Zap, CheckCircle2, XCircle, QrCode, Link2, ShieldAlert, ListChecks,
} from "lucide-react";

/*
  SETU — Application Tracker & Verifiable Audit Trail
  SIH 2026 · PS 26130

  Two demo scenarios (toggle at top): every department approves, or one
  department (Police) rejects and the flow halts. Each event is hashed
  and chained to the previous event's hash client-side (SHA-256 via the
  browser's native crypto.subtle — no external chain, no library).
  That chain is what the QR code lets a citizen verify.
*/

const DEPT_META = {
  Fire: { icon: Flame, color: "#CC6D1D" },
  Police: { icon: Shield, color: "#06038D" },
  Electricity: { icon: Zap, color: "#128807" },
};

const SCENARIOS = {
  approved: {
    outcome: "approved",
    outcomeDate: "08 May",
    departments: [
      { name: "Fire", sla: 5, status: "Approved", took: 5,
        events: [["Submitted", "01 May"], ["Received", "01 May"], ["Approved", "06 May"]] },
      { name: "Police", sla: 5, status: "Approved", took: 4,
        events: [["Submitted", "01 May"], ["Query raised", "03 May"], ["Query resolved", "04 May"], ["Approved", "05 May"]] },
      { name: "Electricity", sla: 7, status: "Approved", took: 7,
        events: [["Submitted", "01 May"], ["Received", "02 May"], ["Approved", "08 May"]] },
    ],
  },
  rejected: {
    outcome: "rejected",
    outcomeDate: "04 May",
    departments: [
      { name: "Fire", sla: 5, status: "Approved", took: 5,
        events: [["Submitted", "01 May"], ["Received", "01 May"], ["Approved", "06 May"]] },
      { name: "Police", sla: 5, status: "Rejected", took: 3,
        events: [["Submitted", "01 May"], ["Query raised", "03 May"], ["Rejected", "04 May"]],
        reason: "Fire-exit width in the site layout does not match the submitted floor plan." },
      { name: "Electricity", sla: 7, status: "Halted", took: null,
        events: [["Submitted", "01 May"], ["Halted — pending resubmission", "04 May"]] },
    ],
  },
};

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const APP_ID = "A102";

function statusColor(status) {
  if (status === "Approved") return "#128807";
  if (status === "Rejected") return "#B4342A";
  if (status === "Halted") return "#8A96A5";
  return "#CC6D1D";
}

export default function ApplicationTracker() {
  const [scenarioKey, setScenarioKey] = useState("approved");
  const scenario = SCENARIOS[scenarioKey];
  const [chain, setChain] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let prevHash = "GENESIS";
      const rows = [];
      for (const dept of scenario.departments) {
        for (const [event, ts] of dept.events) {
          const roleHash = (await sha256(`role:${dept.name}:${APP_ID}`)).slice(0, 12);
          const payload = `${prevHash}|${APP_ID}|${dept.name}|${event}|${ts}`;
          const docHash = await sha256(payload);
          rows.push({ event, ts, department: dept.name, roleHash, docHash });
          prevHash = docHash;
        }
      }
      if (!cancelled) setChain(rows);
    })();
    return () => { cancelled = true; };
  }, [scenarioKey]);

  const qrData = useMemo(
    () => `https://setu.gov.in/verify/${APP_ID}?head=${chain.length ? chain[chain.length - 1].docHash.slice(0, 16) : ""}`,
    [chain]
  );
  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="setu-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        .setu-root { --ink:#0B2036; --paper:#F5F6F3; --line:#DADFDA; --slate:#1C2A36;
          --saffron:#CC6D1D; --green:#128807; --navy:#06038D; --teal:#0F8B8D; --rust:#B4342A;
          font-family:'IBM Plex Sans',system-ui,sans-serif; background:var(--paper); color:var(--slate); min-height:100vh; }
        .setu-root * { box-sizing:border-box; }
        .setu-root h1,.setu-root h2,.setu-root h3 { font-family:'Space Grotesk',sans-serif; margin:0; color:var(--ink); }
        .setu-tricolour { height:5px; background:linear-gradient(90deg,#FF9933 0 33.3%,#fff 33.3% 66.6%,#128807 66.6% 100%); }
        .setu-wrap { max-width:980px; margin:0 auto; padding:28px 32px 60px; }

        .setu-top { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:18px; }
        .setu-brand { display:flex; align-items:center; gap:9px; }
        .setu-mark { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,var(--teal),var(--ink)); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:13px; }
        .setu-brand-name { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:15px; color:var(--ink); }
        .setu-brand-sub { font-size:11px; color:#7A8798; }

        .setu-scenario-toggle { display:inline-flex; border:1px solid var(--line); border-radius:100px; padding:3px; background:white; }
        .setu-scenario-btn { border:none; background:transparent; font-size:12.5px; font-weight:500; padding:7px 14px; border-radius:100px; cursor:pointer; color:#647082; }
        .setu-scenario-btn.on { background:var(--ink); color:white; }

        .setu-outcome { border-radius:10px; padding:18px 22px; display:flex; align-items:center; gap:14px; margin-bottom:22px; }
        .setu-outcome.approved { background:#E9F5EC; border:1px solid #BEE0C4; }
        .setu-outcome.rejected { background:#FBEAE8; border:1px solid #EFC3BE; }
        .setu-outcome h2 { font-size:18px; }
        .setu-outcome p { margin:2px 0 0; font-size:13.2px; color:#4C596A; }

        .setu-dept-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:26px; }
        .setu-dept-card { background:white; border:1px solid var(--line); border-radius:10px; overflow:hidden; }
        .setu-dept-head { display:flex; align-items:center; gap:8px; padding:14px 16px; border-bottom:1px solid var(--line); }
        .setu-dept-name { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:14px; color:var(--ink); flex:1; }
        .setu-pill { font-size:11px; font-weight:600; padding:3px 9px; border-radius:100px; color:white; }
        .setu-sla-row { display:flex; justify-content:space-between; font-size:11.5px; color:#7A8798; padding:10px 16px 0; }
        .setu-sla-bar { height:5px; background:var(--line); border-radius:100px; margin:6px 16px 12px; overflow:hidden; }
        .setu-sla-fill { height:100%; border-radius:100px; }
        .setu-timeline { list-style:none; margin:0; padding:0 16px 16px; }
        .setu-timeline li { font-size:12.3px; color:var(--slate); padding:5px 0; display:flex; justify-content:space-between; border-bottom:1px dashed var(--line); }
        .setu-timeline li:last-child { border-bottom:none; }
        .setu-timeline span.t { color:#8A96A5; }
        .setu-reason { font-size:12px; color:var(--rust); background:#FBEAE8; margin:0 16px 14px; padding:8px 10px; border-radius:6px; }

        .setu-section-title { display:flex; align-items:center; gap:8px; margin:0 0 12px; font-size:16px; }
        .setu-audit { border:1px solid var(--line); border-radius:10px; overflow:auto; margin-bottom:30px; background:white; }
        table.setu-table { width:100%; border-collapse:collapse; font-size:12px; }
        table.setu-table th { text-align:left; background:var(--ink); color:#EAF0F5; padding:9px 12px; font-weight:600; white-space:nowrap; }
        table.setu-table td { padding:9px 12px; border-bottom:1px solid var(--line); white-space:nowrap; color:#3B4756; }
        table.setu-table td.hash { font-family:monospace; color:#647082; }

        .setu-qr-card { display:flex; gap:26px; align-items:center; background:white; border:1px solid var(--line); border-radius:10px; padding:22px; margin-bottom:34px; flex-wrap:wrap; }
        .setu-qr-card img { border-radius:8px; border:1px solid var(--line); }
        .setu-qr-copy h3 { font-size:16px; margin-bottom:8px; }
        .setu-qr-copy p { font-size:13.3px; color:#4C596A; line-height:1.55; max-width:440px; margin:0 0 6px; }
        .setu-qr-link { font-size:12px; color:var(--navy); word-break:break-all; }

        .setu-footer { border-top:1px solid var(--line); padding-top:26px; }
        .setu-note { background:#FFF6EA; border:1px solid #F0DDB5; border-radius:8px; padding:14px 18px; font-size:13px; color:#5A4A26; margin-bottom:20px; }
        .setu-footer-grid { display:grid; grid-template-columns:1fr 1fr; gap:26px; }
        .setu-footer-col h4 { font-family:'Space Grotesk',sans-serif; font-size:13.5px; color:var(--ink); margin:0 0 10px; display:flex; align-items:center; gap:7px; }
        .setu-footer-col ul { margin:0; padding-left:18px; font-size:12.6px; color:#4C596A; line-height:1.7; }
        .setu-footer-col.dont li { color:#8A3A32; }

        @media (max-width:800px) {
          .setu-dept-grid { grid-template-columns:1fr; }
          .setu-footer-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="setu-tricolour" />
      <div className="setu-wrap">
        <div className="setu-top">
          <div className="setu-brand">
            <div className="setu-mark">S</div>
            <div>
              <div className="setu-brand-name">SETU · Application {APP_ID}</div>
              <div className="setu-brand-sub">Composite NOC — Fire, Police &amp; Electricity clearance</div>
            </div>
          </div>
          <div className="setu-scenario-toggle">
            {Object.keys(SCENARIOS).map((key) => (
              <button key={key} className={`setu-scenario-btn${scenarioKey === key ? " on" : ""}`} onClick={() => setScenarioKey(key)}>
                {key === "approved" ? "Approved flow" : "Rejected flow"}
              </button>
            ))}
          </div>
        </div>

        <div className={`setu-outcome ${scenario.outcome}`}>
          {scenario.outcome === "approved" ? <CheckCircle2 size={26} color="#128807" /> : <XCircle size={26} color="#B4342A" />}
          <div>
            <h2>{scenario.outcome === "approved" ? "Application approved — all clearances granted" : "Application rejected — resubmission required"}</h2>
            <p>Final status recorded {scenario.outcomeDate}. Every step below is timestamped and hash-chained the moment it happens.</p>
          </div>
        </div>

        <div className="setu-dept-grid">
          {scenario.departments.map((dept) => {
            const meta = DEPT_META[dept.name];
            const pct = dept.took ? Math.min(100, Math.round((dept.took / dept.sla) * 100)) : 30;
            return (
              <div className="setu-dept-card" key={dept.name}>
                <div className="setu-dept-head">
                  <meta.icon size={16} color={meta.color} />
                  <div className="setu-dept-name">{dept.name}</div>
                  <span className="setu-pill" style={{ background: statusColor(dept.status) }}>{dept.status}</span>
                </div>
                <div className="setu-sla-row">
                  <span>SLA: {dept.sla} days</span>
                  <span>{dept.took ? `Took: ${dept.took} days` : "Awaiting resubmission"}</span>
                </div>
                <div className="setu-sla-bar">
                  <div className="setu-sla-fill" style={{ width: `${pct}%`, background: dept.status === "Rejected" ? "var(--rust)" : dept.took && dept.took <= dept.sla ? "var(--green)" : "var(--saffron)" }} />
                </div>
                <ul className="setu-timeline">
                  {dept.events.map(([ev, ts]) => (
                    <li key={ev}><span>{ev}</span><span className="t">{ts}</span></li>
                  ))}
                </ul>
                {dept.reason && <div className="setu-reason">Reason: {dept.reason}</div>}
              </div>
            );
          })}
        </div>

        <h3 className="setu-section-title"><ListChecks size={18} color="var(--teal)" /> Hash-chained audit trail</h3>
        <div className="setu-audit">
          <table className="setu-table">
            <thead>
              <tr><th>APPLICATION_ID</th><th>DEPARTMENT</th><th>EVENT</th><th>TIMESTAMP</th><th>ROLE_HASH</th><th>DOCUMENT_HASH</th></tr>
            </thead>
            <tbody>
              {chain.map((r, i) => (
                <tr key={i}>
                  <td>{APP_ID}</td>
                  <td>{r.department}</td>
                  <td>{r.event}</td>
                  <td>{r.ts}</td>
                  <td className="hash">{r.roleHash}…</td>
                  <td className="hash">{r.docHash.slice(0, 18)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="setu-qr-card">
          <img src={qrImg} alt="Scan to verify clearance history" width={160} height={160} />
          <div className="setu-qr-copy">
            <h3><QrCode size={16} style={{ verticalAlign: "-2px", marginRight: 6 }} />Verify clearance history</h3>
            <p>Scanning this QR opens the authorised audit view for {APP_ID}: which department acted, when, and what the outcome was — reconstructed from the same hash chain shown above, not from any single department's private records.</p>
            <div className="setu-qr-link"><Link2 size={12} style={{ verticalAlign: "-1px" }} /> {qrData}</div>
          </div>
        </div>

        <div className="setu-footer">
          <div className="setu-note">
            <strong>A correction, stated plainly:</strong> a hash chain does not mean "no corruption." It means every recorded event becomes tamper-evident and independently verifiable — if a record is altered after the fact, the chain breaks and that break is detectable by anyone, not claimed away in a dispute.
          </div>
          <div className="setu-footer-grid">
            <div className="setu-footer-col dont">
              <h4><ShieldAlert size={15} color="var(--rust)" /> Never recorded on the public trail</h4>
              <ul>
                <li>Aadhaar numbers</li>
                <li>PAN details</li>
                <li>Entire application PDFs or attachments</li>
                <li>Financial documents</li>
                <li>Any other private personal information</li>
              </ul>
            </div>
            <div className="setu-footer-col">
              <h4><CheckCircle2 size={15} color="var(--green)" /> What a tamper-evident chain actually buys us</h4>
              <ul>
                <li>Ends "the officer changed my file" disputes — edits after the fact break the chain visibly</li>
                <li>Any applicant, auditor or court can recompute and verify the chain independently</li>
                <li>Timestamps are fixed at the moment of action, so delays can't be backdated</li>
                <li>Officer actions are traceable by role hash, without publishing personal identity</li>
                <li>Applicant, department and inspector all see one shared, matching history via the QR</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
