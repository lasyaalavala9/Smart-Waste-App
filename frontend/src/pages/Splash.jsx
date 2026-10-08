import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Splash() {
    const navigate = useNavigate();
    const { user, getDashboardPath } = useAuth();

    useEffect(() => {
        // If already logged in, redirect to dashboard after brief display
        if (user) {
            const timer = setTimeout(() => {
                navigate(getDashboardPath());
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [user, navigate, getDashboardPath]);

    return (
        <div className="splash">
            <div className="splash-box">
                <div className="leaf">♻️</div>

                <div className="kicker" style={{ color: '#a3e4b0', fontSize: '13px', letterSpacing: '2px' }}>
                    Clean Today, Greener Tomorrow
                </div>

                <h1>
                    Smart Waste<br />
                    Better Tomorrow
                </h1>

                <p>
                    Report. Collect. Recycle.<br />
                    Build a Cleaner, Sustainable World.
                </p>

                <div className="dots">
                    • • • •
                </div>

                <button 
                    className="btn"
                    style={{ fontSize: '16px', padding: '14px 32px', borderRadius: '14px' }}
                    onClick={() => navigate('/role')}
                >
                    Get Started →
                </button>
            </div>
        </div>
    );
}
