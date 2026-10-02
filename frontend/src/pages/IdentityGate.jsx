import React from "react";
import { useNavigate } from "react-router-dom";
import { Fingerprint, UserPlus, ArrowRight } from "lucide-react";

/*
  PragatiSetu — Identity gate
  First real fork in the journey: DigiLocker (for people who already have an
  account) vs manual signup (for people who don't). Both paths converge on
  the same next step: /document-source.
*/

export default function IdentityGate() {
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
        .setu-wrap { width:100%; max-width:640px; }
        .setu-brand { display:flex; align-items:center; gap:9px; margin-bottom:26px; justify-content:center; }
        .setu-mark { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,var(--teal),var(--ink)); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:13px; }
        .setu-brand-name { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:15px; color:var(--ink); }
        h1 { font-family:'Space Grotesk',sans-serif; font-size:24px; color:var(--ink); text-align:center; margin:0 0 6px; }
        .sub { text-align:center; color:#647082; font-size:13.5px; margin-bottom:28px; }
        .setu-cards { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .setu-card {
          background:#fff; border:1px solid var(--line); border-radius:12px; padding:24px;
          cursor:pointer; text-align:left; transition:border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .setu-card:hover { border-color:var(--navy); box-shadow:0 12px 28px rgba(11,32,54,0.08); }
        .setu-card .ring { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
        .setu-card.dl .ring { background:#EAF0FE; color:var(--navy); }
        .setu-card.manual .ring { background:#FFF3E8; color:var(--saffron); }
        .setu-card h3 { font-family:'Space Grotesk',sans-serif; font-size:15.5px; color:var(--ink); margin:0 0 6px; }
        .setu-card p { font-size:12.8px; color:#647082; margin:0 0 14px; line-height:1.5; }
        .setu-card .go { font-size:12.8px; font-weight:600; color:var(--navy); display:flex; align-items:center; gap:5px; }
        .setu-recommended { display:inline-block; font-size:10.5px; font-weight:600; background:#E9F5EC; color:#0E6E05; padding:2px 8px; border-radius:100px; margin-bottom:10px; }
        @media (max-width:560px) { .setu-cards { grid-template-columns:1fr; } }
      `}</style>
      <div className="setu-tricolour" />
      <div className="setu-center">
        <div className="setu-wrap">
          <div className="setu-brand"><div className="setu-mark">S</div><div className="setu-brand-name">PragatiSetu</div></div>
          <h1>How would you like to sign in?</h1>
          <div className="sub">Both paths lead to the same place — pick whichever you already have.</div>

          <div className="setu-cards">
            <div className="setu-card dl" onClick={() => navigate("/digilocker")}>
              <div className="setu-recommended">Faster</div>
              <div className="ring"><Fingerprint size={20} /></div>
              <h3>Continue with DigiLocker</h3>
              <p>Verify with your name, Aadhaar and phone. Demo sandbox — mimics the DigiLocker identity check, doesn't call the real API yet.</p>
              <div className="go">Continue <ArrowRight size={13} /></div>
            </div>
            <div className="setu-card manual" onClick={() => navigate("/signup")}>
              <div className="ring"><UserPlus size={20} /></div>
              <h3>I don't have DigiLocker</h3>
              <p>Sign up manually with your name, phone, email and a demo Aadhaar. Stored only in PragatiSetu's own database.</p>
              <div className="go">Sign up manually <ArrowRight size={13} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
