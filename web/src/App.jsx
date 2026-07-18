import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import LoadingSkeleton from "./components/LoadingSkeleton.jsx";

import HomePage from "./pages/HomePage.jsx";
import ClassifyPage from "./pages/ClassifyPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminModerationPage from "./pages/AdminModerationPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// recharts pulls in a large bundle — only load it for the page that needs it.
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));

function DashboardFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <LoadingSkeleton lines={6} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/check" element={<ClassifyPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<DashboardFallback />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/moderate"
              element={
                <AdminRoute>
                  <AdminModerationPage />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
