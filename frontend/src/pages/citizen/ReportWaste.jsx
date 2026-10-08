import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { citizenApi } from '../../services/api';
import LocationPicker from '../../components/map/LocationPicker';
import CameraCapture from '../../components/camera/CameraCapture';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ReportWaste() {
    const navigate = useNavigate();
    const { updateEcoPoints, user } = useAuth();

    const [wasteType, setWasteType] = useState('PLASTIC');
    const [priority, setPriority] = useState('MEDIUM');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [latitude, setLatitude] = useState(12.9716);
    const [longitude, setLongitude] = useState(77.5946);
    const [imageBase64, setImageBase64] = useState(null);
    const [estimatedWeightKg, setEstimatedWeightKg] = useState('5.0');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [submittedComplaint, setSubmittedComplaint] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const payload = {
                wasteType,
                priority,
                description,
                address: address || 'Community Area, City Center',
                landmark: landmark || 'Near Main Gate',
                latitude,
                longitude,
                imageBase64,
                estimatedWeightKg: parseFloat(estimatedWeightKg) || 5.0
            };

            const result = await citizenApi.submitComplaint(payload);
            setSubmittedComplaint(result);

            // Award eco points celebration!
            if (user?.ecoPoints !== undefined) {
                updateEcoPoints(user.ecoPoints + 50);
            }

            // Confetti effect
            try {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } catch (err) {
                // Ignore if confetti fails
            }
        } catch (err) {
            setError(err.message || 'Failed to submit report. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="page">
            <div className="form" style={{ maxWidth: '640px' }}>
                <div className="kicker">Citizen Report</div>
                <h2>Report Waste</h2>
                <p>Add waste details and location to alert sanitation teams and earn Eco Points.</p>

                {error && (
                    <div style={{
                        background: '#fde7e7',
                        color: '#a13d3d',
                        padding: '12px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        marginBottom: '16px'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Success view if submitted */}
                {submittedComplaint ? (
                    <div style={{ textAlign: 'center', padding: '20px 10px', animation: 'fadeIn 0.3s' }}>
                        <div style={{ color: 'var(--green)', marginBottom: '12px' }}>
                            <CheckCircle2 size={56} style={{ margin: 'auto' }} />
                        </div>
                        <h3 style={{ fontSize: '22px', color: '#1c4f2a', marginBottom: '8px' }}>
                            Complaint Submitted!
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
                            Complaint Code: <b style={{ color: '#26352d' }}>{submittedComplaint.complaintCode}</b>
                            <br />
                            Municipal Authority and field workers have been notified.
                        </p>

                        <div style={{
                            background: '#e9f6ed',
                            padding: '16px',
                            borderRadius: '14px',
                            marginBottom: '24px',
                            border: '1px solid #c2e5ca'
                        }}>
                            <div style={{ fontSize: '13px', color: '#1c4f2a', fontWeight: 700 }}>
                                🎉 +50 Eco Points Awarded!
                            </div>
                            <div style={{ fontSize: '12px', color: '#4a6e54', marginTop: '4px' }}>
                                Thank you for actively keeping our environment clean.
                            </div>
                        </div>

                        <div className="btn-row" style={{ justifyContent: 'center' }}>
                            <button
                                className="btn"
                                onClick={() => navigate('/citizen/complaints')}
                            >
                                Track Complaint Status <ArrowRight size={14} />
                            </button>
                            <button
                                className="btn light"
                                onClick={() => {
                                    setSubmittedComplaint(null);
                                    setDescription('');
                                    setImageBase64(null);
                                }}
                            >
                                Report Another Waste
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Waste Type */}
                        <div className="field">
                            <label>Select Waste Type</label>
                            <select
                                value={wasteType}
                                onChange={(e) => setWasteType(e.target.value)}
                                required
                            >
                                <option value="PLASTIC">Plastic (Bottles, Containers, Wrap)</option>
                                <option value="PAPER">Paper & Cardboard</option>
                                <option value="GLASS">Glass Bottles & Shards</option>
                                <option value="METAL">Metal & Cans</option>
                                <option value="E_WASTE">E-Waste (Electronics, Batteries)</option>
                                <option value="ORGANIC">Organic & Wet Food Waste</option>
                                <option value="MIXED">Mixed / Dumpster Overflow</option>
                                <option value="OTHER">Other Hazardous / Bulky</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="field">
                            <label>Urgency Level</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="LOW">Low (Regular cleanup schedule)</option>
                                <option value="MEDIUM">Medium (Standard community issue)</option>
                                <option value="HIGH">High (Overflowing or foul odor)</option>
                                <option value="URGENT">Urgent (Hazardous / blocking passage)</option>
                            </select>
                        </div>

                        {/* Photo Upload / Camera */}
                        <div className="field">
                            <CameraCapture
                                image={imageBase64}
                                onImageChange={setImageBase64}
                                label="Photo Evidence (Upload or Snap)"
                            />
                        </div>

                        {/* GPS Location & Map */}
                        <div className="field">
                            <label>Incident Location</label>
                            <LocationPicker
                                latitude={latitude}
                                longitude={longitude}
                                onChange={({ latitude: lat, longitude: lng }) => {
                                    setLatitude(lat);
                                    setLongitude(lng);
                                }}
                            />
                        </div>

                        {/* Address & Landmark */}
                        <div className="grid2">
                            <div className="field">
                                <label>Street / Area Address</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sector 5, Near Market"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="field">
                                <label>Nearest Landmark</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Beside bus stop"
                                    value={landmark}
                                    onChange={(e) => setLandmark(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="field">
                            <label>Description (Optional)</label>
                            <textarea
                                placeholder="Describe the waste situation, volume, or any specific hazards..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn"
                            style={{ width: '100%', fontSize: '15px', padding: '14px' }}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting Complaint...' : 'Submit Report (+50 Eco Points) →'}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
