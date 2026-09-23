import React, { useState } from "react";
import {
  Building2, FileBadge2, Users, MapPinned, Factory,
  Leaf, CheckCircle2, ChevronDown,
} from "lucide-react";

/*
  SETU — Unified Business Profile
  SIH 2026 · PS 26130

  Continues the SETU landing-page system (ink navy / Space Grotesk +
  IBM Plex Sans) and layers in the tricolour deliberately: a thin
  saffron–white–green rule at the very top (the way Indian government
  sites mark themselves), a line-drawn Ashoka Chakra as a quiet
  watermark rather than a stock photo, and each section keyed to one
  flag colour instead of one repeated accent everywhere.
*/

const FIELD_GROUPS = [
  {
    id: "identity",
    title: "Business identity",
    color: "#CC6D1D",
    icon: Building2,
    fields: [
      { name: "businessName", label: "Business name", type: "text", full: true },
      { name: "entityType", label: "Entity type", type: "select", options: ["Proprietorship", "Partnership", "LLP", "Private Limited", "Public Limited", "Cooperative", "Other"] },
      { name: "sector", label: "Sector", type: "select", options: ["Manufacturing", "IT / ITeS", "Agro-processing", "Textiles", "Pharma & Chemicals", "Logistics & Warehousing", "Services", "Other"] },
      { name: "nicCode", label: "NIC / activity code", type: "text" },
    ],
  },
  {
    id: "registration",
    title: "Registration & compliance IDs",
    color: "#06038D",
    icon: FileBadge2,
    fields: [
      { name: "pan", label: "PAN", type: "text" },
      { name: "cinLlpin", label: "CIN / LLPIN (if applicable)", type: "text" },
      { name: "udyam", label: "Udyam registration number", type: "text" },
      { name: "gstin", label: "GSTIN (if applicable)", type: "text" },
    ],
  },
  {
    id: "contact",
    title: "Authorised contact",
    color: "#CC6D1D",
    icon: Users,
    fields: [
      { name: "repName", label: "Owner / authorised representative", type: "text", full: true },
      { name: "mobile", label: "Mobile number", type: "tel" },
      { name: "email", label: "Email address", type: "email" },
    ],
  },
  {
    id: "location",
    title: "Location & land",
    color: "#128807",
    icon: MapPinned,
    fields: [
      { name: "location", label: "Business location / address", type: "textarea", full: true },
      { name: "landType", label: "Land type", type: "select", options: ["Owned", "Leased", "Government allotted (MIDC/other)", "Shared / co-working", "Other"] },
    ],
  },
  {
    id: "scale",
    title: "Scale of operations",
    color: "#06038D",
    icon: Factory,
    fields: [
      { name: "investment", label: "Investment (₹)", type: "text" },
      { name: "turnover", label: "Annual turnover (₹)", type: "text" },
      { name: "employees", label: "Number of employees", type: "text" },
      { name: "capacity", label: "Production capacity", type: "text" },
    ],
  },
  {
    id: "premises",
    title: "Premises & environment",
    color: "#128807",
    icon: Leaf,
    fields: [
      { name: "premises", label: "Premises details (built-up area, floors, layout)", type: "textarea", full: true },
      { name: "utilities", label: "Utilities required", type: "checkboxes", options: ["Power connection", "Water supply", "Sewage / effluent disposal", "Piped gas"] },
      { name: "envActivity", label: "Environmental activity category", type: "select", options: ["Not applicable", "White category", "Green category", "Orange category", "Red category"] },
      { name: "hazardous", label: "Handles hazardous material", type: "toggle" },
      { name: "machinery", label: "Key machinery / equipment", type: "textarea", full: true },
    ],
  },
];

function ChakraWatermark() {
  return (
    <svg className="setu-chakra" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line key={i} x1="100" y1="100" x2={100 + 88 * Math.cos((i * Math.PI) / 12)} y2={100 + 88 * Math.sin((i * Math.PI) / 12)} stroke="currentColor" strokeWidth="1.4" />
      ))}
      <circle cx="100" cy="100" r="7" fill="currentColor" />
    </svg>
  );
}

