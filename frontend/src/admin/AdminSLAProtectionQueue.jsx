import React from "react";
import { AlertTriangle, Clock, Users, Activity, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminSLAProtectionQueue() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
          SLA Protection Queue
        </h1>
        <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>
          Dynamic priority queue based on SLA risk, processing feasibility, and fairness protection.
        </p>
      </div>

      {/* Active Protection Banner */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "16px 20px", borderRadius: 12,
        background: "linear-gradient(135deg, #B4342A10, #CC6D1D10)",
        border: "1px solid #B4342A30",
      }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#B4342A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldAlert size={20} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0B2036", marginBottom: 4 }}>
            ⚠ SLA Protection Active
          </div>
          <div style={{ fontSize: 14, color: "#1C2A36" }}>
            7 applications are currently projected to require priority attention based on SLA risk and current processing capacity.
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        {[
          { label: "Total Pending Applications", value: "42", icon: Activity, color: "#0F8B8D" },
          { label: "Applications at SLA Risk", value: "7", icon: AlertTriangle, color: "#CC6D1D" },
          { label: "Critical Applications", value: "2", icon: ShieldAlert, color: "#B4342A" },
          { label: "Current Processing Capacity", value: "32 hrs/day", icon: Clock, color: "#128807" },
          { label: "Average Processing Time", value: "5.4 hrs", icon: Users, color: "#0F8B8D" },
        ].map((card, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 12, padding: 20,
            border: "1px solid #DADFDA", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <card.icon size={24} color={card.color} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0B2036", fontFamily: "'Space Grotesk', sans-serif" }}>
                {card.value}
              </div>
              <div style={{ fontSize: 13, color: "#1C2A36", fontWeight: 500 }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Queue */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
            Dynamic Priority Queue
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#1C2A36" }}>
            <CheckCircle2 size={16} color="#128807" />
            <span>Fairness Protection Active</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Critical Risk */}
          <div style={{
            padding: 20, borderRadius: 12, border: "2px solid #B4342A",
            background: "#B4342A08", display: "flex", gap: 20, alignItems: "flex-start",
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#B4342A", flexShrink: 0, marginTop: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{
                  padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: "#B4342A", color: "#fff",
                }}>
                  🔴 CRITICAL RISK
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#0B2036", fontFamily: "monospace" }}>
                  BES-1042
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2036", marginBottom: 12 }}>
                MPCB Consent to Establish
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>SLA Remaining</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#B4342A" }}>3 hrs</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>Estimated Processing</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0B2036" }}>5 hrs</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>Slack</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#B4342A" }}>-2 hrs</div>
                </div>
              </div>
              <div style={{
                padding: "8px 12px", borderRadius: 8, background: "#B4342A15",
                fontSize: 13, fontWeight: 600, color: "#B4342A", display: "inline-block",
              }}>
                Immediate Processing Required
              </div>
            </div>
          </div>

          {/* High Risk */}
          <div style={{
            padding: 20, borderRadius: 12, border: "2px solid #CC6D1D",
            background: "#CC6D1D08", display: "flex", gap: 20, alignItems: "flex-start",
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#CC6D1D", flexShrink: 0, marginTop: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{
                  padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: "#CC6D1D", color: "#fff",
                }}>
                  🟠 HIGH RISK
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#0B2036", fontFamily: "monospace" }}>
                  BES-1087
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2036", marginBottom: 12 }}>
                Fire Provisional NOC
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>SLA Remaining</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#CC6D1D" }}>8 hrs</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>Estimated Processing</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0B2036" }}>6 hrs</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>Slack</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#CC6D1D" }}>+2 hrs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Medium Risk */}
          <div style={{
            padding: 20, borderRadius: 12, border: "2px solid #DAA520",
            background: "#DAA52008", display: "flex", gap: 20, alignItems: "flex-start",
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#DAA520", flexShrink: 0, marginTop: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{
                  padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: "#DAA520", color: "#fff",
                }}>
                  🟡 MEDIUM RISK
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#0B2036", fontFamily: "monospace" }}>
                  BES-1091
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2036", marginBottom: 12 }}>
                Factory Building Plan
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>SLA Remaining</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0B2036" }}>18 hrs</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>Estimated Processing</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0B2036" }}>5 hrs</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>Slack</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#128807" }}>+13 hrs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Normal */}
          <div style={{
            padding: 20, borderRadius: 12, border: "2px solid #128807",
            background: "#12880708", display: "flex", gap: 20, alignItems: "flex-start",
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#128807", flexShrink: 0, marginTop: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{
                  padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: "#128807", color: "#fff",
                }}>
                  🟢 NORMAL
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#0B2036", fontFamily: "monospace" }}>
                  BES-1102
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2036", marginBottom: 12 }}>
                Shop & Establishment
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>SLA Remaining</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0B2036" }}>2 days</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>Estimated Processing</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0B2036" }}>4 hrs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Change Explanation */}
      <div style={{
        padding: 16, borderRadius: 12, border: "1px solid #CC6D1D40",
        background: "#CC6D1D08", display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <AlertCircle size={20} color="#CC6D1D" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2036", marginBottom: 4 }}>
            Priority Change Reason
          </div>
          <div style={{ fontSize: 13, color: "#1C2A36" }}>
            BES-1042 surfaced because projected processing time exceeds remaining SLA.
          </div>
        </div>
      </div>

      {/* Blocked Application Example */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", padding: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
          Blocked Applications (Not Actionable)
        </h3>
        <div style={{
          padding: 20, borderRadius: 12, border: "2px solid #647082",
          background: "#64708208", display: "flex", gap: 20, alignItems: "flex-start",
        }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#647082", flexShrink: 0, marginTop: 6 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{
                padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: "#647082", color: "#fff",
              }}>
                🔴 CRITICAL — BLOCKED
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#0B2036", fontFamily: "monospace" }}>
                BES-1031
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>Reason</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#647082" }}>Awaiting inspection scheduling</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#1C2A36", marginBottom: 4 }}>Action</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#647082" }}>No immediate departmental processing available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fairness Protection Indicator */}
      <div style={{
        padding: 16, borderRadius: 12, border: "1px solid #12880740",
        background: "#12880708", display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <CheckCircle2 size={20} color="#128807" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2036", marginBottom: 4 }}>
            Fairness Protection
          </div>
          <div style={{ fontSize: 13, color: "#1C2A36" }}>
            Long-waiting applications receive increasing priority to prevent indefinite deferral.
          </div>
        </div>
      </div>
    </div>
  );
}
