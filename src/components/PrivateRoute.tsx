
// PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // You can also check for token
  // const token = localStorage.getItem('token');
  // const isAuthenticated = !!token;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children if provided, otherwise render Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;


// ============================================
// Alternative: PrivateRoute with role-based access
// ============================================

interface PrivateRouteWithRoleProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

export const PrivateRouteWithRole: React.FC<PrivateRouteWithRoleProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};