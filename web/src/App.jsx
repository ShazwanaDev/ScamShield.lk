import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { ToastProvider, Spinner } from "./ui/index.js";
import SmoothScroll from "./components/SmoothScroll.jsx";
import ReportQueueSync from "./components/ReportQueueSync.jsx";

import PublicLayout from "./layouts/PublicLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

// Public pages
import LandingPage from "./pages/public/LandingPage.jsx";
import CheckPage from "./pages/public/CheckPage.jsx";
import ReportPage from "./pages/public/ReportPage.jsx";
import HowItWorksPage from "./pages/public/HowItWorksPage.jsx";
import FeaturesPage from "./pages/public/FeaturesPage.jsx";
import LanguagesPage from "./pages/public/LanguagesPage.jsx";
import ResearchPage from "./pages/public/ResearchPage.jsx";
import ScamTypesPage from "./pages/public/ScamTypesPage.jsx";
import ScamTypeDetailPage from "./pages/public/ScamTypeDetailPage.jsx";
import AlertsPage from "./pages/public/AlertsPage.jsx";
import AlertDetailPage from "./pages/public/AlertDetailPage.jsx";
import AwarenessPage from "./pages/public/AwarenessPage.jsx";
import ArticleDetailPage from "./pages/public/ArticleDetailPage.jsx";
import QuizPage from "./pages/public/QuizPage.jsx";
import AboutPage from "./pages/public/AboutPage.jsx";
import ContactPage from "./pages/public/ContactPage.jsx";
import FaqPage from "./pages/public/FaqPage.jsx";
import HelpPage from "./pages/public/HelpPage.jsx";
import { PrivacyPage, TermsPage } from "./pages/public/LegalPages.jsx";
import NotFoundPage, { ServerErrorPage, MaintenancePage, OfflinePage } from "./pages/public/StatusPages.jsx";

// Auth pages
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import {
  ForgotPasswordPage,
  ResetPasswordPage,
  OtpPage,
  VerifyEmailPage,
  AccountCreatedPage,
} from "./pages/auth/AuthFlowPages.jsx";

// User portal
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import AppDashboard from "./pages/app/AppDashboard.jsx";
import AppCheck from "./pages/app/AppCheck.jsx";
import AppHistory from "./pages/app/AppHistory.jsx";
import AppHistoryDetail from "./pages/app/AppHistoryDetail.jsx";
import AppReports from "./pages/app/AppReports.jsx";
import AppReportNew from "./pages/app/AppReportNew.jsx";
import AppReportDetail from "./pages/app/AppReportDetail.jsx";
import AppAlerts from "./pages/app/AppAlerts.jsx";
import AppAwareness from "./pages/app/AppAwareness.jsx";
import AppNotifications from "./pages/app/AppNotifications.jsx";
import AppProfile from "./pages/app/AppProfile.jsx";
import AppSettings from "./pages/app/AppSettings.jsx";

// Admin portal — code-split into a lazy chunk (keeps recharts out of the
// public/user bundle; only loads when an admin visits /admin/*).
import AdminRoute from "./components/AdminRoute.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
const AdminApp = lazy(() => import("./pages/admin/AdminApp.jsx"));

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll />
      <AuthProvider>
        <ToastProvider>
          <ReportQueueSync />
          <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/check" element={<CheckPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/languages" element={<LanguagesPage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/scam-types" element={<ScamTypesPage />} />
              <Route path="/scam-types/:slug" element={<ScamTypeDetailPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/alerts/:id" element={<AlertDetailPage />} />
              <Route path="/awareness" element={<AwarenessPage />} />
              <Route path="/awareness/:slug" element={<ArticleDetailPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/500" element={<ServerErrorPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/offline" element={<OfflinePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Auth */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-otp" element={<OtpPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/account-created" element={<AccountCreatedPage />} />
            </Route>

            {/* User portal (auth-gated) */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/app" element={<AppDashboard />} />
              <Route path="/app/check" element={<AppCheck />} />
              <Route path="/app/history" element={<AppHistory />} />
              <Route path="/app/history/:id" element={<AppHistoryDetail />} />
              <Route path="/app/reports" element={<AppReports />} />
              <Route path="/app/reports/new" element={<AppReportNew />} />
              <Route path="/app/reports/:id" element={<AppReportDetail />} />
              <Route path="/app/alerts" element={<AppAlerts />} />
              <Route path="/app/alerts/:id" element={<AlertDetailPage />} />
              <Route path="/app/awareness" element={<AppAwareness />} />
              <Route path="/app/awareness/:slug" element={<ArticleDetailPage />} />
              <Route path="/app/notifications" element={<AppNotifications />} />
              <Route path="/app/profile" element={<AppProfile />} />
              <Route path="/app/settings" element={<AppSettings />} />
            </Route>

            {/* Admin login (standalone, full-screen, ungated) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin portal (admin-gated, lazy) */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner /></div>}>
                    <AdminApp />
                  </Suspense>
                </AdminRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
