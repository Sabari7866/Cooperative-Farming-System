import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  useWorkers,
  useJobs,
  useLands,
  useJobActions,
  useLandActions,
  useAnalytics,
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
import IoTDashboard from './IoTDashboard';
import SmartCropDoctor from './SmartCropDoctor';
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
    <div className="w-64 bg-gradient-to-b from-white via-green-50/30 to-emerald-50/50 shadow-2xl border-r border-green-100/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
      <div className="p-6 border-b border-green-100 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-lg shadow-green-500/30 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-800">{t('brand_name')}</h1>
            <p className="text-xs text-gray-500 font-medium">{t('farm_owner_dashboard_subtitle')}</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 transform scale-[1.02]'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-700 hover:pl-5'
                }`}
            >
              <Icon name="Home" className={`h-5 w-5 transition-transform duration-300 ${activeTab === 'dashboard' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium tracking-wide">{t('nav_dashboard')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('iot')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'iot'
                ? 'bg-green-100 text-green-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="Wifi" className="h-5 w-5" />
              <span className="flex-1 text-left">{t('nav_smart_farm')}</span>
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">{t('badge_live')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('land')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'land'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="MapPin" className="h-5 w-5" />
              <span>{t('nav_my_land')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'jobs'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="Users" className="h-5 w-5" />
              <span>{t('nav_posted_jobs')}</span>
            </button>
          </li>
          <li>
            <Link
              to="/crop-advisor"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
            >
              <span>{t('nav_ai')}</span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'doctor'
                ? 'bg-green-100 text-green-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="Stethoscope" className="h-5 w-5" />
              <span className="flex-1 text-left">{t('nav_crop_doctor')}</span>
              <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{t('badge_new')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('workers')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'workers'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="Phone" className="h-5 w-5" />
              <span>{t('nav_find_workers')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('resources')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'resources'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="Wrench" className="h-5 w-5" />
              <span>{t('nav_resource_sharing')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'marketplace'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="ShoppingCart" className="h-5 w-5" />
              <span>{t('nav_marketplace')}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const DashboardContent = ({ setActiveTab, cropAdvice, analytics, loading }: DashboardContentProps) => {
  const { t } = useI18n();
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 rounded-3xl shadow-xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative flex items-center justify-between z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium text-green-50 mb-4 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              {t('label_platform_status') || 'Farm Status'}: {t('status_active')}
            </div>
            <h2 className="text-4xl font-bold mb-2 tracking-tight">{t('welcome_back_owner')}</h2>
            <p className="text-green-100 text-lg max-w-xl opacity-90">{t('welcome_owner_desc_part1')} <span className="font-semibold text-white decoration-green-400 underline decoration-2 underline-offset-2">3 {t('welcome_owner_desc_part2')}</span>.</p>
          </div>
          <div className="hidden md:block transform hover:scale-105 transition-transform duration-500">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <Icon name="Sprout" className="h-16 w-16 text-green-50 drop-shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-lg p-3">
              <Icon name="MapPin" className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{t('card_total_land')}</p>
            <p className="text-3xl font-bold text-gray-900">{analytics?.totalLands || 8}</p>
            <p className="text-xs text-gray-500 mt-1">{t('unit_acres')} {t('label_total')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <Icon name="Users" className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {analytics?.totalApplications || 12}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{t('card_active_jobs')}</p>
            <p className="text-3xl font-bold text-gray-900">{analytics?.activeJobs || 3}</p>
            <p className="text-xs text-gray-500 mt-1">{t('label_active_positions')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 rounded-lg p-3">
              <Icon name="Phone" className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              {t('label_nearby')}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{t('card_available_workers')}</p>
            <p className="text-3xl font-bold text-gray-900">{analytics?.availableWorkers || 15}</p>
            <p className="text-xs text-gray-500 mt-1">{t('card_within_km')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-lg p-3">
              <Icon name="TrendingUp" className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              {t('label_this_month')}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{t('card_this_month')}</p>
            <p className="text-3xl font-bold text-gray-900">
              ₹{analytics?.totalEarnings?.toLocaleString() || '45,000'}
            </p>
            <p className="text-xs text-gray-500 mt-1">{t('card_labor_costs')}</p>
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
              {(landForm.crops || []).map((c, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <select
                    aria-label={t('aria_select_crop')}
                    value={c.crop}
                    onChange={(e) =>
                      handleLandFormChange(
                        'crops',
                        landForm.crops.map((x, i) =>
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
                        landForm.crops.map((x, i) =>
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
              {job.skills.map((skill) => (
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
            rows="3"
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
                        currentSkills.filter((s) => s !== skill),
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

const WorkersContent = ({
  searchTerm,
  handleSearchChange,
  workers,
  loading,
  error,
  onContactWorker,
  filters,
  onFilterChange,
}) => {
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
          <div className="grid md:grid-cols-3 gap-4">
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
      <div className="grid md:grid-cols-2 gap-4">
        {workers.map((worker) => (
          <div key={worker.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{worker.name}</h3>
                <p className="text-gray-600 text-sm">{worker.skills.join(', ')}</p>
                <p className="text-gray-500 text-sm">{worker.distance} away</p>
                <p className="text-gray-500 text-sm">
                  {worker.experience} years exp • {worker.completedJobs} jobs
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{worker.rating}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium mt-1 inline-block ${worker.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                  {worker.available ? 'Available' : 'Busy'}
                </span>
                {worker.verified && (
                  <span className="block px-2 py-1 rounded text-xs font-medium mt-1 bg-blue-100 text-blue-700">
                    Verified
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {worker.skills.map((skill) => (
                <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p>Rate: ₹{worker.hourlyRate}/hour</p>
              <p>Languages: {worker.languages.join(', ')}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onContactWorker(worker)}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${worker.available
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                disabled={!worker.available}
              >
                <Icon name="Phone" className="h-4 w-4" />
                <span>Call</span>
              </button>
              <button
                onClick={() => onContactWorker(worker, 'offer')}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Icon name="Send" className="h-4 w-4" />
                <span>Send Offer</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Application Modal Component
const ApplicationModal = ({ isOpen, onClose, applications, onUpdateStatus, loading }) => {
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
            {applications.map((application) => (
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
  const { t, setLocale, locale } = useI18n();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [workerFilters, setWorkerFilters] = useState({ showFilters: false });

  // API hooks
  const {
    data: workers,
    loading: workersLoading,
    error: workersError,
    refetch: refetchWorkers,
  } = useWorkers(workerFilters);
  const { data: jobs, loading: jobsLoading, error: jobsError, refetch: refetchJobs } = useJobs();

  const {
    data: lands,
    loading: landsLoading,
    error: landsError,
    refetch: refetchLands,
  } = useLands();
  const { data: analytics, loading: analyticsLoading } = useAnalytics();
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
  const handleLandFormChange = useCallback((field, value) => {
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

  const handleJobFormChange = useCallback((field, value) => {
    setJobForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSearchChange = useCallback((e) => {
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
    (worker, type = 'call') => {
      if (type === 'call') {
        window.open(`tel:${worker.phone}`);
      } else if (type === 'offer') {
        addToast({
          type: 'info',
          title: 'Job Offer Sent',
          message: `Job offer sent to ${worker.name}`,
        });
      }
    },
    [addToast],
  );

  const handleViewApplications = useCallback(
    async (jobId) => {
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
    async (applicationId, status) => {
      try {
        await api.updateApplicationStatus(selectedJobId!, applicationId, status);

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
            filters={workerFilters}
            onFilterChange={setWorkerFilters}
          />
        );
      case 'resources':
        return <ResourceSharing />;
      case 'iot':
        return <IoTDashboard />;
      case 'doctor':
        return <SmartCropDoctor />;
      case 'marketplace':
        return <Marketplace />;
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'land' && 'My Land'}
              {activeTab === 'jobs' && 'Posted Jobs'}
              {activeTab === 'workers' && 'Find Workers'}
              {activeTab === 'resources' && 'Resource Sharing'}
              {activeTab === 'iot' && 'IoT Smart Farm'}
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
        <main className="flex-1 p-6">{renderContent()}</main>
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
