import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { citizenApi } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PlusCircle, Award, ListFilter, Sparkles, TrendingUp } from 'lucide-react';

export default function CitizenDashboard() {
    const { user, updateEcoPoints } = useAuth();
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [ecoData, setEcoData] = useState({ balance: user?.ecoPoints || 0, history: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            citizenApi.getMyComplaints(),
            citizenApi.getEcoPoints()
        ])
            .then(([complaintsRes, ecoRes]) => {
                setComplaints(complaintsRes);
                setEcoData(ecoRes);
                if (ecoRes.balance !== undefined) {
                    updateEcoPoints(ecoRes.balance);
                }
            })
            .catch(err => console.error('Dashboard load error:', err))
            .finally(() => setLoading(false));
    }, []);

    const pendingCount = complaints.filter(c => c.status === 'SUBMITTED' || c.status === 'ASSIGNED').length;
    const completedCount = complaints.filter(c => c.status === 'COMPLETED').length;

    return (
        <main className="page">
            <div className="page-title">
                <div>
                    <div className="kicker">Citizen</div>
                    <h2>Good day, {user?.fullName || 'Eco Citizen'} 👋</h2>
                    <p>Be a part of a cleaner tomorrow. Report waste, earn points, and make an impact.</p>
                </div>
                <button 
                    className="btn"
                    onClick={() => navigate('/citizen/report')}
                >
                    <PlusCircle size={16} /> Report Waste
                </button>
            </div>

            {loading ? (
                <LoadingSpinner message="Loading your dashboard..." />
            ) : (
                <>
                    {/* Top 3 Stat Cards matching reference */}
                    <div className="grid3" style={{ marginBottom: '24px' }}>
                        <div className="card" style={{ background: 'linear-gradient(135deg, #ffffff, #f1f9f2)', borderLeft: '4px solid var(--green)' }}>
                            <div className="label">Eco Points</div>
                            <div className="stat" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{ecoData.balance}</span>
                                <Sparkles size={22} color="#e9a43a" />
                            </div>
                            <p>Points earned through responsible reporting and certified cleanups.</p>
                        </div>

                        <div className="card" style={{ borderLeft: '4px solid var(--blue)' }}>
                            <div className="label">Complaints</div>
                            <div className="stat" style={{ color: 'var(--blue)' }}>
                                {complaints.length}
                            </div>
                            <p>{completedCount} resolved, {pendingCount} in progress or scheduled.</p>
                        </div>

                        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div className="label">Quick Action</div>
                                <h3 style={{ margin: '8px 0 4px', color: '#1c4f2a' }}>Notice Dumped Waste?</h3>
                                <p>Take a photo and notify the municipal team instantly.</p>
                            </div>
                            <button
                                className="btn light"
                                style={{ margin: 0, width: '100%' }}
                                onClick={() => navigate('/citizen/report')}
                            >
                                Report Waste Now →
                            </button>
                        </div>
                    </div>

                    {/* Recent Complaints Section */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                                <div className="kicker">Recent Activity</div>
                                <h3 style={{ margin: 0 }}>My Recent Reports</h3>
                            </div>
                            <button
                                className="btn light"
                                style={{ margin: 0, fontSize: '12px', padding: '6px 14px' }}
                                onClick={() => navigate('/citizen/complaints')}
                            >
                                View All ({complaints.length}) →
                            </button>
                        </div>

                        {complaints.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌱</div>
                                <p>No waste reports filed yet. Notice litter or overflowing bins in your area?</p>
                                <button
                                    className="btn"
                                    onClick={() => navigate('/citizen/report')}
                                >
                                    File First Report (+50 Points)
                                </button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Complaint ID</th>
                                            <th>Waste Type</th>
                                            <th>Location</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Worker</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complaints.slice(0, 4).map(c => (
                                            <tr key={c.id}>
                                                <td style={{ fontWeight: 700, color: '#1c4f2a' }}>{c.complaintCode}</td>
                                                <td><b>{c.wasteType}</b></td>
                                                <td>{c.location?.address || 'City Sector'}</td>
                                                <td><StatusBadge status={c.priority} /></td>
                                                <td><StatusBadge status={c.status} /></td>
                                                <td style={{ color: 'var(--muted)' }}>
                                                    {c.assignedWorker ? `🚶 ${c.assignedWorker.fullName}` : 'Pending assignment'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Eco Points History & Sustainability Info */}
                    <div className="grid2">
                        <div className="card">
                            <div className="kicker">Eco Rewards</div>
                            <h3>Recent Point Activity</h3>
                            <p style={{ marginBottom: '14px' }}>Every valid report awards points toward green citizen milestones.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {ecoData.history.length === 0 ? (
                                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>No point transactions yet.</div>
                                ) : (
                                    ecoData.history.slice(0, 4).map(tx => (
                                        <div 
                                            key={tx.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '10px 14px',
                                                background: '#f6faf7',
                                                borderRadius: '10px',
                                                fontSize: '13px'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#26352d' }}>{tx.reason}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <span style={{ fontWeight: 800, color: 'var(--green)' }}>
                                                +{tx.points} pts
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="card" style={{ background: 'linear-gradient(135deg, #eaf6ee, #f7fcf8)' }}>
                            <div className="kicker">Eco Tip of the Day</div>
                            <h3>Recycling Awareness 🌍</h3>
                            <p style={{ marginTop: '8px' }}>
                                Segregating dry recyclable waste (clean plastics, paper, and glass) from wet organic waste prevents cross-contamination and enables up to 92% of municipal waste to be recycled instead of ending up in landfills.
                            </p>
                            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <span className="pill">Plastic: Rinse Bottles</span>
                                <span className="pill blue">Paper: Keep Dry</span>
                                <span className="pill orange">E-Waste: Drop at Depot</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
