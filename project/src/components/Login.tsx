import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveSession, UserRole, registerUser, loginUser } from '../utils/auth';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';
import AIHelper from './AIHelper';
import { useI18n } from '../utils/i18n';

const Login: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const [role, setRole] = useState<UserRole>('farmer');
  const [showBgImage, setShowBgImage] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Worker-specific fields
  const [additionalPhone, setAdditionalPhone] = useState('');
  const [location, setLocation] = useState('');
  const [travelDistance, setTravelDistance] = useState('');
  const [workTypes, setWorkTypes] = useState<string[]>([]);

  // Buyer-specific fields
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Renter-specific fields
  const [equipment, setEquipment] = useState<Array<{ name: string; hourlyRate: string }>>([
    { name: '', hourlyRate: '' },
  ]);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const roles: Array<{ id: UserRole; label: string }> = [
    { id: 'farmer', label: t('role_farmer') },
    { id: 'worker', label: t('role_worker') },
    { id: 'buyer', label: t('role_buyer') },
    { id: 'renter', label: t('role_renter') },
  ];

  const validate = () => {
    if (!email && !phone) {
      setError(t('error_enter_email_or_phone'));
      return false;
    }
    if (!password && !isNew) {
      setError(t('error_enter_password'));
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setError(null);

    if (isNew) {
      try {
        // Build registration data with role-specific fields
        const registrationData: any = {
          role,
          name,
          email: email || undefined,
          phone: phone || undefined,
          password,
          altPhone: additionalPhone || undefined,
        };

        // Add Worker-specific fields
        if (role === 'worker') {
          registrationData.workerLocation = location || undefined;
          registrationData.workerTravelDistance = travelDistance
            ? parseFloat(travelDistance)
            : undefined;
          registrationData.workerSkills = workTypes.length > 0 ? workTypes : undefined;
        }

        // Add Buyer-specific fields
        if (role === 'buyer') {
          registrationData.buyerCity = city || undefined;
          registrationData.buyerAddress = address || undefined;
        }

        // Add Renter-specific fields
        if (role === 'renter') {
          const validEquipment = equipment.filter((e) => e.name && e.hourlyRate);
          registrationData.equipmentList = validEquipment.length > 0 ? validEquipment : undefined;
        }

        // Register the user - this also saves the session
        const session = registerUser(registrationData);

        // If remember is true, session is already saved by registerUser
        // Just navigate to the correct dashboard based on the role
        switch (session.role) {
          case 'farmer':
            navigate('/farm-owner');
            break;
          case 'worker':
            navigate('/farm-worker');
            break;
          case 'buyer':
            navigate('/buyer');
            break;
          case 'renter':
            navigate('/renter');
            break;
          default:
            navigate('/');
        }
        return;
      } catch (e: any) {
        const msg = e?.message || t('registration_failed');
        // If user already exists, try to sign them in automatically
        if (msg.toLowerCase().includes('already')) {
          const maybeSession = loginUser(email || phone, password);
          if (maybeSession) {
            if (remember) saveSession(maybeSession);
            // Navigate based on the LOGGED IN user's role (not selected role)
            switch (maybeSession.role) {
              case 'farmer':
                navigate('/farm-owner');
                break;
              case 'worker':
                navigate('/farm-worker');
                break;
              case 'buyer':
                navigate('/buyer');
                break;
              case 'renter':
                navigate('/renter');
                break;
              default:
                navigate('/');
            }
            return;
          }
          // otherwise guide user to sign in
          setIsNew(false);
          setError(t('user_already_exists'));
          return;
        }
        setError(msg);
        return;
      }
    } else {
      // Existing user login
      const session = loginUser(email || phone, password);
      if (!session) {
        setError(t('invalid_credentials'));
        return;
      }
      if (remember) saveSession(session);

      // Navigate based on the logged-in user's actual role
      switch (session.role) {
        case 'farmer':
          navigate('/farm-owner');
          break;
        case 'worker':
          navigate('/farm-worker');
          break;
        case 'buyer':
          navigate('/buyer');
          break;
        case 'renter':
          navigate('/renter');
          break;
        default:
          navigate('/');
      }
      return;
    }
  };

  const suggestRole = () => {
    // naive heuristic suggestions
    const text = `${name} ${email} ${phone}`.toLowerCase();
    if (text.includes('buyer') || text.includes('market')) setRole('buyer');
    else if (text.includes('worker') || text.includes('labour') || text.includes('labourer'))
      setRole('worker');
    else if (text.includes('renter') || text.includes('rent')) setRole('renter');
    else setRole('farmer');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center login-hero-bg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-tr from-green-200 to-amber-200 opacity-40 rounded-full blur-3xl transform rotate-45"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-200 to-green-200 opacity-30 rounded-full blur-3xl transform rotate-12"></div>
      </div>

      <header className="w-full bg-green-600 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={`/assets/logo-${locale}.svg`} alt={t('brand_name')} className="w-10 h-10" />
            <span className="font-bold text-lg">{t('brand_name')}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-white/90">
            <a className="hover:underline" href="#">
              {t('nav_home')}
            </a>
            <a className="hover:underline" href="#">
              {t('nav_ai')}
            </a>
            <a className="hover:underline" href="#">
              {t('nav_dashboard')}
            </a>
            <a className="hover:underline" href="#">
              {t('contact')}
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <select
              aria-label={t('choose_language')}
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className="bg-green-700/30 rounded px-2 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
            </select>
            <a className="hidden sm:inline-block text-sm" href="tel:+1850344066">
              +1 (850) 344 0 66
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left - Illustration / Branding */}
          <div className="hidden lg:block space-y-6 pr-8">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-1 flex items-center justify-center">
                  <img
                    src={`/assets/logo-${locale}.svg`}
                    alt={t('brand_name')}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-5xl leading-tight font-extrabold text-green-800">
                    {t('welcome_to_uzhavan_x')}
                  </h2>
                  <p className="text-gray-600 mt-2 max-w-md">{t('connect_manage_grow')}</p>
                </div>
              </div>
              <div className="ml-4">
                <ThemeToggle />
              </div>
            </div>

            <div className="mt-6 bg-white/60 backdrop-blur rounded-xl p-6 shadow-lg w-full">
              <h3 className="text-lg font-bold text-gray-800">Why உழவன் X?</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-semibold">•</span> AI crop advice tailored to
                  your farm
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-semibold">•</span> Share resources with
                  neighbors
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-semibold">•</span> Find verified workers fast
                </li>
              </ul>
            </div>

            <div className="mt-4 w-full">
              <img
                src="/assets/farm-illustration.svg"
                alt="Farm illustration"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Right - Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none relative">
            <style>{`@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}.rgb-border{background:linear-gradient(270deg,#34d399,#06b6d4,#f97316,#a78bfa);background-size:800% 800%;animation:gradientShift 8s ease infinite}`}</style>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {showBgImage ? (
                <img
                  src="/assets/soft-farm-bg.jpg"
                  alt="farm bg"
                  className="w-full h-full object-cover opacity-30 rounded-3xl"
                  onError={() => setShowBgImage(false)}
                />
              ) : (
                <svg
                  className="w-full h-full rounded-3xl opacity-40"
                  viewBox="0 0 1200 600"
                  preserveAspectRatio="xMidYMid slice"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="skyGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#FFFBEB" />
                      <stop offset="100%" stopColor="#ECFDF5" />
                    </linearGradient>
                    <linearGradient id="hillGrad" x1="0" x2="1">
                      <stop offset="0%" stopColor="#BBF7D0" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                  </defs>
                  <rect width="1200" height="600" fill="url(#skyGrad)" />
                  <g className="clouds" fill="#ffffff" opacity="0.85">
                    <g className="cloud cloud1">
                      <ellipse cx="180" cy="110" rx="60" ry="28" />
                      <ellipse cx="220" cy="100" rx="38" ry="22" />
                      <ellipse cx="140" cy="100" rx="36" ry="20" />
                    </g>
                    <g className="cloud cloud2">
                      <ellipse cx="700" cy="80" rx="70" ry="32" />
                      <ellipse cx="760" cy="70" rx="46" ry="26" />
                      <ellipse cx="660" cy="72" rx="42" ry="24" />
                    </g>
                    <g className="cloud cloud3">
                      <ellipse cx="1020" cy="130" rx="52" ry="24" />
                      <ellipse cx="1060" cy="118" rx="34" ry="18" />
                      <ellipse cx="990" cy="118" rx="30" ry="16" />
                    </g>
                  </g>
                  <g className="hills" transform="translate(0,260)">
                    <path
                      d="M0 180 C200 90 400 120 600 160 C800 200 1000 120 1200 180 L1200 400 L0 400 Z"
                      fill="url(#hillGrad)"
                    />
                    <path
                      d="M0 220 C200 140 400 170 600 200 C800 230 1000 160 1200 220 L1200 400 L0 400 Z"
                      fill="#10B981"
                      opacity="0.9"
                    />
                  </g>
                </svg>
              )}
            </div>
            <div className="absolute -inset-1 rounded-2xl blur-xl opacity-80 rgb-border pointer-events-none"></div>
            <style>{`
              .clouds .cloud1 { animation: cloudMove 28s linear infinite; }
              .clouds .cloud2 { animation: cloudMove 36s linear infinite; }
              .clouds .cloud3 { animation: cloudMove 22s linear infinite; }
              @keyframes cloudMove { 0% { transform: translateX(-30px); } 50% { transform: translateX(20px); } 100% { transform: translateX(-30px); } }
              @keyframes hillFloat { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
              .hills { animation: hillFloat 6s ease-in-out infinite; transform-origin: center; }
            `}</style>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 md:col-span-1 card-gradient-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {isNew ? t('create_account') : t('welcome_back')}
                  </h1>
                  <p className="text-sm text-gray-500">{t('sign_in_to_access_dashboard')}</p>
                </div>
                <div className="md:hidden">
                  <ThemeToggle />
                </div>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="select-none">{t('new_user_create_account')}</span>
                </label>
                <div className="ml-auto text-sm text-gray-400">{t('choose_role')}</div>
              </div>

              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`px-3 py-2 rounded-lg border transition-shadow text-sm font-medium ${role === r.id
                        ? 'bg-green-600 text-white shadow-md border-transparent'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:shadow-sm'
                        }`}
                      aria-label={t(`role_${r.id}`)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {isNew && (
                  <>
                    <div>
                      <label className="sr-only">Full name</label>
                      <input
                        aria-label="Full name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('full_name')}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                      />
                    </div>

                    {/* WORKER-SPECIFIC FIELDS */}
                    {role === 'worker' && (
                      <>
                        <div>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Native Location / City"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            value={additionalPhone}
                            onChange={(e) => setAdditionalPhone(e.target.value)}
                            placeholder="Additional Phone Number"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={travelDistance}
                            onChange={(e) => setTravelDistance(e.target.value)}
                            placeholder="How many kilometers can you travel for work?"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            What kind of work can you do?
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'Planting',
                              'Harvesting',
                              'Irrigation',
                              'Pesticide Application',
                              'Land Preparation',
                              'General Labor',
                            ].map((work) => (
                              <label
                                key={work}
                                className="inline-flex items-center space-x-2 text-sm"
                              >
                                <input
                                  type="checkbox"
                                  checked={workTypes.includes(work)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setWorkTypes([...workTypes, work]);
                                    } else {
                                      setWorkTypes(workTypes.filter((w) => w !== work));
                                    }
                                  }}
                                  className="h-4 w-4 text-green-600 rounded"
                                />
                                <span>{work}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* BUYER-SPECIFIC FIELDS */}
                    {role === 'buyer' && (
                      <>
                        <div>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                          />
                        </div>
                        <div>
                          <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Full Address"
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            value={additionalPhone}
                            onChange={(e) => setAdditionalPhone(e.target.value)}
                            placeholder="Additional Phone Number"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                          />
                        </div>
                      </>
                    )}

                    {/* RENTER-SPECIFIC  FIELDS */}
                    {role === 'renter' && (
                      <>
                        <div>
                          <input
                            type="tel"
                            value={additionalPhone}
                            onChange={(e) => setAdditionalPhone(e.target.value)}
                            placeholder="Additional Phone Number"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Equipment Available for Rent
                          </label>
                          {equipment.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const newEquipment = [...equipment];
                                  newEquipment[index].name = e.target.value;
                                  setEquipment(newEquipment);
                                }}
                                placeholder="Equipment Name (e.g., Tractor)"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                              />
                              <input
                                type="number"
                                value={item.hourlyRate}
                                onChange={(e) => {
                                  const newEquipment = [...equipment];
                                  newEquipment[index].hourlyRate = e.target.value;
                                  setEquipment(newEquipment);
                                }}
                                placeholder="₹/hour"
                                min="0"
                                className="w-24 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                              />
                              {equipment.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEquipment(equipment.filter((_, i) => i !== index))
                                  }
                                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              setEquipment([...equipment, { name: '', hourlyRate: '' }])
                            }
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            + Add More Equipment
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="relative">
                  <label className="sr-only">Email or phone</label>
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Icon name="Mail" className="h-5 w-5" />
                  </div>
                  <input
                    aria-label="Email or phone"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setPhone(e.target.value);
                    }}
                    placeholder={t('placeholder_email_phone')}
                    className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div className="relative">
                  <label className="sr-only">Password</label>
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Icon name="Lock" className="h-5 w-5" />
                  </div>
                  <input
                    aria-label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isNew ? t('create_a_strong_password') : t('enter_your_password')}
                    className="w-full pl-12 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-2 p-1 text-gray-500 rounded"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <Icon name="EyeOff" className="h-5 w-5" />
                    ) : (
                      <Icon name="Eye" className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span>{t('remember_me')}</span>
                  </label>
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => alert(t('password_reset_flow_placeholder'))}
                  >
                    {t('forgot')}
                  </button>
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="mt-6">
                  <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-3 rounded-lg font-semibold shadow-xl transition-transform transform hover:-translate-y-0.5"
                  >
                    {isNew ? t('create_account') : t('sign_in')}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">{t('hero_trusted')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* AI helper button (floats over the form) */}
      <AIHelper onSuggestRole={suggestRole} />
    </div>
  );
};

export default Login;
