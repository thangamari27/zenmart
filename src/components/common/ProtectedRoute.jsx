// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires admin access but user is not admin
  if (adminOnly && !user.isAdmin) {
    // Redirect non-admin users to customer dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Check if admin is trying to access customer dashboard
  const isCustomerDashboard = location.pathname === '/dashboard';
  if (isCustomerDashboard && user.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Check if customer is trying to access admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;