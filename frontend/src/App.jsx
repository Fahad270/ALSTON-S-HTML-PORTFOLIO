import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import IdentityGate from "./pages/IdentityGate.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import DigiLockerMock from "./pages/DigiLockerMock.jsx";
import DocumentSourceChoice from "./pages/DocumentSourceChoice.jsx";
import EntityLockerMock from "./pages/EntityLockerMock.jsx";
import BusinessProfileForm from "./pages/BusinessProfileForm.jsx";
import ApplicationTracker from "./pages/ApplicationTracker.jsx";

// Admin Imports
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminDepartments from "./admin/AdminDepartments.jsx";
import AdminRules from "./admin/AdminRules.jsx";
import AdminApplications from "./admin/AdminApplications.jsx";
import AdminSLAMonitor from "./admin/AdminSLAMonitor.jsx";
import AdminEscalations from "./admin/AdminEscalations.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";
import AdminSLAProtectionQueue from "./admin/AdminSLAProtectionQueue.jsx";
import AdminResolveDashboard from "./admin/AdminResolveDashboard.jsx";
import AdminResolveIssueDetail from "./admin/AdminResolveIssueDetail.jsx";
import AdminResolveKnowledgeBase from "./admin/AdminResolveKnowledgeBase.jsx";

// Small dev-only nav so every page is reachable without a real backend yet.
function DevNav() {
  const { pathname } = useLocation();
  const links = [
    { to: "/", label: "Landing" },
    { to: "/start", label: "Identity Gate" },
    { to: "/digilocker", label: "DigiLocker" },
    { to: "/signup", label: "Manual Sign Up" },
    { to: "/signin", label: "Sign In" },
    { to: "/document-source", label: "Doc Source" },
    { to: "/entitylocker", label: "EntityLocker" },
    { to: "/business-profile", label: "Business Profile" },
    { to: "/tracker", label: "Application Tracker" },
    { to: "/admin", label: "System Admin" },
    { to: "/admin/sla-protection", label: "SLA Protection" },
    { to: "/admin/resolve", label: "PRAGATI RESOLVE" },
  ];
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      display: "flex", gap: 10, padding: "8px 14px", background: "#0B2036",
      fontFamily: "IBM Plex Sans, sans-serif", fontSize: 11.5, overflowX: "auto", whiteSpace: "nowrap",
    }}>
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          style={{
            color: pathname === l.to ? "#fff" : "#9FB0C2",
            fontWeight: pathname === l.to ? 600 : 400,
            textDecoration: "none",
          }}
        >
          {l.label}
        </Link>
      ))}
      <span style={{ color: "#647082", marginLeft: "auto" }}>PragatiSetu — dev preview nav</span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DevNav />
      <div style={{ paddingTop: 34 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/start" element={<IdentityGate />} />
          <Route path="/digilocker" element={<DigiLockerMock />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/document-source" element={<DocumentSourceChoice />} />
          <Route path="/entitylocker" element={<EntityLockerMock />} />
          <Route path="/business-profile" element={<BusinessProfileForm />} />
          <Route path="/tracker" element={<ApplicationTracker />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="departments" element={<AdminDepartments />} />
            <Route path="rules" element={<AdminRules />} />
            <Route path="sla" element={<AdminSLAMonitor />} />
            <Route path="sla-protection" element={<AdminSLAProtectionQueue />} />
            <Route path="escalations" element={<AdminEscalations />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="resolve" element={<AdminResolveDashboard />} />
            <Route path="resolve/issue/:id" element={<AdminResolveIssueDetail />} />
            <Route path="resolve/knowledge-base" element={<AdminResolveKnowledgeBase />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
