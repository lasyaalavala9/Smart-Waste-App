import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
    Bell, 
    LogOut, 
    User, 
    Home, 
    PlusCircle, 
    ClipboardList, 
    Map, 
    BarChart3, 
    Recycle, 
    CheckSquare
} from 'lucide-react';

export default function Navbar() {
    const { user, logout, isCitizen, isWorker, isAuthority } = useAuth();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();

    // If on splash, role select, or login page, render public navbar or nothing
    const isPublicPage = ['/', '/role', '/login'].includes(location.pathname);

    if (isPublicPage) {
        return (
            <header className="top">
                <div className="brand" onClick={() => navigate('/')}>
                    <span className="brand-icon">♻️</span>
                    <div>
                        <h1>Smart Waste</h1>
                        <p>Clean Today, Greener Tomorrow</p>
                    </div>
                </div>
                <div className="nav">
                    {location.pathname !== '/' && (
                        <NavLink to="/">Home</NavLink>
                    )}
                    {location.pathname !== '/role' && (
                        <NavLink to="/role">Roles</NavLink>
                    )}
                    {location.pathname !== '/login' && (
                        <NavLink to="/login">Login</NavLink>
                    )}
                </div>
            </header>
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="top">
            <div className="brand" onClick={() => navigate(user?.role === 'ROLE_CITIZEN' ? '/citizen/dashboard' : user?.role === 'ROLE_WORKER' ? '/worker/dashboard' : '/authority/dashboard')}>
                <span className="brand-icon">
                    {isCitizen ? '♻️' : isWorker ? '🚶' : '🏛️'}
                </span>
                <div>
                    <h1>
                        {isCitizen ? 'Citizen Dashboard' : isWorker ? 'Worker Dashboard' : 'Municipal Authority'}
                    </h1>
                    <p>
                        {isCitizen ? 'Clean Today, Greener Tomorrow' : isWorker ? 'Sanitation Operations' : 'City-wide monitoring & control'}
                    </p>
                </div>
            </div>

            <nav className="nav">
                {isCitizen && (
                    <>
                        <NavLink to="/citizen/dashboard" end>
                            <Home size={15} /> Home
                        </NavLink>
                        <NavLink to="/citizen/report">
                            <PlusCircle size={15} /> Report
                        </NavLink>
                        <NavLink to="/citizen/complaints">
                            <ClipboardList size={15} /> Complaints
                        </NavLink>
                    </>
                )}

                {isWorker && (
                    <>
                        <NavLink to="/worker/dashboard" end>
                            <CheckSquare size={15} /> Tasks
                        </NavLink>
                    </>
                )}

                {isAuthority && (
                    <>
                        <NavLink to="/authority/dashboard" end>
                            <Home size={15} /> Dashboard
                        </NavLink>
                        <NavLink to="/authority/map">
                            <Map size={15} /> Map
                        </NavLink>
                        <NavLink to="/authority/analytics">
                            <BarChart3 size={15} /> Analytics
                        </NavLink>
                        <NavLink to="/authority/recycling">
                            <Recycle size={15} /> Recycling
                        </NavLink>
                    </>
                )}

                {/* Notifications Link */}
                <NavLink to="/notifications" style={{ position: 'relative' }}>
                    <Bell size={15} /> Notifications
                    {unreadCount > 0 && (
                        <span className="badge-counter">{unreadCount}</span>
                    )}
                </NavLink>

                {/* Profile Link */}
                <NavLink to="/profile">
                    <User size={15} /> Profile
                </NavLink>

                {/* Logout Button */}
                <button 
                    onClick={handleLogout}
                    title="Log out"
                    style={{ background: 'rgba(217, 75, 75, 0.25)', borderColor: 'rgba(217, 75, 75, 0.4)' }}
                >
                    <LogOut size={15} />
                </button>
            </nav>
        </header>
    );
}
