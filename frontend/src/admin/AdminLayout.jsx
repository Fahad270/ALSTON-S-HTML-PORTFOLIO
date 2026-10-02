import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FileSignature,
  Scale,
  Clock,
  ShieldAlert,
  Users,
  Settings,
  LogOut,
  Bell,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { adminApi } from "../api/adminApi.js";
import { Modal } from "./AdminUI.jsx";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    adminApi.listNotifications()
      .then((data) => {
        setNotifications(data.items || []);
        setNotifCount((data.items || []).filter((n) => !n.read).length);
      })
      .catch(() => {});
  }, [pathname]);

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Applications", path: "/admin/applications", icon: FileSignature },
    { label: "Departments", path: "/admin/departments", icon: Building2 },
    { label: "Rules Engine", path: "/admin/rules", icon: Scale },
    { label: "SLA Monitor", path: "/admin/sla", icon: Clock },
    { label: "SLA Protection", path: "/admin/sla-protection", icon: AlertTriangle },
    { label: "Escalations", path: "/admin/escalations", icon: ShieldAlert },
    { label: "PRAGATI RESOLVE", path: "/admin/resolve", icon: CheckCircle2 },
    { label: "Users & Roles", path: "/admin/users", icon: Users },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F5F6F3", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ 
        width: 260, 
        backgroundColor: "#0B2036", 
        color: "white",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 15px rgba(0,0,0,0.1)"
      }}>
        {/* Brand */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #CC6D1D, #128807)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 18 }}>B</div>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.5 }}>PragatiSetu Admin</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: "#9FB0C2", fontWeight: 500, letterSpacing: 0.5 }}>STATE ADMINISTRATION CONSOLE</div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "24px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: 8,
                  textDecoration: "none",
                  color: isActive ? "#fff" : "#9FB0C2",
                  backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#9FB0C2";
                  }
                }}
              >
                <item.icon size={18} style={{ color: isActive ? "#CC6D1D" : "inherit" }} />
                <span style={{ fontSize: 14 }}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div style={{ padding: "20px 12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 16px", borderRadius: 8,
            color: "#9FB0C2", background: "none", border: "none",
            width: "100%", textAlign: "left", cursor: "pointer",
            fontSize: 14
          }}>
            <Settings size={18} /> Settings
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 16px", borderRadius: 8,
            color: "#B4342A", background: "none", border: "none",
            width: "100%", textAlign: "left", cursor: "pointer",
            fontSize: 14, marginTop: 4
          }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        
        {/* Top Header */}
        <header style={{ 
          height: 70, backgroundColor: "#fff", borderBottom: "1px solid #DADFDA",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px", zIndex: 10
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>
              Right to Service Act (2015) Compliance
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setShowNotifs(true)}>
              <Bell size={20} color="#1C2A36" />
              {notifCount > 0 && (
                <span style={{ 
                  position: "absolute", top: -4, right: -4, background: "#B4342A", 
                  color: "#fff", fontSize: 10, fontWeight: "bold", 
                  width: 16, height: 16, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>{notifCount}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, borderLeft: "1px solid #DADFDA", paddingLeft: 24 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2036" }}>Amit Joshi</div>
                <div style={{ fontSize: 12, color: "#1C2A36" }}>Chief Nodal Officer</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#CC6D1D", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 16 }}>
                AJ
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
          <Outlet />
        </div>
      </main>

      {showNotifs && (
        <Modal title="Notifications" onClose={() => setShowNotifs(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notifications.map((n) => (
              <div key={n.id} style={{ padding: 14, borderRadius: 8, border: "1px solid #DADFDA", background: n.read ? "#fff" : "#F5F6F3" }}>
                <div style={{ fontWeight: 600, color: "#0B2036", fontSize: 14 }}>{n.title}</div>
                <div style={{ color: "#1C2A36", fontSize: 13, marginTop: 4 }}>{n.body}</div>
              </div>
            ))}
            {notifications.length === 0 && <div style={{ color: "#1C2A36" }}>No notifications.</div>}
          </div>
        </Modal>
      )}
    </div>
  );
}
