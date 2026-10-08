import React, { useState, useEffect } from 'react';
import { authorityApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Leaf, Award, Recycle, CloudRain, Trees } from 'lucide-react';

export default function RecyclingUnit() {
    const [recyclingData, setRecyclingData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authorityApi.getRecycling()
            .then(data => setRecyclingData(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const defaultMaterials = [
        { material: 'Plastic', collectedKg: 450, targetKg: 500, percentage: 90, color: '#4caf50' },
        { material: 'Paper', collectedKg: 320, targetKg: 400, percentage: 80, color: '#2e7d32' },
        { material: 'Glass', collectedKg: 180, targetKg: 250, percentage: 72, color: '#276fbf' },
        { material: 'Metal', collectedKg: 150, targetKg: 200, percentage: 75, color: '#e9a43a' },
        { material: 'E-Waste', collectedKg: 90, targetKg: 100, percentage: 90, color: '#5842a8' }
    ];

    const materials = recyclingData?.materials || defaultMaterials;

    return (
        <main className="page">
            <div className="page-title">
                <div>
                    <div className="kicker">Sustainability</div>
                    <h2>Recycling Dashboard</h2>
                    <p>Track city-wide recycling quantities, target achievement, and environmental offsets.</p>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner message="Calculating recycling metrics..." />
            ) : (
                <>
                    {/* Top Impact Banner */}
                    <div className="grid3" style={{ marginBottom: '24px' }}>
                        <div className="card" style={{ background: 'linear-gradient(135deg, #f0f9f2, #e0f2e5)', borderLeft: '4px solid var(--green)' }}>
                            <div className="label">Total Recycled Materials</div>
                            <div className="stat" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {recyclingData?.totalRecycledKg || 1810} <span style={{ fontSize: '15px' }}>kg</span>
                                <Recycle size={24} color="var(--green)" />
                            </div>
                            <p>Recovered and processed through municipal recycling partners.</p>
                        </div>

                        <div className="card" style={{ borderLeft: '4px solid #276fbf' }}>
                            <div className="label">Carbon Offset (CO2 Saved)</div>
                            <div className="stat" style={{ color: '#276fbf', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {recyclingData?.co2SavedKg || 854} <span style={{ fontSize: '15px' }}>kg</span>
                                <Trees size={24} color="#276fbf" />
                            </div>
                            <p>Equivalent to planting 38 mature trees in the city.</p>
                        </div>

                        <div className="card" style={{ borderLeft: '4px solid #5842a8' }}>
                            <div className="label">Landfill Diversion Rate</div>
                            <div className="stat" style={{ color: '#5842a8' }}>
                                {recyclingData?.landfillDivertedPercentage || 82.5}%
                            </div>
                            <p>Target for this quarter: 85% diversion.</p>
                        </div>
                    </div>

                    {/* Material Progress Cards matching reference recycling.html */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="kicker">Target Tracking</div>
                        <h3 style={{ margin: '4px 0 16px' }}>Materials Recovered vs Monthly Targets</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {materials.map((item, idx) => (
                                <div key={idx} style={{ background: '#fcfdfc', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '18px' }}>
                                                {item.material === 'Plastic' ? '🧴' : item.material === 'Paper' ? '📦' : item.material === 'Glass' ? '🍾' : item.material === 'Metal' ? '🥫' : '🔌'}
                                            </span>
                                            <span style={{ fontWeight: 700, fontSize: '15px', color: '#1c4f2a' }}>
                                                {item.material}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                                            <b style={{ color: '#26352d' }}>{item.collectedKg} kg</b> / {item.targetKg} kg ({item.percentage}%)
                                        </div>
                                    </div>
                                    <div className="bar" style={{ height: '12px' }}>
                                        <i style={{ width: `${item.percentage}%`, background: item.color || 'var(--green)' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Circular Economy Info Card */}
                    <div className="grid2">
                        <div className="card" style={{ background: 'linear-gradient(135deg, #e9f6ed, #d9efe0)' }}>
                            <div className="kicker">Circular Economy</div>
                            <h3 style={{ margin: '4px 0 8px' }}>From Waste to Secondary Raw Materials</h3>
                            <p style={{ lineHeight: 1.6, fontSize: '13px' }}>
                                All segregated plastics are converted into recycled polymer pellets for local manufacturing. Organic bio-waste is composted for public community gardens and green spaces.
                            </p>
                            <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                                <span className="pill">Zero Open Burning</span>
                                <span className="pill blue">Closed Loop Sorting</span>
                            </div>
                        </div>

                        <div className="card">
                            <div className="kicker">City Green Rank</div>
                            <h3 style={{ margin: '4px 0 8px' }}>Clean City Index: Grade A+ 🌿</h3>
                            <p style={{ lineHeight: 1.6, fontSize: '13px' }}>
                                Thanks to active citizen reporting and accelerated sanitation response times, our municipality has achieved a 94.8% clean corridor rating across primary zones.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
