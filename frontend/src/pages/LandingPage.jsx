import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Rocket, Building2, FileSignature, RefreshCcw, CheckCircle2, ArrowRight,
  Accessibility, Globe, Type,
} from "lucide-react";

/*
  BeeSetu — Unified Approval & Compliance Platform
  SIH 2026 · PS 26130

  Re-themed to echo india.gov.in's national-portal language: a dark hero
  band, a utility bar above it (skip-link, accessibility, font-size,
  language), and a tricolour underline beneath the wordmark. No official
  emblem is reproduced — the mark below is an original Chakra + bee motif,
  and "Demo prototype" is stated plainly so this never reads as an actual
  government property.
*/

const INTENTS = [
  { key: "A", label: "Start a new business", icon: Rocket },
  { key: "B", label: "Expand an existing business", icon: Building2 },
  { key: "C", label: "Obtain a new licence / approval", icon: FileSignature },
  { key: "D", label: "Renew existing approvals", icon: RefreshCcw },
  { key: "E", label: "Check my compliance status", icon: CheckCircle2 },
];

function ChakraBeeMark() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="none" stroke="#06038D" strokeWidth="2" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line key={i} x1="32" y1="32" x2={32 + 27 * Math.cos((i * Math.PI) / 12)} y2={32 + 27 * Math.sin((i * Math.PI) / 12)} stroke="#06038D" strokeWidth="1" />
      ))}
      <ellipse cx="32" cy="30" rx="8" ry="10" fill="#CC6D1D" />
      <path d="M24 26 Q20 20 26 18 Q28 22 24 26" fill="#128807" opacity="0.85" />
      <path d="M40 26 Q44 20 38 18 Q36 22 40 26" fill="#128807" opacity="0.85" />
      <rect x="26" y="24" width="12" height="2" fill="#06038D" />
      <rect x="26" y="29" width="12" height="2" fill="#06038D" />
      <rect x="26" y="34" width="12" height="2" fill="#06038D" />
    </svg>
  );
}

