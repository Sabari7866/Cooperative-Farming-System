import { useState } from 'react';
import {
  Mail,
  Send,
  ArrowLeft,
  MessageCircle,
  Phone,
  MapPin,
  CheckCircle,
  Copy,
  LayoutDashboard,
  Crown,
  Zap,
  MapPin as MapPinIcon,
  Users,
  Settings,
  HelpCircle,
  ShieldCheck,
  Globe,
  Fingerprint,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Icon = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, any> = {
    Home: LayoutDashboard,
    Crown: Crown,
    Zap: Zap,
    MapPin: MapPinIcon,
    Users: Users,
    Settings: Settings,
    HelpCircle: HelpCircle,
    Mail: Mail,
    Send: Send,
    Phone: Phone,
    Globe: Globe,
    ShieldCheck: ShieldCheck
  };

  const LucideIcon = icons[name] || MessageCircle;
  return <LucideIcon className={className || "h-6 w-6"} />;
};

export default function SupportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const emailBody = `
New Support Request from Agri Elite Platform
============================================

From: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
Sent via Agri Elite Neural Relay
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            `.trim();

      const supportEmails = JSON.parse(localStorage.getItem('supportEmails') || '[]');
      const newEmail = {
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
      supportEmails.push(newEmail);
      localStorage.setItem('supportEmails', JSON.stringify(supportEmails));

      const mailtoLink = `mailto:23ad044@drngpit.ac.in?subject=${encodeURIComponent(`Support Request: ${formData.subject}`)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      toast.success('Neural Relay Initialized. Opening Client.', {
        icon: '🚀',
        style: {
          borderRadius: '1rem',
          background: '#0f172a',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold'
        }
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Neural Handshake Failed. Check client installation.');
    } finally {
      setSending(false);
    }
  };

  const handleCopyDetails = () => {
    const details = `
To: 23ad044@drngpit.ac.in
From: ${formData.name} (${formData.email})
Subject: ${formData.subject}

Message:
${formData.message}
        `.trim();

    navigator.clipboard.writeText(details).then(() => {
      toast.success('Intelligence Copied to Cipherbank');
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <AnimatePresence>
        {/* Agri Elite Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col w-80 bg-white/70 backdrop-blur-3xl shadow-premium border-r border-emerald-50 relative overflow-hidden h-screen elite-border-glow shrink-0"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 via-green-400 to-amber-400"></div>

          <div className="p-8 border-b border-emerald-50/50 relative z-10">
            <div className="flex flex-col gap-4">
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => navigate('/login')}
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center border border-emerald-50 group hover:rotate-6 transition-transform">
                  <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tighter leading-none">
                    <span className="text-slate-900">Agri</span>
                    <span className="text-emerald-600">Smart</span>
                  </h1>
                  <p className="text-[10px] text-emerald-600/60 font-black tracking-[0.1em] uppercase mt-2 italic">Cultivating Innovation, Feeding the Future</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="p-6 flex-grow overflow-y-auto space-y-6 custom-scrollbar">
            <ul className="space-y-3">
              {[
                { id: 'dashboard', icon: 'Home', label: 'Main Portal' },
                { id: 'support', icon: 'HelpCircle', label: 'AGRI SUPPORT', active: true },
                { id: 'global', icon: 'Globe', label: 'GLOBAL NETWORK' },
                { id: 'privacy', icon: 'ShieldCheck', label: 'SECURITY HUB' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigate('/login')}
                    className={`w-full flex items-center space-x-4 px-6 py-5 rounded-[2rem] transition-all duration-300 group relative ${item.active
                      ? 'bg-emerald-600 text-white shadow-premium'
                      : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-900'
                      }`}
                  >
                    <Icon name={item.icon} className={`h-6 w-6 transition-transform duration-300 ${item.active ? 'scale-110 rotate-3' : 'group-hover:scale-110'}`} />
                    <span className={`font-black tracking-tight text-sm uppercase ${item.active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{item.label}</span>
                    {item.active && (
                      <div className="absolute left-0 w-1.5 h-8 bg-white/50 rounded-full ml-1" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-6 bg-emerald-50/30 border-t border-emerald-50/50">
            <div className="flex items-center space-x-4 p-4 rounded-3xl bg-white/60 backdrop-blur-md border border-white shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg">CS</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-slate-900 truncate uppercase">Support Relay</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  <p className="text-[9px] text-emerald-800 font-black truncate uppercase">Neural Online</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 overflow-y-auto custom-scrollbar relative px-10 py-12"
      >
        <div className="max-w-6xl mx-auto">
          {/* Elite Support Header */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={() => navigate('/login')}
              className="group flex items-center space-x-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-emerald-50 hover:bg-emerald-600 hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest leading-none">Return to Portal</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Relay Active</span>
            </div>
          </div>

          <div className="flex items-end gap-8 mb-16">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-supreme">
              <Icon name="HelpCircle" className="w-12 h-12 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">AgriSmart Support Hub</h1>
              <p className="text-emerald-600/60 font-black tracking-[0.2em] uppercase text-xs italic">"Agriculture is the most healthful, most useful and most noble employment of man."</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Communication Relay Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[3.5rem] shadow-premium p-12 border border-slate-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Mail className="w-64 h-64" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                      <Send className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Intelligence Transmission</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Origin Identity</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your Name (Agri Partner)"
                          className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-slate-900 shadow-inner"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Relay Channel</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@precision.ag"
                          className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-slate-900 shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Subject Vector</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Security Issue / Precision Advice / System Error"
                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-slate-900 shadow-inner"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Intelligence Payload</label>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Detailed transmission data..."
                        rows={6}
                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2.5rem] outline-none transition-all font-bold text-slate-900 shadow-inner resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={sending}
                        className="flex-1 py-6 bg-slate-900 text-white font-black uppercase tracking-widest rounded-[2.5rem] shadow-premium hover:bg-black transition-all hover:scale-[1.02] flex items-center justify-center gap-4 group/btn"
                      >
                        {sending ? (
                          <div className="w-6 h-6 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5 text-emerald-400 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            Initialize Relay
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyDetails}
                        className="p-6 bg-white border-2 border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 rounded-[2rem] transition-all"
                      >
                        <Copy className="w-6 h-6" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Support Intelligence HUD */}
            <div className="space-y-8">
              {/* Global Diagnostics Card */}
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-premium">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Icon name="Globe" className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    Global Command
                  </h3>

                  <div className="space-y-8">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <Mail className="w-6 h-6 text-emerald-400 mt-1" />
                      <div>
                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Secure Inbox</p>
                        <p className="text-sm font-black break-all">23ad044@drngpit.ac.in</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <Phone className="w-6 h-6 text-emerald-400 mt-1" />
                      <div>
                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Direct Priority</p>
                        <p className="text-sm font-black">+91 1800 123 4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <MapPin className="w-6 h-6 text-emerald-400 mt-1" />
                      <div>
                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Headquarters</p>
                        <p className="text-sm font-black">DR NGP Institute of Technology</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Protocol Card */}
              <div className="bg-white rounded-[3rem] shadow-premium p-10 border border-slate-50">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Support Metrics</h3>
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'Relay Success', val: '99.9%', color: 'emerald' },
                    { label: 'Average Handshake', val: '4.2m', color: 'blue' },
                    { label: 'Neural Capacity', val: 'High', color: 'amber' }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                      <span className={`text-sm font-black text-${stat.color}-600 uppercase`}>{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Knowledge Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-green-500 rounded-[3rem] shadow-premium p-10 text-white">
                <h3 className="text-xl font-black uppercase tracking-widest mb-6">Automated Insight</h3>
                <p className="text-sm font-medium opacity-90 italic leading-relaxed mb-8">
                  "Did you know our AI Crop Advisor can resolve 85% of precision issues instantly via the dashboard neural hub?"
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-white/20 backdrop-blur-md rounded-[1.5rem] border border-white/30 text-xs font-black uppercase tracking-widest hover:bg-white/30 transition-all"
                >
                  Launch Advisor
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
