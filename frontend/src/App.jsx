import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import BottomNav from './components/common/BottomNav';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import Splash from './pages/Splash';
import RoleSelect from './pages/RoleSelect';
import Login from './pages/Login';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportWaste from './pages/citizen/ReportWaste';
import ComplaintsList from './pages/citizen/ComplaintsList';

// Worker Pages
import WorkerDashboard from './pages/worker/WorkerDashboard';
import TaskDetails from './pages/worker/TaskDetails';

// Authority Pages
import AuthorityDashboard from './pages/authority/AuthorityDashboard';
import AuthorityMap from './pages/authority/AuthorityMap';
import Analytics from './pages/authority/Analytics';
import RecyclingUnit from './pages/authority/RecyclingUnit';

// Shared Pages
import NotificationsPage from './pages/shared/NotificationsPage';
import ProfilePage from './pages/shared/ProfilePage';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <NotificationProvider>
                    <div className="app">
                        <Navbar />

                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Splash />} />
                            <Route path="/role" element={<RoleSelect />} />
                            <Route path="/login" element={<Login />} />

                            {/* Citizen Routes */}
                            <Route
                                path="/citizen/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_CITIZEN', 'ROLE_AUTHORITY']}>
                                        <CitizenDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/citizen/report"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_CITIZEN', 'ROLE_AUTHORITY']}>
                                        <ReportWaste />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/citizen/complaints"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_CITIZEN', 'ROLE_AUTHORITY']}>
                                        <ComplaintsList />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Worker Routes */}
                            <Route
                                path="/worker/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_WORKER', 'ROLE_AUTHORITY']}>
                                        <WorkerDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/worker/task/:id"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_WORKER', 'ROLE_AUTHORITY']}>
                                        <TaskDetails />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Authority Routes */}
                            <Route
                                path="/authority/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_AUTHORITY']}>
                                        <AuthorityDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/authority/map"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_AUTHORITY']}>
                                        <AuthorityMap />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/authority/analytics"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_AUTHORITY']}>
                                        <Analytics />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/authority/recycling"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_AUTHORITY']}>
                                        <RecyclingUnit />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Shared Protected Routes */}
                            <Route
                                path="/notifications"
                                element={
                                    <ProtectedRoute>
                                        <NotificationsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>

                        <footer className="footer">
                            Smart Waste Management System • Clean Today, Greener Tomorrow © 2026
                        </footer>

                        <BottomNav />
                    </div>
                </NotificationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
