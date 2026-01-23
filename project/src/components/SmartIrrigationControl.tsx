import { useState, useEffect } from 'react';
import Icon from './Icon';
import { getSession } from '../utils/auth';

interface Zone {
    id: string;
    name: string;
    moisture: number;
    status: 'active' | 'idle' | 'warning';
    lastWatered: string;
    nextSchedule: string;
    autoMode: boolean;
}

export default function SmartIrrigationControl() {
    const [systemActive, setSystemActive] = useState(true);
    const [waterPressure, setWaterPressure] = useState(65); // PSI
    const [flowRate, setFlowRate] = useState(0); // L/min

    const [userPhone, setUserPhone] = useState<string>('');
    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
        const session = getSession();
        if (session?.phone) {
            setUserPhone(session.phone);
        } else {
            setUserPhone('9876543210'); // Default demo number
        }
    }, []);

    const [zones, setZones] = useState<Zone[]>([
        { id: 'z1', name: 'North Field (Rice)', moisture: 45, status: 'idle', lastWatered: '2h ago', nextSchedule: '14:00 Today', autoMode: true },
        { id: 'z2', name: 'South Orchard', moisture: 28, status: 'warning', lastWatered: 'Yesterday', nextSchedule: 'Now', autoMode: true },
        { id: 'z3', name: 'Greenhouse A', moisture: 72, status: 'idle', lastWatered: '30m ago', nextSchedule: 'Tomorrow', autoMode: false },
        { id: 'z4', name: 'West Vegetable Patch', moisture: 55, status: 'idle', lastWatered: '5h ago', nextSchedule: '16:00 Today', autoMode: true },
    ]);

    // AI Nature-based Automation Logic
    useEffect(() => {
        if (!systemActive) return;

        const aiCheckInterval = setInterval(() => {
            setZones(prevZones => {
                return prevZones.map(zone => {
                    // AI Decision Method: If Auto Mode is ON and Moisture is critical (< 30%)
                    if (zone.autoMode && zone.moisture < 30 && zone.status !== 'active') {
                        // Trigger AI Action
                        // 1. Simulate SMS Notification
                        const msg = `[AI ALERT] Starting irrigation for ${zone.name} due to low moisture (${zone.moisture}%). SMS sent to ${userPhone}`;
                        setNotifications(prev => [msg, ...prev].slice(0, 3));

                        // 2. Activate Zone
                        return { ...zone, status: 'active', lastWatered: 'Just now' };
                    }

                    // Stop irrigation if moisture is sufficient (Simulated recovery)
                    if (zone.status === 'active' && zone.autoMode && zone.moisture > 80) {
                        return { ...zone, status: 'idle' };
                    }
                    return zone;
                });
            });
        }, 5000); // Check every 5 seconds for demo purposes

        return () => clearInterval(aiCheckInterval);
    }, [systemActive, userPhone]);

    // Simulate moisture changes when irrigating
    useEffect(() => {
        const moistureInterval = setInterval(() => {
            setZones(prev => prev.map(z => {
                if (z.status === 'active') {
                    // Increase moisture fast
                    const newMoisture = Math.min(100, z.moisture + 5);
                    return { ...z, moisture: newMoisture };
                } else {
                    // dry out slowly
                    const newMoisture = Math.max(10, z.moisture - 0.1); // slow drying
                    return { ...z, moisture: Number(newMoisture.toFixed(1)) };
                }
            }));
        }, 1000);
        return () => clearInterval(moistureInterval);
    }, []);

    // Simulate dynamic values
    useEffect(() => {
        if (!systemActive) {
            setFlowRate(0);
            return;
        }
        const interval = setInterval(() => {
            // Fluctuate pressure slightly
            setWaterPressure(prev => Math.max(50, Math.min(80, prev + (Math.random() - 0.5) * 5)));

            // Calculate flow rate based on active zones
            const activeCount = zones.filter(z => z.status === 'active').length;
            const targetFlow = activeCount * 45; // ~45 L/min per zone
            setFlowRate(prev => {
                const diff = targetFlow - prev;
                return prev + diff * 0.1; // Smooth transition
            });

        }, 1000);
        return () => clearInterval(interval);
    }, [zones, systemActive]);

    const toggleZone = (id: string, currentStatus: string) => {
        if (!systemActive) return;
        setZones(prev => prev.map(z => {
            if (z.id === id) {
                const newStatus = currentStatus === 'active' ? 'idle' : 'active';
                return { ...z, status: newStatus };
            }
            return z;
        }));
    };

    const toggleAuto = (id: string) => {
        setZones(prev => prev.map(z => {
            if (z.id === id) return { ...z, autoMode: !z.autoMode };
            return z;
        }));
    };

    return (
        <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Icon name="Droplets" className="h-6 w-6" />
                            Smart Irrigation Control
                        </h2>
                        <p className="text-blue-100 opacity-90 text-sm mt-1">Advanced Automated Field Management</p>
                    </div>
                    <div className="flex items-center gap-3 bg-blue-700/30 p-2 rounded-xl border border-white/20 backdrop-blur-sm">
                        <div className="text-right">
                            <p className="text-xs font-medium opacity-80">MAIN PUMP</p>
                            <p className={`text-sm font-bold ${systemActive ? 'text-green-300' : 'text-red-300'}`}>
                                {systemActive ? 'RUNNING' : 'STOPPED'}
                            </p>
                        </div>
                        <button
                            onClick={() => setSystemActive(!systemActive)}
                            className={`p-3 rounded-full transition-all shadow-lg ${systemActive ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            <Icon name="Power" className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* System Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-1 opacity-80">
                            <Icon name="Gauge" className="h-4 w-4" />
                            <span className="text-xs font-medium">PRESSURE</span>
                        </div>
                        <div className="text-2xl font-black">{Math.round(waterPressure)} <span className="text-sm font-normal opacity-70">PSI</span></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-1 opacity-80">
                            <Icon name="Activity" className="h-4 w-4" />
                            <span className="text-xs font-medium">FLOW RATE</span>
                        </div>
                        <div className="text-2xl font-black">{Math.round(flowRate)} <span className="text-sm font-normal opacity-70">L/min</span></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-1 opacity-80">
                            <Icon name="CalendarClock" className="h-4 w-4" />
                            <span className="text-xs font-medium">SCHEDULE</span>
                        </div>
                        <div className="text-2xl font-black">4 <span className="text-sm font-normal opacity-70">Events</span></div>
                    </div>
                </div>
            </div>

            {/* AI Notification Ticker */}
            {notifications.length > 0 && (
                <div className="mt-4 bg-blue-800/50 rounded-lg p-2 animate-fade-in mx-6 mb-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-white">
                        <Icon name="MessageSquare" className="h-3 w-3 text-green-300" />
                        <span>Latest AI Action: {notifications[0]}</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Icon name="Map" className="h-4 w-4 text-blue-500" /> Zone Management
                    </h3>
                    <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
                        + ADD ZONE
                    </button>
                </div>

                <div className="space-y-4">
                    {zones.map(zone => (
                        <div key={zone.id} className={`border rounded-xl p-4 transition-all duration-300 ${zone.status === 'active' ? 'border-blue-500 shadow-md bg-blue-50/30' : 'border-gray-200 hover:border-blue-200'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                {/* Zone Info */}
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${zone.status === 'active' ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-gray-100 text-gray-500'}`}>
                                        <Icon name="Sprout" className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{zone.name}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            <span className={`flex items-center gap-1 ${zone.moisture < 30 ? 'text-red-500 font-bold' : ''}`}>
                                                <Icon name="Droplet" className="h-3 w-3" /> {zone.moisture}% Moisture
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Icon name="Clock" className="h-3 w-3" /> Last: {zone.lastWatered}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-4 self-end sm:self-auto">

                                    {/* Auto Mode Toggle */}
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-[10px] font-bold text-gray-400">AI AUTO</span>
                                        <button
                                            onClick={() => toggleAuto(zone.id)}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors ${zone.autoMode ? 'bg-green-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${zone.autoMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    {/* Manual Valve Control */}
                                    <button
                                        onClick={() => toggleZone(zone.id, zone.status)}
                                        disabled={!systemActive}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm
                                    ${!systemActive ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' :
                                                zone.status === 'active'
                                                    ? 'bg-blue-600 text-white shadow-blue-300 hover:bg-blue-700'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }
                                `}
                                    >
                                        <Icon name="Droplets" className={`h-4 w-4 ${zone.status === 'active' ? 'animate-bounce' : ''}`} />
                                        {zone.status === 'active' ? 'IRRIGATING' : 'START WATER'}
                                    </button>
                                </div>
                            </div>

                            {/* Zone Details / Progress (Visible if active) */}
                            {zone.status === 'active' && (
                                <div className="mt-4 pt-4 border-t border-blue-100">
                                    <div className="flex justify-between text-xs font-semibold text-blue-800 mb-1">
                                        <span>Cycle Progress</span>
                                        <span>15m remaining</span>
                                    </div>
                                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-1/3 animate-pulse rounded-full" />
                                    </div>
                                    <div className="flex gap-4 mt-3">
                                        <span className="text-xs text-blue-600 flex items-center gap-1">
                                            <Icon name="Zap" className="h-3 w-3" /> Pump B Running
                                        </span>
                                        <span className="text-xs text-blue-600 flex items-center gap-1">
                                            <Icon name="Wind" className="h-3 w-3" /> Flow: 42 L/min
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Smart Alert */}
                            {zone.moisture < 30 && zone.status !== 'active' && (
                                <div className="mt-3 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 animate-pulse">
                                    <Icon name="AlertTriangle" className="h-4 w-4" />
                                    Critical moisture levels detected. Recommendation: Irrigate immediately.
                                    {zone.autoMode && <span className="font-bold underline cursor-pointer">Starting in 2m...</span>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Icon name="Smartphone" className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Mobile Remote Access</p>
                            <p className="text-xs text-gray-500">Connected to device: Samsung S24 Ultra</p>
                        </div>
                    </div>
                    <button className="text-indigo-600 text-sm font-bold hover:underline">
                        Configure
                    </button>
                </div>
            </div>
        </div >
    );
}
