import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, MessageCircle, Smartphone, ArrowRight, Info } from "lucide-react";

/*
  SETU — Sign Up (frontend only, demo/mock)
  Matches the design system used across LandingPage / BusinessProfileForm /
  ApplicationTracker. OTP is intentionally mocked as 1111 per spec — there is
  no backend call here yet, this is UI only.
*/

const CHANNELS = [
  { key: "email", label: "Email", icon: Mail },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { key: "sms", label: "SMS", icon: Smartphone },
];

export default function SignUp() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", aadhaar: "" });
  const [channel, setChannel] = useState("email");
  const [stage, setStage] = useState("form"); // form -> otp-sent -> verified
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  // Works standalone (no Router) for live preview, and with real
  // navigation once mounted inside the app's BrowserRouter.
  let navigate;
  try { navigate = useNavigate(); } catch { navigate = (path) => { window.location.href = path; }; }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const sendOtp = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || form.aadhaar.length !== 12) {
      setError("Fill all fields — mock Aadhaar must be 12 digits for this demo.");
      return;
    }
    setError("");
    setStage("otp-sent");
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (otp !== "1111") { setError("Incorrect OTP. This demo only accepts 1111."); return; }
    setError("");
    setStage("verified");
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
        .setu-card { width:100%; max-width:420px; background:white; border:1px solid var(--line); border-radius:12px; padding:30px 30px 26px; box-shadow:0 16px 40px rgba(11,32,54,0.08); }
        .setu-brand { display:flex; align-items:center; gap:9px; margin-bottom:20px; }
        .setu-mark { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,var(--teal),var(--ink)); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:13px; }
        .setu-brand-name { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:15px; color:var(--ink); }
        .setu-card h2 { font-family:'Space Grotesk',sans-serif; font-size:21px; color:var(--ink); margin:0 0 6px; }
        .setu-card .sub { font-size:13px; color:#647082; margin-bottom:20px; }
        .setu-field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
        .setu-field label { font-size:12px; font-weight:500; color:#4C596A; }
        .setu-field input { font-size:14px; padding:10px 12px; border:1px solid var(--line); border-radius:7px; background:var(--paper); }
        .setu-field input:focus { outline:none; border-color:var(--navy); background:white; }
        .setu-demo-note { display:flex; gap:7px; align-items:flex-start; font-size:11.8px; color:#8A6A2E; background:#FFF6EA; border:1px solid #F0DDB5; border-radius:7px; padding:9px 11px; margin-bottom:16px; }
        .setu-channels { display:flex; gap:8px; margin-bottom:18px; }
        .setu-channel { flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; padding:10px 4px; border:1px solid var(--line); border-radius:8px; cursor:pointer; font-size:11.5px; color:#647082; background:var(--paper); }
        .setu-channel.on { border-color:var(--teal); background:#EEF7F7; color:#0F6E6F; font-weight:600; }
        .setu-btn { width:100%; font-weight:600; font-size:14px; color:white; background:var(--ink); border:none; border-radius:7px; padding:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
        .setu-btn:hover { background:#123049; }
        .setu-error { font-size:12.3px; color:#B4342A; margin-bottom:12px; }
        .setu-otp-banner { font-size:12.8px; color:#0E6E05; background:#E9F5EC; border:1px solid #BEE0C4; border-radius:7px; padding:9px 11px; margin-bottom:16px; }
        .setu-verified { text-align:center; padding:14px 0; }
        .setu-verified .ring { width:56px; height:56px; border-radius:50%; background:#E9F5EC; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
      `}</style>
      <div className="setu-tricolour" />
      <div className="setu-center">
        <div className="setu-card">
          <div className="setu-brand"><div className="setu-mark">S</div><div className="setu-brand-name">PragatiSetu</div></div>

          {stage === "form" && (
            <form onSubmit={sendOtp}>
              <h2>Create your account</h2>
              <div className="sub">One profile. One intelligent approval journey.</div>
              <div className="setu-field"><label>Full name</label><input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div className="setu-field"><label>Phone number</label><input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div className="setu-field"><label>Email address</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
              <div className="setu-field"><label>Aadhaar number</label><input maxLength={12} value={form.aadhaar} onChange={(e) => set("aadhaar", e.target.value.replace(/\D/g, ""))} /></div>
              <div className="setu-demo-note"><Info size={14} style={{ marginTop: 1 }} /> Demo environment — Aadhaar verification is simulated. Only a hash and last 4 digits would ever be stored.</div>
              <div className="setu-channels">
                {CHANNELS.map((c) => (
                  <div key={c.key} className={`setu-channel${channel === c.key ? " on" : ""}`} onClick={() => setChannel(c.key)}>
                    <c.icon size={16} /> {c.label}
                  </div>
                ))}
              </div>
              {error && <div className="setu-error">{error}</div>}
              <button className="setu-btn" type="submit">Send OTP <ArrowRight size={15} /></button>
            </form>
          )}

          {stage === "otp-sent" && (
            <form onSubmit={verifyOtp}>
              <h2>Verify your OTP</h2>
              <div className="sub">Sent via {CHANNELS.find((c) => c.key === channel).label.toLowerCase()} to your registered contact.</div>
              <div className="setu-otp-banner">OTP sent successfully. (Demo build — enter 1111.)</div>
              <div className="setu-field"><label>6-digit OTP</label><input maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)} /></div>
              {error && <div className="setu-error">{error}</div>}
              <button className="setu-btn" type="submit">Verify &amp; continue <ArrowRight size={15} /></button>
            </form>
          )}

          {stage === "verified" && (
            <div className="setu-verified">
              <div className="ring"><ShieldCheck size={26} color="#128807" /></div>
              <h2 style={{ marginBottom: 8 }}>Account verified</h2>
              <div className="sub">Identity completed manually — no DigiLocker account needed.</div>
              <button className="setu-btn" style={{ marginTop: 16 }} onClick={() => navigate("/document-source")}>
                Continue <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