export default function LandingPage() {
  const [fontStep, setFontStep] = useState(1);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bs-root" style={{ fontSize: `${14 + fontStep}px` }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        .bs-root { --ink:#0B2036; --paper:#F5F6F3; --line:#DADFDA; --slate:#1C2A36;
          --saffron:#CC6D1D; --green:#128807; --navy:#06038D;
          font-family:'IBM Plex Sans',system-ui,sans-serif; background:var(--paper); color:var(--slate); min-height:100vh; }
        .bs-root * { box-sizing:border-box; }
        .bs-root h1,.bs-root h2,.bs-root h3 { font-family:'Space Grotesk',sans-serif; margin:0; color:#fff; }

        .bs-tricolour { height:5px; background:linear-gradient(90deg,#FF9933 0 33.3%,#fff 33.3% 66.6%,#128807 66.6% 100%); }
        .bs-utility { background:#0B2036; color:#B9C6D3; font-size:12px; padding:7px 24px; display:flex; align-items:center; gap:18px; }
        .bs-utility a { color:#B9C6D3; text-decoration:none; }
        .bs-utility .sep { opacity:0.3; }
        .bs-utility .icons { margin-left:auto; display:flex; align-items:center; gap:14px; }
        .bs-utility .icon-btn { display:flex; align-items:center; gap:4px; cursor:pointer; background:none; border:none; color:#B9C6D3; font-size:12px; }

        .bs-hero { position:relative; overflow:hidden; padding:54px 24px 60px; text-align:center;
          background: radial-gradient(circle at 30% 20%, #16324a 0%, #0B2036 55%), repeating-linear-gradient(115deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 26px); }
        .bs-mark-wrap { display:flex; justify-content:center; margin-bottom:10px; }
        .bs-mark-ring { background:#fff; border-radius:50%; padding:8px; box-shadow:0 8px 24px rgba(0,0,0,0.3); }
        .bs-wordmark { font-size:44px; font-weight:700; letter-spacing:-0.01em; }
        .bs-wordmark span { color:#F0A94E; }
        .bs-underline { width:180px; height:4px; margin:8px auto 0; background:linear-gradient(90deg,#FF9933 0 50%, #128807 50% 100%); border-radius:4px; }
        .bs-tagline { color:#C3CBD6; font-size:14.5px; margin-top:14px; letter-spacing:0.02em; }
        .bs-demo-flag { display:inline-block; margin-top:10px; font-size:11px; color:#0B2036; background:#F0A94E; padding:3px 10px; border-radius:100px; font-weight:600; }

        .bs-intent-band { max-width:1000px; margin:34px auto 0; background:#fff; border-radius:12px; padding:22px 26px; box-shadow:0 16px 40px rgba(0,0,0,0.18); text-align:left; }
        .bs-intent-band h3 { color:var(--ink); font-size:16px; margin-bottom:4px; }
        .bs-intent-band .sub { color:#647082; font-size:12.8px; margin-bottom:14px; }
        .bs-intent-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:10px; }
        .bs-intent-btn { display:flex; align-items:center; gap:9px; border:1px solid var(--line); background:var(--paper); border-radius:8px; padding:11px 13px; font-size:13.2px; font-weight:500; color:var(--slate); cursor:pointer; transition:border-color 0.15s ease, background 0.15s ease; text-align:left; }
        .bs-intent-btn:hover { border-color:var(--navy); background:#EEF0FA; }
        .bs-intent-key { width:20px; height:20px; border-radius:5px; background:var(--ink); color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .bs-intent-btn svg { color:var(--saffron); flex-shrink:0; }

        .bs-trending { max-width:1000px; margin:16px auto 0; display:flex; flex-wrap:wrap; gap:8px; align-items:center; font-size:12.5px; color:#C3CBD6; }
        .bs-trending .chip { border:1px solid rgba(255,255,255,0.25); color:#EAF0F5; padding:6px 12px; border-radius:100px; }

        .bs-below { max-width:1000px; margin:0 auto; padding:44px 24px 60px; }
        .bs-below h2 { color:var(--ink); font-size:22px; margin-bottom:6px; }
        .bs-below p.lede { color:#647082; font-size:14px; max-width:600px; margin-bottom:0; }
        .bs-btn { font-weight:600; font-size:14px; padding:11px 20px; border-radius:6px; border:1px solid var(--line); background:#fff; color:var(--ink); cursor:pointer; display:inline-flex; align-items:center; gap:8px; margin-top:16px; }
        .bs-btn:hover { border-color:var(--navy); }
      `}</style>

      <div className="bs-tricolour" />
      <div className="bs-utility">
        <a href="#main">Skip to main content</a>
        <span className="sep">|</span>
        <span>Demo Prototype · SIH 2026 · PS 26130</span>
        <div className="icons">
          <button className="icon-btn" onClick={() => setFontStep((s) => Math.max(0, s - 1))}><Type size={13} />A-</button>
          <button className="icon-btn" onClick={() => setFontStep((s) => Math.min(3, s + 1))}><Type size={15} />A+</button>
          <button className="icon-btn"><Accessibility size={14} /> Screen Reader</button>
          <button className="icon-btn"><Globe size={14} /> EN</button>
          <Link to="/signin" style={{ color: "#EAF0F5", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
          <Link to="/start" style={{ color: "#F0A94E", fontWeight: 600, textDecoration: "none" }}>Sign Up</Link>
        </div>
      </div>

      <header className="bs-hero" id="main">
        <div className="bs-mark-wrap"><div className="bs-mark-ring"><ChakraBeeMark /></div></div>
        <h1 className="bs-wordmark">Bee<span>Setu</span></h1>
        <div className="bs-underline" />
        <div className="bs-tagline">Unified Approval &amp; Compliance Platform — where every clearance converges</div>
        <div className="bs-demo-flag">Demo prototype — not an official government portal</div>

        <div className="bs-intent-band">
          <h3>What are you trying to do?</h3>
          <div className="sub">Pick one to jump straight to the relevant workflow.</div>
          <div className="bs-intent-grid">
            {INTENTS.map((it) => (
              <button key={it.key} className="bs-intent-btn" onClick={() => scrollTo("features")}>
                <span className="bs-intent-key">{it.key}</span>
                <it.icon size={16} />
                {it.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bs-trending">
          <span>Popular:</span>
          <span className="chip">Fire NOC</span>
          <span className="chip">Udyam Registration</span>
          <span className="chip">Pollution Consent</span>
          <span className="chip">Factory Licence</span>
          <span className="chip">GST Registration</span>
        </div>
      </header>

      <section className="bs-below" id="features">
        <h2>One profile. One intelligent approval journey.</h2>
        <p className="lede">
          BeeSetu builds a customised checklist for your business, checks it against
          your documents automatically, and routes it to every department at once —
          so approvals move in parallel, with a tamper-evident record of every step.
        </p>
        <button className="bs-btn">See how it works <ArrowRight size={15} /></button>
      </section>
    </div>
  );
}
