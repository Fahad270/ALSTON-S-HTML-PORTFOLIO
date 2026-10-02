import React from "react";

export function LoadingBlock({ label = "Loading…" }) {
  return (
    <div style={{ padding: 48, textAlign: "center", color: "#1C2A36", fontSize: 15 }}>
      {label}
    </div>
  );
}

export function ErrorBlock({ message, onRetry }) {
  return (
    <div style={{
      padding: 24, borderRadius: 12, border: "1px solid #B4342A40", background: "#B4342A08",
      color: "#B4342A", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
    }}>
      <span>{message || "Failed to load data from the admin API."}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "#B4342A", color: "#fff", border: "none", padding: "8px 14px",
            borderRadius: 8, fontWeight: 600, cursor: "pointer",
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function Modal({ title, onClose, children, width = 560 }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(11,32,54,0.45)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 12, width: "100%", maxWidth: width,
          maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid #DADFDA",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#1C2A36" }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
