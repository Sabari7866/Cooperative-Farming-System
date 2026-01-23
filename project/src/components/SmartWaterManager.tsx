import { useState, useEffect } from 'react';
import Icon from './Icon';

export default function SmartWaterManager() {
    const [waterLevel, setWaterLevel] = useState(78); // % full
    const [pumpStatus] = useState<'running' | 'idle' | 'fault'>('running');
    const [motorTemp, setMotorTemp] = useState(45); // degrees Celsius

    // Simulate fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            setWaterLevel(prev => {
                const change = Math.random() > 0.5 ? -0.1 : 0.05;
                return Math.min(100, Math.max(0, prev + change));
            });
            setMotorTemp(prev => {
                const change = Math.random() > 0.5 ? 0.2 : -0.1;
                return Math.min(80, Math.max(30, prev + change));
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Icon name="Droplet" className="h-6 w-6" />
                    Water Source & Motor Monitor
                </h2>
                <p className="text-cyan-100 opacity-90 text-sm mt-1">Real-time Well Levels & Pump Surveillance</p>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Well Water Level */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Icon name="BarChart2" className="h-5 w-5 text-cyan-600" />
                            Main Well Level
                        </h3>
                        <span className="text-2xl font-black text-cyan-600">{Math.round(waterLevel)}%</span>
                    </div>

                    {/* Visual Water Tank */}
                    <div className="relative h-64 w-full bg-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden flex items-end shadow-inner">
                        {/* Water Background */}
                        <div
                            className="absolute bottom-0 w-full bg-cyan-500/80 transition-all duration-1000 ease-linear"
                            style={{ height: `${waterLevel}%` }}
                        >
                            {/* Waves animation */}
                            <div className="absolute top-0 w-full h-4 bg-cyan-400 opacity-50 animate-pulse" />
                        </div>

                        {/* Depth Markers */}
                        <div className="absolute right-0 top-0 h-full w-12 flex flex-col justify-between py-4 text-xs font-bold text-gray-400 pr-2 text-right pointer-events-none">
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0%</span>
                        </div>

                        {/* Floating Info */}
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-cyan-100 text-center">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Depth</div>
                                <div className="text-xl font-black text-gray-800">{(waterLevel * 0.8).toFixed(1)} Ft</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-100">
                            <div className="text-xs text-gray-500 font-bold uppercase">Inflow Rate</div>
                            <div className="text-lg font-black text-cyan-700">120 L/h</div>
                        </div>
                        <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-100">
                            <div className="text-xs text-gray-500 font-bold uppercase">Est. Capacity</div>
                            <div className="text-lg font-black text-cyan-700">12,400 L</div>
                        </div>
                    </div>
                </div>

                {/* Right: Motor Live Feed & diagnostics */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Icon name="Video" className="h-5 w-5 text-cyan-600" />
                            Pump House Live Cam
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                            <span className="text-xs font-bold text-red-500">LIVE REC</span>
                        </div>
                    </div>

                    {/* Simulated Camera Feed */}
                    <div className="relative h-48 w-full bg-black rounded-2xl overflow-hidden border-2 border-gray-800 shadow-lg group">
                        {/* Placeholder image for Pump Motor */}
                        {/* Live Pump Video Feed */}
                        <video
                            src="https://assets.mixkit.co/videos/preview/mixkit-factory-machines-working-in-a-loop-4675-large.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[10s]"
                        />

                        {/* Cam Overlay */}
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-green-400 border border-green-500/30">
                            CAM_04: PUMP_MAIN
                            <br />
                            {new Date().toLocaleTimeString()}
                        </div>

                        {/* Status Overlay */}
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-3">
                            <div>
                                <span className="text-[10px] text-gray-400 block font-bold">MOTOR STATUS</span>
                                <span className={`text-xs font-black ${pumpStatus === 'running' ? 'text-green-400' : 'text-red-400'}`}>
                                    {pumpStatus.toUpperCase()}
                                </span>
                            </div>
                            <div className="h-6 w-px bg-gray-600"></div>
                            <div>
                                <span className="text-[10px] text-gray-400 block font-bold">TEMP</span>
                                <span className={`text-xs font-black ${motorTemp > 60 ? 'text-red-400' : 'text-blue-400'}`}>
                                    {motorTemp.toFixed(1)}°C
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Diagnostic list */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">System Diagnostics</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 flex items-center gap-2"><Icon name="CheckCircle" className="h-3 w-3 text-green-500" /> Voltage Stability</span>
                                <span className="font-bold text-gray-800">230V</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 flex items-center gap-2"><Icon name="CheckCircle" className="h-3 w-3 text-green-500" /> Valve Pressure</span>
                                <span className="font-bold text-gray-800">Normal</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 flex items-center gap-2"><div className="h-3 w-3 rounded-full border-2 border-gray-300"></div> Sump Level</span>
                                <span className="font-bold text-gray-800">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