export default function BusinessProfileForm() {
  const [values, setValues] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (name, val) => setValues((v) => ({ ...v, [name]: val }));
  const toggleChip = (name, opt) => {
    const cur = values[name] || [];
    set(name, cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3200);
  };

  return (
    <div className="setu-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        .setu-root {
          --ink:#0B2036; --paper:#F5F6F3; --line:#DADFDA; --slate:#1C2A36;
          --saffron:#CC6D1D; --green:#128807; --navy:#06038D;
          font-family:'IBM Plex Sans', system-ui, sans-serif; background:var(--paper);
          color:var(--slate); min-height:100vh; -webkit-font-smoothing:antialiased;
        }
        .setu-root * { box-sizing:border-box; }
        .setu-tricolour { height:5px; background:linear-gradient(90deg,#FF9933 0 33.3%, #FFFFFF 33.3% 66.6%, #128807 66.6% 100%); }
        .setu-header {
          position:relative; overflow:hidden; padding:34px 32px 30px;
          background:linear-gradient(180deg, var(--ink), #123049);
          color:#EAF0F5;
        }
        .setu-chakra { position:absolute; right:-40px; top:-40px; width:220px; height:220px; color:rgba(255,255,255,0.06); }
        .setu-brand { display:flex; align-items:center; gap:10px; margin-bottom:18px; position:relative; z-index:1; }
        .setu-mark { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#CC6D1D,#128807); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; }
        .setu-brand-name { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:16px; }
        .setu-brand-sub { font-size:11.5px; color:#9FB0C2; }
        .setu-header h1 { font-family:'Space Grotesk',sans-serif; font-size:30px; margin:0; position:relative; z-index:1; max-width:560px; }
        .setu-header p { color:#B9C6D3; font-size:14.5px; margin-top:10px; max-width:520px; position:relative; z-index:1; }

        .setu-form { max-width:920px; margin:-18px auto 60px; padding:0 32px; position:relative; z-index:1; }
        .setu-card {
          background:white; border:1px solid var(--line); border-radius:10px;
          margin-bottom:20px; overflow:hidden;
          box-shadow:0 10px 26px rgba(11,32,54,0.06);
        }
        .setu-card-head { display:flex; align-items:center; gap:10px; padding:16px 20px; border-bottom:1px solid var(--line); }
        .setu-card-bar { width:4px; align-self:stretch; }
        .setu-card-title { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15px; color:var(--ink); }
        .setu-card-body { padding:20px; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .setu-field { display:flex; flex-direction:column; gap:6px; }
        .setu-field.full { grid-column:1 / -1; }
        .setu-field label { font-size:12.5px; font-weight:500; color:#4C596A; }
        .setu-field input, .setu-field select, .setu-field textarea {
          font-family:'IBM Plex Sans',sans-serif; font-size:13.8px; padding:10px 12px;
          border:1px solid var(--line); border-radius:7px; background:var(--paper); color:var(--slate);
          transition:border-color 0.15s ease, background 0.15s ease;
        }
        .setu-field textarea { min-height:70px; resize:vertical; }
        .setu-field input:focus, .setu-field select:focus, .setu-field textarea:focus {
          outline:none; border-color:var(--navy); background:white;
        }
        .setu-select-wrap { position:relative; }
        .setu-select-wrap svg { position:absolute; right:10px; top:12px; pointer-events:none; color:#8A96A5; }
        .setu-select-wrap select { appearance:none; width:100%; }

        .setu-chips { display:flex; flex-wrap:wrap; gap:8px; }
        .setu-chip {
          font-size:12.5px; padding:8px 12px; border-radius:100px; border:1px solid var(--line);
          background:var(--paper); cursor:pointer; user-select:none; transition:all 0.15s ease;
        }
        .setu-chip.on { background:#E9F5EC; border-color:var(--green); color:#0E6E05; font-weight:500; }

        .setu-toggle-row { display:flex; align-items:center; gap:10px; }
        .setu-switch { width:42px; height:24px; border-radius:100px; background:var(--line); position:relative; cursor:pointer; transition:background 0.2s ease; flex-shrink:0; }
        .setu-switch.on { background:var(--saffron); }
        .setu-switch::after { content:''; position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:white; transition:transform 0.2s ease; }
        .setu-switch.on::after { transform:translateX(18px); }
        .setu-toggle-label { font-size:13px; color:#4C596A; }

        .setu-submit-row { display:flex; align-items:center; gap:16px; margin-top:6px; }
        .setu-submit {
          font-family:'IBM Plex Sans',sans-serif; font-weight:600; font-size:14.5px; color:white;
          background:linear-gradient(90deg,var(--saffron),var(--navy),var(--green));
          background-size:220% 100%; border:none; border-radius:7px; padding:13px 26px; cursor:pointer;
          transition:background-position 0.4s ease, transform 0.15s ease;
        }
        .setu-submit:hover { background-position:100% 0; transform:translateY(-1px); }
        .setu-saved { display:flex; align-items:center; gap:6px; color:var(--green); font-size:13.5px; font-weight:500; }

        @media (max-width:760px) {
          .setu-card-body { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="setu-tricolour" />

      <header className="setu-header">
        <ChakraWatermark />
        <div className="setu-brand">
          <div className="setu-mark">S</div>
          <div>
            <div className="setu-brand-name">SETU</div>
            <div className="setu-brand-sub">Unified Approval &amp; Compliance Platform</div>
          </div>
        </div>
        <h1>Unified Business Profile</h1>
        <p>
          Fill this once. SETU reuses these verified details across every future
          licence, renewal and inspection, so you never re-enter the same
          information twice.
        </p>
      </header>

      <form className="setu-form" onSubmit={onSubmit}>
        {FIELD_GROUPS.map((group) => (
          <div className="setu-card" key={group.id}>
            <div className="setu-card-head">
              <div className="setu-card-bar" style={{ background: group.color }} />
              <group.icon size={18} color={group.color} />
              <div className="setu-card-title">{group.title}</div>
            </div>
            <div className="setu-card-body">
              {group.fields.map((f) => (
                <div className={`setu-field${f.full ? " full" : ""}`} key={f.name}>
                  <label htmlFor={f.name}>{f.label}</label>

                  {f.type === "text" || f.type === "tel" || f.type === "email" ? (
                    <input id={f.name} type={f.type} value={values[f.name] || ""} onChange={(e) => set(f.name, e.target.value)} />
                  ) : f.type === "textarea" ? (
                    <textarea id={f.name} value={values[f.name] || ""} onChange={(e) => set(f.name, e.target.value)} />
                  ) : f.type === "select" ? (
                    <div className="setu-select-wrap">
                      <select id={f.name} value={values[f.name] || ""} onChange={(e) => set(f.name, e.target.value)}>
                        <option value="" disabled>Select</option>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={15} />
                    </div>
                  ) : f.type === "checkboxes" ? (
                    <div className="setu-chips">
                      {f.options.map((o) => (
                        <div key={o} className={`setu-chip${(values[f.name] || []).includes(o) ? " on" : ""}`} onClick={() => toggleChip(f.name, o)}>
                          {o}
                        </div>
                      ))}
                    </div>
                  ) : f.type === "toggle" ? (
                    <div className="setu-toggle-row">
                      <div className={`setu-switch${values[f.name] ? " on" : ""}`} onClick={() => set(f.name, !values[f.name])} />
                      <span className="setu-toggle-label">{values[f.name] ? "Yes — details required at inspection stage" : "No"}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="setu-submit-row">
          <button type="submit" className="setu-submit">Save business profile</button>
          {saved && <span className="setu-saved"><CheckCircle2 size={16} /> Profile saved</span>}
        </div>
      </form>
    </div>
  );
}
