import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import { useI18n } from '../utils/i18n';
import { loginUser, saveSession, registerUser, getSession } from '../utils/auth';
import type { UserRole } from '../utils/auth';
import { useNavigate } from 'react-router-dom';


export default function LoginModern() {
  const navigate = useNavigate();
  const { t, setLocale, locale } = useI18n();
  const [isNew, setIsNew] = useState(false);
  const [role, setRole] = useState<UserRole>('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [isVideoTheme, setIsVideoTheme] = useState(false);


  const heroVideoSrc = 'https://cdn.coverr.co/videos/coverr-farmer-with-tablet-4100/1080p.mp4';

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateEmailField = () => {
    if (!email.trim()) {
      setEmailError(t('error_email_or_phone_required'));
      return false;
    }
    if (!validateEmail(email) && !validatePhone(email)) {
      setEmailError(t('error_invalid_email_or_phone'));
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePasswordField = () => {
    if (!password) {
      setPasswordError(t('error_password_required'));
      return false;
    }
    if (isNew && !validatePassword(password)) {
      setPasswordError(t('error_password_too_short'));
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const validateConfirmPasswordField = () => {
    if (isNew && confirmPassword !== password) {
      setConfirmPasswordError(t('error_passwords_do_not_match'));
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isNew) {
        // Registration validation
        if (!name.trim()) {
          setError(t('error_full_name_required'));
          setIsLoading(false);
          return;
        }
        if (!validateEmailField()) {
          setError(t('error_invalid_email_or_phone'));
          setIsLoading(false);
          return;
        }
        if (!validatePasswordField()) {
          setIsLoading(false);
          return;
        }
        if (!validateConfirmPasswordField()) {
          setError(t('error_passwords_do_not_match'));
          setIsLoading(false);
          return;
        }

        registerUser({
          role,
          name: name.trim(),
          email: email || undefined,
          phone: validatePhone(email) ? email : undefined,
          password,
        });
        setSuccess(t('registration_success_redirect'));
        // After registration, login automatically
        const session = loginUser(email || '', password);
        if (session) {
          saveSession(session);
          // Navigate immediately based on the selected role - check profile for new users
          navigateBasedOnRole(session.role, true); // true = isNewUser
        }
      } else {
        // Login validation
        if (!validateEmailField()) {
          setError(t('error_invalid_email_or_phone'));
          setIsLoading(false);
          return;
        }
        if (!validatePasswordField()) {
          setIsLoading(false);
          return;
        }

        const session = loginUser(email.trim(), password);
        if (!session) {
          setError(t('invalid_credentials'));
          setIsLoading(false);
          return;
        }
        setSuccess(t('login_success_redirect'));
        saveSession(session);
        if (rememberMe) {
          localStorage.setItem('remembered_email', email.trim());
        } else {
          localStorage.removeItem('remembered_email');
        }
        // Navigate immediately based on the user's role - skip profile check for existing users
        navigateBasedOnRole(session.role, false); // false = existing user
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || t('generic_error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Date & time for the top info row
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setCurrentDate(now.toLocaleDateString(undefined, dateOptions));
      setCurrentTime(now.toLocaleTimeString(undefined, timeOptions));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navigateBasedOnRole = (userRole: UserRole, isNewUser: boolean = false) => {
    const session = getSession();
    switch (userRole) {
      case 'farmer':
        if (isNewUser) {
          if (!session?.name || !session.farmAreaAcres || !session.farmLocation || !session.currentCrops?.length) {
            navigate('/farmer-profile-setup');
            return;
          }
        }
        navigate('/farm-owner');
        return;
      case 'worker':
        if (isNewUser) {
          navigate('/profile-completion');
          return;
        }
        navigate('/farm-worker');
        return;
      case 'buyer':
        navigate('/buyer');
        return;
      case 'renter':
        if (isNewUser) {
          navigate('/profile-completion');
          return;
        }
        navigate('/renter');
        return;
      default:
        navigate('/login');
    }
  };

  return (
    <div className="relative w-screen min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 flex justify-center px-4 py-6 md:px-6 md:py-8 overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-green-100/40 to-teal-100/40 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20" />

        {/* Floating gradient orbs - Enhanced */}
        <motion.div
          className="absolute -left-48 -top-48 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-400/30 to-green-500/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-48 -bottom-48 w-96 h-96 rounded-full bg-gradient-to-br from-teal-400/30 to-cyan-500/30 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Optional background video theme */}
      <AnimatePresence>
        {isVideoTheme && (
          <motion.video
            key="bg-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            autoPlay
            muted
            loop
            playsInline
            className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-overlay"
          >
            <source src={heroVideoSrc} type="video/mp4" />
          </motion.video>
        )}
      </AnimatePresence>

      {/* Animated Leaf Silhouettes - Enhanced */}
      <motion.div
        className="absolute left-0 top-1/4 opacity-20"
        animate={{
          x: ['-100%', '120%'],
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" className="text-emerald-500">
          <path d="M40 10 C 20 20, 10 40, 40 70 C 70 40, 60 20, 40 10 Z" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute right-0 bottom-1/4 opacity-15"
        animate={{
          x: ['120%', '-100%'],
          rotate: [360, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" className="text-green-600">
          <path d="M50 15 C 30 25, 20 50, 50 85 C 80 50, 70 25, 50 15 Z" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Content wrapper (full-width with max for 4K) */}
      <motion.div
        className="relative z-10 w-full max-w-[1800px] mx-auto px-2 sm:px-4 md:px-6 pb-12"
        style={{ zoom: '0.8' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* TOP BAR */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Enhanced Logo with Glow */}
            <motion.div
              className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-400 to-amber-400 flex items-center justify-center shadow-lg elite-border-glow"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <div className="relative z-10 w-full h-full p-1 rounded-xl overflow-hidden bg-white">
                <img src="/logo.png" alt="உழவன் X" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter leading-none h-8 flex items-center">
                <span className="text-slate-900">உழவன்</span>
                <span className="text-emerald-600"> X</span>
              </h1>
              <p className="text-[10px] text-emerald-600/60 font-black tracking-[0.1em] uppercase mt-1 italic">Innovation for inclusive agriculture v12.0</p>
            </div>
          </motion.div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[
                { label: t('nav_crops'), icon: '🌾', onClick: () => navigate('/crops') },
                { label: t('nav_farm_docs'), icon: '🧾', onClick: () => navigate('/farm-docs') },
                { label: t('nav_support'), icon: '🫂', onClick: () => navigate('/support') },
                { label: 'Admin', icon: '🛡️', onClick: () => navigate('/admin-login') },
              ].map((btn) => (
                <motion.button
                  key={btn.label}
                  onClick={btn.onClick}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm hover:shadow-md hover:bg-emerald-600 hover:text-white hover:border-emerald-600 flex items-center gap-1.5"
                  type="button"
                >
                  {btn.icon && <span className="text-base leading-none">{btn.icon}</span>}
                  <span>{btn.label}</span>
                </motion.button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsVideoTheme((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition"
            >
              <div className={`h-2 w-2 rounded-full ${isVideoTheme ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              {isVideoTheme ? t('video_theme_on') : t('video_theme_off')}
            </button>

          </div>
        </header>

        {/* Divider */}
        <div className="mb-4 border-t border-slate-200" />

        {/* SECOND ROW: Date/Time + Languages */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-600">{t('label_date')}</span>
              <input
                value={currentDate}
                readOnly
                className="px-3 py-1.5 rounded-full text-xs md:text-sm border border-slate-200 bg-slate-50 text-slate-800 min-w-[140px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-600">{t('label_time')}</span>
              <div className="px-3 py-1.5 rounded-full text-xs md:text-sm border border-slate-200 bg-slate-50 text-slate-800 min-w-[140px] flex items-center justify-center overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    key={currentTime}
                    initial={{ rotateX: -90, opacity: 0, y: 6 }}
                    animate={{ rotateX: 0, opacity: 1, y: 0 }}
                    exit={{ rotateX: 90, opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="inline-block origin-bottom"
                  >
                    {currentTime}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 mr-1">{t('label_language')}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${locale === 'en'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-transparent shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
              >
                <span className="text-sm">🇬🇧</span> English
              </button>
              <button
                type="button"
                onClick={() => setLocale('ta')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${locale === 'ta'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
              >
                <span className="text-sm">🇮🇳</span> தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLocale('hi')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${locale === 'hi'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
              >
                <span className="text-sm">🇮🇳</span> हिन्दी
              </button>
            </div>
          </div>
        </section>


        


        {/* MAIN BODY: Responsive Columns */}
        <main className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Left Column: Welcome Page - Enhanced with More Content */}
          <motion.section
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.h2
              className="text-base md:text-lg font-semibold text-slate-800 dark:text-white mb-2"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {t('welcome_page_title')}
            </motion.h2>

            {/* Main Welcome Card */}
            <div className="flex-1 rounded-2xl border border-emerald-100 dark:border-emerald-800 bg-white/60 dark:bg-emerald-900/20 shadow-premium px-8 py-8 text-sm text-slate-800 dark:text-slate-300 leading-relaxed space-y-6 relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Icon name="Crown" className="w-32 h-32" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4 leading-none">உழவன் X <br /> <span className="text-emerald-600">Precision Protocol</span></h2>
              <p className="text-lg font-medium opacity-80">{t('welcome_page_body')}</p>

              <div className="space-y-4">
                <motion.div
                  className="flex items-center gap-4 text-sm font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Icon name="Zap" className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span>{t('welcome_point_1')}</span>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4 text-sm font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                >
                  <Icon name="Target" className="h-5 w-5 text-emerald-600" />
                  <span>{t('welcome_point_2')}</span>
                </motion.div>
              </div>
            </div>


            {/* Feature Cards - Floating Animation */}


            {/* 3D TILT HOVER CARDS */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {[
                { title: t('feature_smart_analytics_title'), desc: t('feature_smart_analytics_desc'), icon: 'TrendingUp', color: 'emerald' },
                { title: t('feature_weather_alerts_title'), desc: t('feature_weather_alerts_desc'), icon: 'CloudSun', color: 'blue' },
                { title: t('feature_marketplace_title'), desc: t('feature_marketplace_desc'), icon: 'ShoppingCart', color: 'purple' },
                { title: t('feature_job_board_title'), desc: t('feature_job_board_desc'), icon: 'Users', color: 'amber' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  style={{ perspective: 1000 }}
                  variants={{
                    hidden: { y: 20, opacity: 0, scale: 0.9 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }
                  }}
                >
                  <motion.div
                    className={`h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-${feature.color}-100 dark:border-${feature.color}-800 shadow-sm cursor-default`}
                    whileHover={{
                      scale: 1.05,
                      rotateX: 10,
                      rotateY: -10,
                      boxShadow: "0px 20px 30px -10px rgba(0,0,0,0.2)",
                      zIndex: 10
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="flex items-center gap-2 mb-2" style={{ transform: "translateZ(20px)" }}>
                      <div className={`w-8 h-8 rounded-full bg-${feature.color}-100 dark:bg-${feature.color}-900/50 flex items-center justify-center`}>
                        <Icon
                          name={feature.icon}
                          className={`h-4 w-4 text-${feature.color}-600 dark:text-${feature.color}-400`}
                        />
                      </div>
                      <h3 className="text-xs font-semibold text-slate-800 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400" style={{ transform: "translateZ(10px)" }}>
                      {feature.desc}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>


            {/* FLIP CARD STATS */}
            <div className="group h-32 perspective-1000 cursor-pointer">
              <motion.div
                className="relative h-full w-full rounded-xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Front Face */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 text-white [backface-visibility:hidden]">
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                      repeatDelay: 3
                    }}
                  />

                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Icon name="BarChart3" className="h-4 w-4" />
                    {t('stats_platform_stats')}
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-[10px] text-emerald-100">{t('stats_farmers')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">1K+</div>
                      <div className="text-[10px] text-emerald-100">{t('stats_products')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">200+</div>
                      <div className="text-[10px] text-emerald-100">{t('stats_jobs')}</div>
                    </div>
                  </div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-purple-600 text-white p-4 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center text-center">
                  <h3 className="text-lg font-bold mb-1">Did You Know?</h3>
                  <p className="text-xs text-purple-100">உழவன் X AI has helped save over 10,000 liters of water this season through smart irrigation alerts.</p>
                </div>
              </motion.div>
            </div>
          </motion.section >

          {/* Middle Column: Login Form box - Enhanced with Glassmorphism */}
          <motion.section
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <div className="relative flex flex-col">
              {/* Animated Rotating Gradient Border */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[9px] rounded-9xl opacity-75"
                animate={{
                  background: [
                    'linear-gradient(0deg, rgba(16,185,129,0.8), rgba(20,184,166,0.8), rgba(96,165,250,0.8))',
                    'linear-gradient(120deg, rgba(20,184,166,0.8), rgba(96,165,250,0.8), rgba(168,85,247,0.8))',
                    'linear-gradient(240deg, rgba(96,165,250,0.8), rgba(168,85,247,0.8), rgba(16,185,129,0.8))',
                    'linear-gradient(360deg, rgba(168,85,247,0.8), rgba(16,185,129,0.8), rgba(20,184,166,0.8))',
                    'linear-gradient(360deg, rgba(40, 178, 169, 0.8), rgba(205, 17, 193, 0.8), rgba(118, 37, 218, 0.8))',

                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ filter: 'blur(8px)' }}
              />

              {/* Glassmorphism Card */}
              <motion.div
                className="relative flex-1 rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl px-4 py-5 md:px-5 md:py-6"
                whileHover={{
                  boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)',
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />

                <div className="relative z-10">
                  <motion.h2
                    className="text-base md:text-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-1"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    {isNew ? t('create_account') : t('sign_in')}
                  </motion.h2>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {isNew ? t('login_subtitle_new') : t('login_subtitle_existing')}
                  </p>

                  {/* Toggle New User */}
                  <div className="mb-4">
                    <label className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isNew}
                        onChange={(e) => setIsNew(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{t('new_user_create_account')}</span>
                    </label>
                  </div>

                  {/* Role Selection (only when creating account) */}
                  {isNew && (
                    <div className="mb-4">
                      <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                        {t('choose_role')}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'farmer', label: 'Farmer', icon: 'Sprout' },
                          { id: 'worker', label: 'Worker', icon: 'Users' },
                          { id: 'buyer', label: 'Buyer', icon: 'ShoppingCart' },
                          { id: 'renter', label: 'Renter', icon: 'Wrench' },
                        ].map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id as UserRole)}
                            className={`flex items-center justify-center gap-1.5 rounded-lg border text-xs py-2 px-2 transition ${role === r.id
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                              }`}
                          >
                            <Icon
                              name={r.icon}
                              className={`h-4 w-4 ${role === r.id ? 'text-emerald-600' : 'text-slate-400'
                                }`}
                            />
                            <span>{t(`role_${r.id}`)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs md:text-sm flex items-center gap-2">
                        <Icon name="AlertCircle" className="h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                    {success && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-md text-xs md:text-sm flex items-center gap-2">
                        <Icon name="CheckCircle" className="h-4 w-4 flex-shrink-0" />
                        <span>{success}</span>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {isNew && (
                        <motion.div
                          key="new-user-fields"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="mb-3">
                            <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">
                              {t('full_name')}
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Icon name="User" className="h-4 w-4" />
                              </span>
                              <motion.input
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('full_name')}
                                className="w-full pl-12 pr-3 py-2.5 rounded-lg border border-slate-200 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div layout>
                      <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">
                        {t('email_or_phone')}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Icon name="Mail" className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError(null);
                          }}
                          onBlur={validateEmailField}
                          placeholder={t('placeholder_email_phone')}
                          className={`w-full pl-12 pr-3 py-2.5 rounded-lg border text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${emailError ? 'border-red-300 bg-red-50' : 'border-slate-200'
                            }`}
                        />
                      </div>
                      {emailError && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-1 text-xs text-red-600 flex items-center gap-1"
                        >
                          <Icon name="AlertCircle" className="h-3 w-3" />
                          <span>{emailError}</span>
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div layout>
                      <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">
                        {t('password_label')}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Icon name="Lock" className="h-4 w-4" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError(null);
                          }}
                          onBlur={validatePasswordField}
                          placeholder={
                            isNew ? t('create_a_strong_password') : t('enter_your_password')
                          }
                          className={`w-full pl-12 pr-10 py-2.5 rounded-lg border text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${passwordError ? 'border-red-300 bg-red-50' : 'border-slate-200'
                            }`}
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          whileTap={{ scale: 0.9, rotate: showPassword ? -90 : 90 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                          <Icon name={showPassword ? 'EyeOff' : 'Eye'} className="h-4 w-4" />
                        </motion.button>
                      </div>
                      {passwordError && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-1 text-xs text-red-600 flex items-center gap-1"
                        >
                          <Icon name="AlertCircle" className="h-3 w-3" />
                          <span>{passwordError}</span>
                        </motion.p>
                      )}

                      <AnimatePresence>
                        {isNew && password && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-slate-500">
                                {t('password_strength_label')}
                              </span>
                              <span
                                className={`font-medium ${getPasswordStrength(password) <= 2
                                  ? 'text-red-600'
                                  : getPasswordStrength(password) <= 3
                                    ? 'text-amber-600'
                                    : 'text-emerald-600'
                                  }`}
                              >
                                {getPasswordStrength(password) <= 2
                                  ? t('password_strength_weak')
                                  : getPasswordStrength(password) <= 3
                                    ? t('password_strength_medium')
                                    : t('password_strength_strong')}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1">
                              <motion.div
                                className={`h-1 rounded-full`}
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${(getPasswordStrength(password) / 5) * 100}%`,
                                  backgroundColor: getPasswordStrength(password) <= 2
                                    ? '#ef4444' // red-500
                                    : getPasswordStrength(password) <= 3
                                      ? '#f59e0b' // amber-500
                                      : '#10b981' // emerald-500
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <AnimatePresence>
                      {isNew && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 mt-3">
                            {t('confirm_password_label')}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <Icon name="Lock" className="h-4 w-4" />
                            </span>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (confirmPasswordError) setConfirmPasswordError(null);
                              }}
                              onBlur={validateConfirmPasswordField}
                              placeholder={t('confirm_password_placeholder')}
                              className={`w-full pl-12 pr-10 py-2.5 rounded-lg border text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${confirmPasswordError ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                }`}
                            />
                            <motion.button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              whileTap={{ scale: 0.9, rotate: showConfirmPassword ? -90 : 90 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                            >
                              <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} className="h-4 w-4" />
                            </motion.button>
                          </div>
                          {confirmPasswordError && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-1 text-xs text-red-600 flex items-center gap-1"
                            >
                              <Icon name="AlertCircle" className="h-3 w-3" />
                              <span>{confirmPasswordError}</span>
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between pt-1">
                      <label className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{t('remember_me')}</span>
                      </label>
                      {!isNew && (
                        <button
                          type="button"
                          onClick={() => setError(t('password_reset_flow_placeholder'))}
                          className="text-xs md:text-sm text-emerald-700 hover:underline font-medium"
                        >
                          {t('forgot')}
                        </button>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileTap={{ scale: 0.97 }}
                      className="relative w-full mt-2 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-green-700 text-white text-sm font-semibold py-2.5 shadow-md hover:from-emerald-700 hover:to-green-800 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {/* simple ripple/wave effect */}
                      <span className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-20 bg-[radial-gradient(circle_at_center,_white,_transparent_55%)] transition-opacity duration-300" />
                      {isLoading ? (
                        <>
                          <Icon name="Loader2" className="h-4 w-4 animate-spin" />
                          <span>{t('please_wait')}</span>
                        </>
                      ) : (
                        <>
                          <span>{isNew ? t('create_account') : t('sign_in')}</span>
                          <Icon name="ArrowRight" className="h-4 w-4" />
                        </>
                      )}
                    </motion.button>

                    <div className="mt-8 pt-6 border-t border-slate-200/50">
                      <div className="flex flex-wrap justify-center gap-4 opacity-70">
                        <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-default">
                          <Icon name="ShieldCheck" className="w-4 h-4 text-emerald-600" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('secure_login')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-default">
                          <Icon name="Lock" className="w-4 h-4 text-emerald-600" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('encrypted_data')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-default">
                          <Icon name="Users" className="w-4 h-4 text-emerald-600" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('trusted_platform')}</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 flex justify-center">
              <p className="text-slate-500 dark:text-gray-400 font-medium tracking-wide">
                Engineer to Farmer 🌾❤️
              </p>
            </div>

            {/* Network Impact Section - Fills the left side blank space below the form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 md:mt-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-white/50 dark:border-slate-800/80 shadow-md transform hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-800 dark:text-gray-200 uppercase tracking-widest flex items-center gap-2">
                  <Icon name="Activity" className="w-4 h-4 text-emerald-500" />
                  Network Impact
                </h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100/50 dark:border-emerald-800/30">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">1200+</span>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mt-0.5">Active Farmers</span>
                </div>
                <div className="flex flex-col bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100/50 dark:border-blue-800/30">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">5000+</span>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mt-0.5">Acres Managed</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
                <div className="flex -space-x-2 shrink-0">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-green-200 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-sm">
                      <Icon name="User" className="w-4 h-4 text-emerald-700" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                  <span className="font-bold text-slate-800 dark:text-slate-200">24+</span> new users joined today.<br />
                  Join our growing network!
                </p>
              </div>
            </motion.div>

            <AnimatePresence>
            </AnimatePresence>
          </motion.section >

          {/* Right Column: Welcome to the future of farming - Enhanced */}
          < motion.section
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.h2
              className="text-base md:text-lg font-semibold text-slate-800 dark:text-white mb-2"
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {t('future_farming_title')}
            </motion.h2>

            {/* Main Future Card */}
            <div className="flex-1 rounded-xl border border-emerald-100 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20 shadow-sm px-4 py-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              <p className="mb-2">{t('future_farming_p1')}</p>
              <p>{t('future_farming_p2')}</p>

              <div className="space-y-2">
                <motion.div
                  className="flex items-center gap-3 text-xs md:text-sm text-emerald-800 dark:text-emerald-300"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                >
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full shadow-sm"
                    style={{
                      background: 'conic-gradient(from 180deg, #0ea5e9, #22c55e, #0ea5e9)',
                    }}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900">
                      <Icon
                        name="CloudSun"
                        className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400"
                      />
                    </span>
                  </span>
                  <span>{t('future_farming_point1')}</span>
                </motion.div>

                <motion.div
                  className="flex items-center gap-3 text-xs md:text-sm text-emerald-800 dark:text-emerald-300"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full shadow-sm"
                    style={{
                      background: 'conic-gradient(from 0deg, #f97316, #22c55e, #f97316)',
                    }}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900">
                      <Icon
                        name="TrendingUp"
                        className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
                      />
                    </span>
                  </span>
                  <span>{t('future_farming_point2')}</span>
                </motion.div>
              </div>
            </div>

            {/* Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Shield" className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xs font-semibold text-slate-800 dark:text-white">{t('benefit_secure_title')}</h3>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  {t('benefit_secure_desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Zap" className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <h3 className="text-xs font-semibold text-slate-800 dark:text-white">{t('benefit_fast_title')}</h3>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  {t('benefit_fast_desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-100 dark:border-purple-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Bot" className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xs font-semibold text-slate-800 dark:text-white">
                    {t('benefit_ai_powered_title')}
                  </h3>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  {t('benefit_ai_powered_desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Smartphone" className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <h3 className="text-xs font-semibold text-slate-800 dark:text-white">
                    {t('benefit_mobile_ready_title')}
                  </h3>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  {t('benefit_mobile_ready_desc')}
                </p>
              </div>
            </motion.div>

            {/* Testimonial / Success Card */}
            <motion.div
              className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl p-4 text-white shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon name="Quote" className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-2 italic">
                    {t('testimonial_quote')}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          className="h-3 w-3 fill-yellow-300 text-yellow-300"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-cyan-100">- {t('testimonial_author')}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* MARKET TRENDS / LIVE UPDATES SECTION - Fills the right side blank space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t('live_market_trends')}
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                  {t('trending_now')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">{t('crop_wheat')}</span>
                    <Icon name="TrendingUp" className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-800 dark:text-white">₹2,450</span>
                    <span className="text-[10px] font-bold text-emerald-500">+2.4%</span>
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">{t('crop_rice')}</span>
                    <Icon name="TrendingUp" className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-800 dark:text-white">₹3,800</span>
                    <span className="text-[10px] font-bold text-emerald-500">+1.8%</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between p-2 bg-emerald-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-emerald-600/20 rounded-md">
                    <Icon name="Zap" className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-200">
                    {t('ai_insight_harvest_alert')}
                  </span>
                </div>
                <Icon name="ChevronRight" className="w-4 h-4 text-emerald-600" />
              </div>
            </motion.div>
          </motion.section >

        </main>


      </motion.div>
    </div>
  );
}
