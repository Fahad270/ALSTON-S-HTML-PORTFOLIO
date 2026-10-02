import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, ArrowRight, Info, CheckCircle2, FileText } from "lucide-react";

/*
  PragatiSetu — EntityLocker sandbox
  Mirrors the real Entity Locker API's shape (see backend/src/mock for the
  matching server-side version): the `acr` the real /oauth2/1/authorize
  endpoint would use — pan, cin or udyam — depends on entity type, which is
  why the requested ID field changes below. OTP stands in for "the entity
  signs in to Entity Locker" in the real OAuth flow. Nothing here calls the
  real government API.
*/

const ENTITY_TYPES = ["Private Limited", "Public Limited", "LLP", "Partnership", "Proprietorship", "Cooperative", "Other"];
const ACR_BY_ENTITY_TYPE = {
  "Private Limited": "cin", "Public Limited": "cin", LLP: "cin",
  Partnership: "pan", Proprietorship: "udyam", Cooperative: "pan", Other: "pan",
};
const ACR_FIELD_LABEL = { pan: "Organisation PAN", cin: "CIN (Corporate Identity Number)", udyam: "Udyam Registration Number" };

// Matches backend/src/mock/mockEntityLockerData.js — same demo entity.
const MOCK_ENTITY = { name: "Demo Manufacturing Pvt Ltd", doi: "20-03-2019", verified_by: "CIN" };
const MOCK_DOCS = [
  "Organisation PAN Verification Record", "GST Registration Certificate", "Udyam Registration Certificate",
  "Certificate of Incorporation", "Registered Office Address Proof", "Company Master Details",
  "Bank Account Statement (6 months)", "Premises Lease Deed", "Authorised Signatory ID Proof", "Factory Licence",
];

