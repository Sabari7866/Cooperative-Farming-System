import React from 'react';
import { Link } from 'react-router-dom';
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-1 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt={t('brand_name')}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">{t('brand_name')}</h1>
                <p className="text-xs text-green-600">{t('tagline')}</p>
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
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-amber-600/10 animate-pulse"></div>
        {/* Animated Background Shapes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-300/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-green-800 px-6 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm border border-green-100 animate-fade-in-down">
              <Icon name="Star" className="h-4 w-4 text-amber-500" />
              <span>{t('hero_trusted')}</span>
            </div>

            <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
              {t('hero_title_1')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 block mt-2">{t('hero_title_2')}</span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('hero_desc')}
            </p>

            {/* User Type Selection */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Link
                to="/login"
                className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1"
              >
                <Icon name="Sprout" className="h-6 w-6" />
                <span>{t('cta_login')}</span>
                <Icon
                  name="ArrowRight"
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* Hero Visual */}
            <div className="relative transform hover:scale-[1.01] transition-transform duration-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-amber-400 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/50">
                <div className="bg-white/80 rounded-xl p-8 sm:p-12">
                  <div className="grid md:grid-cols-3 gap-12 items-center">
                    <div className="text-center group p-4 rounded-xl hover:bg-green-50/50 transition-colors">
                      <div className="bg-green-100 rounded-2xl p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <Icon name="Users" className="h-10 w-10 text-green-600" />
                      </div>
                      <h4 className="font-bold text-2xl text-gray-900 mb-2">{t('hero_stat_workers')}</h4>
                      <p className="text-gray-600 font-medium">{t('hero_stat_workers_desc')}</p>
                    </div>
                    <div className="text-center group p-4 rounded-xl hover:bg-amber-50/50 transition-colors">
                      <div className="bg-amber-100 rounded-2xl p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <Icon name="MapPin" className="h-10 w-10 text-amber-600" />
                      </div>
                      <h4 className="font-bold text-2xl text-gray-900 mb-2">{t('hero_stat_villages')}</h4>
                      <p className="text-gray-600 font-medium">{t('hero_stat_villages_desc')}</p>
                    </div>
                    <div className="text-center group p-4 rounded-xl hover:bg-blue-50/50 transition-colors">
                      <div className="bg-blue-100 rounded-2xl p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <Icon name="Brain" className="h-10 w-10 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-2xl text-gray-900 mb-2">{t('hero_stat_ai')}</h4>
                      <p className="text-gray-600 font-medium">{t('hero_stat_ai_desc')}</p>
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
