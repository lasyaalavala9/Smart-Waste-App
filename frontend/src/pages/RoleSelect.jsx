import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelect() {
    const navigate = useNavigate();

    const handleSelectRole = (role) => {
        navigate('/login', { state: { selectedRole: role } });
    };

    return (
        <main className="page">
            <div className="hero">
                <div>
                    <div className="kicker">Role Selection</div>
                    <h2>Choose Your Role</h2>
                    <p>Select your operational profile to continue to the Smart Waste platform.</p>
                </div>
            </div>

            <div className="role-grid">
                {/* Citizen */}
                <div 
                    className="role citizen"
                    onClick={() => handleSelectRole('ROLE_CITIZEN')}
                >
                    <div>
                        <div className="icon">👤</div>
                        <h3>Citizen</h3>
                        <p>Report public waste, earn Eco Points, track resolution status and keep your community clean.</p>
                    </div>
                    <div>
                        <span className="btn light" style={{ pointerEvents: 'none' }}>
                            Continue as Citizen →
                        </span>
                    </div>
                </div>

                {/* Sanitation Worker */}
                <div 
                    className="role worker"
                    onClick={() => handleSelectRole('ROLE_WORKER')}
                >
                    <div>
                        <div className="icon">🚶</div>
                        <h3>Sanitation Worker</h3>
                        <p>Access assigned waste pickup routes, capture before & after proof, and optimize collection.</p>
                    </div>
                    <div>
                        <span className="btn light" style={{ pointerEvents: 'none' }}>
                            Continue as Worker →
                        </span>
                    </div>
                </div>

                {/* Municipal Authority */}
                <div 
                    className="role authority"
                    onClick={() => handleSelectRole('ROLE_AUTHORITY')}
                >
                    <div>
                        <div className="icon">🏛️</div>
                        <h3>Municipal Authority</h3>
                        <p>City-wide dashboard, assign workers, monitor smart bins, track recycling analytics & KPI reports.</p>
                    </div>
                    <div>
                        <span className="btn light" style={{ pointerEvents: 'none' }}>
                            Continue as Authority →
                        </span>
                    </div>
                </div>
            </div>
        </main>
    );
}
