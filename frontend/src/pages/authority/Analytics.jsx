import React, { useState, useEffect } from 'react';
import { authorityApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';

const COLORS = ['#2f7d32', '#276fbf', '#e9a43a', '#5842a8', '#d94b4b', '#1c4f2a'];

export default function Analytics() {
    const [trends, setTrends] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            authorityApi.getTrends(),
            authorityApi.getAnalytics()
        ])
            .then(([trendsRes, analyticsRes]) => {
                setTrends(trendsRes);
                setAnalytics(analyticsRes);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const wasteDistribution = [
        { name: 'Plastic', value: 450 },
        { name: 'Paper', value: 320 },
        { name: 'Organic', value: 620 },
        { name: 'Glass', value: 180 },
        { name: 'Metal', value: 150 },
        { name: 'E-Waste', value: 90 }
    ];

    return (
        <main className="page">
            <div className="page-title">
                <div>
                    <div className="kicker">City Operations</div>
                    <h2>Analytics & Performance</h2>
                    <p>Statistical breakdown of municipal waste intake, recycling metrics, and worker resolution performance.</p>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner message="Generating analytics reports..." />
            ) : (
                <>
                    {/* Top KPI Cards */}
                    <div className="grid" style={{ marginBottom: '22px' }}>
                        <div className="card">
                            <div className="label">Total Complaints Logged</div>
                            <div className="stat">{analytics?.totalComplaints || 38}</div>
                            <p>Recorded this month</p>
                        </div>

                        <div className="card">
                            <div className="label">Resolved Successfully</div>
                            <div className="stat" style={{ color: 'var(--green2)' }}>
                                {analytics?.completedComplaints || 18}
                            </div>
                            <p>Cleaned & certified</p>
                        </div>

                        <div className="card">
                            <div className="label">Resolution Rate</div>
                            <div className="stat" style={{ color: 'var(--blue)' }}>
                                78.4%
                            </div>
                            <p>Within SLA timeframe</p>
                        </div>

                        <div className="card">
                            <div className="label">Avg Response Time</div>
                            <div className="stat" style={{ color: 'var(--purple)' }}>
                                3.2 <span style={{ fontSize: '14px', fontWeight: 600 }}>hrs</span>
                            </div>
                            <p>From report to dispatch</p>
                        </div>
                    </div>

                    {/* Chart 1: Daily Waste Collection & Complaints Trend */}
                    <div className="card" style={{ marginBottom: '22px' }}>
                        <div className="kicker">Weekly Trends</div>
                        <h3 style={{ margin: '4px 0 16px' }}>Daily Waste Collection (kg) vs Complaints</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={trends?.dailyData || []}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#edf1ee" />
                                    <XAxis dataKey="day" stroke="var(--muted)" />
                                    <YAxis stroke="var(--muted)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid var(--line)' }}
                                    />
                                    <Bar dataKey="collected" fill="#2f7d32" radius={[6, 6, 0, 0]} name="Waste Collected (kg)" />
                                    <Bar dataKey="complaints" fill="#e9a43a" radius={[6, 6, 0, 0]} name="Complaints Reported" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2 & 3: Waste Type Breakdown & Worker Performance */}
                    <div className="grid2">
                        <div className="card">
                            <div className="kicker">Categorical Distribution</div>
                            <h3 style={{ margin: '4px 0 16px' }}>Waste Intake by Material</h3>
                            <div style={{ height: '240px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={wasteDistribution}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={85}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {wasteDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="card">
                            <div className="kicker">Operational Efficiency</div>
                            <h3 style={{ margin: '4px 0 14px' }}>Sector Performance & Compliance</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                                        <span>Sector 5 (Park & Residential)</span>
                                        <span style={{ color: 'var(--green)' }}>92% on-time</span>
                                    </div>
                                    <div className="bar"><i style={{ width: '92%' }} /></div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                                        <span>Sector 2 & Commercial Area</span>
                                        <span style={{ color: 'var(--blue)' }}>85% on-time</span>
                                    </div>
                                    <div className="bar"><i style={{ width: '85%', background: 'var(--blue)' }} /></div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                                        <span>Sector 7 (Market Square)</span>
                                        <span style={{ color: 'var(--orange)' }}>74% on-time</span>
                                    </div>
                                    <div className="bar"><i style={{ width: '74%', background: 'var(--orange)' }} /></div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                                        <span>Smart Bin Sensor Coverage</span>
                                        <span style={{ color: 'var(--purple)' }}>88% active</span>
                                    </div>
                                    <div className="bar"><i style={{ width: '88%', background: 'var(--purple)' }} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
