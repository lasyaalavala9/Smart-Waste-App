import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin } from 'lucide-react';

const pinIcon = L.divIcon({
    className: 'picker-pin',
    html: `<div style="
        background: #2f7d32;
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        border: 2px solid white;
    ">
        <span style="transform: rotate(45deg); font-size: 16px;">📍</span>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34]
});

function MapClickHandler({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
}

export default function LocationPicker({ 
    latitude, 
    longitude, 
    onChange, 
    height = '240px' 
}) {
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsError, setGpsError] = useState(null);

    const defaultLat = latitude || 12.9716;
    const defaultLng = longitude || 77.5946;

    const handleDetectGps = () => {
        if (!navigator.geolocation) {
            setGpsError('Geolocation is not supported by your browser.');
            return;
        }

        setGpsLoading(true);
        setGpsError(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = parseFloat(pos.coords.latitude.toFixed(6));
                const lng = parseFloat(pos.coords.longitude.toFixed(6));
                onChange({ latitude: lat, longitude: lng });
                setGpsLoading(false);
            },
            (err) => {
                console.warn('Geolocation error:', err);
                setGpsError('Unable to retrieve GPS. You can click on the map to pinpoint.');
                setGpsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--green)" />
                    {latitude && longitude ? (
                        <span>Coordinates: <b>{latitude.toFixed(4)}, {longitude.toFixed(4)}</b></span>
                    ) : (
                        <span>Click map or use GPS to set location</span>
                    )}
                </span>
                <button
                    type="button"
                    className="btn light"
                    style={{ margin: 0, padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={handleDetectGps}
                    disabled={gpsLoading}
                >
                    <Navigation size={12} />
                    {gpsLoading ? 'Detecting...' : 'Detect GPS'}
                </button>
            </div>

            {gpsError && (
                <div style={{ fontSize: '11px', color: '#d94b4b', marginBottom: '6px' }}>
                    {gpsError}
                </div>
            )}

            <div style={{ height, width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--line)' }}>
                <MapContainer
                    center={[defaultLat, defaultLng]}
                    zoom={14}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler onLocationSelect={(lat, lng) => onChange({ latitude: lat, longitude: lng })} />
                    {latitude && longitude && (
                        <Marker position={[latitude, longitude]} icon={pinIcon} />
                    )}
                </MapContainer>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                💡 Click anywhere on the map to reposition the pickup point.
            </div>
        </div>
    );
}
