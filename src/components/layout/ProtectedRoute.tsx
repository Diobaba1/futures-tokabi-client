// src/components/layout/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireStaff?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireStaff = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If requireAuth is false (login/register pages), redirect authenticated users to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If requireAuth is true and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If requireStaff is true, check if user has staff or admin privileges
  if (requireStaff && isAuthenticated && user) {
    const isStaffOrAdmin = user.is_staff || user.is_admin;
    
    if (!isStaffOrAdmin) {
      // Redirect non-staff users to dashboard with an error state
      return (
        <Navigate 
          to="/dashboard" 
          state={{ 
            error: "You do not have permission to access this page.",
            from: location 
          }} 
          replace 
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;