import React, { useState, useCallback } from 'react';
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
import { logoutAndRedirect } from '../utils/auth';
import FloatingChatbot from './FloatingChatbot';
import Marketplace from './Marketplace';
import SmartCropDoctor from './SmartCropDoctor';
import AICropAdvisor from './AICropAdvisor';
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
}

interface LandContentProps {
  landForm: any;
  handleLandFormChange: (field: string, value: any) => void;
  myLands: any[];
  onAddLand: () => void;
  loading: boolean;
  error: string | null;
  onPostJobFromLand: (land: any) => void;
}

interface JobsContentProps {
  jobForm: any;
  handleJobFormChange: (field: string, value: any) => void;
  postedJobs: any[];
  onCreateJob: () => void;
  loading: boolean;
  error: string | null;
  onViewApplications: (jobId: string) => void;
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
                <span className="text-slate-900">Agri</span>
                <span className="text-emerald-600">Smart</span>
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
            { id: 'doctor', icon: 'Crown', label: 'AGRI DOCTOR', badge: 'v12.0', badgeColor: 'bg-amber-500' },
            { id: 'agri_intelligence', icon: 'Zap', label: 'AGRI INTELLIGENCE', badge: 'AI', badgeColor: 'bg-emerald-500' },
            { id: 'workers', icon: 'Phone', label: t('nav_find_workers') },
            { id: 'resources', icon: 'Wrench', label: t('nav_resource_sharing') },
            { id: 'marketplace', icon: 'ShoppingCart', label: t('nav_marketplace') },
            { id: 'agroshops', icon: 'Store', label: 'Agri Shops' },
            { id: 'farmer_connection', icon: 'Activity', label: 'Agri Network' },
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

const DashboardContent = ({ setActiveTab, cropAdvice, analytics }: DashboardContentProps) => {
  const { t } = useI18n();
  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Elite Welcome Section */}
      <div className="relative group rounded-[3.5rem] overflow-hidden shadow-premium transition-all hover:shadow-emerald-100/50">
        <div className="absolute inset-0 bg-slate-900 border-b-[8px] border-emerald-500/20 group-hover:bg-black transition-colors duration-1000"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[140px] -mr-64 -mt-64 pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>

        <div className="relative p-14 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-emerald-600/20 backdrop-blur-3xl text-xs font-black text-emerald-300 mb-10 border border-emerald-500/20 shadow-glow uppercase tracking-[0.4em]">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_15px_#10b981]"></span>
              🌾 AgriSmart – Cultivating the Future
            </motion.div>
            <h2 className="text-6xl md:text-[8rem] font-black text-white mb-8 tracking-tighter leading-[0.85] drop-shadow-2xl">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400">AgriSmart.</span>
            </h2>
            <p className="text-emerald-50/60 text-3xl max-w-2xl font-medium leading-tight tracking-tight mt-6">
              🌱 <span className="text-white font-black underline decoration-emerald-500 decoration-[6px] underline-offset-[12px]">Connecting Farmers,</span> Cultivating the Future 🚜📱
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-white/5 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/10 shadow-premium flex items-center justify-center transform rotate-6 hover:rotate-0 transition-all duration-700 hover:scale-105 group-hover:border-emerald-500/30">
              <Icon name="Crown" className="h-20 w-20 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
            </div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md px-14 py-6 flex items-center gap-8 border-t border-white/5">
          <div className="flex -space-x-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full bg-emerald-900 border-4 border-slate-900 shadow-2xl flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black text-emerald-400/80 uppercase tracking-[0.5em] leading-none">🌾 உழவே உயிர் · Farming is Life · AgriSmart Live</span>
        </div>
      </div>