export default function EntityLockerMock() {
  const [stage, setStage] = useState("type"); // type -> id -> otp -> connected
  const [entityType, setEntityType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  // Works standalone (no Router) for live preview, and with real
  // navigation once mounted inside the app's BrowserRouter.
  let navigate;
  try { navigate = useNavigate(); } catch { navigate = (path) => { window.location.href = path; }; }

  const acr = ACR_BY_ENTITY_TYPE[entityType] || "pan";

  const chooseType = (e) => {
    e.preventDefault();
    if (!entityType) { setError("Select your entity type."); return; }
    setError(""); setStage("id");
  };
  const submitId = (e) => {
    e.preventDefault();
    if (!idNumber.trim()) { setError(`Enter your ${ACR_FIELD_LABEL[acr]}.`); return; }
    setError(""); setStage("otp");
  };
  const verify = (e) => {
    e.preventDefault();
    if (otp !== "1111") { setError("Incorrect OTP. This demo only accepts 1111."); return; }
    setError(""); setStage("connected");
  };

  return (
    <div className="setu-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        .setu-root { --ink:#0B2036; --paper:#F5F6F3; --line:#DADFDA; --slate:#1C2A36;
          --saffron:#CC6D1D; --green:#128807; --navy:#06038D; --teal:#0F8B8D;
          font-family:'IBM Plex Sans',system-ui,sans-serif; background:var(--paper); min-height:100vh; color:var(--slate); }
        .setu-root * { box-sizing:border-box; }
        .setu-tricolour { height:5px; background:linear-gradient(90deg,#FF9933 0 33.3%,#fff 33.3% 66.6%,#128807 66.6% 100%); }
        .setu-center { min-height:calc(100vh - 5px); display:flex; align-items:center; justify-content:center; padding:40px 20px; }
        .setu-card { width:100%; max-width:460px; background:#fff; border:1px solid var(--line); border-radius:12px; padding:30px; box-shadow:0 16px 40px rgba(11,32,54,0.08); }
        .setu-el-head { display:flex; align-items:center; gap:9px; margin-bottom:6px; }
        .setu-el-head .ring { width:34px; height:34px; border-radius:8px; background:#EAF0FE; color:var(--navy); display:flex; align-items:center; justify-content:center; }
        h2 { font-family:'Space Grotesk',sans-serif; font-size:19px; color:var(--ink); margin:0; }
        .sub { font-size:12.8px; color:#647082; margin-bottom:18px; }
        .setu-field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
        .setu-field label { font-size:12px; font-weight:500; color:#4C596A; }
        .setu-field input, .setu-field select { font-size:14px; padding:10px 12px; border:1px solid var(--line); border-radius:7px; background:var(--paper); width:100%; }
        .setu-field input:focus, .setu-field select:focus { outline:none; border-color:var(--navy); background:#fff; }
        .setu-demo-note { display:flex; gap:7px; align-items:flex-start; font-size:11.5px; color:#3B5488; background:#EAF0FE; border:1px solid #C6D4F5; border-radius:7px; padding:9px 11px; margin-bottom:16px; }
        .setu-btn { width:100%; font-weight:600; font-size:14px; color:#fff; background:var(--ink); border:none; border-radius:7px; padding:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
        .setu-btn:hover { background:#123049; }
        .setu-error { font-size:12.3px; color:#B4342A; margin-bottom:12px; }
        .setu-otp-banner { font-size:12.8px; color:#0E6E05; background:#E9F5EC; border:1px solid #BEE0C4; border-radius:7px; padding:9px 11px; margin-bottom:16px; }
        .setu-acr-pill { display:inline-block; font-size:10.5px; font-weight:600; background:#EAF0FE; color:var(--navy); padding:2px 8px; border-radius:100px; margin-bottom:12px; }
        .setu-connected { text-align:center; }
        .setu-connected .ring2 { width:52px; height:52px; border-radius:50%; background:#E9F5EC; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; }
        .setu-entity-box { background:var(--paper); border:1px solid var(--line); border-radius:8px; padding:12px 14px; margin:14px 0; text-align:left; font-size:12.8px; }
        .setu-entity-box b { color:var(--ink); }
        .setu-doc-list { list-style:none; margin:0 0 18px; padding:0; text-align:left; max-height:200px; overflow:auto; border:1px solid var(--line); border-radius:8px; }
        .setu-doc-list li { display:flex; align-items:center; gap:8px; font-size:12.5px; padding:8px 12px; border-bottom:1px solid var(--line); color:var(--slate); }
        .setu-doc-list li:last-child { border-bottom:none; }
      `}</style>
      <div className="setu-tricolour" />
      <div className="setu-center">
        <div className="setu-card">
          <div className="setu-el-head"><div className="ring"><Landmark size={17} /></div><h2>EntityLocker sandbox</h2></div>
          <div className="sub">Demo Mode — mimicking the Entity Locker connect flow. No real government API is called.</div>

          {stage === "type" && (
            <form onSubmit={chooseType}>
              <div className="setu-field">
                <label>Business entity type</label>
                <select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
                  <option value="" disabled>Select</option>
                  {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="setu-demo-note"><Info size={13} style={{ marginTop: 1 }} /> The real Entity Locker API decides what ID it asks for based on entity type (its "acr" parameter — PAN, CIN or Udyam). This sandbox mirrors that.</div>
              {error && <div className="setu-error">{error}</div>}
              <button className="setu-btn" type="submit">Continue <ArrowRight size={15} /></button>
            </form>
          )}

          {stage === "id" && (
            <form onSubmit={submitId}>
              <div className="setu-acr-pill">Verification type: {acr.toUpperCase()}</div>
              <div className="setu-field"><label>{ACR_FIELD_LABEL[acr]}</label><input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} /></div>
              {error && <div className="setu-error">{error}</div>}
              <button className="setu-btn" type="submit">Connect via EntityLocker <ArrowRight size={15} /></button>
            </form>
          )}

          {stage === "otp" && (
            <form onSubmit={verify}>
              <div className="setu-otp-banner">OTP sent to your EntityLocker-registered number. (Demo build — enter 1111.)</div>
              <div className="setu-field"><label>4-digit OTP</label><input maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)} /></div>
              {error && <div className="setu-error">{error}</div>}
              <button className="setu-btn" type="submit">Verify &amp; connect <ArrowRight size={15} /></button>
            </form>
          )}

          {stage === "connected" && (
            <div className="setu-connected">
              <div className="ring2"><CheckCircle2 size={24} color="#128807" /></div>
              <h2 style={{ marginBottom: 4 }}>EntityLocker connected</h2>
              <div className="sub">Demo Mode — connection simulated.</div>
              <div className="setu-entity-box">
                <div><b>{MOCK_ENTITY.name}</b></div>
                <div>Incorporated: {MOCK_ENTITY.doi}</div>
                <div>Verified by: {MOCK_ENTITY.verified_by}</div>
              </div>
              <ul className="setu-doc-list">
                {MOCK_DOCS.map((d) => (
                  <li key={d}><FileText size={13} color="#647082" /> {d}</li>
                ))}
              </ul>
              <button className="setu-btn" onClick={() => navigate("/business-profile")}>Continue to Business Profile <ArrowRight size={15} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
