import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Bell, CheckCheck, Clock, CheckCircle2, Award, AlertCircle, ArrowRight } from 'lucide-react';

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
    const { isCitizen, isWorker, isAuthority } = useAuth();
    const navigate = useNavigate();

    const getIconForType = (type) => {
        switch (type) {
            case 'TASK_COMPLETED':
                return <CheckCircle2 size={20} color="var(--green)" />;
            case 'ECO_POINTS_AWARDED':
                return <Award size={20} color="#e9a43a" />;
            case 'COMPLAINT_SUBMITTED':
            case 'COMPLAINT_ASSIGNED':
                return <Bell size={20} color="var(--blue)" />;
            default:
                return <AlertCircle size={20} color="var(--green)" />;
        }
    };

    const handleNotificationClick = (n) => {
        if (!n.read) {
            markAsRead(n.id);
        }
        if (n.referenceType === 'COMPLAINT') {
            if (isCitizen) navigate('/citizen/complaints');
            else if (isAuthority) navigate('/authority/dashboard');
        } else if (n.referenceType === 'TASK') {
            if (isWorker) navigate(`/worker/task/${n.referenceId}`);
            else if (isAuthority) navigate('/authority/dashboard');
        }
    };

    return (
        <main className="page">
            <div className="page-title">
                <div>
                    <div className="kicker">Updates</div>
                    <h2>Notifications</h2>
                    <p>Your latest Smart Waste activity feeds, assignments, and resolution alerts.</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        className="btn light"
                        onClick={markAllAsRead}
                        style={{ fontSize: '13px' }}
                    >
                        <CheckCheck size={16} /> Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <LoadingSpinner message="Fetching notifications..." />
            ) : notifications.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '38px', marginBottom: '8px' }}>🔔</div>
                    <h3>All caught up!</h3>
                    <p>You have no notifications right now.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            className="card"
                            onClick={() => handleNotificationClick(n)}
                            style={{
                                cursor: 'pointer',
                                background: n.read ? '#fff' : '#f0f9f2',
                                borderLeft: n.read ? '1px solid var(--line)' : '4px solid var(--green)',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '16px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                                <div style={{ marginTop: '2px' }}>
                                    {getIconForType(n.type)}
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px', color: '#1c4f2a', fontSize: '15px' }}>
                                        {n.title}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>
                                        {n.message}
                                    </p>
                                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={11} />
                                        {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {!n.read && (
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }} />
                                )}
                                <ArrowRight size={16} color="var(--muted)" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
