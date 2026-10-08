import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from '../common/StatusBadge';

// Helper to create beautiful status-colored HTML markers
const createCustomIcon = (status, priority) => {
    let color = '#2f7d32'; // green
    if (priority === 'URGENT' || priority === 'HIGH') color = '#d94b4b'; // red
    else if (status === 'ASSIGNED') color = '#276fbf'; // blue
    else if (status === 'IN_PROGRESS') color = '#5842a8'; // purple
    else if (status === 'COMPLETED') color = '#2e7d32'; // green
    else if (status === 'SUBMITTED') color = '#e9a43a'; // orange

    return L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
            background: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            border: 2px solid white;
        ">
            <span style="
                transform: rotate(45deg);
                font-size: 14px;
                color: white;
            ">📍</span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -28]
    });
};

export default function InteractiveMap({ 
    items = [], 
    center = [12.9716, 77.5946], 
    zoom = 13, 
    height = '380px',
    onSelect
}) {
    // If items has at least one valid coordinate, center on it
    const initialCenter = items.length > 0 && items[0].location?.latitude 
        ? [items[0].location.latitude, items[0].location.longitude] 
        : center;

    return (
        <div style={{ height, width: '100%', borderRadius: '18px', overflow: 'hidden', position: 'relative' }}>
            <MapContainer 
                center={initialCenter} 
                zoom={zoom} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {items.map((item) => {
                    const lat = item.location?.latitude;
                    const lng = item.location?.longitude;
                    if (!lat || !lng) return null;

                    return (
                        <Marker 
                            key={item.id} 
                            position={[lat, lng]} 
                            icon={createCustomIcon(item.status, item.priority)}
                            eventHandlers={{
                                click: () => onSelect && onSelect(item)
                            }}
                        >
                            <Popup>
                                <div style={{ minWidth: '180px', padding: '4px' }}>
                                    <div style={{ fontWeight: 800, color: '#1c4f2a', fontSize: '14px', marginBottom: '4px' }}>
                                        {item.complaintCode || `Report #${item.id}`}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#555', marginBottom: '6px' }}>
                                        <b>Type:</b> {item.wasteType}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                        📍 {item.location?.address || 'City Zone'}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <StatusBadge status={item.status} />
                                        <StatusBadge status={item.priority} />
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
