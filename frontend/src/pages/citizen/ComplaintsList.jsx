import React, { useState, useEffect } from 'react';
import { citizenApi } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { Eye, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export default function ComplaintsList() {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        citizenApi.getMyComplaints()
            .then(data => setComplaints(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const allCount = complaints.length;
    const pendingCount = complaints.filter(c => c.status === 'SUBMITTED' || c.status === 'ASSIGNED').length;
    const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
    const completedCount = complaints.filter(c => c.status === 'COMPLETED').length;

    const filtered = complaints.filter(c => {
        if (filter === 'ALL') return true;
        if (filter === 'PENDING') return c.status === 'SUBMITTED' || c.status === 'ASSIGNED';
        if (filter === 'IN_PROGRESS') return c.status === 'IN_PROGRESS';
        if (filter === 'COMPLETED') return c.status === 'COMPLETED';
        return true;
    });

    return (
        <main className="page">
            <div className="page-title">
                <div>
                    <div className="kicker">Citizen</div>
                    <h2>My Complaints</h2>
                    <p>Monitor the progress of every waste report from submission to verified resolution.</p>
                </div>
            </div>

            {/* Stat Counters matching reference complaints.html */}
            <div className="grid" style={{ marginBottom: '22px' }}>
                <div 
                    className="card" 
                    onClick={() => setFilter('ALL')}
                    style={{ cursor: 'pointer', border: filter === 'ALL' ? '2px solid var(--green)' : '1px solid var(--line)' }}
                >
                    <div className="label">All</div>
                    <div className="stat">{allCount}</div>
                </div>

                <div 
                    className="card" 
                    onClick={() => setFilter('PENDING')}
                    style={{ cursor: 'pointer', border: filter === 'PENDING' ? '2px solid var(--green)' : '1px solid var(--line)' }}
                >
                    <div className="label">Pending</div>
                    <div className="stat" style={{ color: 'var(--orange)' }}>{pendingCount}</div>
                </div>

                <div 
                    className="card" 
                    onClick={() => setFilter('IN_PROGRESS')}
                    style={{ cursor: 'pointer', border: filter === 'IN_PROGRESS' ? '2px solid var(--green)' : '1px solid var(--line)' }}
                >
                    <div className="label">In Progress</div>
                    <div className="stat" style={{ color: 'var(--purple)' }}>{inProgressCount}</div>
                </div>

                <div 
                    className="card" 
                    onClick={() => setFilter('COMPLETED')}
                    style={{ cursor: 'pointer', border: filter === 'COMPLETED' ? '2px solid var(--green)' : '1px solid var(--line)' }}
                >
                    <div className="label">Completed</div>
                    <div className="stat" style={{ color: 'var(--green2)' }}>{completedCount}</div>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner message="Fetching complaints..." />
            ) : filtered.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '38px', marginBottom: '8px' }}>📋</div>
                    <h3>No complaints found</h3>
                    <p>No waste reports match the selected status filter.</p>
                </div>
            ) : (
                <div className="card">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Waste Type</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Assigned Worker</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(c => (
                                    <tr key={c.id}>
                                        <td style={{ fontWeight: 800, color: '#1c4f2a' }}>{c.complaintCode}</td>
                                        <td><b>{c.wasteType}</b></td>
                                        <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                        <td>{c.location?.address || 'Designated Area'}</td>
                                        <td><StatusBadge status={c.priority} /></td>
                                        <td><StatusBadge status={c.status} /></td>
                                        <td style={{ color: 'var(--muted)' }}>
                                            {c.assignedWorker ? `🚶 ${c.assignedWorker.fullName}` : 'Unassigned'}
                                        </td>
                                        <td>
                                            <button
                                                className="btn light"
                                                style={{ margin: 0, padding: '6px 12px', fontSize: '11px' }}
                                                onClick={() => setSelectedComplaint(c)}
                                            >
                                                <Eye size={12} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Complaint Detail Modal */}
            <Modal
                isOpen={!!selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
                title={selectedComplaint ? `Complaint ${selectedComplaint.complaintCode}` : ''}
            >
                {selectedComplaint && (
                    <div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                            <StatusBadge status={selectedComplaint.status} />
                            <StatusBadge status={selectedComplaint.priority} />
                            <span className="pill blue">{selectedComplaint.wasteType}</span>
                        </div>

                        <p style={{ fontSize: '14px', marginBottom: '12px', color: '#26352d' }}>
                            <b>Description:</b> {selectedComplaint.description || 'No description provided.'}
                        </p>

                        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div>📍 <b>Location:</b> {selectedComplaint.location?.address} ({selectedComplaint.location?.landmark})</div>
                            <div>🕒 <b>Reported on:</b> {new Date(selectedComplaint.createdAt).toLocaleString()}</div>
                            {selectedComplaint.assignedWorker && (
                                <div>🚶 <b>Assigned Worker:</b> {selectedComplaint.assignedWorker.fullName} ({selectedComplaint.assignedWorker.assignedZone})</div>
                            )}
                        </div>

                        {/* Images: Citizen report / Before / After */}
                        <div style={{ marginTop: '16px', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
                            <h4 style={{ color: '#1c4f2a', marginBottom: '10px' }}>Evidence & Verification</h4>
                            
                            {selectedComplaint.images && selectedComplaint.images.length > 0 ? (
                                <div className="grid2" style={{ gap: '10px' }}>
                                    {selectedComplaint.images.map((img, idx) => (
                                        <div key={idx} style={{ textAlign: 'center', background: '#f7fcf8', padding: '8px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', marginBottom: '4px' }}>
                                                {img.imageType === 'CITIZEN_REPORT' ? 'Report Image' : img.imageType === 'BEFORE' ? 'Before Cleanup' : 'After Cleanup'}
                                            </div>
                                            <img
                                                src={img.imageUrl}
                                                alt="Complaint evidence"
                                                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: '12px', color: 'var(--muted)' }}>No images attached to this complaint.</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </main>
    );
}
