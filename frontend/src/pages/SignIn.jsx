import React, { useState } from "react";
import { LogIn, ArrowRight } from "lucide-react";

/*
  SETU — Sign In (frontend only, demo/mock).
  Asks name + email + Aadhaar last-4 only, per spec — never the full Aadhaar again.
*/

export default function SignIn() {
  const [form, setForm] = useState({ name: "", email: "", last4: "" });
  const [error, setError] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || form.last4.length !== 4) {
      setError("Enter your name, email, and the last 4 digits of your Aadhaar.");
      return;
    }
    setError("");
    setSignedIn(true);
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
        .setu-card { width:100%; max-width:400px; background:white; border:1px solid var(--line); border-radius:12px; padding:30px 30px 26px; box-shadow:0 16px 40px rgba(11,32,54,0.08); }
        .setu-brand { display:flex; align-items:center; gap:9px; margin-bottom:20px; }
        .setu-mark { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,var(--teal),var(--ink)); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:13px; }
        .setu-brand-name { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:15px; color:var(--ink); }
        .setu-card h2 { font-family:'Space Grotesk',sans-serif; font-size:21px; color:var(--ink); margin:0 0 6px; }
        .setu-card .sub { font-size:13px; color:#647082; margin-bottom:20px; }
        .setu-field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
        .setu-field label { font-size:12px; font-weight:500; color:#4C596A; }
        .setu-field input { font-size:14px; padding:10px 12px; border:1px solid var(--line); border-radius:7px; background:var(--paper); }
        .setu-field input:focus { outline:none; border-color:var(--navy); background:white; }
        .setu-btn { width:100%; font-weight:600; font-size:14px; color:white; background:var(--ink); border:none; border-radius:7px; padding:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
        .setu-btn:hover { background:#123049; }
        .setu-error { font-size:12.3px; color:#B4342A; margin-bottom:12px; }
        .setu-footline { text-align:center; font-size:12.5px; color:#7A8798; margin-top:16px; }
        .setu-welcome { text-align:center; padding:14px 0; }
        .setu-welcome .ring { width:56px; height:56px; border-radius:50%; background:#E9F5EC; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
      `}</style>
      <div className="setu-tricolour" />
      <div className="setu-center">
        <div className="setu-card">
          <div className="setu-brand"><div className="setu-mark">S</div><div className="setu-brand-name">PragatiSetu</div></div>

          {!signedIn ? (
            <form onSubmit={submit}>
              <h2>Sign in</h2>
              <div className="sub">Welcome back. Continue to your dashboard.</div>
              <div className="setu-field"><label>Full name</label><input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div className="setu-field"><label>Email address</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
              <div className="setu-field"><label>Aadhaar — last 4 digits</label><input maxLength={4} value={form.last4} onChange={(e) => set("last4", e.target.value.replace(/\D/g, ""))} /></div>
              {error && <div className="setu-error">{error}</div>}
              <button className="setu-btn" type="submit"><LogIn size={15} /> Sign in</button>
              <div className="setu-footline">New here? <b>Sign up</b> takes under two minutes.</div>
            </form>
          ) : (
            <div className="setu-welcome">
              <div className="ring"><LogIn size={24} color="#128807" /></div>
              <h2 style={{ marginBottom: 8 }}>Welcome, {form.name.split(" ")[0] || "there"}</h2>
              <div className="sub">You'd land on /dashboard from here <ArrowRight size={13} style={{ verticalAlign: "-2px" }} /></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
