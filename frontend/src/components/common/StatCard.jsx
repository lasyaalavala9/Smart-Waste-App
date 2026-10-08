import React from 'react';

export default function StatCard({ label, stat, description, icon, color = 'green' }) {
    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="label">{label}</div>
                {icon && <div style={{ fontSize: '20px' }}>{icon}</div>}
            </div>
            <div className="stat" style={{ color: color === 'green' ? 'var(--green)' : color }}>
                {stat}
            </div>
            {description && <p>{description}</p>}
        </div>
    );
}
