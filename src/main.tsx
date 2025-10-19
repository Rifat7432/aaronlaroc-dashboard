import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import SupportPage from "./pages/SupportPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CorporatePage from "./pages/CorporatePage";
import AllUsers from "./pages/AllUsersPage";
import ReportsPage from "./pages/ReportsPage";
import PrivateRoute from "./components/PrivateRoute";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="corporate" element={<CorporatePage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