      {/* Stats Cards - Interactive Premium Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: t('card_total_land'), val: analytics?.totalLands || '8.2', unit: t('unit_acres'), icon: 'MapPin', color: 'emerald', trend: '+12%' },
          { label: t('card_active_jobs'), val: analytics?.activeJobs || '03', unit: t('label_active_positions'), icon: 'Users', color: 'blue', trend: 'ACTIVE' },
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
            <p className="text-blue-900 font-semibold mb-2">{t('rice_fields_north_plot')}</p>
            <p className="text-blue-700 text-sm leading-relaxed mb-4">
              {cropAdvice.rice.irrigation}
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
              <p className="font-medium text-gray-900">{t('activity_rice_harvested')}</p>
              <p className="text-sm text-gray-500">North plot completed successfully</p>
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
  loading,
  error,
  onPostJobFromLand,
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
        {myLands.map((land) => (
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
                <span>{new Date(land.expectedHarvest).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('label_last_updated')}:</span>
                <span>{land.lastUpdated}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">
                {t('view_details')}
              </button>
              <button
                onClick={() => onPostJobFromLand(land)}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
              >
                {t('action_post_job')}
              </button>
            </div>
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
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('coordinate_help') || 'Use the button to get your current GPS location or enter manually.'}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('label_crops_on_land')}
            </label>
            <div className="space-y-2">
              {(landForm.crops || []).map((c: any, idx: number) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <select
                    aria-label={t('aria_select_crop')}
                    value={c.crop}
                    onChange={(e) =>
                      handleLandFormChange(
                        'crops',
                        landForm.crops.map((x: any, i: number) =>
                          i === idx ? { ...x, crop: e.target.value } : x,
                        ),
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="rice">{t('crop_rice')}</option>
                    <option value="cotton">{t('crop_cotton')}</option>
                    <option value="wheat">{t('crop_wheat')}</option>
                    <option value="corn">{t('crop_corn')}</option>
                    <option value="sugarcane">{t('crop_sugarcane')}</option>
                    <option value="soybean">{t('crop_soybean')}</option>
                  </select>
                  <select
                    aria-label={t('aria_select_crop_stage')}
                    value={c.stage}
                    onChange={(e) =>
                      handleLandFormChange(
                        'crops',
                        landForm.crops.map((x: any, i: number) =>
                          i === idx ? { ...x, stage: e.target.value } : x,
                        ),
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="sowing">{t('stage_sowing')}</option>
                    <option value="growing">{t('stage_growing')}</option>
                    <option value="flowering">{t('stage_flowering')}</option>
                    <option value="harvest">{t('stage_harvest')}</option>
                  </select>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleLandFormChange('crops', [
                    ...(landForm.crops || []),
                    { crop: 'rice', stage: 'sowing' },
                  ])
                }
                className="mt-1 text-sm text-blue-600 hover:underline"
              >
                + {t('add_another_crop')}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_crop_type')}</label>
            <select
              aria-label="Select crop type"
              value={landForm.cropType}
              onChange={(e) => handleLandFormChange('cropType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="rice">{t('crop_rice')}</option>
              <option value="cotton">{t('crop_cotton')}</option>
              <option value="wheat">{t('crop_wheat')}</option>
              <option value="corn">{t('crop_corn')}</option>
              <option value="sugarcane">{t('crop_sugarcane')}</option>
              <option value="soybean">{t('crop_soybean')}</option>
            </select>
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
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
                <p className="text-sm text-gray-500 mt-1">{job.applicants.length} applicants</p>
                {job.urgent && (
                  <span className="block text-xs text-red-600 font-medium mt-1">Urgent</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map((skill: string) => (
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
                  {t('view_applications')} ({job.applicants.length})
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

import { AgroShop } from '../utils/api';

const FarmerConnectionContent = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'feed' | 'network' | 'profile'>('feed');
  const [postContent, setPostContent] = useState('');

  // Mock Data for Current User
  const userProfile = {
    name: 'You',
    location: 'Thanjavur, TN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    stats: { posts: 12, followers: 145, following: 89 },
    bio: 'Organic rice farmer | Sustainable agriculture enthusiast'
  };

  // State for Posts Feed
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Ramesh Kumar',
      location: 'Vadipatti, Madurai',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
      time: '2 hours ago',
      content: 'Successfully harvested 5 acres of Ponni rice today! The yield looks fantastic this season thanks to the timely rains. Anyone looking for bulk paddy procurement?',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop',
      likes: 24,
      comments: 5,
      liked: false,
      tags: ['Harvest', 'Rice', 'Organic']
    },
    {
      id: 2,
      author: 'Selvi Farm',
      location: 'Melur, Madurai',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      time: '5 hours ago',
      content: 'Just finished sowing cotton seeds. Used the new drought-resistant variety suggested by the Crop Doctor AI. Fingers crossed! 🌱',
      likes: 18,
      comments: 2,
      liked: true,
      tags: ['Sowing', 'Cotton', 'Innovation']
    },
    {
      id: 3,
      author: 'Karthik Raja',
      location: 'Usilampatti',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      time: '1 day ago',
      content: 'Warning to fellow farmers in Usilampatti area: Spotted some Fall Armyworm activity in my maize field. Please check your crops and take preventive measures immediately.',
      likes: 56,
      comments: 12,
      liked: false,
      tags: ['Alert', 'PestControl', 'Maize']
    }
  ]);

  // State for Suggestions
  const [suggestions, setSuggestions] = useState([
    { id: 101, name: 'Anitha Paul', location: 'Trichy', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', mutual: 12, status: 'none' },
    { id: 102, name: 'Velu Agrotech', location: 'Dindigul', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', mutual: 5, status: 'none' },
    { id: 103, name: 'Green Earth Coop', location: 'Coimbatore', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', mutual: 23, status: 'none' },
  ]);

  const handlePostSubmit = () => {
    if (!postContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: userProfile.name,
      location: userProfile.location,
      avatar: userProfile.avatar,
      time: 'Just now',
      content: postContent,
      likes: 0,
      comments: 0,
      liked: false,
      tags: ['Update']
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
    // toast.success('Update posted successfully!'); // Assuming toast is available or passed down
  };

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleConnect = (id: number) => {
    setSuggestions(suggestions.map(s =>
      s.id === id ? { ...s, status: s.status === 'sent' ? 'none' : 'sent' } : s
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-100px)] overflow-hidden">
      {/* Left Sidebar - Profile Summary */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full p-1 mb-4">
            <img src={userProfile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">{userProfile.name}</h3>
          <p className="text-gray-500 text-sm mb-4">{userProfile.bio}</p>

          <div className="flex justify-center divide-x divide-gray-200 py-4 border-t border-b border-gray-100 mb-4">
            <div className="px-4">
              <span className="block font-bold text-xl text-gray-900">{userProfile.stats.posts}</span>
              <span className="text-xs text-gray-500">Posts</span>
            </div>
            <div className="px-4">
              <span className="block font-bold text-xl text-gray-900">{userProfile.stats.followers}</span>
              <span className="text-xs text-gray-500">Connections</span>
            </div>
            <div className="px-4">
              <span className="block font-bold text-xl text-gray-900">{userProfile.stats.following}</span>
              <span className="text-xs text-gray-500">Following</span>
            </div>
          </div>

          <button className="w-full py-2 text-green-600 font-bold hover:bg-green-50 rounded-lg transition-colors">
            View My Profile
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Icon name="TrendingUp" className="h-5 w-5" /> Trending Topics
          </h4>
          <ul className="space-y-2 text-sm mt-4 text-green-50">
            <li className="flex justify-between cursor-pointer hover:text-white"><span>#OrganicFarming</span> <span className="opacity-75">1.2k</span></li>
            <li className="flex justify-between cursor-pointer hover:text-white"><span>#Monsoon2024</span> <span className="opacity-75">856</span></li>
            <li className="flex justify-between cursor-pointer hover:text-white"><span>#SustainableAgri</span> <span className="opacity-75">642</span></li>
            <li className="flex justify-between cursor-pointer hover:text-white"><span>#SmartFarming</span> <span className="opacity-75">420</span></li>
          </ul>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar">
        {/* Create Post Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex gap-4">
            <img src={userProfile.avatar} alt="You" className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your farm updates, tips, or ask questions..."
                className="w-full bg-gray-50 border-0 rounded-xl p-3 focus:ring-2 focus:ring-green-500 resize-none h-24"
              ></textarea>
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Add Image">
                    <Icon name="Image" className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" title="Add Video">
                    <Icon name="Film" className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Add Location">
                    <Icon name="MapPin" className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handlePostSubmit}
                  disabled={!postContent.trim()}
                  className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Post Update
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Tabs */}
        <div className="flex border-b border-gray-200 mb-6 bg-white sticky top-0 z-10 p-2 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 font-bold text-center rounded-lg transition-colors ${activeTab === 'feed' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex-1 py-3 font-bold text-center rounded-lg transition-colors ${activeTab === 'network' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            My Network
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-6 pb-20">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slideUp">
              <div className="p-4 flex justify-between items-start">
                <div className="flex gap-3">
                  <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  <div>
                    <h4 className="font-bold text-gray-900">{post.author}</h4>
                    <p className="text-xs text-gray-500 flex items-center">
                      <span>{post.time}</span>
                      <span className="mx-1">•</span>
                      <Icon name="MapPin" className="h-3 w-3 mr-0.5" /> {post.location}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Icon name="MoreHorizontal" className="h-5 w-5" />
                </button>
              </div>

              <div className="px-4 pb-2">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">#{tag}</span>
                  ))}
                </div>
              </div>

              {post.image && (
                <div className="mt-2 text-center bg-black">
                  <img src={post.image} alt="Post content" className="w-full object-cover max-h-96" />
                </div>
              )}

              <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500 border-b border-gray-100">
                <span>{post.likes} Likes</span>
                <span>{post.comments} Comments</span>
              </div>

              <div className="grid grid-cols-4 p-2 gap-1">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-colors font-medium ${post.liked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon name="Heart" className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                  Like
                </button>
                <button className="flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium">
                  <Icon name="MessageCircle" className="h-5 w-5" />
                  Comment
                </button>
                <button className="flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium">
                  <Icon name="Share2" className="h-5 w-5" />
                  Share
                </button>
                <button className="flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium">
                  <Icon name="Bookmark" className="h-5 w-5" />
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Suggestions */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Farmers You May Know</h3>
            <button className="text-green-600 text-sm font-bold">See All</button>
          </div>
          <div className="space-y-4">
            {suggestions.map(user => (
              <div key={user.id} className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{user.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{user.location} • {user.mutual} mutual</p>
                </div>
                <button
                  onClick={() => handleConnect(user.id)}
                  className={`p-2 rounded-full transition-colors ${user.status === 'sent' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                >
                  <Icon name={user.status === 'sent' ? 'Check' : 'UserPlus'} className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="bg-purple-100 text-purple-700 rounded-lg p-2 text-center min-w-[3.5rem]">
                <span className="block text-xs font-bold uppercase">Jun</span>
                <span className="block text-xl font-bold">15</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Organic Farming Expo</h4>
                <p className="text-xs text-gray-500">Madurai Trade Center</p>
                <span className="text-xs text-blue-600 font-medium">120 interested</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-amber-100 text-amber-700 rounded-lg p-2 text-center min-w-[3.5rem]">
                <span className="block text-xs font-bold uppercase">Jun</span>
                <span className="block text-xl font-bold">22</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Govt Loan Camp</h4>
                <p className="text-xs text-gray-500">Panchayat Office, Melur</p>
                <span className="text-xs text-blue-600 font-medium">85 interested</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center">
          <p>&copy; 2024 AgriSmart Inc.</p>
          <p className="mt-1">Privacy • Terms • Advertising • Cookies</p>
        </div>
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

  const allProducts = Array.from(new Set(agroShops?.flatMap(shop => shop.productPrices?.map(p => p.name) || []) || []));

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
                        const prices = agroShops.map(shop => shop.productPrices?.find(p => p.name === productName)?.price).filter(p => p !== undefined) as number[];
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

import { Worker } from '../utils/api';

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
}: WorkersContentProps) => {
  return (
    <div className="space-y-6">
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
          <Icon name="Search" className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search workers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {filters.showFilters && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Filter Workers</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                placeholder="10"
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
                <option value="all">All Workers</option>
                <option value="true">Available Only</option>
                <option value="false">Busy Workers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <select
                aria-label="Filter skills"
                multiple
                value={filters.skills || []}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    skills: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >

                <option value="Harvesting">Harvesting</option>
                <option value="Sowing">Sowing</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Equipment Operation">Equipment Operation</option>
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
          </div>
        </div>
      )}

      {/* Map placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Workers Near You</h3>
        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <Icon name="MapPin" className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Interactive Map View</p>
            <p className="text-sm text-gray-500">Showing {workers.length} workers within radius</p>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner text="Loading workers..." />}
      {error && <ErrorMessage message={error} />}

      {/* Workers List */}
      {!loading && !error && (
        <div className="grid gap-6">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
                    {worker.verified && <Icon name="CheckCircle" className="h-4 w-4 text-blue-500 ml-1" />}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Icon name="MapPin" className="h-4 w-4 mr-1" />
                    <span>{worker.location} ({worker.distance})</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Icon name="Phone" className="h-3 w-3 mr-1" />
                    <span>{worker.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Icon name="User" className="h-3 w-3 mr-1" />
                    <span>{worker.gender || 'Unknown'}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {worker.experience} years exp • {worker.completedJobs} jobs
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 justify-end">
                    <Icon name="Star" className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{worker.rating}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium mt-1 inline-block ${worker.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {worker.available ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {worker.skills.map((skill) => (
                  <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
                  <span>Hourly Rate:</span>
                  <span className="font-semibold">₹{worker.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>Languages:</span>
                  <span className="font-medium text-right">{worker.languages.join(', ')}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onContactWorker(worker, 'call')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${worker.available
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200 shadow-md'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  disabled={!worker.available}
                >
                  <Icon name="Phone" className="h-4 w-4" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => onContactWorker(worker, 'offer')}
                  disabled={sentOffers.has(worker.id)}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${sentOffers.has(worker.id)
                    ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-md'
                    }`}
                >
                  {sentOffers.has(worker.id) ? (
                    <>
                      <Icon name="CheckCircle" className="h-4 w-4" />
                      <span>Offer Sent</span>
                    </>
                  ) : (
                    <>
                      <Icon name="Send" className="h-4 w-4" />
                      <span>Send Offer</span>
                    </>
                  )}
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
  const [workerFilters, setWorkerFilters] = useState({
    skills: [] as string[],
    maxDistance: 50,
    available: true,
    gender: 'all'
  });

  // Track sent offers
  const [sentOffers, setSentOffers] = useState<Set<string>>(new Set());

  // Load sent offers from localStorage on mount
  React.useEffect(() => {
    const offers = JSON.parse(localStorage.getItem('workerOffers') || '[]');
    const sentWorkerIds = new Set(offers.map((offer: any) => offer.workerId));
    setSentOffers(sentWorkerIds);
  }, []);

  // API hooks
  const {
    data: workers,
    loading: workersLoading,
    error: workersError,
  } = useWorkers(workerFilters);
  const { data: jobs, loading: jobsLoading, error: jobsError, refetch: refetchJobs } = useJobs();

  const {
    data: lands,
    loading: landsLoading,
    error: landsError,
    refetch: refetchLands,
  } = useLands();
  const { data: analytics, loading: analyticsLoading } = useAnalytics();
  const { data: agroShops, loading: agroShopsLoading, error: agroShopsError } = useAgroShops();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: string; timestamp: string; read: boolean }>
  >([]);

  // Action hooks
  const { createJob, loading: createJobLoading } = useJobActions();
  const { createLand, loading: createLandLoading } = useLandActions();

  // Toast notifications
  const { toasts, addToast, removeToast } = useToast();

  // Form states
  const [landForm, setLandForm] = useState({
    name: '',
    location: '',
    cropType: 'rice',
    crops: [] as Array<{ crop: string; stage: string }>,
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

      await createLand({
        name: landForm.name,
        location: landForm.location,
        crop: landForm.cropType,
        acreage: parseFloat(landForm.acreage),
        stage: landForm.stage,
        soilType: landForm.soilType,
        irrigationType: landForm.irrigationType,
        status: landForm.stage,
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
        crops: [],
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
  }, [landForm, createLand, addToast, refetchLands]);

  const handleCreateJob = useCallback(async () => {
    try {
      if (!jobForm.title || !jobForm.location || !jobForm.workers || !jobForm.date) {
        addToast({
          type: 'error',
          title: 'Missing Information',
          message: 'Please fill in all required fields',
        });
        return;
      }

      await createJob({
        title: jobForm.title,
        description: jobForm.description,
        farmOwner: 'Current User', // This would come from auth context
        farmOwnerPhone: '+91 98765 54321', // This would come from user profile
        location: jobForm.location,
        distance: '0 km', // Would be calculated based on location
        workers: parseInt(jobForm.workers),
        date: jobForm.date,
        time: jobForm.time || '8:00 AM - 5:00 PM',
        duration: jobForm.duration,
        payment: jobForm.payment,
        hourlyRate: parseInt(jobForm.payment.replace(/[^\d]/g, '')) / 8, // Rough calculation
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardContent
            setActiveTab={setActiveTab}
            cropAdvice={cropAdvice}
            analytics={analytics}
            loading={analyticsLoading}
          />
        );
      case 'land':
        return (
          <LandContent
            landForm={landForm}
            handleLandFormChange={handleLandFormChange}
            myLands={lands || []}
            onAddLand={handleAddLand}
            loading={landsLoading || createLandLoading}
            error={landsError}
            onPostJobFromLand={(land) => {
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
          />
        );
      case 'jobs':
        return (
          <JobsContent
            jobForm={jobForm}
            handleJobFormChange={handleJobFormChange}
            postedJobs={jobs || []}
            onCreateJob={handleCreateJob}
            loading={jobsLoading || createJobLoading}
            error={jobsError}
            onViewApplications={handleViewApplications}
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
      case 'farmer_connection':
        return <FarmerConnectionContent />;
      case 'agri_intelligence':
        return <AICropAdvisor embeddedMode={true} />;
      default:
        return (
          <DashboardContent
            setActiveTab={setActiveTab}
            cropAdvice={cropAdvice}
            analytics={analytics}
            loading={analyticsLoading}
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
              {activeTab === 'farmer_connection' && 'Farmer To Farmer Connection'}
              {activeTab === 'agri_intelligence' && 'Agri Intelligence'}
            </h1>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button
                onClick={logoutAndRedirect}
                className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-50"
              >
                Logout
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
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
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">FO</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 ${activeTab === 'agri_intelligence' ? '' : 'p-6'}`}>{renderContent()}</main>
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
      {/* Floating AI Chatbot for Farm Owner */}
      <FloatingChatbot />
    </div>
  );
}
