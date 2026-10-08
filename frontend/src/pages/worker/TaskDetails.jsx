import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workerApi } from '../../services/api';
import InteractiveMap from '../../components/map/InteractiveMap';
import CameraCapture from '../../components/camera/CameraCapture';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Navigation, ArrowLeft, CheckCircle2, PlayCircle, ShieldCheck } from 'lucide-react';

export default function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    // Completion form state
    const [beforeImage, setBeforeImage] = useState(null);
    const [afterImage, setAfterImage] = useState(null);
    const [completionNotes, setCompletionNotes] = useState('');

    useEffect(() => {
        workerApi.getTask(id)
            .then(data => {
                setTask(data);
                if (data.beforeImageUrl) setBeforeImage(data.beforeImageUrl);
                if (data.afterImageUrl) setAfterImage(data.afterImageUrl);
                if (data.completionNotes) setCompletionNotes(data.completionNotes);
            })
            .catch(err => setError(err.message || 'Task not found'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleStartTask = async () => {
        setActionLoading(true);
        setError(null);
        try {
            const res = await workerApi.startTask(id, { beforeImageUrl: beforeImage });
            setTask(res.task);
        } catch (err) {
            setError(err.message || 'Failed to start task.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCompleteTask = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError(null);
        try {
            const res = await workerApi.completeTask(id, {
                beforeImageUrl: beforeImage,
                afterImageUrl: afterImage,
                completionNotes: completionNotes || 'Area thoroughly cleared and sanitized.'
            });
            setTask(res.task);
        } catch (err) {
            setError(err.message || 'Failed to complete task.');
        } finally {
            setActionLoading(false);
        }
    };

    const openNavigation = () => {
        const lat = task?.complaint?.location?.latitude;
        const lng = task?.complaint?.location?.longitude;
        if (lat && lng) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
        }
    };

    if (loading) return <main className="page"><LoadingSpinner message="Loading task details..." /></main>;
    if (error && !task) return <main className="page"><div className="card" style={{ color: '#d94b4b' }}>{error}</div></main>;
    if (!task) return null;

    const complaint = task.complaint;
    const isCompleted = task.status === 'COMPLETED';
    const isInProgress = task.status === 'IN_PROGRESS';
    const isAssigned = task.status === 'ASSIGNED';

    return (
        <main className="page">
            <div style={{ marginBottom: '16px' }}>
                <button
                    className="btn light"
                    style={{ margin: 0, padding: '6px 14px', fontSize: '12px' }}
                    onClick={() => navigate('/worker/dashboard')}
                >
                    <ArrowLeft size={14} /> Back to Tasks
                </button>
            </div>

            <div className="grid2" style={{ marginBottom: '22px' }}>
                {/* Left Card: Map and Navigation */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div className="kicker">Geographic Location</div>
                        <button
                            className="btn light"
                            style={{ margin: 0, padding: '6px 12px', fontSize: '11px' }}
                            onClick={openNavigation}
                        >
                            <Navigation size={12} /> Open GPS Route
                        </button>
                    </div>

                    <InteractiveMap
                        items={[complaint]}
                        center={[complaint?.location?.latitude || 12.9716, complaint?.location?.longitude || 77.5946]}
                        zoom={15}
                        height="300px"
                    />

                    <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--muted)' }}>
                        📍 <b>{complaint?.location?.address}</b>
                        {complaint?.location?.landmark && ` (${complaint.location.landmark})`}
                    </div>
                </div>

                {/* Right Card: Task and Complaint Information matching task-details.html */}
                <div className="card">
                    <div className="kicker">
                        Task #{complaint?.complaintCode || task.id}
                    </div>

                    <h2 style={{ color: '#1c4f2a', fontSize: '22px', margin: '4px 0 12px' }}>
                        {complaint?.location?.address || 'Designated Collection Area'}
                    </h2>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                        <StatusBadge status={task.status} />
                        <StatusBadge status={complaint?.priority} />
                        <span className="pill blue">Type: {complaint?.wasteType}</span>
                    </div>

                    <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.6, marginBottom: '14px' }}>
                        <b>Citizen Report:</b> {complaint?.description || 'Standard collection request.'}
                    </div>

                    {/* Citizen Photo preview */}
                    {complaint?.images && complaint.images.length > 0 && (
                        <div style={{ marginBottom: '16px', background: '#f7fcf8', padding: '10px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', marginBottom: '6px' }}>
                                📸 Citizen Uploaded Photo:
                            </div>
                            <img
                                src={complaint.images[0].imageUrl}
                                alt="Reported Waste"
                                style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    {/* Action Flow */}
                    {isAssigned && (
                        <div>
                            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
                                Ready to head to this site? Click below to notify citizen and start the task.
                            </p>
                            <button
                                className="btn"
                                style={{ width: '100%', fontSize: '14px', padding: '12px' }}
                                onClick={handleStartTask}
                                disabled={actionLoading}
                            >
                                <PlayCircle size={16} /> Start Task Now →
                            </button>
                        </div>
                    )}

                    {isInProgress && (
                        <div style={{ background: '#f8f5ff', padding: '14px', borderRadius: '12px', border: '1px solid #dcd1f6' }}>
                            <div style={{ color: '#5842a8', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <PlayCircle size={15} /> Task is Currently In Progress
                            </div>
                            <p style={{ fontSize: '12px', color: '#68598a', margin: '4px 0 0' }}>
                                Once you have cleaned the site, attach the before and after photos below to finish.
                            </p>
                        </div>
                    )}

                    {isCompleted && (
                        <div style={{ background: '#e9f6ed', padding: '16px', borderRadius: '14px', border: '1px solid #bfe8c7' }}>
                            <div style={{ color: 'var(--green)', fontWeight: 800, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 size={18} /> Task Completed & Verified!
                            </div>
                            <p style={{ fontSize: '12px', color: '#31583a', marginTop: '6px' }}>
                                Notes: {task.completionNotes || 'Area cleared and certified.'}
                            </p>
                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                                Finished: {new Date(task.completedAt).toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Before and After Verification Section (matching completion.html) */}
            {(isInProgress || isCompleted) && (
                <div className="card" style={{ maxWidth: '850px', margin: 'auto' }}>
                    <div className="kicker">Proof of Work</div>
                    <h2 style={{ fontSize: '20px', color: '#1c4f2a', marginBottom: '6px' }}>
                        Before & After Verification
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '18px' }}>
                        Verify the sanitary cleanup by capturing the initial state and cleaned area.
                    </p>

                    <form onSubmit={handleCompleteTask}>
                        <div className="grid2" style={{ marginBottom: '20px' }}>
                            {/* Before Card */}
                            <div className="card" style={{ textAlign: 'center', background: '#fafcfa' }}>
                                <div style={{ fontSize: '38px', marginBottom: '6px' }}>🗑️</div>
                                <h3>Before</h3>
                                <p style={{ fontSize: '12px', marginBottom: '10px' }}>Waste present on site</p>
                                {isCompleted ? (
                                    beforeImage ? (
                                        <img src={beforeImage} alt="Before" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }} />
                                    ) : (
                                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>No before photo captured</span>
                                    )
                                ) : (
                                    <CameraCapture
                                        image={beforeImage}
                                        onImageChange={setBeforeImage}
                                        label="Attach Before Photo"
                                    />
                                )}
                            </div>

                            {/* After Card */}
                            <div className="card" style={{ textAlign: 'center', background: '#fafcfa' }}>
                                <div style={{ fontSize: '38px', marginBottom: '6px' }}>🌳</div>
                                <h3>After</h3>
                                <p style={{ fontSize: '12px', marginBottom: '10px' }}>Area thoroughly cleaned</p>
                                {isCompleted ? (
                                    afterImage ? (
                                        <img src={afterImage} alt="After" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }} />
                                    ) : (
                                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>No after photo captured</span>
                                    )
                                ) : (
                                    <CameraCapture
                                        image={afterImage}
                                        onImageChange={setAfterImage}
                                        label="Attach Cleaned Photo"
                                    />
                                )}
                            </div>
                        </div>

                        {!isCompleted && (
                            <>
                                <div className="field">
                                    <label>Sanitation Completion Notes</label>
                                    <textarea
                                        placeholder="e.g. Waste safely loaded into municipal truck and transport to sorting facility..."
                                        value={completionNotes}
                                        onChange={(e) => setCompletionNotes(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn"
                                    style={{ width: '100%', fontSize: '15px', padding: '14px' }}
                                    disabled={actionLoading}
                                >
                                    <ShieldCheck size={18} /> Mark Task as Completed & Award Eco Points →
                                </button>
                            </>
                        )}
                    </form>
                </div>
            )}
        </main>
    );
}
