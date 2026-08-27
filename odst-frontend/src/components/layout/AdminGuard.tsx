import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // Redirect to login if token is missing
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default AdminGuard;
