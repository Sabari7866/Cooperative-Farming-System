import { useMemo, useState, useEffect, useCallback } from 'react';
import { useJobs, useJobActions } from '../hooks/useApi';
import { logoutAndRedirect } from '../utils/auth';
import { useI18n } from '../utils/i18n';
import LanguageSelector from './LanguageSelector';
import FloatingChatbot from './FloatingChatbot';
import Icon from './Icon';

import { useToast, ToastContainer } from './Toast';

const skillFilters = ['all', 'Harvesting', 'Irrigation', 'Pest Control', 'Equipment'];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  workerOffers: any[];
}

const Sidebar = ({ activeTab, setActiveTab, workerOffers }: SidebarProps) => {
  const { t } = useI18n();
  return (
    <div className="w-72 glass-card border-r border-white/5 relative z-20 flex flex-col hidden md:flex shrink-0">
      <div className="p-8 border-b border-white/10 dark:border-white/5">
        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl border border-emerald-50 group-hover:rotate-6 transition-transform duration-500">
            <Icon name="Brain" className="h-8 w-8" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
              உழவன் <span className="text-emerald-600 uppercase tracking-widest ml-1">X</span>
            </h1>
            <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Worker Node
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {[
          { id: 'dashboard', label: t('nav_dashboard'), icon: 'Home' },
          { id: 'jobs', label: t('nav_find_jobs'), icon: 'Search' },
          { id: 'shifts', label: t('nav_my_shifts'), icon: 'Calendar' },
          { id: 'offers', label: t('nav_job_offers'), icon: 'Mail', count: workerOffers.filter((o: any) => o.status === 'pending').length },
          { id: 'profile', label: t('my_profile'), icon: 'User' },
          { id: 'community', label: t('nav_community'), icon: 'Users' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative ${activeTab === item.id
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
              : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
          >
            <Icon name={item.icon as any} className={`h-5 w-5 transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="text-xs font-black uppercase tracking-widest text-left flex-1">{item.label}</span>
            {item.count ? (
              <span className="bg-emerald-500 text-[#0A0A0B] text-[10px] font-black px-2 py-0.5 rounded-full glow-emerald">
                {item.count}
              </span>
            ) : activeTab === item.id && (
              <div className="w-1 h-1 rounded-full bg-emerald-400 glow-emerald"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button
          onClick={logoutAndRedirect}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all group"
        >
          <Icon name="LogOut" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          <span className="text-xs font-black uppercase tracking-widest">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
};

const WorkerProfileContent = ({ about, setAbout, onSave, isSaving }: any) => {
  const { t } = useI18n();
  const session = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-600 via-green-400 to-amber-400"></div>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-4xl text-white font-black shadow-2xl group-hover:rotate-3 transition-transform duration-500">
              {session.name ? session.name.charAt(0).toUpperCase() : 'W'}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-emerald-50 cursor-pointer hover:scale-110 transition-transform">
              <Icon name="Camera" className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{t('title_profile')}</h2>
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">{t('label_profile_header')}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('label_full_name')}</p>
                  <p className="font-bold text-slate-700 px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100">{session.name || 'Demo Worker'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('label_phone')}</p>
                  <p className="font-bold text-slate-700 px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100">{session.phone || '+91 99999 99999'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('label_bio')}</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={5}
                  className="w-full px-6 py-4 rounded-2xl bg-emerald-50/30 border-2 border-emerald-50/50 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all focus:bg-white resize-none"
                  placeholder={t('placeholder_bio')}
                ></textarea>
              </div>

              <div className="flex gap-3">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Icon name="CheckCircle" className="w-4 h-4" />
                  {t('badge_verified')}
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Icon name="Star" className="w-4 h-4" />
                  {t('badge_top_rated')}
                </span>
              </div>

              <button
                onClick={onSave}
                disabled={isSaving}
                className="px-10 py-5 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 flex items-center gap-3 active:scale-95"
              >
                <Icon name={isSaving ? 'Loader2' : 'CheckCircle'} className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                {isSaving ? t('please_wait') : t('btn_save_profile')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white shadow-soft">
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">{t('label_account_details')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Icon name="Mail" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
              <p className="font-bold text-slate-700">{session.email || 'worker@agrismart.com'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Icon name="Award" className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Experience Level</p>
              <p className="font-bold text-slate-700">Senior Farmer • 8+ Years</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FarmWorkerDashboard = () => {
  const { data: jobs } = useJobs();
  const { applyForJob } = useJobActions();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [about, setAbout] = useState(localStorage.getItem('worker_bio') || t('default_about_worker'));
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [view, setView] = useState<'list' | 'compact'>('list');
  const [applyStatus, setApplyStatus] = useState<string | null>(null);
  const [workerOffers, setWorkerOffers] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const { addToast, removeToast, toasts } = useToast();

  // Load applied jobs from localStorage
  const loadAppliedJobs = useCallback(() => {
    const applied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setAppliedJobs(applied);
  }, []);

  // Load worker offers from localStorage
  const loadOffers = useCallback(() => {
    let offers = JSON.parse(localStorage.getItem('workerOffers') || '[]');
    if (offers.length === 0) {
      // Add some sample offers for demo purposes
      offers = [
        {
          id: 'OFFER-1',
          workerId: 'demo-worker',
          workerName: 'Demo Worker',
          farmOwner: 'Green Valley Farms',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          status: 'pending',
          payment: '₹600/day',
        },
        {
          id: 'OFFER-2',
          workerId: 'demo-worker',
          workerName: 'Demo Worker',
          farmOwner: 'Sunset Acres',
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          status: 'pending',
          payment: '₹550/day',
        },
      ];
      localStorage.setItem('workerOffers', JSON.stringify(offers));
    }
    setWorkerOffers(offers);
  }, []);

  useEffect(() => {
    loadAppliedJobs();
    loadOffers();
    window.addEventListener('storage', loadOffers);
    return () => window.removeEventListener('storage', loadOffers);
  }, [loadOffers, loadAppliedJobs]);

  const handleOfferStatus = (offerId: string, status: 'accepted' | 'rejected') => {
    if (status === 'accepted') {
      const targetOffer = workerOffers.find(o => o.id === offerId);
      if (targetOffer) {
        // Check for overlap with confirmed shifts or already accepted offers
        const hasOverlap = shifts.some(s => s.date === targetOffer.date && s.status === 'confirmed') ||
          workerOffers.some(o => o.id !== offerId && o.date === targetOffer.date && o.status === 'accepted');

        if (hasOverlap) {
          setApplyStatus(`✗ Error: You are already booked for ${targetOffer.date}`);
          setTimeout(() => setApplyStatus(null), 3000);
          return;
        }
      }
    }

    const updated = workerOffers.map(off =>
      off.id === offerId ? { ...off, status } : off
    );
    setWorkerOffers(updated);
    localStorage.setItem('workerOffers', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    if (status === 'accepted') {
      const offer = workerOffers.find(o => o.id === offerId);
      // Add to shifts
      setShifts(prev => [...prev, {
        id: Date.now(),
        title: 'Directed Offer',
        farmer: offer.farmOwner,
        location: 'TBD',
        date: offer.date,
        time: 'Full Day',
        payment: offer.payment,
        status: 'confirmed',
        distance: 'Direct'
      }]);
    }

    setApplyStatus(`✓ Offer ${status} successfully!`);
    setTimeout(() => setApplyStatus(null), 2500);
  };

  // Shifts state management
  const [shifts, setShifts] = useState([
    {
      id: 1,
      title: 'Rice Harvesting',
      farmer: 'Ravi Kumar',
      location: 'North Field, Thanjavur',
      date: '2026-02-05',
      time: '6:00 AM - 2:00 PM',
      payment: '600',
      status: 'confirmed',
      distance: '3.2 km'
    },
    {
      id: 2,
      title: 'Irrigation Setup',
      farmer: 'Lakshmi Devi',
      location: 'East Plot, Trichy',
      date: '2026-02-06',
      time: '7:00 AM - 12:00 PM',
      payment: '400',
      status: 'confirmed',
      distance: '5.1 km'
    },
    {
      id: 3,
      title: 'Pest Control',
      farmer: 'Murugan S',
      location: 'West Farm, Madurai',
      date: '2026-02-07',
      time: '8:00 AM - 11:00 AM',
      payment: '350',
      status: 'pending',
      distance: '7.8 km'
    },
    {
      id: 4,
      title: 'Cotton Picking',
      farmer: 'Anitha R',
      location: 'South Field, Salem',
      date: '2026-02-08',
      time: '6:30 AM - 1:00 PM',
      payment: '550',
      status: 'confirmed',
      distance: '4.5 km'
    },
    {
      id: 5,
      title: 'Land Preparation',
      farmer: 'Karthik P',
      location: 'Central Farm, Coimbatore',
      date: '2026-02-09',
      time: '7:00 AM - 3:00 PM',
      payment: '700',
      status: 'pending',
      distance: '2.9 km'
    }
  ]);

  const focusBlocks = [
    {
      title: t('block_sunrise_title'),
      time: '6:00 - 9:00',
      task: t('block_sunrise_task'),
      mood: t('block_sunrise_mood'),
    },
    { title: t('block_irrigation_title'), time: '10:30 - 12:00', task: t('block_irrigation_task'), mood: t('block_irrigation_mood') },
    { title: t('block_skill_title'), time: '4:00 - 5:00', task: t('block_skill_task'), mood: t('block_skill_mood') },
  ];

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    if (selectedSkill === 'all') return jobs;
    return jobs.filter((job) =>
      job.skills.some((skill) => skill.toLowerCase().includes(selectedSkill.toLowerCase())),
    );
  }, [jobs, selectedSkill]);

  const handleApply = async (job: any) => {
    // Check if already applied
    if (appliedJobs.includes(job.id)) {
      setApplyStatus('✓ You have already applied for this job');
      setTimeout(() => setApplyStatus(null), 2500);
      return;
    }

    setApplyStatus('⏳ Applying...');
    try {
      await applyForJob(job.id, {
        id: 'current-worker',
        name: 'Demo Worker',
        phone: '+91 99999 99999',
        rating: 4.8,
      });

      // Add to applied jobs list
      const updatedApplied = [...appliedJobs, job.id];
      setAppliedJobs(updatedApplied);
      localStorage.setItem('appliedJobs', JSON.stringify(updatedApplied));

      setApplyStatus(`✓ Application sent to ${job.farmOwner}!`);
      setTimeout(() => setApplyStatus(null), 2500);
    } catch (err) {
      console.error('Apply error:', err);
      setApplyStatus('❌ Application failed. Please try again.');
      setTimeout(() => setApplyStatus(null), 3000);
    }
  };

  // Shift handlers
  const handleConfirmShift = (shiftId: number) => {
    setShifts(prevShifts =>
      prevShifts.map(shift =>
        shift.id === shiftId ? { ...shift, status: 'confirmed' } : shift
      )
    );
    setApplyStatus(`✓ Shift confirmed successfully!`);
    setTimeout(() => setApplyStatus(null), 2500);
  };

  const handleCancelShift = (shiftId: number) => {
    setShifts(prevShifts => prevShifts.filter(shift => shift.id !== shiftId));
    setApplyStatus(`✗ Shift cancelled`);
    setTimeout(() => setApplyStatus(null), 2500);
  };

  const handleViewShiftDetails = (shift: any) => {
    setApplyStatus(`📍 Opening details for ${shift.title}...`);
    setTimeout(() => setApplyStatus(null), 2500);
    // In a real app, this would open a modal or navigate to details page
  };

  const handleSaveWorkerProfile = useCallback(async () => {
    setIsSavingProfile(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    localStorage.setItem('worker_bio', about);
    setIsSavingProfile(false);
    addToast({ type: 'success', title: 'Success', message: t('msg_profile_updated') });
  }, [about, addToast, t]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} workerOffers={workerOffers} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {activeTab === 'dashboard'
                ? t('nav_dashboard')
                : activeTab === 'offers'
                  ? t('nav_job_offers')
                  : activeTab.replace('-', ' ')}
            </h2>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors relative">
                <Icon name="Bell" className="h-6 w-6" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
                DW
              </div>
              <button
                onClick={logoutAndRedirect}
                className="ml-4 px-4 py-2 rounded-xl bg-gray-50 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all border border-gray-100 flex items-center gap-2"
              >
                <Icon name="LogOut" className="h-4 w-4" />
                {t('logout')}
              </button>
            </div>
          </div>
        </header>


        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* OFFERS TAB */}
            {activeTab === 'offers' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <Icon name="Mail" className="h-6 w-6 mr-2 text-emerald-600" />
                    {t('nav_job_offers')}
                  </h3>

                  {workerOffers.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Inbox" className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-gray-500">{t('msg_no_job_offers')}</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {workerOffers.map((offer) => (
                        <div key={offer.id} className="border border-gray-100 rounded-xl p-5 hover:bg-emerald-50/30 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">Work with {offer.farmOwner}</h4>
                              <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                                <span className="flex items-center">
                                  <Icon name="Calendar" className="h-4 w-4 mr-1 text-emerald-600" />
                                  {offer.date}
                                </span>
                                <span className="flex items-center">
                                  <Icon name="DollarSign" className="h-4 w-4 mr-1 text-emerald-600" />
                                  {offer.payment}
                                </span>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${offer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              offer.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                              {offer.status}
                            </span>
                          </div>

                          {offer.status === 'pending' && (
                            <div className="flex space-x-3 mt-4">
                              <button
                                onClick={() => handleOfferStatus(offer.id, 'accepted')}
                                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                              >
                                Accept Offer
                              </button>
                              <button
                                onClick={() => handleOfferStatus(offer.id, 'rejected')}
                                className="flex-1 bg-white text-gray-700 border border-gray-200 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="relative bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 rounded-3xl shadow-xl p-8 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-400/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                  <div className="relative flex items-center justify-between z-10">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium text-emerald-50 mb-4 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        {t('status_label')} {t('status_available')}
                      </div>
                      <h2 className="text-4xl font-bold mb-2 tracking-tight">{t('worker_dashboard_subtitle')}</h2>
                      <p className="text-emerald-100 text-lg max-w-xl opacity-90">
                        {t('worker_welcome_msg_part1')} <span className="font-semibold text-white decoration-emerald-400 underline decoration-2 underline-offset-2">2</span> {t('worker_welcome_msg_part2')}.
                      </p>
                    </div>
                    <div className="hidden md:block transform hover:scale-105 transition-transform duration-500">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <Icon name="Users" className="h-16 w-16 text-emerald-50 drop-shadow-lg" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    {
                      label: t('stats_shifts_confirmed'),
                      primary: '03',
                      detail: '+1 ' + t('stats_pending'),
                      color: 'from-emerald-50 to-white',
                      iconColor: 'text-emerald-600',
                      iconBg: 'bg-emerald-100',
                      icon: 'CheckCircle'
                    },
                    {
                      label: t('stats_verified_skills'),
                      primary: '5',
                      detail: t('stats_add_skill'),
                      color: 'from-amber-50 to-white',
                      iconColor: 'text-amber-600',
                      iconBg: 'bg-amber-100',
                      icon: 'Award'
                    },
                    {
                      label: t('stats_completed_jobs') || 'Completed Jobs',
                      primary: '28',
                      detail: t('stats_all_time') || 'All time',
                      color: 'from-blue-50 to-white',
                      iconColor: 'text-blue-600',
                      iconBg: 'bg-blue-100',
                      icon: 'Briefcase'
                    },
                    {
                      label: t('stats_active_days') || 'Active Days',
                      primary: '45',
                      detail: t('stats_this_month') || 'This month',
                      color: 'from-purple-50 to-white',
                      iconColor: 'text-purple-600',
                      iconBg: 'bg-purple-100',
                      icon: 'Calendar'
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${stat.color}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`rounded-lg p-3 ${stat.iconBg}`}>
                          <Icon name={stat.icon as any} className={`h-6 w-6 ${stat.iconColor}`} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.primary}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Middle Column Content - Focus Blocks */}
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('label_todays_focus')}</h3>
                    <div className="bg-gradient-to-br from-emerald-600 to-green-500 rounded-3xl p-6 text-white shadow-lg">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide opacity-80">{t('label_rhythm_board')}</p>
                          <h3 className="text-2xl font-semibold">{t('label_daily_schedule')}</h3>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                          <Icon name="Calendar" className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {focusBlocks.map((block) => (
                          <div key={block.title} className="bg-white/10 hover:bg-white/20 transition-colors rounded-2xl p-4 flex justify-between items-center group">
                            <div>
                              <p className="text-xs text-emerald-100 mb-1 flex items-center gap-1">
                                <Icon name="Clock" className="h-3 w-3" />
                                {block.time}
                              </p>
                              <p className="font-semibold text-lg">{block.title}</p>
                              <p className="text-sm text-emerald-50 opacity-90">{block.task}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs bg-white/20 px-2 py-1 rounded-lg">{block.mood}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Nearby Available Jobs */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">{t('nearby_jobs') || 'Nearby Available Jobs'}</h3>
                        <button
                          onClick={() => setActiveTab('jobs')}
                          className="text-emerald-600 text-sm font-medium hover:underline"
                        >
                          {t('action_view_all')}
                        </button>
                      </div>
                      <div className="space-y-4">
                        {(jobs || []).slice(0, 4).map((job) => (
                          <div key={job.id} className="flex items-start justify-between p-3 rounded-xl hover:bg-emerald-50 transition-colors border border-gray-100 group">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700">{job.title}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Icon name="MapPin" className="h-3 w-3" />
                                {job.distance} • {job.location}
                              </p>
                              <p className="text-xs font-semibold text-emerald-600 mt-1">
                                ₹{job.payment}
                              </p>
                            </div>
                            {appliedJobs.includes(job.id) ? (
                              <span className="ml-2 px-3 py-1 bg-green-50 text-green-600 text-xs rounded-lg font-bold border border-green-100 flex items-center gap-1">
                                <Icon name="CheckCircle" className="h-3.5 w-3.5" />
                                Applied
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveTab('jobs');
                                  handleApply(job);
                                }}
                                className="ml-2 px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                              >
                                {t('apply')}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* JOBS TAB */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex gap-2 flex-wrap">
                    {skillFilters.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => setSelectedSkill(chip)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedSkill === chip
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-600 ring-offset-2'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {chip === 'all'
                          ? t('skill_all')
                          : t('skill_' + chip.toLowerCase().replace(' ', '_')) || chip}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
                    {['list', 'compact'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setView(mode as 'list' | 'compact')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === mode ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <span className="capitalize">{mode}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={view === 'compact' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                  {filteredJobs.map((job) => (
                    <article
                      key={job.id}
                      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-3">
                          <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                            {job.title.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{job.title}</h3>
                            <div className="flex flex-col gap-1 mt-1">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Icon name="MapPin" className="h-3.5 w-3.5 text-gray-400" />
                                <span>{job.location} • <span className="text-emerald-600 font-medium">{job.distance}</span></span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Icon name="User" className="h-3.5 w-3.5 text-gray-400" />
                                <span>{t('label_posted_by')}: <span className="font-semibold">{job.farmOwner}</span></span>
                              </div>
                              {job.farmOwnerPhone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Icon name="Phone" className="h-3.5 w-3.5 text-gray-400" />
                                  <span>{t('label_phone')}: <span className="font-mono">{job.farmOwnerPhone}</span></span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {job.urgent && (
                          <span className="animate-pulse bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            {t('label_urgent')}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 uppercase">{t('label_payment')}</span>
                          <span className="text-xl font-bold text-emerald-600">₹{job.payment}</span>
                        </div>
                        {appliedJobs.includes(job.id) ? (
                          <div className="px-6 py-2.5 flex items-center gap-2 text-green-600 font-bold bg-green-50 rounded-xl border border-green-100">
                            <Icon name="CheckCircle" className="h-5 w-5" />
                            <span>Applied</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApply(job)}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                          >
                            <span>{t('apply')}</span>
                            <Icon name="ArrowRight" className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <WorkerProfileContent
                about={about}
                setAbout={setAbout}
                onSave={handleSaveWorkerProfile}
                isSaving={isSavingProfile}
              />
            )}

            {/* SHIFTS TAB */}
            {activeTab === 'shifts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">{t('nav_my_shifts')}</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      {shifts.filter(s => s.status === 'confirmed').length} {t('stats_shifts_confirmed')}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
                      {shifts.filter(s => s.status === 'pending').length} {t('stats_pending')}
                    </span>
                  </div>
                </div>

                {/* Upcoming Shifts */}
                <div className="grid gap-4">
                  {shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all hover:shadow-lg ${shift.status === 'confirmed'
                        ? 'border-green-200 hover:border-green-300'
                        : 'border-yellow-200 hover:border-yellow-300'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{shift.title}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Icon name="User" className="h-3.5 w-3.5" />
                            {shift.farmer}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${shift.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {shift.status === 'confirmed' ? t('stats_shifts_confirmed') : t('stats_pending')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="MapPin" className="h-4 w-4 text-gray-400" />
                          <span>{shift.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="Navigation" className="h-4 w-4 text-gray-400" />
                          <span>{shift.distance}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="Calendar" className="h-4 w-4 text-gray-400" />
                          <span>{new Date(shift.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="Clock" className="h-4 w-4 text-gray-400" />
                          <span>{shift.time}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-xs text-gray-500">{t('label_payment')}</span>
                          <p className="text-xl font-bold text-emerald-600">₹{shift.payment}</p>
                        </div>
                        <div className="flex gap-2">
                          {shift.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleConfirmShift(shift.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all hover:scale-105 active:scale-95"
                              >
                                {t('confirm')}
                              </button>
                              <button
                                onClick={() => handleCancelShift(shift.id)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all hover:scale-105 active:scale-95"
                              >
                                {t('cancel')}
                              </button>
                            </>
                          )}
                          {shift.status === 'confirmed' && (
                            <button
                              onClick={() => handleViewShiftDetails(shift)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                            >
                              <Icon name="MapPin" className="h-4 w-4" />
                              {t('view_details')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMMUNITY TAB */}
            {activeTab === 'community' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">{t('nav_community')}</h2>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2">
                    <Icon name="Plus" className="h-4 w-4" />
                    New Post
                  </button>
                </div>

                {/* Community Posts */}
                <div className="grid gap-4">
                  {[
                    {
                      id: 1,
                      author: 'Ravi Kumar',
                      role: 'Farmer',
                      avatar: 'RK',
                      time: '2 hours ago',
                      content: 'Looking for experienced workers for rice harvesting next week. Good pay and meals provided. Contact me if interested!',
                      likes: 12,
                      comments: 5,
                      type: 'opportunity'
                    },
                    {
                      id: 2,
                      author: 'Lakshmi Devi',
                      role: 'Farmer',
                      avatar: 'LD',
                      time: '5 hours ago',
                      content: 'Sharing my experience with organic pest control methods. Used neem oil spray and it worked wonders! Happy to share the recipe.',
                      likes: 28,
                      comments: 14,
                      type: 'tip'
                    },
                    {
                      id: 3,
                      author: 'Murugan S',
                      role: 'Worker',
                      avatar: 'MS',
                      time: '1 day ago',
                      content: 'Completed a successful harvest at North Field today. Great team work! Thanks to all the farmers who trust us.',
                      likes: 45,
                      comments: 8,
                      type: 'update'
                    },
                    {
                      id: 4,
                      author: 'Anitha R',
                      role: 'Farmer',
                      avatar: 'AR',
                      time: '2 days ago',
                      content: 'Weather forecast shows rain next week. Plan your irrigation accordingly. Stay safe everyone!',
                      likes: 67,
                      comments: 22,
                      type: 'alert'
                    },
                    {
                      id: 5,
                      author: 'Karthik P',
                      role: 'Worker',
                      avatar: 'KP',
                      time: '3 days ago',
                      content: 'Anyone interested in learning modern irrigation techniques? I can conduct a small workshop this weekend.',
                      likes: 34,
                      comments: 19,
                      type: 'event'
                    }
                  ].map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {post.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900">{post.author}</h4>
                              <p className="text-xs text-gray-500">{post.role} • {post.time}</p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${post.type === 'opportunity'
                                ? 'bg-blue-100 text-blue-700'
                                : post.type === 'tip'
                                  ? 'bg-purple-100 text-purple-700'
                                  : post.type === 'alert'
                                    ? 'bg-red-100 text-red-700'
                                    : post.type === 'event'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                              {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <button className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                              <Icon name="Heart" className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                              <Icon name="MessageCircle" className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                              <Icon name="Share2" className="h-4 w-4" />
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        </main>
      </div>

      {applyStatus && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-fade-in-up">
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          {applyStatus}
        </div>
      )}

      {/* Floating AI Chatbot */}
      <FloatingChatbot />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default FarmWorkerDashboard;
