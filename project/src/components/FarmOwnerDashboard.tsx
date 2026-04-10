import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  useWorkers,
  useJobs,
  useLands,
  useJobActions,
  useLandActions,
  useAnalytics,
  useAgroShops,
} from '../hooks/useApi';
import { useToast, ToastContainer } from './Toast';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ResourceSharing from './ResourceSharing';
import { api } from '../utils/api';
import Icon from './Icon';
import { logoutAndRedirect, getSession } from '../utils/auth';
import FloatingChatbot from './FloatingChatbot';
import Marketplace from './Marketplace';
import SmartCropDoctor from './SmartCropDoctor';
import AICropAdvisor from './AICropAdvisor';

import AgriConnect from './AgriConnect';
import { useI18n } from '../utils/i18n';
import LanguageSelector from './LanguageSelector';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface DashboardContentProps {
  setActiveTab: (tab: string) => void;
  cropAdvice: any; // Ideally this should be a specific type too
  analytics: any; // Ideally specific type
  loading: boolean;
  lands: any[];
  jobs?: any[];
}

interface LandContentProps {
  landForm: any;
  handleLandFormChange: (field: string, value: any) => void;
  myLands: any[];
  onAddLand: () => void;
  onEditLand: (land: any) => void;
  onDeleteLand: (id: string) => void;
  onSearchCoordinates: (locationName: string) => void;
  loading: boolean;
  error: string | null;
  onPostJobFromLand: (land: any) => void;
  onFindWorkersFromLand: (landId: string) => void;
  onManageSequence: (land: any) => void;
}

interface JobsContentProps {
  jobForm: any;
  handleJobFormChange: (field: string, value: any) => void;
  postedJobs: any[];
  onCreateJob: () => void;
  loading: boolean;
  error: string | null;
  onViewApplications: (jobId: string) => void;
  lands: any[];
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { t } = useI18n();
  return (
    <div className="w-68 bg-white/70 backdrop-blur-3xl shadow-premium border-r border-emerald-50 relative overflow-hidden flex flex-col h-screen sticky top-0 elite-border-glow">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 via-green-400 to-amber-400"></div>

      <div className="p-8 border-b border-emerald-50/50 relative z-10 transition-all hover:bg-emerald-50/10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center border border-emerald-50 group hover:rotate-6 transition-transform">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter leading-none">
                <span className="text-slate-900">உழவன்</span>
                <span className="text-emerald-600"> X</span>
              </h1>
              <p className="text-[10px] text-emerald-600/60 font-black tracking-[0.1em] uppercase mt-2 italic">Cultivating trust, harvesting intelligence</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="p-6 flex-grow overflow-y-auto space-y-2 custom-scrollbar">
        <ul className="space-y-2">
          {[
            { id: 'dashboard', icon: 'Home', label: t('nav_dashboard') },
            { id: 'land', icon: 'MapPin', label: t('nav_my_land') },
            { id: 'jobs', icon: 'Users', label: t('nav_posted_jobs') },
            { id: 'doctor', icon: 'Crown', label: 'உழவன் X DOCTOR', badge: 'v12.0', badgeColor: 'bg-amber-500' },
            { id: 'agri_intelligence', icon: 'Zap', label: 'உழவன் INTELLIGENCE', badge: 'AI', badgeColor: 'bg-emerald-500' },
            { id: 'workers', icon: 'Phone', label: t('nav_find_workers') },
            { id: 'resources', icon: 'Wrench', label: t('nav_resource_sharing') },
            { id: 'marketplace', icon: 'ShoppingCart', label: t('nav_marketplace') },
            { id: 'agroshops', icon: 'Store', label: 'உழவன் Shops' },
            { id: 'agriconnect', icon: 'MessageCircle', label: 'உழவன் Connect Forum', badge: 'FORUM', badgeColor: 'bg-blue-500' },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-5 py-5 rounded-[2rem] transition-all duration-300 group relative ${activeTab === item.id
                  ? 'bg-emerald-600 text-white shadow-premium translate-x-1'
                  : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
              >
                <Icon name={item.icon as any} className={`h-6 w-6 transition-transform duration-300 ${activeTab === item.id ? 'scale-110 rotate-3' : 'group-hover:scale-110'}`} />
                <span className={`font-black tracking-tight text-sm uppercase ${activeTab === item.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto text-[8px] px-2 py-0.5 rounded-full font-black text-white ${item.badgeColor} shadow-sm border border-white/20`}>
                    {item.badge}
                  </span>
                )}
                {activeTab === item.id && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 w-1.5 h-8 bg-white/50 rounded-full ml-1" />
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="p-6 mt-auto border-t border-emerald-50/50 bg-emerald-50/20">
          <div className="p-4 rounded-3xl bg-white/60 border border-white">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-relaxed mb-3 italic">
              "Agriculture is the foundation of civilization."
            </p>
            <button
              onClick={logoutAndRedirect}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-slate-900 text-white hover:bg-black transition-all group"
            >
              <Icon name="LogOut" className="h-4 w-4 text-emerald-400 group-hover:scale-110" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('logout')}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="p-6 bg-emerald-50/30 border-t border-emerald-50/50">
        <div className="flex items-center space-x-4 p-4 rounded-3xl bg-white/60 backdrop-blur-md border border-white shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg">AS</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black text-slate-900 truncate uppercase">Elite Admin</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              <p className="text-[9px] text-emerald-800 font-black truncate uppercase">Premium Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LiveClock = () => {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex flex-col items-end">
      <span className="text-[11px] font-black text-emerald-300 tracking-widest font-mono">
        {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
      </span>
      <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">
        {time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
      </span>
    </div>
  );
};

const DashboardContent = ({ setActiveTab, cropAdvice, analytics, lands, jobs }: DashboardContentProps) => {
  const { t } = useI18n();

  const userLands = lands || [];
  const userJobs = jobs || [];

  const totalLand = userLands.reduce(
    (sum: number, land: any) => sum + (Number(land.acreage) || Number(land.acres) || 0),
    0
  );
  const totalAcres = totalLand.toFixed(1);

  const activeJobsCount = userJobs.filter((j: any) => j.status === 'active').length.toString() || '0';

  const mainLand = userLands.length > 0 ? userLands[0] : null;
  const mainCrop = mainLand?.crop?.toLowerCase() || 'rice';
  const mainLandName = mainLand?.location || t('rice_fields_north_plot');
  const irrigationAdvice = cropAdvice[mainCrop as keyof typeof cropAdvice]?.irrigation || cropAdvice.rice.irrigation;

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Compact Innovative Welcome Section */}
      <div className="relative group rounded-3xl overflow-hidden shadow-xl transition-all hover:shadow-emerald-200/30" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d1f12 50%, #0f172a 100%)' }}>
        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { w: 3, h: 3, top: '15%', left: '8%', delay: '0s', dur: '3s' },
            { w: 2, h: 2, top: '60%', left: '15%', delay: '1s', dur: '4s' },
            { w: 4, h: 4, top: '30%', left: '85%', delay: '0.5s', dur: '5s' },
            { w: 2, h: 2, top: '75%', left: '75%', delay: '2s', dur: '3.5s' },
            { w: 3, h: 3, top: '45%', left: '50%', delay: '1.5s', dur: '4.5s' },
          ].map((p, i) => (
            <div key={i} className="absolute rounded-full bg-emerald-400/30" style={{ width: `${p.w * 4}px`, height: `${p.h * 4}px`, top: p.top, left: p.left, animation: `pulse ${p.dur} ${p.delay} infinite` }} />
          ))}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/8 rounded-full blur-[80px] -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/6 rounded-full blur-[60px] -ml-16 -mb-16" />
        </div>

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

        <div className="relative px-8 py-6 flex items-center justify-between gap-6">
          {/* Left: branding + tagline */}
          <div className="flex items-center gap-5 flex-1 min-w-0">
            {/* Animated icon badge */}
            <div className="shrink-0 w-14 h-14 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
              <Icon name="Crown" className="h-7 w-7 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>

