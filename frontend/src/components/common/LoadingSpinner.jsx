import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            gap: '14px',
            color: 'var(--muted)'
        }}>
            <div style={{
                width: '36px',
                height: '36px',
                border: '3px solid #dfe8e2',
                borderTopColor: 'var(--green)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ fontSize: '14px', fontWeight: 600 }}>{message}</p>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
