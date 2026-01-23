import { useMemo, useState } from 'react';
import { useJobs, useWorkers, useJobActions } from '../hooks/useApi';
import { logoutAndRedirect } from '../utils/auth';
import { useI18n } from '../utils/i18n';
import LanguageSelector from './LanguageSelector';
import FloatingChatbot from './FloatingChatbot';
import Icon from './Icon';

const skillFilters = ['all', 'Harvesting', 'Irrigation', 'Pest Control', 'Equipment'];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { t } = useI18n();
  return (
    <div className="w-64 bg-gradient-to-b from-white via-emerald-50/30 to-green-50/50 shadow-2xl border-r border-emerald-100/50 relative overflow-hidden hidden md:block">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
      <div className="p-6 border-b border-emerald-100 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-lg shadow-emerald-500/30 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-800">{t('brand_name')}</h1>
            <p className="text-xs text-gray-500 font-medium">{t('worker_dashboard_title')}</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30 transform scale-[1.02]'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:pl-5'
                }`}
            >
              <Icon name="Home" className={`h-5 w-5 transition-transform duration-300 ${activeTab === 'dashboard' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium tracking-wide">{t('nav_dashboard')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'jobs'
                ? 'bg-emerald-100 text-emerald-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="Search" className="h-5 w-5" />
              <span className="flex-1 text-left">{t('nav_find_workers')}</span> {/* Using 'Find Workers' label for finding jobs */}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('shifts')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'shifts'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="Calendar" className="h-5 w-5" />
              <span>{t('nav_my_shifts')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="User" className="h-5 w-5" />
              <span>{t('my_profile')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('community')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'community'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon name="Users" className="h-5 w-5" />
              <span>{t('nav_community')}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const FarmWorkerDashboard = () => {
  const { data: jobs } = useJobs();
  const { data: workers } = useWorkers();
  const { applyForJob } = useJobActions();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [about, setAbout] = useState(t('default_about_worker'));
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [view, setView] = useState<'list' | 'compact'>('list');
  const [applyStatus, setApplyStatus] = useState<string | null>(null);

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
    setApplyStatus(t('status_applying'));
    try {
      await applyForJob(job.id, {
        id: 'current-worker',
        name: 'Demo Worker',
        phone: '+91 99999 99999',
        rating: 4.8,
      });
      setApplyStatus(t('status_request_sent') + ` ${t('to')} ${job.farmOwner}`);
      setTimeout(() => setApplyStatus(null), 2500);
    } catch (err) {
      setApplyStatus(t('generic_error'));
      setTimeout(() => setApplyStatus(null), 3000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {activeTab === 'dashboard' ? t('dashboard') : activeTab.replace('-', ' ')}
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
                className="ml-4 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-6">

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
                      label: t('stats_avg_rating'),
                      primary: '4.8',
                      detail: t('stats_top_workers'),
                      color: 'from-blue-50 to-white',
                      iconColor: 'text-blue-600',
                      iconBg: 'bg-blue-100',
                      icon: 'Star'
                    },
                    {
                      label: t('stats_earnings'),
                      primary: '₹4,250',
                      detail: t('stats_this_week'),
                      color: 'from-purple-50 to-white',
                      iconColor: 'text-purple-600',
                      iconBg: 'bg-purple-100',
                      icon: 'TrendingUp'
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

                  {/* Right Column - Crew Nearby */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">{t('nearby_workers')}</h3>
                        <button className="text-emerald-600 text-sm font-medium hover:underline">{t('action_view_all')}</button>
                      </div>
                      <div className="space-y-4">
                        {(workers || []).slice(0, 4).map((worker) => (
                          <div key={worker.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                {worker.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{worker.name}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Icon name="MapPin" className="h-3 w-3" />
                                  {worker.distance}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${worker.available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                              {worker.available ? t('label_ready') : t('label_busy')}
                            </span>
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
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Icon name="MapPin" className="h-3 w-3" />
                              {job.location} • {job.distance}
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
                          <span className="text-lg font-bold text-emerald-600">₹{job.payment}</span>
                        </div>
                        <button
                          onClick={() => handleApply(job)}
                          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                          <span>{t('apply')}</span>
                          <Icon name="ArrowRight" className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE TAB (Placeholder for now, simplified) */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">{t('my_profile')}</h3>
                  <button className="text-emerald-600 font-medium hover:underline">{t('edit')}</button>
                </div>

                <div className="flex flex-col items-center mb-8">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 mb-4 ring-4 ring-emerald-100">
                    DW
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Demo Worker</h4>
                  <p className="text-gray-500">+91 99999 99999</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{t('badge_verified')}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{t('badge_top_rated')}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_about')}</label>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_skills')}</label>
                    <div className="flex flex-wrap gap-2">
                      {/* Filtered skills would be dynamic */}
                      <span className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-500 rounded-lg text-sm hover:bg-gray-50">{t('action_add_skill')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs placeholders */}
            {['shifts', 'community'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Construction" className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t('feature_coming_soon')}</h3>
                <p className="text-gray-500 max-w-md text-center mt-2">{t('feature_coming_soon_desc')}</p>
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
    </div>
  );
};

export default FarmWorkerDashboard;
