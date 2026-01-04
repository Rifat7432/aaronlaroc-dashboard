import "./App.css";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import SupportPage from "./pages/SupportPage";
import AnalyticsPage from "./pages/AnalyticsPage";
// import CorporatePage from "./pages/CorporatePage";
import AllUsers from "./pages/AllUsersPage";
import ReportsPage from "./pages/ReportsPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  return (
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
          {/* <Route path="corporate" element={<CorporatePage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
