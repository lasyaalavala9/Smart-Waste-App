import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authorityApi } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { UserCheck, MapPin, Map, BarChart3, Recycle, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AuthorityDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state for assigning worker
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [selectedWorkerId, setSelectedWorkerId] = useState('');
    const [assignPriority, setAssignPriority] = useState('HIGH');
    const [assigning, setAssigning] = useState(false);
    const [assignSuccess, setAssignSuccess] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, complaintsRes, workersRes] = await Promise.all([
                authorityApi.getAnalytics(),
                authorityApi.getAllComplaints(),
                authorityApi.getWorkers()
            ]);
            setStats(statsRes);
            setComplaints(complaintsRes);
            setWorkers(workersRes);
        } catch (err) {
            console.error('Error loading authority dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenAssignModal = (complaint) => {
        setSelectedComplaint(complaint);
        setSelectedWorkerId(complaint.assignedWorker?.id || (workers[0]?.id || ''));
        setAssignPriority(complaint.priority || 'HIGH');
        setAssignSuccess(null);
    };

    const handleAssignWorker = async (e) => {
        e.preventDefault();
        if (!selectedComplaint || !selectedWorkerId) return;

        setAssigning(true);
        try {
            await authorityApi.assignWorker(selectedComplaint.id, selectedWorkerId, assignPriority);
            setAssignSuccess('Worker assigned and task notification dispatched successfully!');
            setTimeout(() => {
                setSelectedComplaint(null);
                loadData();
            }, 1200);
        } catch (err) {
            alert('Failed to assign worker: ' + (err.message || 'Error'));
        } finally {
            setAssigning(false);
        }
    };

    return (
        <main className="page">
            <div className="page-title">
                <div>
                    <div className="kicker">Authority</div>
                    <h2>Municipal Authority Dashboard</h2>
                    <p>Monitor waste operations, dispatch sanitation workers, and oversee city cleanliness in real time.</p>
                </div>
                <div className="btn-row">
                    <button className="btn light" onClick={loadData} title="Refresh data">
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button className="btn" onClick={() => navigate('/authority/map')}>
                        <Map size={14} /> Live City Map
                    </button>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner message="Loading municipal operations data..." />
            ) : (
                <>
                    {/* Top 4 Stat Cards matching authority-dashboard.html */}
                    <div className="grid" style={{ marginBottom: '18px' }}>
                        <div className="card">
                            <div className="label">Total Complaints</div>
                            <div className="stat">{stats?.totalComplaints || complaints.length}</div>
                        </div>

                        <div className="card">
                            <div className="label">Pending</div>
                            <div className="stat" style={{ color: 'var(--orange)' }}>
                                {stats?.pendingComplaints || 0}
                            </div>
                        </div>

                        <div className="card">
                            <div className="label">In Progress</div>
                            <div className="stat" style={{ color: 'var(--purple)' }}>
                                {stats?.inProgressComplaints || 0}
                            </div>
                        </div>

                        <div className="card">
                            <div className="label">Completed</div>
                            <div className="stat" style={{ color: 'var(--green2)' }}>
                                {stats?.completedComplaints || 0}
                            </div>
                        </div>
                    </div>

                    {/* Operational metrics */}
                    <div className="grid" style={{ marginBottom: '24px' }}>
                        <div className="card">
                            <div className="label">Waste Collected Today</div>
                            <div className="stat" style={{ fontSize: '26px' }}>
                                {stats?.wasteCollectedTodayKg || 124.5} <span style={{ fontSize: '14px', fontWeight: 600 }}>kg</span>
                            </div>
                            <p style={{ margin: 0 }}>Aggregated across all city zones.</p>
                        </div>

                        <div className="card">
                            <div className="label">Smart Bin Status</div>
                            <div className="stat" style={{ fontSize: '26px', color: 'var(--blue)' }}>
                                {stats?.smartBinFillLevelAvg || '68%'}
                            </div>
                            <p style={{ margin: 0 }}>Average fill level across sensors.</p>
                        </div>

                        <div className="card">
                            <div className="label">Active Workers</div>
                            <div className="stat" style={{ fontSize: '26px', color: 'var(--green)' }}>
                                {stats?.activeWorkers || workers.length}
                            </div>
                            <p style={{ margin: 0 }}>Field personnel on active duty.</p>
                        </div>

                        <div className="card">
                            <div className="label">Recycling Rate</div>
                            <div className="stat" style={{ fontSize: '26px', color: 'var(--green2)' }}>
                                {stats?.recyclingRate || '74.2%'}
                            </div>
                            <p style={{ margin: 0 }}>Diverted from city landfills.</p>
                        </div>
                    </div>

                    {/* City-Wide Complaints Table */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                                <div className="kicker">Operational Oversight</div>
                                <h3 style={{ margin: 0 }}>City-wide Complaints & Assignments</h3>
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                                Showing {complaints.length} records
                            </span>
                        </div>

                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Complaint ID</th>
                                        <th>Reported By</th>
                                        <th>Waste Type</th>
                                        <th>Location</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Assigned Worker</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map(c => (
                                        <tr key={c.id}>
                                            <td style={{ fontWeight: 800, color: '#1c4f2a' }}>{c.complaintCode}</td>
                                            <td>{c.citizen?.fullName || 'Citizen'}</td>
                                            <td><b>{c.wasteType}</b></td>
                                            <td>{c.location?.address || 'City Zone'}</td>
                                            <td><StatusBadge status={c.priority} /></td>
                                            <td><StatusBadge status={c.status} /></td>
                                            <td style={{ color: '#333' }}>
                                                {c.assignedWorker ? (
                                                    <span>🚶 {c.assignedWorker.fullName}</span>
                                                ) : (
                                                    <span style={{ color: '#d94b4b', fontWeight: 600 }}>Unassigned</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn light"
                                                    style={{ margin: 0, padding: '6px 12px', fontSize: '11px' }}
                                                    onClick={() => handleOpenAssignModal(c)}
                                                >
                                                    <UserCheck size={12} /> {c.assignedWorker ? 'Reassign' : 'Assign'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Assign Worker Modal */}
            <Modal
                isOpen={!!selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
                title={selectedComplaint ? `Assign Worker: ${selectedComplaint.complaintCode}` : ''}
            >
                {selectedComplaint && (
                    <form onSubmit={handleAssignWorker}>
                        {assignSuccess ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--green)', fontWeight: 700 }}>
                                ✓ {assignSuccess}
                            </div>
                        ) : (
                            <>
                                <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '14px' }}>
                                    <b>Location:</b> {selectedComplaint.location?.address} | <b>Type:</b> {selectedComplaint.wasteType}
                                </div>

                                <div className="field">
                                    <label>Select Sanitation Worker</label>
                                    <select
                                        value={selectedWorkerId}
                                        onChange={(e) => setSelectedWorkerId(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Worker --</option>
                                        {workers.map(w => (
                                            <option key={w.id} value={w.id}>
                                                {w.fullName} ({w.assignedZone || 'Field Team'})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Set Task Priority</label>
                                    <select
                                        value={assignPriority}
                                        onChange={(e) => setAssignPriority(e.target.value)}
                                    >
                                        <option value="LOW">Low Priority</option>
                                        <option value="MEDIUM">Medium Priority</option>
                                        <option value="HIGH">High Priority</option>
                                        <option value="URGENT">Urgent Priority</option>
                                    </select>
                                </div>

                                <div className="btn-row" style={{ justifyContent: 'flex-end', marginTop: '16px' }}>
                                    <button
                                        type="button"
                                        className="btn light"
                                        onClick={() => setSelectedComplaint(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn"
                                        disabled={assigning || !selectedWorkerId}
                                    >
                                        {assigning ? 'Assigning...' : 'Dispatch Assignment →'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                )}
            </Modal>
        </main>
    );
}
