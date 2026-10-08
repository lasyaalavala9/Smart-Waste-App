import React, { useState, useRef } from 'react';
import { Camera, Upload, X, RefreshCw } from 'lucide-react';

export default function CameraCapture({ image, onImageChange, label = 'Upload or Capture Photo' }) {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const streamRef = useRef(null);

    const startCamera = async () => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            streamRef.current = stream;
            setIsCameraOpen(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (err) {
            console.error('Camera access error:', err);
            setCameraError('Unable to access device camera. Please upload a photo from your files.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onImageChange(dataUrl);
        stopCamera();
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file (JPG, PNG, WebP).');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            onImageChange(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{ marginTop: '8px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                {label}
            </label>

            {image ? (
                <div style={{ position: 'relative', textAlign: 'center', background: '#eef6f0', padding: '16px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                    <img 
                        src={image} 
                        alt="Captured evidence" 
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', objectFit: 'cover' }} 
                    />
                    <button
                        type="button"
                        onClick={() => onImageChange(null)}
                        style={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            background: '#d94b4b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                        title="Remove photo"
                    >
                        <X size={16} />
                    </button>
                    <div style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600, marginTop: '8px' }}>
                        ✓ Photo attached
                    </div>
                </div>
            ) : isCameraOpen ? (
                <div style={{ background: '#000', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        style={{ width: '100%', maxHeight: '240px', borderRadius: '12px', objectFit: 'cover' }} 
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
                        <button 
                            type="button" 
                            className="btn" 
                            onClick={capturePhoto}
                            style={{ margin: 0, padding: '8px 18px' }}
                        >
                            📸 Snap Photo
                        </button>
                        <button 
                            type="button" 
                            className="btn red" 
                            onClick={stopCamera}
                            style={{ margin: 0, padding: '8px 18px' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div 
                    className="upload-box"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📸</div>
                    <div style={{ fontWeight: 700, color: '#284f35', fontSize: '14px', marginBottom: '4px' }}>
                        Click to upload photo
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
                        JPG, PNG or WebP up to 15MB
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '12px' }}>
                        <button
                            type="button"
                            className="btn light"
                            style={{ margin: 0, fontSize: '12px', padding: '6px 14px' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                        >
                            <Upload size={14} /> Browse Files
                        </button>
                        {navigator.mediaDevices?.getUserMedia && (
                            <button
                                type="button"
                                className="btn"
                                style={{ margin: 0, fontSize: '12px', padding: '6px 14px' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startCamera();
                                }}
                            >
                                <Camera size={14} /> Open Camera
                            </button>
                        )}
                    </div>

                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={handleFileUpload}
                    />
                </div>
            )}

            {cameraError && (
                <div style={{ fontSize: '11px', color: '#d94b4b', marginTop: '6px' }}>
                    {cameraError}
                </div>
            )}
        </div>
    );
}
