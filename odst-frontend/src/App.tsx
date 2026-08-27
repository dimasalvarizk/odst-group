import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

// A simple PrivateRoute component to protect the admin dashboard
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  return token ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

// App component managing client-side routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        {/* Redirect /admin to dashboard if logged in, otherwise to login */}
        <Route 
          path="/admin" 
          element={
            localStorage.getItem('adminToken') ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
