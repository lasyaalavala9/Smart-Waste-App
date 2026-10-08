import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, Mail, Phone } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, getDashboardPath, user } = useAuth();

    const [isRegister, setIsRegister] = useState(false);
    const [identifierId, setIdentifierId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Register fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // If role was selected on previous screen, set default credential hints
    useEffect(() => {
        const selectedRole = location.state?.selectedRole;
        if (selectedRole === 'ROLE_WORKER') {
            setIdentifierId('WORKER01');
            setPassword('password123');
        } else if (selectedRole === 'ROLE_AUTHORITY') {
            setIdentifierId('AUTH01');
            setPassword('password123');
        } else if (selectedRole === 'ROLE_CITIZEN') {
            setIdentifierId('CITIZEN01');
            setPassword('password123');
        }
    }, [location.state]);

    // If already logged in, redirect
    useEffect(() => {
        if (user) {
            navigate(getDashboardPath());
        }
    }, [user, navigate, getDashboardPath]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isRegister) {
                const userData = await register({
                    identifierId,
                    fullName,
                    email,
                    password,
                    phoneNumber
                });
                navigate(getDashboardPath(userData.role));
            } else {
                const userData = await login(identifierId, password);
                navigate(getDashboardPath(userData.role));
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (id, pw) => {
        setIdentifierId(id);
        setPassword(pw);
        setError(null);
    };

    return (
        <main className="page">
            <div className="form">
                <div style={{ textAlign: 'center', fontSize: '46px', marginBottom: '8px' }}>
                    🌿
                </div>

                <h2 style={{ textAlign: 'center' }}>
                    {isRegister ? 'Register as Citizen' : 'Welcome Back'}
                </h2>

                <p style={{ textAlign: 'center' }}>
                    {isRegister 
                        ? 'Join the community and earn Eco Points by keeping your city clean.' 
                        : 'Login to continue to the Smart Waste ecosystem.'}
                </p>

                {error && (
                    <div style={{
                        background: '#fde7e7',
                        color: '#a13d3d',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        marginBottom: '16px',
                        fontWeight: 600
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <div className="field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="field">
                        <label>
                            {isRegister ? 'Citizen ID / Username' : 'Government ID / Worker ID / Authority ID'}
                        </label>
                        <input
                            type="text"
                            placeholder={isRegister ? 'Choose a username or ID' : 'e.g. CITIZEN01 / WORKER01 / AUTH01'}
                            value={identifierId}
                            onChange={(e) => setIdentifierId(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--muted)'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        style={{ width: '100%', textAlign: 'center', marginTop: '10px' }}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Login'}
                    </button>
                </form>

                {/* Quick 1-click Demo Accounts */}
                {!isRegister && (
                    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
                            Quick Demo Sign-In (1 Click)
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            <button
                                type="button"
                                className="btn light"
                                style={{ margin: 0, fontSize: '11px', padding: '8px 4px', textAlign: 'center' }}
                                onClick={() => fillDemo('CITIZEN01', 'password123')}
                            >
                                👤 Citizen
                            </button>
                            <button
                                type="button"
                                className="btn light"
                                style={{ margin: 0, fontSize: '11px', padding: '8px 4px', textAlign: 'center', color: '#1f5898' }}
                                onClick={() => fillDemo('WORKER01', 'password123')}
                            >
                                🚶 Worker
                            </button>
                            <button
                                type="button"
                                className="btn light"
                                style={{ margin: 0, fontSize: '11px', padding: '8px 4px', textAlign: 'center', color: '#463489' }}
                                onClick={() => fillDemo('AUTH01', 'password123')}
                            >
                                🏛️ Authority
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
                    {isRegister ? (
                        <span>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => { setIsRegister(false); setError(null); }}
                                style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Log in
                            </button>
                        </span>
                    ) : (
                        <span>
                            Citizen without an account?{' '}
                            <button
                                type="button"
                                onClick={() => { setIsRegister(true); setError(null); }}
                                style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Register here
                            </button>
                        </span>
                    )}
                </div>
            </div>
        </main>
    );
}
