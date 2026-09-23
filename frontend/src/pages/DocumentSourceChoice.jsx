import React from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, Vault, ArrowRight } from "lucide-react";

/*
  BeeSetu — Document source choice
  Runs right after "Identity completed" (either DigiLocker or manual path).
  Choosing EntityLocker routes into its own sandbox connect flow; choosing
  the vault skips straight to the business profile, per the spec — no
  forced upload immediately after creating the vault.
*/

export default function DocumentSourceChoice() {
  // Works standalone (no Router) for live preview, and with real
  // navigation once mounted inside the app's BrowserRouter.
  let navigate;
  try { navigate = useNavigate(); } catch { navigate = (path) => { window.location.href = path; }; }

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
        .setu-wrap { width:100%; max-width:680px; }
        .setu-brand { display:flex; align-items:center; gap:9px; margin-bottom:26px; justify-content:center; }
        .setu-mark { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,var(--teal),var(--ink)); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:13px; }
        .setu-brand-name { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:15px; color:var(--ink); }
        h1 { font-family:'Space Grotesk',sans-serif; font-size:22px; color:var(--ink); text-align:center; margin:0 0 6px; }
        .sub { text-align:center; color:#647082; font-size:13.5px; margin-bottom:28px; }
        .setu-cards { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .setu-card { background:#fff; border:1px solid var(--line); border-radius:12px; padding:24px; cursor:pointer; text-align:left; transition:border-color 0.15s ease, box-shadow 0.15s ease; }
        .setu-card:hover { border-color:var(--navy); box-shadow:0 12px 28px rgba(11,32,54,0.08); }
        .setu-card .ring { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
        .setu-card.el .ring { background:#EAF0FE; color:var(--navy); }
        .setu-card.vault .ring { background:#E9F5EC; color:var(--green); }
        .setu-card h3 { font-family:'Space Grotesk',sans-serif; font-size:15.5px; color:var(--ink); margin:0 0 6px; }
        .setu-card p { font-size:12.8px; color:#647082; margin:0 0 14px; line-height:1.5; }
        .setu-card .go { font-size:12.8px; font-weight:600; color:var(--navy); display:flex; align-items:center; gap:5px; }
        @media (max-width:560px) { .setu-cards { grid-template-columns:1fr; } }
      `}</style>
      <div className="setu-tricolour" />
      <div className="setu-center">
        <div className="setu-wrap">
          <div className="setu-brand"><div className="setu-mark">S</div><div className="setu-brand-name">BeeSetu</div></div>
          <h1>Where should we get your business documents?</h1>
          <div className="sub">You won't be forced to upload anything right now, either way.</div>

          <div className="setu-cards">
            <div className="setu-card el" onClick={() => navigate("/entitylocker")}>
              <div className="ring"><Landmark size={20} /></div>
              <h3>I already have an EntityLocker account</h3>
              <p>Connect it and BeeSetu reuses your existing issued documents — PAN, GST, incorporation certificate and more.</p>
              <div className="go">Connect EntityLocker <ArrowRight size={13} /></div>
            </div>
            <div className="setu-card vault" onClick={() => navigate("/business-profile")}>
              <div className="ring"><Vault size={20} /></div>
              <h3>Use BeeSetu's Document Vault</h3>
              <p>Start with an empty vault. You can add documents whenever you're ready — nothing is required immediately.</p>
              <div className="go">Continue with the vault <ArrowRight size={13} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
