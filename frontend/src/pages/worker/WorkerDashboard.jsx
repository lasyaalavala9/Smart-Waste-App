import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { workerApi } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Navigation, ArrowRight, MapPin, CheckSquare, Clock } from 'lucide-react';

export default function WorkerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        workerApi.getMyTasks()
            .then(data => setTasks(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const pendingTasks = tasks.filter(t => t.status === 'ASSIGNED').length;

    const openNavigation = (lat, lng) => {
        if (!lat || !lng) return;
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    return (
        <main className="page">
            <div className="page-title">
                <div>
                    <div className="kicker">Sanitation Worker</div>
                    <h2>Tasks Near You</h2>
                    <p>Assigned routes for {user?.fullName} ({user?.assignedZone || 'Sector 5'}). Complete collections to keep the city clean.</p>
                </div>
            </div>

            {/* Stat Counters matching worker-dashboard.html */}
            <div className="grid3" style={{ marginBottom: '22px' }}>
                <div className="card">
                    <div className="label">Tasks Today</div>
                    <div className="stat">{totalTasks}</div>
                    <p>Total collection jobs assigned.</p>
                </div>

                <div className="card">
                    <div className="label">In Progress</div>
                    <div className="stat" style={{ color: 'var(--purple)' }}>{inProgressTasks}</div>
                    <p>Active tasks on field right now.</p>
                </div>

                <div className="card">
                    <div className="label">Completed</div>
                    <div className="stat" style={{ color: 'var(--green2)' }}>{completedTasks}</div>
                    <p>{pendingTasks} pending pickup jobs.</p>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner message="Fetching assigned sanitation tasks..." />
            ) : tasks.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '38px', marginBottom: '8px' }}>🎉</div>
                    <h3>No pending tasks!</h3>
                    <p>You have no pending waste collection assignments at this moment.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {tasks.map(task => {
                        const complaint = task.complaint;
                        return (
                            <div key={task.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                <div style={{ flex: 1, minWidth: '260px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <span className="kicker" style={{ margin: 0 }}>
                                            Task #{complaint?.complaintCode || task.id}
                                        </span>
                                        <StatusBadge status={task.status} />
                                        <StatusBadge status={complaint?.priority} />
                                        <span className="pill blue">{complaint?.wasteType}</span>
                                    </div>

                                    <h3 style={{ margin: '4px 0 6px', color: '#1c4f2a', fontSize: '18px' }}>
                                        {complaint?.location?.address || 'Designated Collection Point'}
                                    </h3>

                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                                        {complaint?.description || 'Standard waste collection requested.'}
                                    </p>

                                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '12px', color: '#455a4e' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={13} color="var(--green)" />
                                            {task.distanceKm || 1.2} km away
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={13} />
                                            Assigned: {new Date(task.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="btn-row" style={{ marginTop: 0 }}>
                                    {complaint?.location?.latitude && (
                                        <button
                                            className="btn light"
                                            style={{ margin: 0, padding: '10px 14px', fontSize: '12px' }}
                                            onClick={() => openNavigation(complaint.location.latitude, complaint.location.longitude)}
                                        >
                                            <Navigation size={14} /> Navigate
                                        </button>
                                    )}

                                    <button
                                        className="btn"
                                        style={{ margin: 0, padding: '10px 18px', fontSize: '12px' }}
                                        onClick={() => navigate(`/worker/task/${task.id}`)}
                                    >
                                        Task Details <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
