import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Home, PlusCircle, ClipboardList, Map, Bell, User, CheckSquare, BarChart3 } from 'lucide-react';

export default function BottomNav() {
    const { user, isCitizen, isWorker, isAuthority } = useAuth();
    const { unreadCount } = useNotifications();

    if (!user) return null;

    return (
        <nav className="bottom-nav">
            {isCitizen && (
                <>
                    <NavLink to="/citizen/dashboard">
                        <Home size={18} />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/citizen/report">
                        <PlusCircle size={18} />
                        <span>Report</span>
                    </NavLink>
                    <NavLink to="/citizen/complaints">
                        <ClipboardList size={18} />
                        <span>Reports</span>
                    </NavLink>
                </>
            )}

            {isWorker && (
                <>
                    <NavLink to="/worker/dashboard">
                        <CheckSquare size={18} />
                        <span>Tasks</span>
                    </NavLink>
                </>
            )}

            {isAuthority && (
                <>
                    <NavLink to="/authority/dashboard">
                        <Home size={18} />
                        <span>Dash</span>
                    </NavLink>
                    <NavLink to="/authority/map">
                        <Map size={18} />
                        <span>Map</span>
                    </NavLink>
                    <NavLink to="/authority/analytics">
                        <BarChart3 size={18} />
                        <span>Trends</span>
                    </NavLink>
                </>
            )}

            <NavLink to="/notifications" style={{ position: 'relative' }}>
                <Bell size={18} />
                <span>Alerts</span>
                {unreadCount > 0 && (
                    <span className="badge-counter" style={{ position: 'absolute', top: 2, right: 12 }}>
                        {unreadCount}
                    </span>
                )}
            </NavLink>

            <NavLink to="/profile">
                <User size={18} />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
}
