import React from "react";
import { Users, Shield, UserPlus, Search } from "lucide-react";

export default function AdminUsers() {
  const users = [
    { name: "Amit Joshi", role: "Chief Nodal Officer", dept: "All Departments", status: "Active", lastLogin: "Today, 10:45 AM" },
    { name: "Vikram Deshmukh", role: "Department Officer", dept: "Industry & Labour", status: "Active", lastLogin: "Today, 09:12 AM" },
    { name: "Sunita Patil", role: "Department Officer", dept: "Urban Dev", status: "Active", lastLogin: "Yesterday, 4:30 PM" },
    { name: "Dr. Anand Kulkarni", role: "Nodal Officer", dept: "Pollution Control", status: "Inactive", lastLogin: "12 Sep 2026" },
    { name: "System Admin", role: "Super Admin", dept: "IT Services", status: "Active", lastLogin: "Today, 08:00 AM" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: 28, fontFamily: "'Space Grotesk', sans-serif", color: "#0B2036" }}>Role-Based Access Control</h1>
          <p style={{ margin: 0, color: "#1C2A36", fontSize: 15 }}>Manage platform users, officers, and administrative privileges.</p>
        </div>
        <button style={{ 
          background: "#0F8B8D", color: "#fff", border: "none", padding: "10px 20px", 
          borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8
        }}>
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DADFDA", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #DADFDA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ 
            display: "flex", alignItems: "center", gap: 8, background: "#F5F6F3", 
            border: "1px solid #DADFDA", borderRadius: 8, padding: "8px 16px", width: 300 
          }}>
            <Search size={16} color="#1C2A36" />
            <input type="text" placeholder="Search users by name or role..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, width: "100%" }} />
          </div>
        </div>
        
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F5F6F3" }}>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>User Name</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Role</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Department Scope</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Status</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA" }}>Last Login</th>
              <th style={{ padding: "16px 24px", color: "#1C2A36", fontSize: 13, fontWeight: 600, borderBottom: "1px solid #DADFDA", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} style={{ borderBottom: i < users.length - 1 ? "1px solid #DADFDA" : "none" }}>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0B2036", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold" }}>
                      {user.name.charAt(0)}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2036" }}>{user.name}</div>
                  </div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#1C2A36" }}>
                    <Shield size={16} color={user.role.includes("Admin") || user.role.includes("Chief") ? "#0F8B8D" : "#CC6D1D"} />
                    {user.role}
                  </div>
                </td>
                <td style={{ padding: "20px 24px", fontSize: 14, color: "#1C2A36" }}>{user.dept}</td>
                <td style={{ padding: "20px 24px" }}>
                  <span style={{ 
                    padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    backgroundColor: user.status === "Active" ? "#12880715" : "#1C2A3615",
                    color: user.status === "Active" ? "#128807" : "#1C2A36",
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: "20px 24px", fontSize: 13, color: "#1C2A36" }}>{user.lastLogin}</td>
                <td style={{ padding: "20px 24px", textAlign: "right" }}>
                  <button style={{ color: "#0F8B8D", background: "none", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Edit Role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
