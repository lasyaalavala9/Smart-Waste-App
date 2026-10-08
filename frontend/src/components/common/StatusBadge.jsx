import React from 'react';

export default function StatusBadge({ status }) {
    if (!status) return null;

    let badgeClass = 'pill';
    let label = status;

    switch (status.toUpperCase()) {
        case 'SUBMITTED':
            badgeClass = 'pill orange';
            label = 'Submitted';
            break;
        case 'ASSIGNED':
            badgeClass = 'pill blue';
            label = 'Assigned';
            break;
        case 'IN_PROGRESS':
            badgeClass = 'pill purple';
            label = 'In Progress';
            break;
        case 'COMPLETED':
            badgeClass = 'pill'; // default green
            label = 'Completed';
            break;
        case 'REJECTED':
            badgeClass = 'pill red';
            label = 'Rejected';
            break;
        case 'HIGH':
        case 'URGENT':
            badgeClass = 'pill red';
            label = status;
            break;
        case 'MEDIUM':
            badgeClass = 'pill orange';
            label = status;
            break;
        case 'LOW':
            badgeClass = 'pill';
            label = status;
            break;
        default:
            badgeClass = 'pill';
    }

    return (
        <span className={badgeClass}>
            {label}
        </span>
    );
}
