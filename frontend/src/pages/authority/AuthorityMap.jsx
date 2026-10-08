import React, { useState, useEffect } from 'react';
import { authorityApi } from '../../services/api';
import InteractiveMap from '../../components/map/InteractiveMap';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { MapPin, UserCheck } from 'lucide-react';

export default function AuthorityMap() {
    const [complaints, setComplaints] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    // Assign worker state
    const [isAssignModal, setIsAssignModal] = useState(false);
    const [workerId, setWorkerId] = useState('');
    const [assignPriority, setAssignPriority] = useState('HIGH');
    const [assigning, setAssigning] = useState(false);

    const loadData = async () => {
        try {
            const [complaintsRes, workersRes] = await Promise.all([
                authorityApi.getAllComplaints(),
                authorityApi.getWorkers()
            ]);
            setComplaints(complaintsRes);
            setWorkers(workersRes);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedItem || !workerId) return;
        setAssigning(true);
        try {
            await authorityApi.assignWorker(selectedItem.id, workerId, assignPriority);
            setIsAssignModal(false);
            setSelectedItem(null);
            loadData();
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
                    <div className="kicker">City Monitoring</div>
                    <h2>Authority Live Map</h2>
                    <p>Live geographic tracking of all reported waste sites, smart bins, and collection activities.</p>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner message="Loading live city map data..." />
            ) : (
                <div className="card" style={{ padding: '16px' }}>
                    <InteractiveMap
                        items={complaints}
                        height="520px"
                        zoom={13}
                        onSelect={(item) => setSelectedItem(item)}
                    />

                    {/* Legend matching reference authority-map.html */}
                    <div className="legend" style={{ marginTop: '16px', justifyContent: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#e9a43a' }} />
                            Submitted (Pending)
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#276fbf' }} />
                            Assigned
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5842a8' }} />
                            In Progress
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2e7d32' }} />
                            Completed
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#d94b4b' }} />
                            Urgent / High Priority
                        </span>
                    </div>
                </div>
            )}

            {/* Clicked Item Modal */}
            <Modal
                isOpen={!!selectedItem && !isAssignModal}
                onClose={() => setSelectedItem(null)}
                title={selectedItem?.complaintCode || 'Complaint Details'}
            >
                {selectedItem && (
                    <div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <StatusBadge status={selectedItem.status} />
                            <StatusBadge status={selectedItem.priority} />
                            <span className="pill blue">{selectedItem.wasteType}</span>
                        </div>

                        <p style={{ fontSize: '14px', marginBottom: '12px', color: '#26352d' }}>
                            <b>Location:</b> {selectedItem.location?.address} ({selectedItem.location?.landmark})
                        </p>

                        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
                            <b>Description:</b> {selectedItem.description || 'No additional details.'}
                        </p>

                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
                            Reported on {new Date(selectedItem.createdAt).toLocaleString()} by {selectedItem.citizen?.fullName}
                            <br />
                            <b>Assigned Worker:</b> {selectedItem.assignedWorker ? selectedItem.assignedWorker.fullName : 'None yet'}
                        </div>

                        {selectedItem.images && selectedItem.images.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <img
                                    src={selectedItem.images[0].imageUrl}
                                    alt="Complaint"
                                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px' }}
                                />
                            </div>
                        )}

                        <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
                            <button
                                className="btn light"
                                onClick={() => setSelectedItem(null)}
                            >
                                Close
                            </button>
                            <button
                                className="btn"
                                onClick={() => {
                                    setWorkerId(selectedItem.assignedWorker?.id || (workers[0]?.id || ''));
                                    setAssignPriority(selectedItem.priority || 'HIGH');
                                    setIsAssignModal(true);
                                }}
                            >
                                <UserCheck size={14} /> {selectedItem.assignedWorker ? 'Reassign Worker' : 'Assign Worker'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Reassign / Assign Modal */}
            <Modal
                isOpen={isAssignModal}
                onClose={() => setIsAssignModal(false)}
                title={`Assign: ${selectedItem?.complaintCode}`}
            >
                <form onSubmit={handleAssign}>
                    <div className="field">
                        <label>Select Worker</label>
                        <select value={workerId} onChange={(e) => setWorkerId(e.target.value)} required>
                            <option value="">-- Choose Worker --</option>
                            {workers.map(w => (
                                <option key={w.id} value={w.id}>
                                    {w.fullName} ({w.assignedZone || 'City Wide'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Priority</label>
                        <select value={assignPriority} onChange={(e) => setAssignPriority(e.target.value)}>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>

                    <div className="btn-row" style={{ justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button type="button" className="btn light" onClick={() => setIsAssignModal(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn" disabled={assigning}>
                            {assigning ? 'Assigning...' : 'Confirm Assignment'}
                        </button>
                    </div>
                </form>
            </Modal>
        </main>
    );
}