            <div className="min-w-0">
              {/* Live badge */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-[9px] font-black text-emerald-300 uppercase tracking-[0.35em] mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
                🌾 உழவன் X · Live
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tighter"
              >
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400">உழவன் X.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-emerald-100/50 text-xs font-medium mt-1 tracking-wide"
              >
                🌱 <span className="text-emerald-300/70 font-semibold">Connecting Farmers,</span> Cultivating the Future
              </motion.p>
            </div>
          </div>

          {/* Center: quick stats pills */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {[
              { icon: 'MapPin', label: 'Acres', val: totalAcres, color: 'emerald' },
              { icon: 'Users', label: 'Jobs', val: activeJobsCount.padStart(2, '0'), color: 'blue' },
              { icon: 'Activity', label: 'Health', val: analytics?.healthScore || '94%', color: 'teal' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-emerald-500/30 transition-all group/stat cursor-default"
              >
                <span className="text-lg font-black text-white group-hover/stat:text-emerald-300 transition-colors">{s.val}</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{s.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Right: live clock + tamil motto */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            <LiveClock />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-white/5">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-5 h-5 rounded-full bg-emerald-800 border-2 border-slate-900 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                ))}
              </div>
              <span className="text-[8px] font-black text-emerald-400/70 uppercase tracking-[0.3em]">உழவே உயிர்</span>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      {/* Stats Cards - Interactive Premium Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: t('card_total_land'), val: totalAcres, unit: t('unit_acres'), icon: 'MapPin', color: 'emerald', trend: 'TOTAL' },
          { label: t('card_active_jobs'), val: activeJobsCount.padStart(2, '0'), unit: t('label_active_positions'), icon: 'Users', color: 'blue', trend: 'ACTIVE' },
          { label: t('card_available_workers'), val: analytics?.availableWorkers || '15', unit: t('card_within_km'), icon: 'Phone', color: 'amber', trend: 'NEAR' },
          { label: 'Health Index', val: analytics?.healthScore || '94.8%', unit: 'AGGREGATE SCORE', icon: 'Activity', color: 'teal', trend: 'OPTIMAL' },
        ].map((stat, i) => (
          <div key={i} className="group bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-2 h-full bg-${stat.color}-500 opacity-20`}></div>
            <div className="flex items-center justify-between mb-8">
              <div className={`bg-${stat.color}-50 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <Icon name={stat.icon as any} className={`h-8 w-8 text-${stat.color}-600`} />
              </div>
              <span className={`text-[10px] font-black text-${stat.color}-600 bg-${stat.color}-100/50 px-3 py-1.5 rounded-full tracking-tighter`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900 leading-none mb-2">{stat.val}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{stat.unit}</p>
          </div>
        ))}
      </div>

      {/* Land Utilization Sequence (New Innovation) */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
          <Icon name="Map" className="w-64 h-64 text-emerald-900" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Land Utilization Sequence</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Spatial breakdown of your segmented cultivation</p>
            </div>
            <button
              onClick={() => setActiveTab('land')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 self-start md:self-auto"
            >
              <Icon name="Plus" className="w-4 h-4" />
              Manage Land
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Visual Sequence Bar */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex h-12 rounded-2xl overflow-hidden bg-slate-100 shadow-inner group-hover:shadow-emerald-100 transition-all duration-500">
                  {userLands.length > 0 ? (
                    (() => {
                      const allParts = userLands.flatMap(land => (land.parts || []).map((p: any) => ({ ...p, landName: land.location })));
                      if (allParts.length === 0) {
                        return (
                          <div className="w-full flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest gap-2">
                             <Icon name="Info" className="w-3 h-3" />
                             No sequence data defined. Click "Manage Land" to start.
                          </div>
                        );
                      }
                      const totalAreaAcrossLands = userLands.reduce((acc, l) => acc + (Number(l.acreage) || 0), 0) || 1;
                      
                      return allParts.map((part: any, idx) => {
                        const width = ((Number(part.area) || 0) / totalAreaAcrossLands) * 100;
                        const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-green-500', 'bg-lime-500', 'bg-emerald-400'];
                        return (
                          <div
                            key={idx}
                            style={{ width: `${Math.max(width, 5)}%` }}
                            className={`${colors[idx % colors.length]} h-full border-r border-white/20 relative group cursor-pointer transition-all hover:brightness-110 flex items-center justify-center`}
                            title={`${part.crop} (${part.area} Acres) in ${part.landName}`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                            <span className="text-[8px] font-black text-white uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity truncate px-1">
                              {part.crop}
                            </span>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <div className="w-full flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       Waiting for land data...
                    </div>
                  )}
                </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(() => {
                  const allParts = userLands.flatMap(land => (land.parts || []).map((p: any) => ({ ...p, landName: land.location })));
                  if (allParts.length === 0) {
                    return (
                      <div className="col-span-full py-10 bg-emerald-50/30 rounded-[2rem] border border-dashed border-emerald-100 flex flex-col items-center text-center px-6">
                        <Icon name="Info" className="w-8 h-8 text-emerald-300 mb-3" />
                        <p className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-2">Detailed Segmentation Required</p>
                        <p className="text-[10px] text-emerald-600/60 font-medium leading-relaxed max-w-xs uppercase">
                          Divide your plots into specific crop segments to unlock advanced analytics and optimized harvest scheduling.
                        </p>
                      </div>
                    );
                  }
                  
                  return allParts.slice(0, 3).map((part: any, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-emerald-50 transition-all group overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-50/50 rounded-bl-[2rem] flex items-center justify-center">
                        <span className="text-emerald-500 font-black text-xs">#{idx + 1}</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-emerald-100 shadow-lg">
                          <Icon name="Leaf" className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{part.landName || 'Main Field'}</p>
                          <h4 className="text-base font-black text-slate-900 tracking-tighter uppercase truncate">{part.crop}</h4>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
                          <div className="flex flex-col text-left">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Region</span>
                            <span className="text-[10px] font-bold text-emerald-600">{part.area} Acres</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full capitalize">{part.stage}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Sequence Stats */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mb-16" />
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6">Sequence Metrics</h4>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">Total Segments</span>
                    <span className="text-2xl font-black">{userLands.reduce((acc: number, l: any) => acc + (l.parts?.length || 0), 0)}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Dominant Sequence Varieties</p>
                  <div className="space-y-4">
                    {Array.from(new Set(userLands.flatMap(l => (l.parts || []).map((p: any) => p.crop)))).slice(0, 3).map((crop, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-tight">{crop}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">
                          {userLands.reduce((acc: number, l: any) => acc + (l.parts?.filter((p: any) => p.crop === crop).reduce((sa: number, sp: any) => sa + (Number(sp.area) || 0), 0) || 0), 0).toFixed(1)} Ac
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{t('quick_actions')}</h3>
          <span className="text-sm text-gray-500">{t('label_get_started_quickly')}</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('land')}
            className="group flex flex-col items-start space-y-3 p-5 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200"
          >
            <div className="bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition-colors">
              <Icon name="Plus" className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 group-hover:text-green-700">
                {t('action_add_new_land')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Register new farmland</p>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className="group flex flex-col items-start space-y-3 p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition-colors">
              <Icon name="Users" className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 group-hover:text-blue-700">
                {t('action_post_work_request')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Hire workers now</p>
            </div>
          </button>
          <Link
            to="/crop-advisor"
            className="group flex flex-col items-start space-y-3 p-5 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
          >
            <div className="bg-purple-100 rounded-lg p-3 group-hover:bg-purple-200 transition-colors">
              <Icon name="Brain" className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 group-hover:text-purple-700">
                {t('action_get_ai_advice')}
              </p>
              <p className="text-xs text-gray-500 mt-1">AI-powered insights</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recommendations & Weather */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Icon name="Droplets" className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t('irrigation_alert')}</h3>
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Action needed
            </span>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <p className="text-blue-900 font-semibold mb-2">{mainLandName}</p>
            <p className="text-blue-700 text-sm leading-relaxed mb-4">
              {irrigationAdvice}
            </p>
            <button className="text-blue-700 text-sm font-semibold hover:text-blue-900 flex items-center space-x-1 group">
              <span>{t('view_full_schedule')}</span>
              <Icon
                name="ArrowRight"
                className="h-4 w-4 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 rounded-lg p-2">
                <Icon name="Sun" className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t('weather_update')}</h3>
            </div>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
              Favorable
            </span>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200">
            <p className="text-yellow-900 font-semibold mb-2">{t('weather_favorable')}</p>
            <p className="text-yellow-700 text-sm leading-relaxed mb-4">{t('weather_summary')}</p>
            <button className="text-yellow-700 text-sm font-semibold hover:text-yellow-900 flex items-center space-x-1 group">
              <span>{t('view_7day_forecast')}</span>
              <Icon
                name="ArrowRight"
                className="h-4 w-4 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{t('recent_activity')}</h3>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            View all
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                <Icon name="Check" className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 capitalize">{mainCrop} Activity Updated</p>
              <p className="text-sm text-gray-500">{mainLandName} completed successfully</p>
            </div>
            <span className="text-sm text-green-600 font-medium">{t('activity_2_hours_ago')}</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Icon name="UserPlus" className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{t('activity_new_application')}</p>
              <p className="text-sm text-gray-500">
                {analytics?.totalApplications || 12} new applicants
              </p>
            </div>
            <span className="text-sm text-blue-600 font-medium">{t('activity_4_hours_ago')}</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition-colors">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Icon name="AlertCircle" className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{t('activity_weather_alert')}</p>
              <p className="text-sm text-gray-500">Light rain expected tomorrow</p>
            </div>
            <span className="text-sm text-yellow-600 font-medium">{t('activity_6_hours_ago')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandContent = ({
  landForm,
  handleLandFormChange,
  myLands,
  onAddLand,
  onEditLand,
  onDeleteLand,
  onSearchCoordinates,
  loading,
  error,
  onPostJobFromLand,
  onFindWorkersFromLand,
  onManageSequence,
}: LandContentProps) => {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('my_land_title')}</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700">
          <Icon name="Plus" className="h-5 w-5" />
          <span>{t('action_add_new_land')}</span>
        </button>
      </div>

      {loading && <LoadingSpinner text={t('loading_your_lands')} />}
      {error && <ErrorMessage message={error} />}

      <div className="grid md:grid-cols-2 gap-6">
        {myLands.map((land: Land) => (
          <div key={land.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{land.location}</h3>
                <p className="text-gray-600">
                  {land.crop} • {land.acreage} acres
                </p>
                <p className="text-sm text-gray-500">
                  {t('label_soil')}: {land.soilType} • {land.irrigationType}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${land.status === 'growing'
                  ? 'bg-green-100 text-green-700'
                  : land.status === 'sowing'
                    ? 'bg-blue-100 text-blue-700'
                    : land.status === 'flowering'
                      ? 'bg-purple-100 text-purple-700'
                      : land.status === 'harvest'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
              >
                {land.status.charAt(0).toUpperCase() + land.status.slice(1)}
              </span>
            </div>

            {land.parts && land.parts.length > 0 && (
              <div className="mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Icon name="Layers" className="h-3 w-3" />
                  Land Segmentation ({land.parts.length} Parts)
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {land.parts.map((part: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-xs shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-bold text-gray-800">{part.crop}</span>
                      </div>
                      <span className="text-gray-500 font-medium">{part.area} Acres</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>{t('label_planted')}:</span>
                <span>
                  {land.plantedDate !== 'Not planted'
                    ? new Date(land.plantedDate).toLocaleDateString()
                    : t('not_planted')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('label_expected_harvest')}:</span>
                <span>{land.expectedHarvest ? new Date(land.expectedHarvest).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('label_last_updated')}:</span>
                <span>{land.lastUpdated}</span>
              </div>
            </div>
 
            {/* Mini Segmentation Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Allocation Status</span>
                <span className={((land.parts?.reduce((acc: number, p: any) => acc + (p.area || 0), 0) || 0) > land.acreage) ? 'text-red-500' : 'text-emerald-600'}>
                   {((land.parts?.reduce((acc: number, p: any) => acc + (p.area || 0), 0) || 0)).toFixed(1)} / {Number(land.acreage || 0).toFixed(1)} Acres
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                {(land.parts || []).map((part: any, idx: number) => {
                  const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-blue-500', 'bg-lime-500'];
                  return (
                    <div 
                      key={idx}
                      style={{ width: `${(part.area / (land.acreage || 1)) * 100}%` }}
                      className={`${colors[idx % colors.length]} h-full border-r border-white/20`}
                      title={`${part.crop}: ${part.area} Acres`}
                    />
                  );
                })}
                {((land.parts?.reduce((acc: number, p: any) => acc + (p.area || 0), 0) || 0) < land.acreage) && (
                  <div className="flex-1 bg-slate-200/50" />
                )}
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => onEditLand(land)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-blue-100 shadow-lg flex items-center justify-center gap-2"
              >
                <Icon name="Edit2" className="h-4 w-4" />
                <span>{t('btn_edit_land') || 'Edit'}</span>
              </button>
              <button
                onClick={() => onPostJobFromLand(land)}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors shadow-green-100 shadow-lg flex items-center justify-center gap-2"
              >
                <Icon name="Briefcase" className="h-4 w-4" />
                <span>{t('action_post_job')}</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this land record?')) {
                    onDeleteLand(land.id);
                  }
                }}
                className="w-10 bg-red-50 text-red-600 border border-red-100 py-2 rounded-lg text-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                title="Delete Land"
              >
                <Icon name="Trash2" className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => onManageSequence(land)}
              className="w-full mt-3 py-2 bg-emerald-600 text-white font-bold border border-emerald-500 rounded-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              <Icon name="Layers" className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span>Sequence Method (Segmentation)</span>
            </button>
            <button
              onClick={() => onFindWorkersFromLand(land.id)}
              className="w-full mt-3 py-2 bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
            >
              <Icon name="Map" className="h-4 w-4" />
              <span>Find Workers Near This Land</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add New Land Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{t('add_new_land_title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('label_land_name') || 'Land Name'}
            </label>
            <input
              type="text"
              value={landForm.name}
              onChange={(e) => handleLandFormChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t('placeholder_enter_land_name') || 'Enter land name'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('label_location_description') || 'Location Description'}
            </label>
            <input
              type="text"
              value={landForm.location}
              onChange={(e) => handleLandFormChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t('placeholder_enter_field_location') || 'e.g. Near Village School'}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('label_coordinates') || 'Farm Coordinates'}
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  step="any"
                  value={landForm.latitude}
                  onChange={(e) => handleLandFormChange('latitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={t('placeholder_latitude') || 'Latitude'}
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  step="any"
                  value={landForm.longitude}
                  onChange={(e) => handleLandFormChange('longitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={t('placeholder_longitude') || 'Longitude'}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        handleLandFormChange('latitude', position.coords.latitude.toString());
                        handleLandFormChange('longitude', position.coords.longitude.toString());
                      },
                      (error) => {
                        console.error('Error getting location:', error);
                        alert('Could not get your location. Please ensure location services are enabled.');
                      }
                    );
                  } else {
                    alert('Geolocation is not supported by your browser.');
                  }
                }}
                className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                title={t('get_live_location') || 'Get Live Location'}
              >
                <Icon name="MapPin" className="h-5 w-5 mr-2" />
                <span className="whitespace-nowrap">{t('btn_live_location')}</span>
              </button>
              <button
                type="button"
                onClick={() => onSearchCoordinates(landForm.location)}
                className="flex items-center justify-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                title="Search Coordinates from Name"
              >
                <Icon name="Search" className="h-5 w-5 mr-2" />
                <span className="whitespace-nowrap">Find by Name</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('coordinate_help') || 'Use the button to get your current GPS location or enter manually.'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_acreage')}</label>
            <input
              type="number"
              step="0.1"
              value={landForm.acreage}
              onChange={(e) => handleLandFormChange('acreage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={t('placeholder_enter_acreage') || 'Enter acreage'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_soil_type')}</label>
            <select
              aria-label="Select soil type"
              value={landForm.soilType}
              onChange={(e) => handleLandFormChange('soilType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="clay">{t('soil_clay')}</option>
              <option value="loam">{t('soil_loam')}</option>
              <option value="sandy">{t('soil_sandy')}</option>
              <option value="clay-loam">{t('soil_clay_loam')}</option>
              <option value="sandy-loam">{t('soil_sandy_loam')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_irrigation_type')}</label>
            <select
              aria-label="Select irrigation type"
              value={landForm.irrigationType}
              onChange={(e) => handleLandFormChange('irrigationType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="flood">{t('irrigation_flood')}</option>
              <option value="drip">{t('irrigation_drip')}</option>
              <option value="sprinkler">{t('irrigation_sprinkler')}</option>
              <option value="furrow">{t('irrigation_furrow')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('stage_current') || t('status_label')}</label>
            <select
              aria-label="Select current stage"
              value={landForm.stage}
              onChange={(e) => handleLandFormChange('stage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="preparation">{t('label_land_preparation')}</option>
              <option value="sowing">{t('stage_sowing')}</option>
              <option value="growing">{t('stage_growing')}</option>
              <option value="flowering">{t('stage_flowering')}</option>
              <option value="harvest">{t('stage_harvest')}</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_notes')}</label>
          <textarea
            value={landForm.notes}
            onChange={(e) => handleLandFormChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            placeholder={t('placeholder_land_notes')}
          />
        </div>
        <button
          onClick={onAddLand}
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading && <Icon name="Loader2" className="h-4 w-4 animate-spin" />}
          {t('btn_add_land')}
        </button>
      </div>
    </div>
  );
};

const JobsContent = ({
  jobForm,
  handleJobFormChange,
  postedJobs,
  onCreateJob,
  loading,
  error,
  onViewApplications,
  lands,
}: JobsContentProps) => {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('posted_jobs_title')}</h2>
        <a
          href="#post-job-form"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Icon name="Plus" className="h-5 w-5" />
          <span>{t('action_post_new_job')}</span>
        </a>
      </div>

      {loading && <LoadingSpinner text={t('loading_your_jobs')} />}
      {error && <ErrorMessage message={error} />}

      <div className="grid gap-4">
        {postedJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.farmOwner}</p>
                <p className="text-sm text-gray-500">
                  {job.location} • {job.distance}
                </p>
                <p className="text-sm text-gray-500">
                  Workers needed: {job.workers} • Date: {new Date(job.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Payment: {job.payment} • Duration: {job.duration}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${job.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : job.status === 'completed'
                      ? 'bg-blue-100 text-blue-700'
                      : job.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {(job.status || 'unknown').charAt(0).toUpperCase() + (job.status || 'unknown').slice(1)}
                </span>
                <p className="text-sm text-gray-500 mt-1">{(job.applicants || []).length} applicants</p>
                {job.urgent && (
                  <span className="block text-xs text-red-600 font-medium mt-1">Urgent</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {(job.skills || []).map((skill: string) => (
                <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700">{job.description}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onViewApplications(job.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center space-x-2"
              >
                <Icon name="Eye" className="h-4 w-4" />
                <span>
                  {t('view_applications')} ({(job.applicants || []).length})
                </span>
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">
                {t('btn_edit_job')}
              </button>
              <a
                href={`tel:${job.farmOwnerPhone}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2"
              >
                <Icon name="Phone" className="h-4 w-4" />
                <span>{t('contact')}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Post Work Request Form */}
      <div id="post-job-form" className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{t('title_post_work_request')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_job_title')}</label>
            <input
              type="text"
              value={jobForm.title}
              onChange={(e) => handleJobFormChange('title', e.target.value)}
              aria-label="Job title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('placeholder_job_title')}
            />
          </div>
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <label className="flex items-center text-sm font-bold text-emerald-800 mb-2">
              <Icon name="Map" className="h-4 w-4 mr-2" />
              Auto-fill from Registered Land
            </label>
            <select
              onChange={(e) => {
                const selectedLandId = e.target.value;
                if (!selectedLandId) return;
                const land = lands.find(l => l.id === selectedLandId || l._id === selectedLandId);
                if (land) {
                  handleJobFormChange('location', land.location);
                  if (!jobForm.title) handleJobFormChange('title', `${land.crop || 'Crop'} Management at ${land.name}`);
                }
              }}
              className="w-full px-3 py-2 border border-emerald-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            >
              <option value="">-- Choose a land to auto-populate --</option>
              {lands.map(land => (
                <option key={land.id || land._id} value={land.id || land._id}>
                  {land.name} ({land.location})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-emerald-600 mt-2 font-medium">✨ Selecting a land will automatically set the location and suggest a title.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_location')}</label>
            <input
              type="text"
              value={jobForm.location}
              onChange={(e) => handleJobFormChange('location', e.target.value)}
              aria-label="Job location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('placeholder_job_location')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_job_date')}</label>
            <input
              type="date"
              aria-label="Job date"
              value={jobForm.date}
              onChange={(e) => handleJobFormChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('label_num_workers')}
            </label>
            <input
              type="number"
              value={jobForm.workers}
              onChange={(e) => handleJobFormChange('workers', e.target.value)}
              aria-label="Number of workers"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('placeholder_num_workers')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_duration')}</label>
            <input
              type="text"
              value={jobForm.duration}
              onChange={(e) => handleJobFormChange('duration', e.target.value)}
              aria-label="Job duration"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('placeholder_duration')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('label_payment_per_day')}
            </label>
            <input
              type="text"
              value={jobForm.payment}
              onChange={(e) => handleJobFormChange('payment', e.target.value)}
              aria-label="Job payment"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('placeholder_payment')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_time')}</label>
            <input
              type="text"
              value={jobForm.time}
              onChange={(e) => handleJobFormChange('time', e.target.value)}
              aria-label="Job time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('placeholder_time')}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
          <textarea
            value={jobForm.description}
            onChange={(e) => handleJobFormChange('description', e.target.value)}
            aria-label="Job description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Describe the work requirements..."
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              'Harvesting',
              'Sowing',
              'Irrigation',
              'Pest Control',
              'Fertilizer Application',
              'Equipment Operation',
            ].map((skill) => (
              <label key={skill} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={jobForm.skills?.includes(skill) || false}
                  onChange={(e) => {
                    const currentSkills = jobForm.skills || [];
                    if (e.target.checked) {
                      handleJobFormChange('skills', [...currentSkills, skill]);
                    } else {
                      handleJobFormChange(
                        'skills',
                        currentSkills.filter((s: string) => s !== skill),
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{skill}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={jobForm.urgent || false}
              onChange={(e) => handleJobFormChange('urgent', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm">Mark as Urgent</span>
          </label>
        </div>
        <button
          onClick={onCreateJob}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading && <Icon name="Loader2" className="h-4 w-4 animate-spin" />}
          Post Job
        </button>
      </div>
    </div>
  );
};





interface AgroShopsContentProps {
  agroShops: AgroShop[];
  loading: boolean;
  error: string | null;
}

const AgroShopsContent = ({ agroShops, loading, error }: AgroShopsContentProps) => {
  const [selectedShop, setSelectedShop] = useState<AgroShop | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  const marketRates = [
    { name: 'Urea', price: 266.5, unit: '50kg', trend: 'up' },
    { name: 'DAP', price: 1350, unit: '50kg', trend: 'down' },
    { name: 'Paddy Hybrid', price: 420, unit: 'kg', trend: 'stable' },
    { name: 'Tomato Seeds', price: 85, unit: 'pkt', trend: 'up' },
    { name: 'Organic Manure', price: 350, unit: '25kg', trend: 'stable' },
    { name: 'Potash', price: 1700, unit: '50kg', trend: 'up' },
    { name: 'Corn Seeds', price: 250, unit: 'kg', trend: 'down' },
    { name: 'Bio-Fertilizer', price: 120, unit: 'L', trend: 'stable' },
    { name: 'Zinc Sulphate', price: 850, unit: '10kg', trend: 'up' },
  ];

  const allProducts = Array.from(new Set(agroShops?.flatMap((shop: AgroShop) => shop.productPrices?.map((p: any) => p.name) || []) || []));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Shop List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Icon name="Store" className="h-6 w-6 mr-2 text-green-600" />
                Nearby Agro Product Shops
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCompare(true)}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all border border-blue-100"
                >
                  <Icon name="BarChart2" className="h-4 w-4 mr-2" />
                  Compare
                </button>
              </div>
            </div>

            {loading && <LoadingSpinner text="Loading shops..." />}
            {error && <ErrorMessage message={error} />}

            {!loading && !error && (
              <div className="grid md:grid-cols-2 gap-6">
                {agroShops.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => setSelectedShop(shop)}
                    className="border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-xl transition-all duration-300 bg-white group cursor-pointer relative"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-gray-800 text-lg group-hover:text-green-700 transition-colors">
                        {shop.name}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${shop.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {shop.open ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Icon name="MapPin" className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{shop.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Icon name="Navigation" className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{shop.distance} away</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Icon name="Star" className="h-4 w-4 mr-2 text-yellow-500 fill-current" />
                        <span className="font-medium text-gray-900">{shop.rating}</span>
                        <span className="text-gray-400 ml-1">({shop.reviewCount})</span>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-2 border-t border-gray-100">
                      <button
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors font-medium"
                      >
                        <Icon name="Store" className="h-4 w-4" />
                        <span>Explore Shop</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stable Sidebar for Daily Rates */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden sticky top-24">
            <div className="bg-emerald-600 p-4 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Icon name="TrendingUp" className="h-5 w-5" />
                Daily Market Rates
              </h3>
              <p className="text-xs text-emerald-100 mt-1">Last updated: Today, 6:00 AM</p>
            </div>

            <div className="h-[500px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {marketRates.map((rate, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{rate.name}</span>
                    {rate.trend === 'up' && <Icon name="ArrowUpRight" className="h-4 w-4 text-red-500" />}
                    {rate.trend === 'down' && <Icon name="ArrowDownRight" className="h-4 w-4 text-green-500" />}
                    {rate.trend === 'stable' && <Icon name="Minus" className="h-4 w-4 text-gray-400" />}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-gray-900">₹{rate.price}</span>
                      <span className="text-xs text-gray-500">/{rate.unit}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rate.trend === 'up' ? 'bg-red-50 text-red-600' : rate.trend === 'down' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {rate.trend === 'up' ? '+2.4%' : rate.trend === 'down' ? '-1.8%' : '0.0%'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 border-t border-emerald-100">
              <button className="w-full py-2 text-emerald-700 text-sm font-bold hover:underline">
                View Historical Trends
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Details Modal */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-popIn">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedShop.name}</h3>
                <p className="text-green-700 text-sm font-medium flex items-center mt-1">
                  <Icon name="CheckCircle" className="h-4 w-4 mr-1" />
                  Verified Agricultural Supplier
                </p>
              </div>
              <button
                onClick={() => setSelectedShop(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close"
              >
                <Icon name="X" className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                      <Icon name="Info" className="h-4 w-4 mr-2 text-blue-600" />
                      Shop Info
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm flex items-center text-gray-600">
                        <Icon name="MapPin" className="h-4 w-4 mr-2" />
                        {selectedShop.address || selectedShop.location}
                      </p>
                      <p className="text-sm flex items-center text-gray-600">
                        <Icon name="Clock" className="h-4 w-4 mr-2" />
                        {selectedShop.openingHours?.open} - {selectedShop.openingHours?.close}
                      </p>
                      <p className="text-sm flex items-center text-gray-600">
                        <Icon name="Phone" className="h-4 w-4 mr-2 text-green-600" />
                        {selectedShop.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 flex items-center">
                    <Icon name="Package" className="h-4 w-4 mr-2 text-orange-500" />
                    Shop Products & Rates
                  </h4>
                  <div className="space-y-3">
                    {selectedShop.productPrices && selectedShop.productPrices.length > 0 ? (
                      selectedShop.productPrices.map((prod, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                          <span className="font-medium text-gray-800">{prod.name}</span>
                          <div className="text-right">
                            <p className="text-green-700 font-bold">₹{prod.price}</p>
                            <p className="text-[10px] text-gray-400">per {prod.unit}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Icon name="PackageOpen" className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No product prices available</p>
                        <p className="text-xs mt-1">Contact shop owner for pricing details</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium flex items-start">
                  <Icon name="ShieldAlert" className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
                  Rates are updated daily by the shop owner at 8:00 AM. Prices may vary slightly based on state taxes or bulk purchase.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex space-x-4 bg-gray-50">
              <a
                href={`tel:${selectedShop.phone}`}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                <Icon name="Phone" className="h-5 w-5 mr-2" />
                Call Agent
              </a>
              <button
                className="flex-1 bg-white text-gray-700 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedShop(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )
      }

      {/* Compare Rates Modal */}
      {
        showCompare && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Compare Shop Rates</h3>
                <button
                  onClick={() => setShowCompare(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Icon name="X" className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <div className="min-w-max">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 text-left bg-gray-50 border-b-2 border-gray-200 font-bold text-gray-700 sticky left-0 z-10">Product Name</th>
                        {agroShops.map(shop => (
                          <th key={shop.id} className="p-4 text-center bg-gray-50 border-b-2 border-gray-200 font-bold text-gray-700 min-w-[200px]">
                            {shop.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts.map((productName, idx) => {
                        const prices = agroShops.map((shop: AgroShop) => shop.productPrices?.find((p: any) => p.name === productName)?.price).filter((p): p is number => p !== undefined);
                        const minPrice = Math.min(...prices);

                        return (
                          <tr key={idx} className="group hover:bg-emerald-50/30 transition-all duration-300">
                            <td className="p-5 border-b border-gray-100 font-bold text-gray-800 sticky left-0 bg-white z-10 group-hover:bg-emerald-50/50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                  <Icon name="Package" className="w-4 h-4 text-emerald-600" />
                                </div>
                                {productName}
                              </div>
                            </td>
                            {agroShops.map(shop => {
                              const prod = shop.productPrices?.find(p => p.name === productName);
                              const isBestPrice = prod && prod.price === minPrice;
                              return (
                                <td key={shop.id} className={`p-5 border-b border-gray-100 text-center transition-all ${isBestPrice ? 'bg-emerald-50/50' : ''}`}>
                                  {prod ? (
                                    <div className="flex flex-col items-center gap-2">
                                      <div className={`relative px-4 py-2 rounded-2xl border transition-all ${isBestPrice ? 'bg-white border-emerald-400 shadow-lg scale-105' : 'bg-gray-50/50 border-gray-100'}`}>
                                        {isBestPrice && (
                                          <div className="absolute -top-2 -right-2 bg-emerald-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Best Deal</div>
                                        )}
                                        <div className="flex flex-col">
                                          <span className={`text-xl font-black ${isBestPrice ? 'text-emerald-700' : 'text-gray-900'}`}>₹{prod.price}</span>
                                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">per {prod.unit}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 opacity-60">
                                          <Icon name="Navigation" className="w-3 h-3 text-slate-400" />
                                          <span className="text-[10px] font-bold text-slate-500">{shop.distance}</span>
                                        </div>
                                        <a href={`tel:${shop.phone}`} className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-emerald-400 hover:text-emerald-600 transition-all">
                                          <Icon name="Phone" className="w-3 h-3" />
                                        </a>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center opacity-20 filter grayscale">
                                      <Icon name="PackageX" className="w-6 h-6 mb-1" />
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Unavailable</span>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 text-right">
                <button
                  onClick={() => setShowCompare(false)}
                  className="bg-gray-800 text-white px-8 py-2 rounded-lg font-bold hover:bg-gray-900 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

import { Worker, AgroShop, Land } from '../utils/api';

interface WorkersContentProps {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  workers: Worker[];
  loading: boolean;
  error: string | null;
  onContactWorker: (worker: Worker, type?: 'call' | 'offer') => void;
  filters: any;
  onFilterChange: any;
  sentOffers: Set<string>;
  lands: Land[];
}

const WorkersContent = ({
  searchTerm,
  handleSearchChange,
  workers,
  loading,
  error,
  onContactWorker,
  filters,
  onFilterChange,
  sentOffers,
  lands,
}: WorkersContentProps) => {
  const [selectedLandId, setSelectedLandId] = useState<string>(filters.landId || 'default');

  // Update internal state when filter prop changes (for external triggers)
  useEffect(() => {
    if (filters.landId) {
      setSelectedLandId(filters.landId);
    }
  }, [filters.landId]);

  const selectedLand = lands.find(l => l.id === selectedLandId);

  return (
    <div className="space-y-6">
      {/* ── RELAY SECTOR ── */}
      <div className="bg-slate-900 rounded-[2rem] px-7 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl border border-slate-800">
        <div className="flex items-center gap-5 flex-1">
          <div className="flex flex-col min-w-[90px]">
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Relay</span>
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Sector:</span>
          </div>
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <select
              aria-label="Relay Sector – select land"
              value={selectedLandId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedLandId(val);
                onFilterChange({ ...filters, landId: val === 'default' ? undefined : val });
              }}
              className="w-full appearance-none bg-slate-800 text-white font-black text-sm uppercase tracking-widest px-5 py-3 pr-12 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="default">All Locations (Default)</option>
              {lands.map(land => (
                <option key={land.id} value={land.id}>
                  {(land.name || land.location || 'Unnamed Land').toUpperCase()}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <Icon name="ChevronDown" className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedLandId !== 'default' && selectedLand && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">
                {selectedLand.acreage} Acre{selectedLand.acreage !== 1 ? 's' : ''} • {selectedLand.location}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-2xl">
            <Icon name="Users" className="h-4 w-4 text-slate-400" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              {workers.length} Workers Found
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Available Workers</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onFilterChange({ ...filters, showFilters: !filters.showFilters })}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Icon name="Filter" className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search workers..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
            />
          </div>
        </div>
      </div>

      {filters.showFilters && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Filter Workers</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Distance (km)
              </label>
              <input
                type="number"
                value={filters.maxDistance || ''}
                onChange={(e) =>
                  onFilterChange({ ...filters, maxDistance: parseInt(e.target.value) || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min. Hours/Day</label>
              <input
                type="number"
                min="1"
                max="24"
                value={filters.minWorkHours || ''}
                onChange={(e) =>
                  onFilterChange({ ...filters, minWorkHours: parseInt(e.target.value) || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                aria-label="Filter availability"
                value={filters.available === undefined ? 'all' : filters.available.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  const available = value === 'all' ? undefined : value === 'true';
                  onFilterChange({ ...filters, available });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Any</option>
                <option value="true">Available</option>
                <option value="false">Busy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                aria-label="Filter gender"
                value={filters.gender || 'all'}
                onChange={(e) => onFilterChange({ ...filters, gender: e.target.value === 'all' ? undefined : e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
              <select
                aria-label="Filter skill"
                value={filters.skills?.[0] || 'all'}
                onChange={(e) => onFilterChange({ ...filters, skills: e.target.value === 'all' ? [] : [e.target.value] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Any</option>
                <option value="Harvesting">Harvesting</option>
                <option value="Sowing">Sowing</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Equipment Operation">Equipment Operation</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Find Workers Near Specific Land</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLandId('default')}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${selectedLandId === 'default'
                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                  }`}
              >
                My Default Location
              </button>
              {lands.map(land => (
                <button
                  key={land.id}
                  onClick={() => setSelectedLandId(land.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${selectedLandId === land.id
                      ? 'bg-green-600 text-white border-green-600 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                    }`}
                >
                  <Icon name="MapPin" className="h-3 w-3" />
                  {land.name || land.location}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map View Toggle Area (Placeholder) */}
      <div className="bg-white rounded-lg shadow p-4 border border-emerald-100 bg-emerald-50/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Icon name="Map" className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-900">Map Intelligence</p>
              <p className="text-xs text-emerald-700">
                {selectedLandId === 'default'
                  ? `Showing ${workers.length} workers near your primary location`
                  : `Showing ${workers.length} workers eligible to travel to ${selectedLand?.name || selectedLand?.location}`
                }
              </p>
            </div>
          </div>
          <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 px-4 py-2 bg-white rounded-lg border border-emerald-200 shadow-sm transition-all hover:shadow-md">
            View on Map
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner text="Finding available workers..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group active:scale-[0.98]"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-700 font-bold text-lg shadow-inner">
                      {worker.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        {worker.name}
                        {worker.verified && <Icon name="CheckCircle" className="h-4 w-4 text-blue-500 ml-1.5" />}
                      </h3>
                      <div className="flex items-center text-gray-500 text-xs mt-0.5">
                        <Icon name="MapPin" className="h-3 w-3 mr-1" />
                        <span>{worker.location} ({worker.distance})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 rounded-lg border border-yellow-100">
                      <Icon name="Star" className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                      <span className="text-xs font-bold text-yellow-700">{worker.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Travel Radius</p>
                    <p className="text-sm font-black text-gray-700">{worker.maxTravelKm || 50} km</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Max Hours/Day</p>
                    <p className="text-sm font-black text-gray-700">{worker.availableHoursPerDay || 8} h</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Icon name="Briefcase" className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{worker.experience} years exp • {worker.completedJobs} jobs</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Icon name="Wallet" className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-bold text-gray-900">₹{worker.hourlyRate}/hr</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 line-clamp-2">
                  {worker.skills.map((skill) => (
                    <span key={skill} className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-100 uppercase tracking-tight">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => onContactWorker(worker, 'call')}
                  className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all shadow-sm"
                  aria-label="Call worker"
                >
                  <Icon name="Phone" className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onContactWorker(worker, 'offer')}
                  disabled={sentOffers.has(worker.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 ${sentOffers.has(worker.id)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-green-100'
                    }`}
                >
                  {sentOffers.has(worker.id) ? 'Offer Sent' : 'Hire Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Application Modal Component
interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: any[];
  onUpdateStatus: (id: string, status: string) => void;
  loading: boolean;
}

const ApplicationModal = ({
  isOpen,
  onClose,
  applications,
  onUpdateStatus,
  loading,
}: ApplicationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Job Applications</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close applications modal"
          >
            <Icon name="X" className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading applications..." />
        ) : applications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No applications yet</p>
        ) : (
          <div className="space-y-4">
            {applications.map((application: any) => (
              <div key={application.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{application.workerName}</h4>
                    <p className="text-sm text-gray-600">{application.workerPhone}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Icon name="Star" className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{application.workerRating}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${application.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : application.status === 'accepted'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>

                {application.message && (
                  <p className="text-sm text-gray-700 mb-3">{application.message}</p>
                )}

                <p className="text-xs text-gray-500 mb-3">
                  Applied: {new Date(application.appliedAt).toLocaleString()}
                </p>

                {application.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onUpdateStatus(application.id, 'accepted')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                    >
                      <Icon name="UserCheck" className="h-4 w-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => onUpdateStatus(application.id, 'rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center space-x-1"
                    >
                      <Icon name="UserX" className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    <a
                      href={`tel:${application.workerPhone}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                    >
                      <Icon name="Phone" className="h-4 w-4" />
                      <span>Call</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main component
export default function FarmOwnerDashboard() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [showWorkerFilters, setShowWorkerFilters] = useState(false);
  const session = getSession();
  const [workerFilters, setWorkerFilters] = useState({
    skills: [] as string[],
    maxDistance: 20, // Default to a smaller nearby distance
    available: true,
    gender: 'all',
    minWorkHours: undefined as number | undefined
  });

  // Track sent offers
  const [sentOffers, setSentOffers] = useState<Set<string>>(new Set());
  const [selectedEditLand, setSelectedEditLand] = useState<any>(null);
  const [selectedSequenceLand, setSelectedSequenceLand] = useState<any>(null);

  // Load sent offers from localStorage on mount
  React.useEffect(() => {
    const offers = JSON.parse(localStorage.getItem('workerOffers') || '[]');
    const sentWorkerIds = new Set<string>(offers.map((offer: any) => String(offer.workerId)));
    setSentOffers(sentWorkerIds);
  }, []);

  const {
    data: workers,
    loading: workersLoading,
    error: workersError,
  } = useWorkers(workerFilters);

  const currentUserId = localStorage.getItem("currentUserId") || session?.id;

  const { data: jobs, loading: jobsLoading, error: jobsError, refetch: refetchJobs } = useJobs({ userId: currentUserId });

  const {
    data: lands,
    loading: landsLoading,
    error: landsError,
    refetch: refetchLands,
  } = useLands(currentUserId || session?.id);
  const { data: analytics, loading: analyticsLoading } = useAnalytics();
  const { data: agroShops, loading: agroShopsLoading, error: agroShopsError } = useAgroShops();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: string; timestamp: string; read: boolean }>
  >([]);


  // Action hooks
  const [landActionsProgress, setLandActionsProgress] = useState(false); // Local loading for land actions
  const { createJob, loading: createJobLoading } = useJobActions();
  const { createLand, updateLand, deleteLand, loading: landActionsLoading } = useLandActions();

  // Toast notifications
  const { toasts, addToast, removeToast } = useToast();

  // Form states
  const [landForm, setLandForm] = useState({
    name: '',
    location: '',
    cropType: 'rice',
    parts: [] as Array<{ crop: string; stage: string; area: string }>,
    acreage: '',
    stage: 'preparation',
    soilType: 'loam',
    irrigationType: 'flood',
    notes: '',
    latitude: '',
    longitude: '',
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    workers: '',
    duration: '',
    payment: '',
    skills: [],
    urgent: false,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const cropAdvice = {
    rice: {
      irrigation: 'Water every 3-4 days, maintain 2-3 inches depth. Next irrigation due in 2 days.',
      fertilizer: 'Apply NPK (120:60:40) in 3 splits',
      pests: 'Monitor for brown plant hopper, use neem oil spray',
      weather: 'Favorable conditions for next 7 days',
    },
    cotton: {
      irrigation: 'Deep watering twice a week',
      fertilizer: 'Use organic compost with phosphorus boost',
      pests: 'Watch for bollworm, apply biological controls',
      weather: 'Moderate rainfall expected',
    },
  };

  // Memoized handlers to prevent re-renders
  const handleLandFormChange = useCallback((field: string, value: any) => {
    setLandForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Notifications load and actions
  React.useEffect(() => {
    (async () => {
      const list = await api.getNotifications();
      setNotifications(list);
    })();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(async () => {
    await api.markAllNotificationsRead();
    const list = await api.getNotifications();
    setNotifications(list);
  }, []);

  const markOneRead = useCallback(async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const handleJobFormChange = useCallback((field: string, value: any) => {
    setJobForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);




  // New handlers for enhanced functionality
  const handleAddLand = useCallback(async () => {
    try {
      if (!landForm.name || !landForm.location || !landForm.acreage) {
        addToast({
          type: 'error',
          title: 'Missing Information',
          message: 'Please fill in all required fields',
        });
        return;
      }

      const localUserId = localStorage.getItem("currentUserId") || session?.id;
      await createLand({
        userId: localUserId,
        name: landForm.name,
        location: landForm.location,
        crop: landForm.cropType,
        acreage: parseFloat(landForm.acreage),
        stage: landForm.stage,
        soilType: landForm.soilType,
        irrigationType: landForm.irrigationType,
        status: landForm.stage,
        parts: landForm.parts.map(p => ({
          crop: p.crop,
          area: parseFloat(p.area) || 0,
          stage: p.stage
        })),
        plantedDate: landForm.stage === 'preparation' ? 'Not planted' : new Date().toISOString(),
        expectedHarvest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        notes: landForm.notes,
        coordinates: {
          lat: parseFloat(landForm.latitude) || 0,
          lng: parseFloat(landForm.longitude) || 0,
        },
      });

      setLandForm({
        name: '',
        location: '',
        cropType: 'rice',
        parts: [],
        acreage: '',
        stage: 'preparation',
        soilType: 'loam',
        irrigationType: 'flood',
        notes: '',
        latitude: '',
        longitude: '',
      });

      addToast({
        type: 'success',
        title: 'Land Added',
        message: 'Your land has been successfully added',
      });

      refetchLands();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to add land. Please try again.',
      });
    }
  }, [landForm, createLand, addToast, refetchLands, session?.id]);

  const handleDeleteLand = useCallback(async (id: string) => {
    try {
      await deleteLand(id);
      addToast({
        type: 'success',
        title: 'Land Deleted',
        message: 'Land record has been removed successfully',
      });
      refetchLands();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete land record',
      });
    }
  }, [deleteLand, addToast, refetchLands]);

  const handleUpdateLand = useCallback(async (id: string, updates: any) => {
    try {
      await updateLand(id, updates);
      addToast({
        type: 'success',
        title: 'Land Updated',
        message: 'Land record has been successfully updated',
      });
      setSelectedEditLand(null);
      refetchLands();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update land record',
      });
    }
  }, [updateLand, addToast, refetchLands]);

  const handleSearchCoordinates = useCallback(async (locationName: string) => {
    if (!locationName) return;
    try {
      setLandActionsProgress(true);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setLandForm(prev => ({ ...prev, latitude: lat, longitude: lon }));
        addToast({
          type: 'success',
          title: 'Location Found',
          message: `Coordinates for ${locationName} detected.`,
        });
      } else {
        addToast({
          type: 'error',
          title: 'Not Found',
          message: 'Could not find coordinates for this location.',
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setLandActionsProgress(false);
    }
  }, [addToast]);

  const handleCreateJob = useCallback(async () => {
    try {
      if (!jobForm.title || !jobForm.location || !jobForm.workers || !jobForm.date || !jobForm.description) {
        addToast({
          type: 'error',
          title: 'Missing Information',
          message: 'Please fill in all required fields (title, location, workers, date, description)',
        });
        return;
      }

      const localUserId = localStorage.getItem("currentUserId") || session?.id;
      await createJob({
        userId: localUserId,
        title: jobForm.title,
        description: jobForm.description,
        farmOwner: session?.name || 'Current User', // This would come from auth context
        farmOwnerPhone: session?.phone || '+91 98765 54321', // This would come from user profile
        location: jobForm.location,
        distance: '0 km', // Would be calculated based on location
        workers: parseInt(jobForm.workers),
        date: jobForm.date,
        time: jobForm.time || '8:00 AM - 5:00 PM',
        duration: jobForm.duration,
        payment: jobForm.payment,
        hourlyRate: (parseInt(jobForm.payment.replace(/[^\d]/g, '')) || 0) / 8, // Rough calculation
        skills: jobForm.skills,
        urgent: jobForm.urgent,
        verified: true,
        rating: 4.5,
        requirements: [],
        benefits: [],
      });

      setJobForm({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        workers: '',
        duration: '',
        payment: '',
        skills: [],
        urgent: false,
      });

      addToast({
        type: 'success',
        title: 'Job Posted',
        message: 'Your job has been successfully posted',
      });

      refetchJobs();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to post job. Please try again.',
      });
    }
  }, [jobForm, createJob, addToast, refetchJobs]);

  const handleContactWorker = useCallback(
    (worker: Worker, type = 'call') => {
      if (type === 'call') {
        window.open(`tel:${worker.phone}`);
      } else if (type === 'offer') {
        const offerDate = jobForm.date || new Date().toISOString().split('T')[0];

        // Check for worker availability/overlap
        const existingOffers = JSON.parse(localStorage.getItem('workerOffers') || '[]');
        const overlap = existingOffers.find((off: any) =>
          off.workerId === worker.id &&
          off.date === offerDate &&
          off.status !== 'rejected'
        );

        if (overlap) {
          addToast({
            type: 'error',
            title: 'Worker Unavailable',
            message: `${worker.name} already has an offer or booking for ${offerDate}.`,
          });
          return;
        }

        const newOffer = {
          id: `OFFER-${Date.now()}`,
          workerId: worker.id,
          workerName: worker.name,
          farmOwner: 'Current Farmer',
          date: offerDate,
          status: 'pending',
          payment: jobForm.payment || `${worker.hourlyRate * 8}/day`,
        };

        localStorage.setItem('workerOffers', JSON.stringify([...existingOffers, newOffer]));
        window.dispatchEvent(new Event('storage'));

        addToast({
          type: 'success',
          title: 'Job Offer Sent',
          message: `Job offer sent to ${worker.name} for ${offerDate}`,
        });

        // Update sent offers state
        setSentOffers(prev => new Set([...prev, worker.id]));
      }
    },
    [addToast, jobForm.date, jobForm.payment],
  );

  const handleViewApplications = useCallback(
    async (jobId: string) => {
      try {
        setSelectedJobId(jobId);
        const jobApplications = await api.getJobApplications(jobId);
        setApplications(jobApplications);
        setShowApplicationModal(true);
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to load applications',
        });
      }
    },
    [addToast],
  );

  const handleUpdateApplicationStatus = useCallback(
    async (applicationId: string, status: string) => {
      try {
        await api.updateApplicationStatus(selectedJobId!, applicationId, status as 'accepted' | 'rejected');

        setApplications((prev) =>
          prev.map((app) => (app.id === applicationId ? { ...app, status } : app)),
        );

        addToast({
          type: 'success',
          title: 'Application Updated',
          message: `Application ${status} successfully`,
        });
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to update application',
        });
      }
    },
    [selectedJobId, addToast],
  );

  const filteredLands = (lands || []).filter(
    (land: any) => land.userId === currentUserId
  );
  const filteredJobs = (jobs || []).filter(
    (job: any) => job.userId === currentUserId
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardContent
            setActiveTab={setActiveTab}
            cropAdvice={cropAdvice}
            analytics={analytics}
            loading={analyticsLoading}
            lands={filteredLands}
            jobs={filteredJobs}
          />
        );
      case 'land':
        return (
          <LandContent
            landForm={landForm}
            handleLandFormChange={handleLandFormChange}
            myLands={filteredLands}
            onAddLand={handleAddLand}
            onEditLand={setSelectedEditLand}
            onDeleteLand={handleDeleteLand}
            onSearchCoordinates={handleSearchCoordinates}
            loading={landsLoading || landActionsLoading || landActionsProgress}
            error={landsError}
            onFindWorkersFromLand={(landId: string) => {
              setWorkerFilters((prev: any) => ({ ...prev, landId }));
              setActiveTab('workers');
            }}
            onPostJobFromLand={(land: any) => {
              setActiveTab('jobs');
              setJobForm((prev) => ({
                ...prev,
                location: land.location,
                description: `${land.crop} • ${land.acreage} acres • ${land.soilType} • ${land.irrigationType}`,
              }));
              setTimeout(() => {
                const el = document.getElementById('post-job-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 0);
            }}
            onManageSequence={(land: any) => setSelectedSequenceLand(land)}
          />
        );
      case 'jobs':
        return (
          <JobsContent
            jobForm={jobForm}
            handleJobFormChange={handleJobFormChange}
            postedJobs={filteredJobs}
            onCreateJob={handleCreateJob}
            loading={jobsLoading || createJobLoading}
            error={jobsError}
            onViewApplications={handleViewApplications}
            lands={filteredLands}
          />
        );
      case 'workers':
        return (
          <WorkersContent
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            workers={workers || []}
            loading={workersLoading}
            error={workersError}
            onContactWorker={handleContactWorker}
            filters={{ ...workerFilters, showFilters: showWorkerFilters }}
            onFilterChange={(newFilters: any) => {
              if (newFilters.showFilters !== undefined) {
                setShowWorkerFilters(newFilters.showFilters);
              }
              setWorkerFilters(newFilters);
            }}
            sentOffers={sentOffers}
            lands={filteredLands}
          />
        );
      case 'resources':
        return <ResourceSharing />;
      case 'doctor':
        return <SmartCropDoctor />;
      case 'marketplace':
        return <Marketplace />;
      case 'agroshops':
        return (
          <AgroShopsContent
            agroShops={agroShops || []}
            loading={agroShopsLoading}
            error={agroShopsError}
          />
        );
      case 'agriconnect':
        return <AgriConnect />;


      case 'agri_intelligence':
        return <AICropAdvisor embeddedMode={true} />;
      default:
        return (
          <DashboardContent
            setActiveTab={setActiveTab}
            cropAdvice={cropAdvice}
            analytics={analytics}
            loading={analyticsLoading}
            lands={filteredLands}
            jobs={filteredJobs}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' && t('nav_dashboard')}

              {activeTab === 'land' && t('nav_my_land')}
              {activeTab === 'jobs' && t('nav_posted_jobs')}
              {activeTab === 'workers' && t('nav_find_workers')}
              {activeTab === 'resources' && t('nav_resource_sharing')}
              {activeTab === 'agroshops' && t('nav_agro_shops')}
              {activeTab === 'agriconnect' && 'உழவன் Connect Forum'}
              {activeTab === 'agri_intelligence' && 'உழவன் Intelligence'}
            </h1>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button
                onClick={logoutAndRedirect}
                className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <Icon name="LogOut" className="h-4 w-4" />
                Logout
              </button>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications((prev) => !prev);
                    setShowProfileDropdown(false);
                  }}
                  className="relative"
                  aria-label="Notifications"
                >
                  <Icon name="Bell" className="h-6 w-6 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="flex items-center justify-between px-3 py-2 border-b">
                      <span className="text-sm font-medium">Notifications</span>
                      <button
                        onClick={markAllRead}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">No notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`px-3 py-2 text-sm border-b ${n.read ? 'bg-white' : 'bg-gray-50'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="pr-2">
                                <p className="text-gray-800">{n.message}</p>
                                <p className="text-gray-500 text-xs">{n.timestamp}</p>
                              </div>
                              {!n.read && (
                                <button
                                  onClick={() => markOneRead(n.id)}
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowNotifications(false);
                  }}
                  className="h-8 w-8 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none focus:ring-offset-1"
                >
                  <span className="text-white font-medium">
                    {session?.name ? session.name.charAt(0).toUpperCase() : 'FO'}
                  </span>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 border-green-200">
                          <span className="text-white text-lg font-bold">
                            {session?.name ? session.name.charAt(0).toUpperCase() : 'FO'}
                          </span>
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{session?.name || 'Farm Owner'}</h3>
                          <p className="text-xs text-gray-500 truncate">{session?.email || session?.phone || 'No contact info'}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black rounded-full uppercase tracking-widest">
                            {session?.role || 'Farmer'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      <div className="px-3 py-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Contact Details</p>
                        <p className="text-sm text-gray-700 font-bold">{session?.phone || 'N/A'}</p>
                        {session?.altPhone && <p className="text-xs text-gray-500 mt-0.5">Alt: {session.altPhone}</p>}
                      </div>

                      {(session?.farmName || session?.farmLocation) && (
                        <div className="px-3 py-2 border-t border-gray-100">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Farm Info</p>
                          {session?.farmName && <p className="text-sm text-gray-700 font-bold">{session.farmName}</p>}
                          {session?.farmLocation && (
                            <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                              <Icon name="MapPin" className="h-3.5 w-3.5 mt-0.5 text-green-500 shrink-0" />
                              <span className="leading-snug">{session.farmLocation}</span>
                            </p>
                          )}
                          {session?.farmAreaAcres && (
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="font-bold text-gray-700">{session.farmAreaAcres}</span> Acres Total
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>


        {/* Main Content */}
        <main className={`flex-1 custom-scrollbar bg-slate-50/50 ${activeTab === 'agri_intelligence' ? 'overflow-hidden' : 'overflow-y-auto p-6'}`}>
          {renderContent()}
        </main>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        applications={applications}
        onUpdateStatus={handleUpdateApplicationStatus}
        loading={false}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Edit Land Modal */}
      {selectedEditLand && (
        <EditLandModal
          land={selectedEditLand}
          onClose={() => setSelectedEditLand(null)}
          onUpdate={handleUpdateLand}
          loading={landActionsLoading}
        />
      )}

      {/* NEW: Sequence Management Modal */}
      {selectedSequenceLand && (
        <SequenceManagementModal
          land={selectedSequenceLand}
          onClose={() => setSelectedSequenceLand(null)}
          onSave={(id: string, parts: any[]) => handleUpdateLand(id, { parts })}
          loading={landActionsLoading}
        />
      )}

      {/* Floating AI Chatbot for Farm Owner */}
      <FloatingChatbot />
    </div>
  );
}

// Edit Land Modal
interface EditLandModalProps {
  land: any;
  onClose: () => void;
  onUpdate: (id: string, updates: any) => void;
  loading: boolean;
}

const EditLandModal = ({ land, onClose, onUpdate, loading }: EditLandModalProps) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: land.name || land.location || '',
    location: land.location || '',
    acreage: land.acreage || '',
    status: land.status || 'growing',
    soilType: land.soilType || 'loam',
    irrigationType: land.irrigationType || 'flood',
    parts: land.parts || [],
    latitude: land.coordinates?.lat?.toString() || '',
    longitude: land.coordinates?.lng?.toString() || ''
  });
  const [searching, setSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(land.id, {
      ...formData,
      coordinates: {
        lat: parseFloat(formData.latitude) || 0,
        lng: parseFloat(formData.longitude) || 0
      }
    });
  };

  const searchCoordinates = async () => {
    if (!formData.location) return;
    try {
      setSearching(true);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        setFormData({
          ...formData,
          latitude: data[0].lat,
          longitude: data[0].lon
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl elite-border-glow">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{t('edit_land_title')}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{t('edit_land_subtitle')}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
            <Icon name="X" className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <form id="edit-land-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('label_land_name')}</label>
                <div className="relative">
                  <Icon name="Fingerprint" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('label_location_description')}</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Icon name="MapPin" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={searchCoordinates}
                    disabled={searching}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-emerald-700 transition-all shadow-lg"
                  >
                    {searching ? '...' : 'Get Lat/Lng'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latitude</label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longitude</label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Acreage</label>
                <div className="relative">
                  <Icon name="Maximize" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <input
                    type="number"
                    value={formData.acreage}
                    onChange={(e) => setFormData({ ...formData, acreage: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('label_growth_status')}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="sowing">{t('stage_sowing')}</option>
                  <option value="growing">{t('stage_growing')}</option>
                  <option value="flowering">{t('stage_flowering')}</option>
                  <option value="harvest">{t('stage_harvest')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('label_soil_composition')}</label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="loam">{t('soil_loam')}</option>
                  <option value="clay">{t('soil_clay')}</option>
                  <option value="sandy">{t('soil_sandy')}</option>
                  <option value="silt">Silt</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('label_irrigation_method')}</label>
              <select
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="flood">{t('irrigation_flood')}</option>
                <option value="drip">{t('irrigation_drip')}</option>
                <option value="sprinkler">{t('irrigation_sprinkler')}</option>
              </select>
            </div>

          </form>
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4 mt-auto">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
          >
            {t('cancel')}
          </button>
          <button
            form="edit-land-form"
            type="submit"
            disabled={loading}
            className="flex-1 py-4 px-6 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            {loading ? t('please_wait') : t('btn_update_land')}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- NEW COMPONENT: Sequence Management Modal ---
interface SequenceManagementModalProps {
  land: any;
  onClose: () => void;
  onSave: (id: string, parts: any[]) => void;
  loading: boolean;
}

const SequenceManagementModal = ({ land, onClose, onSave, loading }: SequenceManagementModalProps) => {
  const [parts, setParts] = useState(land.parts || []);
  const [newPart, setNewPart] = useState({ crop: '', area: '', stage: 'preparation' });

  const handleAddPart = () => {
    if (!newPart.crop || !newPart.area) return;
    setParts([...parts, { ...newPart, area: parseFloat(newPart.area) }]);
    setNewPart({ crop: '', area: '', stage: 'preparation' });
  };

  const handleRemovePart = (index: number) => {
    setParts(parts.filter((_: any, i: number) => i !== index));
  };

  const handleSave = () => {
    onSave(land.id, parts);
    onClose();
  };

  const totalSegmentedArea = parts.reduce((acc: number, p: any) => acc + (p.area || 0), 0);
  const remainingArea = (Number(land.acreage) || 0) - totalSegmentedArea;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl elite-border-glow">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Icon name="Layers" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Sequence Method</h3>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
                Land Segmentation: {land.location} ({land.acreage} Acres)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
            <Icon name="X" className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 bg-emerald-500 h-full" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Segmented</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-600">{totalSegmentedArea.toFixed(1)}</span>
                <span className="text-xs font-bold text-slate-400">/ {Number(land.acreage || 0).toFixed(1)} Acres</span>
              </div>
              <div className="mt-3 w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min((totalSegmentedArea / (Number(land.acreage) || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className={`p-5 rounded-3xl border relative overflow-hidden ${remainingArea < 0 ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${remainingArea < 0 ? 'bg-red-500' : 'bg-blue-500'}`} />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Available Space</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${remainingArea < 0 ? 'text-red-600' : 'text-blue-600'}`}>{Math.max(0, remainingArea).toFixed(1)}</span>
                <span className="text-xs font-bold text-slate-400">Acres Left</span>
              </div>
              {remainingArea < 0 && (
                <p className="text-[8px] text-red-500 font-bold uppercase mt-1">Exceeds total area by {Math.abs(remainingArea).toFixed(1)}!</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cultivation Sequence (Segments)</h4>
            <div className="space-y-3">
              {parts.length === 0 ? (
                <div className="py-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center opacity-60">
                  <Icon name="FolderPlus" className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No segments defined yet</p>
                </div>
              ) : (
                parts.map((part: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 uppercase tracking-tight">{part.crop}</h5>
                        <p className="text-[10px] font-bold text-emerald-600">{part.area} Acres • {part.stage}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePart(idx)}
                      className="p-2 opacity-0 group-hover:opacity-100 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Icon name="Trash2" className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 space-y-5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Add Segment to Sequence</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Crop Variety</label>
                <input
                  type="text"
                  value={newPart.crop}
                  onChange={e => setNewPart({ ...newPart, crop: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                  placeholder="e.g., Basmati Rice"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Area (Acres)</label>
                <input
                  type="number"
                  value={newPart.area}
                  onChange={e => setNewPart({ ...newPart, area: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                  placeholder="e.g., 2.5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Stage</label>
                <select
                  value={newPart.stage}
                  onChange={e => setNewPart({ ...newPart, stage: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="preparation">Preparation</option>
                  <option value="sowing">Sowing</option>
                  <option value="growing">Growing</option>
                  <option value="flowering">Flowering</option>
                  <option value="harvest">Harvest</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAddPart}
              className="w-full py-4 bg-white border-2 border-dashed border-emerald-200 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:border-emerald-400 transition-all flex items-center justify-center gap-2"
            >
              <Icon name="Plus" className="w-4 h-4" />
              Add Segment
            </button>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4 mt-auto">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || remainingArea < -0.1}
            className="flex-1 py-4 px-6 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Save Sequence'}
          </button>
        </div>
      </div>
    </div>
  );
};


