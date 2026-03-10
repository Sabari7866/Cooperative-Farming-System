import { useState, useEffect } from 'react';
import { getSession, logoutAndRedirect } from '../utils/auth';
import FloatingChatbot from './FloatingChatbot';
import LanguageSelector from './LanguageSelector';
import { useI18n } from '../utils/i18n';
import {
  LayoutDashboard,
  Package,
  Calendar,
  Settings,
  Plus,
  Download,
  Search,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Wrench,
  Truck,
  FileText,
  Inbox,
  X,
  AlertTriangle,
  Phone
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

// Data Interfaces
interface Equipment {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  status: 'available' | 'rented' | 'maintenance';
  image: string;
  bookings: number;
}

interface Rental {
  id: string;
  equipmentId: string;
  equipmentName: string;
  renterName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'pending';
}

interface IncomingRequest {
  id: string;
  equipmentName: string;
  requesterName: string;
  requesterPhone: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  resourceId?: string;
}

const RenterDashboard = () => {
  const session = getSession();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'listings' | 'rentals' | 'requests' | 'settings'>('dashboard');
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    category: '',
    pricePerDay: '',
    image: '',
    description: ''
  });

  // Dummy Data
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([
    { id: '1', name: 'John Deere 5050D Tractor', category: 'Tractor', pricePerDay: 2500, status: 'available', image: '🚜', bookings: 12 },
    { id: '2', name: 'Rotavator 6ft', category: 'Equipment', pricePerDay: 800, status: 'rented', image: '⚙️', bookings: 28 },
    { id: '3', name: 'Harvester Combine', category: 'Harvester', pricePerDay: 12000, status: 'maintenance', image: '🌾', bookings: 5 },
    { id: '4', name: 'Water Tanker 5000L', category: 'Transport', pricePerDay: 1500, status: 'available', image: '💧', bookings: 18 },
  ]);

  const [rentals] = useState<Rental[]>([
    { id: 'ORD-001', equipmentId: '2', equipmentName: 'Rotavator 6ft', renterName: 'Ramesh Kumar', startDate: '2025-06-10', endDate: '2025-06-12', totalDays: 2, totalAmount: 1600, status: 'active', paymentStatus: 'paid' },
    { id: 'ORD-002', equipmentId: '1', equipmentName: 'John Deere 5050D Tractor', renterName: 'Suresh Singh', startDate: '2025-06-01', endDate: '2025-06-05', totalDays: 4, totalAmount: 10000, status: 'completed', paymentStatus: 'paid' },
    { id: 'ORD-003', equipmentId: '3', equipmentName: 'Harvester Combine', renterName: 'Anil Yadav', startDate: '2025-06-20', endDate: '2025-06-21', totalDays: 1, totalAmount: 12000, status: 'pending', paymentStatus: 'pending' },
    { id: 'ORD-004', equipmentId: '1', equipmentName: 'John Deere 5050D Tractor', renterName: 'Mahesh Babu', startDate: '2025-05-15', endDate: '2025-05-18', totalDays: 3, totalAmount: 7500, status: 'completed', paymentStatus: 'paid' },
  ]);

  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([
    { id: 'REQ-001', equipmentName: 'John Deere 5050D Tractor', requesterName: 'Rajesh Patel', requesterPhone: '+91 98765 43210', startDate: '2025-06-15', endDate: '2025-06-18', totalDays: 3, totalAmount: 7500, message: 'Need for land preparation work. Can I get delivery service?', status: 'pending' },
    { id: 'REQ-002', equipmentName: 'Water Tanker 5000L', requesterName: 'Sita Devi', requesterPhone: '+91 99887 76655', startDate: '2025-06-12', endDate: '2025-06-13', totalDays: 1, totalAmount: 1500, message: 'Urgent requirement for irrigation', status: 'pending' },
    { id: 'REQ-003', equipmentName: 'Rotavator 6ft', requesterName: 'Kumar Singh', requesterPhone: '+91 98123 45678', startDate: '2025-06-20', endDate: '2025-06-22', totalDays: 2, totalAmount: 1600, message: 'I will pick up from your location', status: 'accepted' },
  ]);

  // Analytics Data
  const revenueData = [
    { name: t('month_jan'), revenue: 12000 },
    { name: t('month_feb'), revenue: 18000 },
    { name: t('month_mar'), revenue: 15000 },
    { name: t('month_apr'), revenue: 24000 },
    { name: t('month_may'), revenue: 32000 },
    { name: t('month_jun'), revenue: 28000 },
  ];

  // Load incoming requests from localStorage and listen for updates
  useEffect(() => {
    const loadIncomingRequests = () => {
      const stored = localStorage.getItem('incomingRequests');
      if (stored) {
        try {
          const requests = JSON.parse(stored);
          setIncomingRequests(requests);
        } catch (error) {
          console.error('Error loading incoming requests:', error);
        }
      }
    };

    loadIncomingRequests();
    window.addEventListener('storage', loadIncomingRequests);
    return () => window.removeEventListener('storage', loadIncomingRequests);
  }, []);

  // Logic Functions
  const generateInvoice = (rental: Rental) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74); // Green
    doc.text(t('invoice_title'), 105, 20, { align: 'center' });

    // Bill Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${t('invoice_no')} ${rental.id}`, 20, 40);
    doc.text(`${t('invoice_date')} ${new Date().toLocaleDateString()}`, 150, 40);

    doc.text(`${t('invoice_from')} ${session?.name || t('brand_name')}`, 20, 55);
    doc.text(`${t('invoice_to')} ${rental.renterName}`, 150, 55);

    // Table
    autoTable(doc, {
      startY: 70,
      head: [[t('table_item'), t('table_duration'), t('table_rate_day'), t('table_total')]],
      body: [
        [
          rental.equipmentName,
          `${rental.totalDays} Days`,
          `INR ${(rental.totalAmount / rental.totalDays).toFixed(2)}`,
          `INR ${rental.totalAmount.toFixed(2)}`
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] },
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t('invoice_grand_total')} INR ${rental.totalAmount.toFixed(2)}`, 140, finalY);

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(t('invoice_thank_you'), 105, finalY + 30, { align: 'center' });

    doc.save(`invoice_${rental.id}.pdf`);
    toast.success(t('msg_invoice_downloaded'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'rented': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleRequestStatus = (requestId: string, status: 'accepted' | 'rejected') => {
    if (status === 'accepted') {
      const targetRequest = incomingRequests.find(r => r.id === requestId);
      if (targetRequest) {
        const hasOverlap = incomingRequests.some(req =>
          req.id !== requestId &&
          req.resourceId === targetRequest.resourceId &&
          req.status === 'accepted' &&
          (new Date(targetRequest.startDate) <= new Date(req.endDate) && new Date(targetRequest.endDate) >= new Date(req.startDate))
        );

        if (hasOverlap) {
          toast.error('This equipment is already booked for overlapping dates!');
          return;
        }
      }
    }

    setIncomingRequests(prevRequests => {
      const updated = prevRequests.map(request =>
        request.id === requestId ? { ...request, status } : request
      );
      // Save to localStorage to sync with farmer dashboard
      localStorage.setItem('incomingRequests', JSON.stringify(updated));
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
      return updated;
    });
    toast.success(`Request ${status} successfully!`);
  };

  const handleAddEquipment = async () => {
    if (!equipmentForm.name || !equipmentForm.category || !equipmentForm.pricePerDay) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Create new equipment object
      const newEquipment: Equipment = {
        id: `eq-${Date.now()}`,
        name: equipmentForm.name,
        category: equipmentForm.category,
        pricePerDay: parseInt(equipmentForm.pricePerDay),
        status: 'available',
        image: equipmentForm.image || '📦',
        bookings: 0
      };

      // Add to local state immediately
      setEquipmentList(prevList => {
        const updated = [...prevList, newEquipment];
        // Save to localStorage to share with other dashboards
        localStorage.setItem('sharedEquipment', JSON.stringify(updated));
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'));
        return updated;
      });

      // TODO: Replace with actual API call to save to backend
      // const response = await api.post('/equipment', newEquipment);

      toast.success('Equipment added successfully!');
      setShowAddEquipmentModal(false);
      setEquipmentForm({
        name: '',
        category: '',
        pricePerDay: '',
        image: '',
        description: ''
      });
    } catch (error) {
      toast.error('Failed to add equipment');
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            <Wrench className="w-8 h-8" /> AgriRent
          </h1>
          <p className="text-xs text-gray-500 mt-1">Partner Console</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: t('renter_nav_dashboard'), icon: LayoutDashboard },
            { id: 'listings', label: t('renter_nav_listings'), icon: Truck },
            { id: 'rentals', label: t('renter_nav_rentals'), icon: FileText },
            { id: 'requests', label: t('tab_incoming_requests'), icon: Inbox },
            { id: 'settings', label: t('renter_nav_settings'), icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                ? 'bg-green-50 text-green-700 font-bold shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logoutAndRedirect}
            className="w-full flex items-center gap-2 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white px-8 py-5 border-b border-gray-200 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {activeTab === 'dashboard' ? t('renter_nav_dashboard') :
              activeTab === 'listings' ? t('renter_nav_listings') :
                activeTab === 'rentals' ? t('renter_nav_rentals') :
                  t('renter_nav_settings')}
          </h2>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="hidden md:block text-right">
              <p className="font-bold text-gray-800">{session?.name || 'Renter Name'}</p>
              <p className="text-xs text-green-600">{t('verified_partner')}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
              {session?.name?.[0] || 'R'}
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: t('label_total_revenue'), value: '₹45,200', icon: DollarSign, color: 'bg-green-500' },
                  { label: t('label_active_rentals'), value: rentals.filter(r => r.status === 'active').length, icon: Clock, color: 'bg-blue-500' },
                  { label: t('label_total_equipment'), value: equipmentList.length, icon: Package, color: 'bg-purple-500' },
                  { label: t('label_pending_requests'), value: rentals.filter(r => r.status === 'pending').length, icon: Calendar, color: 'bg-orange-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                      <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                        <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('label_last_30_days')}</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Chart Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" /> {t('chart_revenue')}
                  </h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                        <RechartsTooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">{t('title_recent_activity')}</h3>
                  <div className="space-y-4">
                    {rentals.slice(0, 4).map((rental) => (
                      <div key={rental.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(rental.status)} bg-opacity-20`}>
                          {rental.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{rental.renterName}</p>
                          <p className="text-xs text-gray-500">{t('rented_verb')} {rental.equipmentName}</p>
                          <p className="text-xs font-medium text-green-600 mt-1">₹{rental.totalAmount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LISTINGS VIEW */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder={t('placeholder_search_equipment')} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
                <button
                  onClick={() => setShowAddEquipmentModal(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5" /> {t('btn_add_equipment')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipmentList.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl relative">
                      {item.image}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(item.status)}`}>
                        {t('status_' + item.status)}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-green-600 transition-colors">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{item.category} • {item.bookings} {t('label_bookings')}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="text-2xl font-black text-gray-900">₹{item.pricePerDay}<span className="text-sm font-normal text-gray-400">/{t('label_day')}</span></div>
                        <button className="text-gray-400 hover:text-green-600">
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RENTALS & BILLING VIEW */}
          {activeTab === 'rentals' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">{t('title_recent_rentals')}</h3>
                  <button className="text-green-600 text-sm font-bold hover:underline">{t('btn_view_all_history')}</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
                        <th className="pb-4">{t('col_order_id')}</th>
                        <th className="pb-4">{t('col_equipment')}</th>
                        <th className="pb-4">{t('col_renter')}</th>
                        <th className="pb-4">{t('col_duration')}</th>
                        <th className="pb-4">{t('col_status')}</th>
                        <th className="pb-4">{t('col_amount')}</th>
                        <th className="pb-4">{t('col_actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {rentals.map((rental) => (
                        <tr key={rental.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-4 font-mono text-gray-500">{rental.id}</td>
                          <td className="py-4 font-bold text-gray-800">{rental.equipmentName}</td>
                          <td className="py-4 text-gray-600">{rental.renterName}</td>
                          <td className="py-4">
                            <span className="block text-gray-800 font-medium">{rental.totalDays} {t('label_days')}</span>
                            <span className="text-xs text-gray-400">{rental.startDate}</span>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${getStatusColor(rental.status)}`}>
                              {t('status_' + rental.status)}
                            </span>
                          </td>
                          <td className="py-4 font-bold text-green-700">₹{rental.totalAmount}</td>
                          <td className="py-4">
                            <button
                              onClick={() => generateInvoice(rental)}
                              className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <Download className="w-3 h-3" /> {t('btn_invoice')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{t('title_payment_settings')}</h3>
              <div className="space-y-6">
                <div className="p-4 border border-green-100 bg-green-50 rounded-xl flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-green-800">{t('msg_auto_payments')}</h4>
                    <p className="text-sm text-green-700 mt-1">{t('msg_payouts_scheduled')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('label_bank_account')}</label>
                  <input type="text" value="HDFC Bank •••• 8892" disabled className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-gray-500 font-mono" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('label_upi_id')}</label>
                  <input type="text" defaultValue="renter@okhdfcbank" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-500" />
                </div>

                <button className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors">
                  {t('btn_save_changes')}
                </button>
              </div>
            </div>
          )}

          {/* INCOMING REQUESTS VIEW */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">{t('tab_incoming_requests')}</h3>
                <div className="text-sm text-gray-600">
                  {incomingRequests.filter(r => r.status === 'pending').length} {t('label_pending_requests')}
                </div>
              </div>

              <div className="space-y-4">
                {incomingRequests.map((request) => (
                  <div key={`${request.id}-${request.status}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{request.equipmentName}</h4>
                        <p className="text-gray-600">{t('label_requester')}: {request.requesterName}</p>
                        <p className="text-sm text-gray-500">
                          {request.startDate} to {request.endDate} • {request.totalDays} days
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : request.status === 'accepted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Total Payment:</span>
                        <span className="font-bold text-green-700 ml-2">₹{request.totalAmount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <span className="font-medium text-gray-800 ml-2">{request.requesterPhone}</span>
                      </div>
                    </div>

                    {request.message && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <span className="text-gray-600 text-sm">Message: </span>
                        <span className="text-gray-800">{request.message}</span>
                      </div>
                    )}

                    {request.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRequestStatus(request.id, 'accepted')}
                          className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <CheckCircle className="w-5 h-5" /> {t('confirm')}
                        </button>
                        <button
                          onClick={() => handleRequestStatus(request.id, 'rejected')}
                          className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <AlertTriangle className="w-5 h-5" /> {t('delete')}
                        </button>
                        <button
                          onClick={() => {
                            const newPrice = prompt(`Current price: ₹${request.totalAmount}. Enter your counter offer:`);
                            if (newPrice) {
                              toast.success(`Counter offer of ₹${newPrice} sent to ${request.requesterName}`);
                            }
                          }}
                          className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <DollarSign className="w-5 h-5" /> Bargain
                        </button>
                      </div>
                    ) : (
                      <div className="flex">
                        <a
                          href={`tel:${request.requesterPhone}`}
                          className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <Phone className="w-5 h-5" /> Call Requester
                        </a>
                      </div>
                    )}
                  </div>
                ))}

                {incomingRequests.length === 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No incoming requests</h3>
                    <p className="text-gray-600">When farmers request your equipment, they'll appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{t('title_payment_settings')}</h3>
              <div className="space-y-6">
                <div className="p-4 border border-green-100 bg-green-50 rounded-xl flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-green-800">{t('msg_auto_payments')}</h4>
                    <p className="text-sm text-green-700 mt-1">{t('msg_payouts_scheduled')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('label_bank_account')}</label>
                  <input type="text" value="HDFC Bank •••• 8892" disabled className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-gray-500 font-mono" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('label_upi_id')}</label>
                  <input type="text" defaultValue="renter@okhdfcbank" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-500" />
                </div>

                <button className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors">
                  {t('btn_save_changes')}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Equipment Modal */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Add New Equipment</h3>
                <button
                  onClick={() => setShowAddEquipmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Equipment Name *</label>
                <input
                  type="text"
                  value={equipmentForm.name}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                  placeholder="e.g., John Deere Tractor"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                <select
                  value={equipmentForm.category}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">Select category</option>
                  <option value="Tractor">Tractor</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Harvester">Harvester</option>
                  <option value="Transport">Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price per Day (₹) *</label>
                <input
                  type="number"
                  value={equipmentForm.pricePerDay}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, pricePerDay: e.target.value })}
                  placeholder="e.g., 2500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Image/Icon</label>
                <input
                  type="text"
                  value={equipmentForm.image}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, image: e.target.value })}
                  placeholder="e.g., 🚜"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={equipmentForm.description}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                  placeholder="Describe the equipment condition, features, etc."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={handleAddEquipment}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-bold"
              >
                Add Equipment
              </button>
              <button
                onClick={() => setShowAddEquipmentModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <FloatingChatbot />
    </div>
  );
};

export default RenterDashboard;
