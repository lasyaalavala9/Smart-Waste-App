import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading, getDashboardPath } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <main className="page">
                <LoadingSpinner message="Checking authentication session..." />
            </main>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User is authenticated but doesn't have required role for this route
        return <Navigate to={getDashboardPath(user.role)} replace />;
    }

    return children;
}
