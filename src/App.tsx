import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import type { Session } from "@supabase/supabase-js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CreaturesPage from "./pages/CreaturesPage";
import CreatureDetailPage from "./pages/CreatureDetailPage";
import ShamansHealersPage from "./pages/shamanHealersPage";
import ShamanDetailPage from "./pages/ShamanDetailPage";
import StoriesPage from "./pages/StoriesPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import RegionsPage from "./pages/RegionsPage";
import RegionDetailPage from "./pages/RegionDetailPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./components/Login";
import Register from "./components/Register";
import StorySubmission from "./components/StorySubmission";
import AdminPanel from "./components/AdminPanel";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import WriterDashboardPage from "./pages/WriterDashboardPage";
import MonetizationGuidelines from "./pages/MonetizationGuidelines";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

// ScrollToTop component that will handle smooth scroll behavior
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This enables smooth scrolling
    });
  }, [pathname]);

  return null;
}

function DashboardRouter({ session }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    setLoading(true);
    supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        setRole(data?.role);
        setLoading(false);
      });
  }, [session]);

  if (!session?.user) return <Navigate to="/login" />;
  if (loading)
    return (
      <div className="text-center text-gray-300 py-12">
        Loading dashboard...
      </div>
    );
  if (role === "admin") return <AdminDashboardPage />;
  return <WriterDashboardPage />;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    // Set initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          element={
            <Layout
              user={(session?.user as any) || null}
              onLogout={async () => {
                await supabase.auth.signOut();
                setSession(null);
              }}
            />
          }
        >
          <Route
            path="/login"
            element={!session ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!session ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/submit"
            element={
              session ? (
                <StorySubmission session={session} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* You can update admin logic later if needed */}
          <Route
            path="/admin"
            element={
              session?.user?.user_metadata?.is_admin ? (
                <AdminPanel user={session.user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/" element={<HomePage />} />
          <Route path="/creatures" element={<CreaturesPage />} />
          <Route path="/creatures/:id" element={<CreatureDetailPage />} />
          <Route path="/shamans-healers" element={<ShamansHealersPage />} />
          <Route path="/shamans-healers/:id" element={<ShamanDetailPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:id" element={<StoryDetailPage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="/regions/:id" element={<RegionDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/termsofservice" element={<TermsOfService />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/change-password"
            element={
              session ? <ChangePasswordPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/monetization-guidelines"
            element={<MonetizationGuidelines />}
          />
          <Route path="/writer" element={<WriterDashboardPage />} />
          <Route
            path="/dashboard"
            element={<DashboardRouter session={session} />}
          />
          <Route
            path="/admin-dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

// Admin dashboard route protection
function AdminDashboardRoute({ session }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    setLoading(true);
    supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        setRole(data?.role);
        setLoading(false);
      });
  }, [session]);

  if (!session?.user) return <Navigate to="/login" />;
  if (loading)
    return (
      <div className="text-center text-gray-300 py-12">
        Loading dashboard...
      </div>
    );
  if (role === "admin") return <AdminDashboardPage />;
  return <Navigate to="/dashboard" />;
}

export default App;
