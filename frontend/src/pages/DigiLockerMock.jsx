import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fingerprint, ArrowRight, Info, ShieldCheck } from "lucide-react";

/*
  PragatiSetu — DigiLocker sandbox (identity mock)
  Mimics the shape of a DigiLocker identity check: name + Aadhaar + phone,
  then OTP. No real DigiLocker API is called — this is a self-contained
  frontend mock (matching backend/src/controllers/digilockerController.js
  if/when this gets wired to it). OTP is always 1111 for the demo.
*/

export default function DigiLockerMock() {
  const [form, setForm] = useState({ name: "", aadhaar: "", phone: "" });
  const [stage, setStage] = useState("form"); // form -> otp -> done
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  // Works standalone (no Router) for live preview, and with real
  // navigation once mounted inside the app's BrowserRouter.
  let navigate;
  try { navigate = useNavigate(); } catch { navigate = (path) => { window.location.href = path; }; }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const sendOtp = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || form.aadhaar.length !== 12) {
      setError("Enter your name, phone, and a 12-digit demo Aadhaar.");
      return;
    }
    setError("");
    setStage("otp");
  };

  const verify = (e) => {
    e.preventDefault();
    if (otp !== "1111") { setError("Incorrect OTP. This demo only accepts 1111."); return; }
    setError("");
    setStage("done");
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
        .setu-card { width:100%; max-width:420px; background:#fff; border:1px solid var(--line); border-radius:12px; padding:30px; box-shadow:0 16px 40px rgba(11,32,54,0.08); }
        .setu-dl-head { display:flex; align-items:center; gap:9px; margin-bottom:6px; }
        .setu-dl-head .ring { width:34px; height:34px; border-radius:8px; background:#EAF0FE; color:var(--navy); display:flex; align-items:center; justify-content:center; }
        h2 { font-family:'Space Grotesk',sans-serif; font-size:19px; color:var(--ink); margin:0; }
        .sub { font-size:12.8px; color:#647082; margin-bottom:18px; }
        .setu-field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
        .setu-field label { font-size:12px; font-weight:500; color:#4C596A; }
        .setu-field input { font-size:14px; padding:10px 12px; border:1px solid var(--line); border-radius:7px; background:var(--paper); }
        .setu-field input:focus { outline:none; border-color:var(--navy); background:#fff; }
        .setu-demo-note { display:flex; gap:7px; align-items:flex-start; font-size:11.5px; color:#3B5488; background:#EAF0FE; border:1px solid #C6D4F5; border-radius:7px; padding:9px 11px; margin-bottom:16px; }
        .setu-btn { width:100%; font-weight:600; font-size:14px; color:#fff; background:var(--ink); border:none; border-radius:7px; padding:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
        .setu-btn:hover { background:#123049; }
        .setu-error { font-size:12.3px; color:#B4342A; margin-bottom:12px; }
        .setu-otp-banner { font-size:12.8px; color:#0E6E05; background:#E9F5EC; border:1px solid #BEE0C4; border-radius:7px; padding:9px 11px; margin-bottom:16px; }
        .setu-done { text-align:center; padding:14px 0; }
        .setu-done .ring2 { width:56px; height:56px; border-radius:50%; background:#E9F5EC; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
      `}</style>
      <div className="setu-tricolour" />
      <div className="setu-center">
        <div className="setu-card">
          <div className="setu-dl-head"><div className="ring"><Fingerprint size={17} /></div><h2>DigiLocker sandbox</h2></div>
          <div className="sub">Demo Mode — mimicking the DigiLocker identity check. No real government API is called.</div>

          {stage === "form" && (
            <form onSubmit={sendOtp}>
              <div className="setu-field"><label>Full name</label><input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div className="setu-field"><label>Aadhaar number (demo)</label><input maxLength={12} value={form.aadhaar} onChange={(e) => set("aadhaar", e.target.value.replace(/\D/g, ""))} /></div>
              <div className="setu-field"><label>Phone number</label><input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div className="setu-demo-note"><Info size={13} style={{ marginTop: 1 }} /> This sandbox stands in for DigiLocker's identity step. A future build swaps this for the real DigiLocker OAuth flow.</div>
              {error && <div className="setu-error">{error}</div>}
              <button className="setu-btn" type="submit">Send OTP <ArrowRight size={15} /></button>
            </form>
          )}

          {stage === "otp" && (
            <form onSubmit={verify}>
              <div className="setu-otp-banner">OTP sent successfully. (Demo build — enter 1111.)</div>
              <div className="setu-field"><label>4-digit OTP</label><input maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)} /></div>
              {error && <div className="setu-error">{error}</div>}
              <button className="setu-btn" type="submit">Verify identity <ArrowRight size={15} /></button>
            </form>
          )}

          {stage === "done" && (
            <div className="setu-done">
              <div className="ring2"><ShieldCheck size={26} color="#128807" /></div>
              <h2 style={{ marginBottom: 8 }}>Identity completed</h2>
              <div className="sub">Verified via DigiLocker (Demo Mode) for {form.name || "you"}.</div>
              <button className="setu-btn" onClick={() => navigate("/document-source")}>Continue <ArrowRight size={15} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
