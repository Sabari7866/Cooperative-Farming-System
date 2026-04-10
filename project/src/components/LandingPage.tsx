import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { useI18n } from '../utils/i18n';
import ThemeToggle from './ThemeToggle';

const LandingPage = () => {
  const { t, setLocale, locale } = useI18n();
  const [showLangPrompt, setShowLangPrompt] = React.useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem('locale')) {
      setShowLangPrompt(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center shadow-lg border border-emerald-50">
                <img
                  src="/logo.png"
                  alt="உழவன் X"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-black tracking-tighter leading-none h-8 flex items-center">
                  <span className="text-slate-900">உழவன் X</span>
                  <span className="text-emerald-600"> X</span>
                </h1>
                <p className="text-[10px] text-emerald-600/60 font-black tracking-[0.1em] uppercase mt-1 italic">Innovation for inclusive agriculture</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-green-700 hover:text-green-900 font-medium transition-colors"
              >
                {t('nav_home')}
              </Link>
              <Link
                to="/crop-advisor"
                className="text-green-700 hover:text-green-900 font-medium transition-colors"
              >
                {t('nav_ai')}
              </Link>
              <div className="flex space-x-3 items-center">
                <ThemeToggle />
                <select
                  aria-label={t('choose_language')}
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as any)}
                  className="px-2 py-1 border rounded text-sm text-gray-600"
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ்</option>
                  <option value="hi">हिन्दी</option>
                </select>
                <Link
                  to="/login"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {t('nav_login')}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 transition-opacity"></div>
        {/* Animated Background shapes */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-300/30 rounded-full blur-[100px] mix-blend-multiply filter animate-blob"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/20 rounded-full blur-[100px] mix-blend-multiply filter animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-blue-200/20 rounded-full blur-[100px] mix-blend-multiply filter animate-blob animation-delay-4000"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-xl shadow-premium text-emerald-800 px-8 py-3 rounded-full text-xs font-black tracking-[0.4em] mb-12 border border-white/50 uppercase"
            >
              <Icon name="Crown" className="h-4 w-4 text-amber-500" />
              <span>AGRI CERTIFIED PLATFORM</span>
            </motion.div>

            <h2 className="text-8xl md:text-[9rem] font-black text-slate-900 mb-12 tracking-tighter leading-[0.85] drop-shadow-sm">
              Experience <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-amber-500">உழவன் X.</span>
            </h2>

            <p className="text-2xl md:text-3xl text-slate-500 mb-14 max-w-4xl mx-auto leading-relaxed font-medium">
              {t('hero_desc')}
            </p>

            {/* User Type Selection */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24">
              <Link
                to="/login"
                className="group bg-slate-900 hover:bg-black text-white px-12 py-6 rounded-2xl font-black text-xl transition-all duration-300 flex items-center justify-center space-x-4 shadow-2xl hover:scale-[1.02]"
              >
                <Icon name="Sprout" className="h-7 w-7 text-emerald-400" />
                <span>{t('cta_login')}</span>
                <Icon
                  name="ArrowRight"
                  className="h-6 w-6 group-hover:translate-x-2 transition-transform"
                />
              </Link>
            </div>

            {/* Hero Visual - Elite Interface Hood */}
            <div className="relative transform hover:scale-[1.02] transition-all duration-1000 group">
              <div className="absolute -inset-10 bg-gradient-to-r from-emerald-500/30 to-amber-500/30 rounded-[5rem] blur-[100px] opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/5 backdrop-blur-3xl rounded-[4rem] p-4 shadow-premium border border-white/30">
                <div className="bg-white/80 rounded-[3.5rem] p-16 sm:p-24 shadow-inner border border-white/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                  <div className="grid md:grid-cols-3 gap-20 items-center">
                    <div className="text-center group-hover:translate-y-[-10px] transition-transform duration-700">
                      <div className="bg-white rounded-[2.5rem] p-10 w-32 h-32 mx-auto mb-10 flex items-center justify-center shadow-premium border border-emerald-50 elite-border-glow">
                        <Icon name="Users" className="h-14 w-14 text-emerald-600" />
                      </div>
                      <h4 className="font-black text-5xl text-slate-900 mb-4 tracking-tighter">{t('hero_stat_workers')}</h4>
                      <p className="text-slate-400 font-black tracking-[0.2em] uppercase text-[10px]">{t('hero_stat_workers_desc')}</p>
                    </div>
                    <div className="text-center group-hover:translate-y-[-10px] transition-transform duration-700 delay-100">
                      <div className="bg-white rounded-[2.5rem] p-10 w-32 h-32 mx-auto mb-10 flex items-center justify-center shadow-premium border border-amber-50 relative">
                        <div className="absolute inset-0 bg-amber-400/5 rounded-[2.5rem] animate-pulse" />
                        <Icon name="MapPin" className="h-14 w-14 text-amber-500 relative z-10" />
                      </div>
                      <h4 className="font-black text-5xl text-slate-900 mb-4 tracking-tighter">{t('hero_stat_villages')}</h4>
                      <p className="text-slate-400 font-black tracking-[0.2em] uppercase text-[10px]">{t('hero_stat_villages_desc')}</p>
                    </div>
                    <div className="text-center group-hover:translate-y-[-10px] transition-transform duration-700 delay-200">
                      <div className="bg-white rounded-[2.5rem] p-10 w-32 h-32 mx-auto mb-10 flex items-center justify-center shadow-premium border border-blue-50 relative">
                        <div className="absolute inset-0 bg-blue-400/5 rounded-[2.5rem]" />
                        <Icon name="BrainCircuit" className="h-14 w-14 text-blue-600 relative z-10" />
                      </div>
                      <h4 className="font-black text-5xl text-slate-900 mb-4 tracking-tighter">{t('hero_stat_ai')}</h4>
                      <p className="text-slate-400 font-black tracking-[0.2em] uppercase text-[10px]">{t('hero_stat_ai_desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">{t('features_why')}</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('features_why_desc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-600 rounded-xl p-4 w-16 h-16 mb-6 group-hover:scale-110 transition-transform">
                <Icon name="Shield" className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                {t('feature_verified_title')}
              </h4>
              <p className="text-gray-600 leading-relaxed">{t('feature_verified_desc')}</p>
              <div className="mt-6 flex items-center space-x-2 text-green-600 font-medium">
                <Icon name="CheckCircle" className="h-5 w-5" />
                <span>{t('feature_verified_badge')}</span>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-amber-600 rounded-xl p-4 w-16 h-16 mb-6 group-hover:scale-110 transition-transform">
                <Icon name="Clock" className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">{t('feature_match_title')}</h4>
              <p className="text-gray-600 leading-relaxed">{t('feature_match_desc')}</p>
              <div className="mt-6 flex items-center space-x-2 text-amber-600 font-medium">
                <Icon name="CheckCircle" className="h-5 w-5" />
                <span>{t('feature_match_badge')}</span>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-600 rounded-xl p-4 w-16 h-16 mb-6 group-hover:scale-110 transition-transform">
                <Icon name="Brain" className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">{t('feature_ai_title')}</h4>
              <p className="text-gray-600 leading-relaxed">{t('feature_ai_desc')}</p>
              <div className="mt-6 flex items-center space-x-2 text-blue-600 font-medium">
                <Icon name="CheckCircle" className="h-5 w-5" />
                <span>{t('feature_ai_badge')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">{t('how_title')}</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('how_desc')}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-300 to-amber-300"></div>

              <div className="text-center relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{t('how_step1_title')}</h4>
                  <p className="text-gray-600 leading-relaxed">{t('how_step1_desc')}</p>
                </div>
              </div>

              <div className="text-center relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{t('how_step2_title')}</h4>
                  <p className="text-gray-600 leading-relaxed">{t('how_step2_desc')}</p>
                </div>
              </div>

              <div className="text-center relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{t('how_step3_title')}</h4>
                  <p className="text-gray-600 leading-relaxed">{t('how_step3_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-6">{t('cta_title')}</h3>
            <p className="text-xl text-green-100 mb-10">{t('cta_desc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Icon name="Sprout" className="h-6 w-6" />
                <span>{t('cta_get_started')}</span>
              </Link>
              <Link
                to="/crop-advisor"
                className="bg-green-800 hover:bg-green-900 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Icon name="Brain" className="h-6 w-6" />
                <span>{t('cta_try_ai')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Language Prompt */}
      {showLangPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h4 className="text-lg font-semibold mb-3">{t('choose_language')}</h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setLocale('ta' as any);
                  setShowLangPrompt(false);
                }}
                className="w-full px-4 py-2 border rounded hover:bg-gray-50"
              >
                தமிழ்
              </button>
              <button
                onClick={() => {
                  setLocale('hi' as any);
                  setShowLangPrompt(false);
                }}
                className="w-full px-4 py-2 border rounded hover:bg-gray-50"
              >
                हिन्दी
              </button>
              <button
                onClick={() => {
                  setLocale('en' as any);
                  setShowLangPrompt(false);
                }}
                className="w-full px-4 py-2 border rounded hover:bg-gray-50"
              >
                English
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-1 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt={t('brand_name')}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold">{t('brand_name')}</h4>
                  <p className="text-gray-400 text-sm">{t('tagline')}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md">
                {t('footer_desc')}
              </p>
              <div className="mt-6 flex space-x-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Icon name="Star" className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="font-semibold">{t('footer_rating')}</p>
                  <p className="text-gray-400 text-sm">{t('footer_reviews')}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">{t('footer_quick_links')}</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    {t('footer_about_us')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crop-advisor"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {t('nav_ai')}
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    {t('footer_success_stories')}
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    {t('footer_help_center')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">{t('footer_contact_info')}</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="MapPin" className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">{t('footer_address')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">{t('footer_copyright')}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('footer_privacy')}
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('footer_terms')}
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t('footer_cookies')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
