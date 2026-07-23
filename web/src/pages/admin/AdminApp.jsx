import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminAnalytics from "./AdminAnalytics.jsx";
import AdminModeration from "./AdminModeration.jsx";
import AdminReports from "./AdminReports.jsx";
import AdminFeedback from "./AdminFeedback.jsx";
import AdminDataset from "./AdminDataset.jsx";
import AdminAnnotation from "./AdminAnnotation.jsx";
import AdminModels from "./AdminModels.jsx";
import AdminEvaluation from "./AdminEvaluation.jsx";
import AdminExplainability from "./AdminExplainability.jsx";
import { AdminCategories, AdminAlerts, AdminArticles, AdminQuiz } from "./AdminContent.jsx";
import AdminUsers from "./AdminUsers.jsx";
import AdminSupport from "./AdminSupport.jsx";
import AdminSystem from "./AdminSystem.jsx";
import AdminSettings from "./AdminSettings.jsx";
import NotFoundPage from "../public/StatusPages.jsx";

/**
 * The entire admin portal, isolated in one module so it (and its heavy chart
 * dependency, recharts) code-splits into a lazy chunk that only loads when an
 * admin actually visits /admin/* — keeping the public + user bundle lean.
 * Mounted at /admin/* in App.jsx, so these paths are relative.
 */
export default function AdminApp() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="moderation" element={<AdminModeration />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="feedback" element={<AdminFeedback />} />
        <Route path="dataset" element={<AdminDataset />} />
        <Route path="annotation" element={<AdminAnnotation />} />
        <Route path="models" element={<AdminModels />} />
        <Route path="evaluation" element={<AdminEvaluation />} />
        <Route path="explainability" element={<AdminExplainability />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="alerts" element={<AdminAlerts />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="quiz" element={<AdminQuiz />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="system" element={<AdminSystem />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
