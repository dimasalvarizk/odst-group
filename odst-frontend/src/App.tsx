import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Preloader from './components/ui/Preloader.tsx';

// Code-split pages for high-performance lazy loading
const LandingPage = lazy(() => import('./pages/LandingPage.tsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.tsx'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage.tsx'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.tsx'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage.tsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.tsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.tsx'));

// A simple PrivateRoute component to protect the admin dashboard
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  return token ? <>{children}</> : <Navigate to="/internal-odst-gate" replace />;
};

// App component managing client-side routing
function App() {
  return (
    <Router>
      <Preloader transitionDuration={380} />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          {/* Secret Admin Gate */}
          <Route path="/internal-odst-gate" element={<AdminLogin />} />
          <Route
            path="/internal-odst-gate/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Trap/Redirect any old /admin requests back to Home */}
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
