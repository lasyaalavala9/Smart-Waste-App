import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { LogOut, User, Mail, Phone, MapPin, Award, HelpCircle, Shield } from 'lucide-react';

export default function ProfilePage() {
    const { user, logout, isCitizen, isWorker, isAuthority } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <main className="page">
            <div className="page-title">
                <div>
                    <div className="kicker">Account</div>
                    <h2>Profile & Settings</h2>
                    <p>Manage your account credentials, preferences, and system access.</p>
                </div>
            </div>

            <div className="grid2" style={{ maxWidth: '960px', margin: 'auto' }}>
                {/* Profile Card */}
                <div className="card">
                    <div style={{ textAlign: 'center', padding: '16px 0 20px', borderBottom: '1px solid var(--line)' }}>
                        <div style={{
                            width: '72px',
                            height: '72px',
                            background: isCitizen ? '#4e963d' : isWorker ? '#2871bd' : '#5a48a8',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            margin: '0 auto 12px'
                        }}>
                            {isCitizen ? '👤' : isWorker ? '🚶' : '🏛️'}
                        </div>

                        <h3 style={{ margin: '0 0 4px', fontSize: '20px', color: '#1c4f2a' }}>
                            {user?.fullName || 'User Profile'}
                        </h3>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
                            <span className="pill">
                                {isCitizen ? 'Citizen' : isWorker ? 'Sanitation Worker' : 'Municipal Authority'}
                            </span>
                            <span className="pill blue">
                                ID: {user?.identifierId}
                            </span>
                        </div>
                    </div>

                    <div style={{ padding: '20px 0 10px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Mail size={16} color="var(--muted)" />
                            <div>
                                <span style={{ color: 'var(--muted)', display: 'block', fontSize: '11px' }}>Email Address</span>
                                <b>{user?.email || 'N/A'}</b>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Phone size={16} color="var(--muted)" />
                            <div>
                                <span style={{ color: 'var(--muted)', display: 'block', fontSize: '11px' }}>Phone Number</span>
                                <b>{user?.phoneNumber || '+91 98765 43210'}</b>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={16} color="var(--muted)" />
                            <div>
                                <span style={{ color: 'var(--muted)', display: 'block', fontSize: '11px' }}>Assigned Zone / City</span>
                                <b>{user?.assignedZone || 'Central Metropolitan Zone'}</b>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                        <button
                            className="btn red"
                            style={{ width: '100%', margin: 0 }}
                            onClick={handleLogout}
                        >
                            <LogOut size={16} /> Sign Out of Account
                        </button>
                    </div>
                </div>

                {/* Right Column: Role Perks / Eco Rewards / Support */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {isCitizen && (
                        <div className="card" style={{ background: 'linear-gradient(135deg, #eaf6ee, #f5faf6)' }}>
                            <div className="label">Citizen Eco Rewards</div>
                            <div className="stat" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{user?.ecoPoints || 1250}</span>
                                <Award size={26} color="#e9a43a" />
                            </div>
                            <h3 style={{ margin: '8px 0 4px', fontSize: '16px', color: '#1c4f2a' }}>
                                Green Tier: Eco Guardian ⭐
                            </h3>
                            <p style={{ fontSize: '13px', color: '#44614e' }}>
                                Redeem points for public transit passes, civic utility discounts, or municipal recognition badges.
                            </p>
                        </div>
                    )}

                    <div className="card">
                        <div className="kicker">System & Security</div>
                        <h3 style={{ margin: '4px 0 10px', fontSize: '16px' }}>Application Information</h3>
                        <div style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div>🛡️ <b>Security:</b> JWT 256-bit Token Authorization</div>
                            <div>🗺️ <b>Map Service:</b> OpenStreetMap Leaflet Engine</div>
                            <div>🚀 <b>Version:</b> Smart Waste Suite 2.0 (Production Ready)</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="kicker">Need Assistance?</div>
                        <h3 style={{ margin: '4px 0 8px', fontSize: '16px' }}>Help & Municipal Support</h3>
                        <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                            Emergency sanitation hotline: <b>1800-CLEAN-CITY</b>
                            <br />
                            Email Support: <b>support@smartwaste.gov</b>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
