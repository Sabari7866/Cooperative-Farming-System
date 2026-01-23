import React, { useState, useEffect } from 'react';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    ComposedChart,
    Bar,
    Legend,
} from 'recharts';
import Icon from './Icon';
import SmartIrrigationControl from './SmartIrrigationControl';
// import SmartCropDoctor from './SmartCropDoctor'; // Removed as per user request
import SmartWaterManager from './SmartWaterManager';
import { useLands } from '../hooks/useApi';

interface SensorData {
    time: string;
    moisture: number;
    temperature: number;
    humidity: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
}

const IoTDashboard: React.FC = () => {
    const { data: lands, loading: landsLoading } = useLands();
    const [selectedLandId, setSelectedLandId] = useState<string>('');
    const [data, setData] = useState<SensorData[]>([]);
    const [currentReadings, setCurrentReadings] = useState<SensorData | null>(null);
    const [isLive, setIsLive] = useState(true);

    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [simulationMode] = useState<'auto' | 'manual'>('auto');
    const [manualValues, setManualValues] = useState({
        temperature: 28,
        humidity: 65,
        moisture: 45,
        nitrogen: 140,
        phosphorus: 45,
        potassium: 180
    });


    // View Mode State: 'monitor' (Sensors, Map) or 'control' (Irrigation, Crop Doctor)
    const [viewMode, setViewMode] = useState<'monitor' | 'control'>('monitor');

    const [mapType, setMapType] = useState<'satellite' | 'terrain'>('satellite');

    // Select first land by default
    useEffect(() => {
        if (lands && lands.length > 0 && !selectedLandId) {
            setSelectedLandId(lands[0].id);
        }
    }, [lands, selectedLandId]);

    const selectedLand = lands?.find(l => l.id === selectedLandId);

    // Get Live Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    setLocationError("Location access denied. Using default farm coordinates.");
                }
            );
        }
    }, []);

    // Initialize with some historical data (keep existing logic)
    useEffect(() => {
        const initialData: SensorData[] = [];
        const now = new Date();
        // Use selectedLandId as seed for slight variation (mock)
        const seed = selectedLandId ? selectedLandId.charCodeAt(0) : 0;

        for (let i = 20; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
            initialData.push(generateRandomData(time, seed));
        }
        setData(initialData);
        setCurrentReadings(initialData[initialData.length - 1]);
    }, [selectedLandId]);

    // Loop for Data Updates
    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            const now = new Date();
            let newData: SensorData;
            const seed = selectedLandId ? selectedLandId.charCodeAt(0) : 0;

            if (simulationMode === 'auto') {
                newData = generateRandomData(now, seed);
            } else {
                // Manual Mode: Use the manual values but add slight jitter for realism
                newData = {
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    temperature: Number((manualValues.temperature + Math.random() * 0.4 - 0.2).toFixed(1)),
                    humidity: Math.floor(manualValues.humidity + Math.random() * 2 - 1),
                    moisture: Math.floor(manualValues.moisture + Math.random() * 2 - 1),
                    nitrogen: manualValues.nitrogen,
                    phosphorus: manualValues.phosphorus,
                    potassium: manualValues.potassium,
                };
            }

            setData(prev => {
                const newHistory = [...prev, newData];
                if (newHistory.length > 30) newHistory.shift();
                return newHistory;
            });
            setCurrentReadings(newData);
        }, 2000);

        return () => clearInterval(interval);
    }, [isLive, simulationMode, manualValues, selectedLandId]);

    const generateRandomData = (date: Date, seed: number = 0): SensorData => {
        // Simulate some realistic fluctuations
        const baseTemp = 28 + (seed % 5);
        const baseHum = 65 + (seed % 10 - 5);
        const baseMoisture = 45 + (seed % 10 - 5);

        return {
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            temperature: Number((baseTemp + Math.random() * 2 - 1).toFixed(1)),
            humidity: Math.floor(baseHum + Math.random() * 5 - 2.5),
            moisture: Math.floor(baseMoisture + Math.random() * 4 - 2),
            nitrogen: Math.floor(140 + Math.random() * 10 - 5),
            phosphorus: Math.floor(45 + Math.random() * 4 - 2),
            potassium: Math.floor(180 + Math.random() * 15 - 7.5),
        };
    };

    const getStatusColor = (value: number, type: 'moisture' | 'temp' | 'humidity') => {
        if (type === 'moisture') {
            if (value < 30) return 'text-red-500';
            if (value < 40) return 'text-yellow-500';
            return 'text-green-500';
        }
        return 'text-gray-700';
    };

    const handleManualChange = (key: keyof typeof manualValues, value: number) => {
        setManualValues(prev => ({ ...prev, [key]: value }));
    };

    if (!currentReadings) return (
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Connecting to satellite sensors...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn p-6 bg-gradient-to-br from-gray-50 to-green-50/20 min-h-screen">

            {/* Header with Location & Optimized Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-premium border border-white/40 glass">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-600 rounded-xl shadow-lg ring-4 ring-green-50">
                        <Icon name="Wifi" className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            IoT Smart Farm Monitor
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Icon name="MapPin" className="h-4 w-4 text-green-600" />
                                {landsLoading ? (
                                    <span className="text-sm font-medium text-gray-500 animate-pulse">Loading lands...</span>
                                ) : lands && lands.length > 0 ? (
                                    <select
                                        value={selectedLandId}
                                        onChange={(e) => setSelectedLandId(e.target.value)}
                                        className="bg-gray-100 border-none rounded-md py-1 px-3 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-green-500 cursor-pointer"
                                    >
                                        {lands.map((land) => (
                                            <option key={land.id} value={land.id}>
                                                {land.name || land.location} ({land.crop})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="font-medium text-gray-500 italic">No lands added</span>
                                )}
                            </div>
                            <span className="hidden sm:flex items-center gap-1.5 font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md capitalize">
                                <Icon name="Map" className="h-3.5 w-3.5" />
                                {mapType} View
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex bg-white/50 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-gray-200">
                    <button
                        onClick={() => setViewMode('monitor')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'monitor' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-gray-600 hover:bg-white/50'}`}
                    >
                        <Icon name="Activity" className="h-4 w-4" />
                        Monitoring
                    </button>
                    <button
                        onClick={() => setViewMode('control')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'control' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-white/50'}`}
                    >
                        <Icon name="Settings" className="h-4 w-4" />
                        Control & Actions
                    </button>
                </div>

                <div className="h-8 w-px bg-gray-200 hidden sm:block" />

                <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
                    <button
                        onClick={() => setMapType('satellite')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mapType === 'satellite' ? 'bg-white shadow-md text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Satellite
                    </button>
                    <button
                        onClick={() => setMapType('terrain')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mapType === 'terrain' ? 'bg-white shadow-md text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Terrain
                    </button>
                </div>

                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${isLive ? 'bg-red-500 text-white shadow-red-200' : 'bg-green-500 text-white shadow-green-200'}`}
                >
                    <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-white animate-pulse' : 'bg-white'}`} />
                    {isLive ? 'LIVE' : 'PAUSED'}
                </button>
            </div>

            {
                viewMode === 'monitor' ? (
                    <div className="space-y-6 animate-slide-up">
                        {/* Manual Control Panel (Visible only in Manual Mode) */}
                        {simulationMode === 'manual' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fade-in">
                                <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2">
                                    <Icon name="Sliders" className="h-4 w-4" /> Sensor Input Control
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">Temperature ({manualValues.temperature}°C)</label>
                                        <input
                                            type="range"
                                            min="0" max="50"
                                            value={manualValues.temperature}
                                            onChange={(e) => handleManualChange('temperature', Number(e.target.value))}
                                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">Humidity ({manualValues.humidity}%)</label>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={manualValues.humidity}
                                            onChange={(e) => handleManualChange('humidity', Number(e.target.value))}
                                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">Moisture ({manualValues.moisture}%)</label>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={manualValues.moisture}
                                            onChange={(e) => handleManualChange('moisture', Number(e.target.value))}
                                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Gauges Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Moisture Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-strong border border-gray-100 relative overflow-hidden group hover:scale-[1.02] transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100">
                                            <Icon name="Droplets" className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Soil Moisture</h3>
                                    <div className="flex items-end gap-2 mt-2">
                                        <span className={`text-4xl font-black ${getStatusColor(currentReadings.moisture, 'moisture')}`}>
                                            {currentReadings.moisture}%
                                        </span>
                                        <span className="text-gray-400 text-sm font-bold mb-1">VOL</span>
                                    </div>
                                    <div className="h-12 mt-4 bg-blue-50/50 rounded-lg p-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={data}>
                                                    <defs>
                                                        <linearGradient id="gradMoisture" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <Area type="monotone" dataKey="moisture" stroke="#2563eb" fill="url(#gradMoisture)" strokeWidth={2} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Temp Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-strong border border-gray-100 relative overflow-hidden group hover:scale-[1.02] transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-100">
                                            <Icon name="Thermometer" className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Temperature</h3>
                                    <div className="flex items-end gap-2 mt-2">
                                        <span className="text-4xl font-black text-gray-900">
                                            {currentReadings.temperature}°C
                                        </span>
                                    </div>
                                    <div className="h-12 mt-4 bg-orange-50/50 rounded-lg p-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={data}>
                                                    <defs>
                                                        <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                                                            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <Area type="monotone" dataKey="temperature" stroke="#ea580c" fill="url(#gradTemp)" strokeWidth={2} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Humidity Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-strong border border-gray-100 relative overflow-hidden group hover:scale-[1.02] transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-100">
                                            <Icon name="Cloud" className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Humidity</h3>
                                    <div className="flex items-end gap-2 mt-2">
                                        <span className="text-4xl font-black text-gray-900">
                                            {currentReadings.humidity}%
                                        </span>
                                        <span className="text-gray-400 text-sm font-bold mb-1">RH</span>
                                    </div>
                                    <div className="h-12 mt-4 bg-teal-50/50 rounded-lg p-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={data}>
                                                    <defs>
                                                        <linearGradient id="gradHum" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
                                                            <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <Area type="monotone" dataKey="humidity" stroke="#0d9488" fill="url(#gradHum)" strokeWidth={2} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* NPK Status Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-strong border border-gray-100 relative overflow-hidden group hover:scale-[1.02] transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-100">
                                            <Icon name="Leaf" className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Nutrient Health</h3>
                                    <div className="flex items-end gap-2 mt-2">
                                        <span className="text-4xl font-black text-gray-900">
                                            Optimal
                                        </span>
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 gap-1">
                                        <div className="bg-green-100/80 text-green-800 p-1.5 rounded-lg text-[10px] font-black text-center ring-1 ring-green-200">N: {currentReadings.nitrogen}</div>
                                        <div className="bg-green-100/80 text-green-800 p-1.5 rounded-lg text-[10px] font-black text-center ring-1 ring-green-200">P: {currentReadings.phosphorus}</div>
                                        <div className="bg-green-100/80 text-green-800 p-1.5 rounded-lg text-[10px] font-black text-center ring-1 ring-green-200">K: {currentReadings.potassium}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Field Map Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-8 bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden relative group">
                                <div className="p-6 border-b border-gray-50 flex items-center justify-between relative z-10 bg-white/50 backdrop-blur-sm">
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900">
                                            {selectedLand ? selectedLand.name : 'Virtual Field Map'}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                            {selectedLand ? `${selectedLand.location} • ${selectedLand.acreage} Acres` : 'Real-time Topographic Overlay'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-green-700">6 SENSORS ACTIVE</span>
                                    </div>
                                </div>

                                {/* Simulated Map Container */}
                                <div className={`relative h-[480px] w-full transition-all duration-700 overflow-hidden ${mapType === 'satellite' ? 'bg-[#1a2c1a]' : 'bg-[#f0f4f0]'}`}>

                                    {/* Satellite Video Background */}
                                    {mapType === 'satellite' && (
                                        <div className="absolute inset-0 z-0 bg-[url('https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg')] bg-cover bg-center">
                                            <video
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                className="w-full h-full object-cover opacity-90 scale-110 hover:scale-100 transition-transform duration-[30s]"
                                            >
                                                {/* Primary Source: Top-down Aerial View of Green Fields (No People) */}
                                                <source src="https://videos.pexels.com/video-files/2833058/2833058-hd_1920_1080_30fps.mp4" type="video/mp4" />
                                                {/* Fallback Source */}
                                                <source src="https://videos.pexels.com/video-files/1536322/1536322-hd_1920_1080_30fps.mp4" type="video/mp4" />
                                            </video>
                                            <div className="absolute inset-0 bg-green-900/10 mix-blend-multiply" />
                                            {/* High-tech Scanline grid */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                                        </div>
                                    )}

                                    {/* Map Background Pattern (Only for Terrain view) */}
                                    {mapType !== 'satellite' && (
                                        <div className="absolute inset-0 opacity-40 z-0"
                                            style={{
                                                backgroundImage: `radial-gradient(circle at 2px 2px, #00000010 1px, transparent 0)`,
                                                backgroundSize: '40px 40px'
                                            }}
                                        />
                                    )}

                                    {/* Field Boundaries */}
                                    <svg className="absolute inset-0 w-full h-full p-10 transform rotate-12">
                                        <path
                                            d="M100,100 L400,120 L450,350 L120,380 Z"
                                            fill={mapType === 'satellite' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.2)'}
                                            stroke="rgba(34, 197, 94, 0.5)"
                                            strokeWidth="3"
                                            strokeDasharray="10,5"
                                            className="animate-pulse"
                                        />
                                        <path
                                            d="M500,50 L750,80 L720,250 L520,220 Z"
                                            fill={mapType === 'satellite' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)'}
                                            stroke="rgba(59, 130, 246, 0.5)"
                                            strokeWidth="3"
                                        />
                                    </svg>

                                    {/* Sensor Hotspots */}
                                    <div className="absolute top-[180px] left-[220px] group cursor-pointer">
                                        <div className="relative">
                                            <div className="absolute -inset-4 bg-green-500/20 rounded-full animate-ping" />
                                            <div className="h-6 w-6 bg-green-600 border-4 border-white rounded-full shadow-lg relative z-10 hover:scale-125 transition-transform" />
                                            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                Sensor A1: {currentReadings.moisture}% Moist
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute top-[280px] left-[580px] group cursor-pointer">
                                        <div className="relative">
                                            <div className="h-6 w-6 bg-blue-600 border-4 border-white rounded-full shadow-lg relative z-10 hover:scale-125 transition-transform" />
                                            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                Sensor B3: {currentReadings.temperature}°C
                                            </div>
                                        </div>
                                    </div>

                                    {/* Map HUD Overlay */}
                                    <div className="absolute bottom-6 right-6 flex flex-col gap-2 scale-90">
                                        <div className="bg-gray-900/80 backdrop-blur-md p-3 rounded-2xl text-white border border-white/20 shadow-2xl">
                                            <div className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-tighter">Legend</div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                                    <span className="text-[9px] font-bold">Optimal Zone</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                    <span className="text-[9px] font-bold">High Moisture</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Smart Alerts & Controls */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="bg-white rounded-3xl shadow-premium border border-gray-100 p-6 flex-1 hover:shadow-2xl transition-all">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-black text-gray-900">Smart Actions</h3>
                                        <span className="p-1 px-3 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full">AI DRIVEN</span>
                                    </div>

                                    <div className="space-y-5">
                                        {/* Alert Item */}
                                        <div className={`p-4 rounded-2xl border-2 transition-all duration-500 ${currentReadings.moisture < 40 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                                            <div className="flex gap-4">
                                                <div className={`p-2 rounded-xl h-fit ${currentReadings.moisture < 40 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                                    <Icon name={currentReadings.moisture < 40 ? 'AlertCircle' : 'CheckCircle'} className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">Irrigation Advice</h4>
                                                    <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">
                                                        {currentReadings.moisture < 40
                                                            ? "Soil moisture is critically low in Sector 7. Automated drip recommended."
                                                            : "All sectors currently within optimal moisture range."}
                                                    </p>
                                                </div>
                                            </div>
                                            {currentReadings.moisture < 40 && (
                                                <button
                                                    onClick={() => setViewMode('control')}
                                                    className="mt-4 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all w-full flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                                                >
                                                    <Icon name="Droplets" className="h-3.5 w-3.5" />
                                                    Activate (Go to Controls)
                                                </button>
                                            )}
                                        </div>

                                        <div className="p-4 rounded-2xl border-2 bg-purple-50 border-purple-200">
                                            <div className="flex gap-4">
                                                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl h-fit">
                                                    <Icon name="Zap" className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">Optimization Tip</h4>
                                                    <p className="text-xs text-gray-600 mt-1 font-medium">NPK levels are perfect for current growth stage. No action required.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Irrigation-as-a-Service */}
                                        <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                                            <div className="relative z-10 flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-black text-sm">Water Trading</h4>
                                                    <p className="text-[10px] opacity-80 font-bold mt-1 uppercase tracking-tighter">SURPLUS DETECTED</p>
                                                </div>
                                                <div className="text-xl font-black">₹50<span className="text-[10px] opacity-70">/hr</span></div>
                                            </div>
                                            <button className="mt-4 w-full bg-white text-blue-600 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-blue-50 transition-colors">
                                                OPEN MARKETPLACE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Analysis Chart Section */}
                        <div className="bg-white rounded-3xl shadow-premium border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Historical Environmental Data</h3>
                                    <p className="text-sm text-gray-500 font-medium">Comparison of core climate metrics</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                                        <span className="text-xs font-bold text-gray-600">Moisture</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-orange-500" />
                                        <span className="text-xs font-bold text-gray-600">Temp</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-80 w-full bg-gray-50/50 rounded-2xl p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={data}>
                                        <defs>
                                            <linearGradient id="colorMoistureMain" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorHumMain" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                                padding: '12px',
                                                fontSize: '12px'
                                            }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                                        <Area
                                            type="monotone"
                                            dataKey="moisture"
                                            name="Soil Moisture"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            fill="url(#colorMoistureMain)"
                                        />
                                        <Bar
                                            dataKey="humidity"
                                            name="Humidity"
                                            barSize={20}
                                            fill="#2dd4bf"
                                            radius={[4, 4, 0, 0]}
                                            opacity={0.6}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="temperature"
                                            name="Temperature"
                                            stroke="#f97316"
                                            strokeWidth={4}
                                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-slide-up">
                        {/* NEW: Advanced Irrigation System */}
                        <SmartIrrigationControl />

                        {/* NEW: Smart Water & Motor Monitor */}
                        <div className="bg-white rounded-3xl shadow-premium border border-gray-100 p-2 lg:p-6 overflow-hidden">
                            <SmartWaterManager />
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default IoTDashboard;
