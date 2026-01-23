import { useState, useCallback } from 'react';
import {
  Search,
  Send,
  Bell,
  AlertTriangle,
  TrendingUp,
  Package,
  CheckCircle,
  DollarSign,
  Phone,
  Plus,
} from 'lucide-react';
import Icon from './Icon';
import { useI18n } from '../utils/i18n';
import { downloadCSV } from '../utils/export';
import { useToast, ToastContainer } from './Toast';
import ThemeToggle from './ThemeToggle';
import LoadingSpinner from './LoadingSpinner';

const ResourceSharing = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    maxDistance: '',
    maxPrice: '',
    availability: 'available',
    condition: '',
  });

  // Demo data with rich initial values
  const [resources] = useState<any[]>([
    {
      id: '1',
      title: 'John Deere 5310 Tractor',
      category: 'equipment',
      description: '55 HP tractor in excellent condition. Comes with rotavator attachment. Perfect for heavy duty plowing.',
      images: ['https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
      ownerName: 'Rajesh Kumar',
      ownerId: 'owner1',
      ownerPhone: '+91 98765 00001',
      ownerLocation: 'Coimbatore, TN',
      distance: '5 km',
      pricePerDay: 2500,
      pricePerHour: 400,
      rating: 4.8,
      condition: 'excellent',
      deliveryAvailable: true,
      deliveryCharge: 500,
      verified: true,
      availability: 'available',
    },
    {
      id: '2',
      title: 'Combine Harvester Kubota DC-68G',
      category: 'equipment',
      description: 'Efficient paddy harvester. Rate includes operator charges. ideal for wet fields.',
      images: ['https://images.unsplash.com/photo-1530267981375-f0de937f5f13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
      ownerName: 'Siva Agro Services',
      ownerId: 'owner2',
      ownerPhone: '+91 98765 00002',
      ownerLocation: 'Erode, TN',
      distance: '15 km',
      pricePerDay: 12000,
      pricePerHour: 1500,
      rating: 4.5,
      condition: 'good',
      deliveryAvailable: true,
      deliveryCharge: 1500,
      verified: true,
      availability: 'rented',
    },
    {
      id: '3',
      title: 'Certified IR-64 Rice Seeds',
      category: 'seeds',
      description: 'High germination rate tested seeds. Treated with fungicide. 50kg bags available.',
      images: ['https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
      ownerName: 'Green Leaf Nursery',
      ownerId: 'owner3',
      ownerPhone: '+91 98765 00003',
      ownerLocation: 'Madurai, TN',
      distance: '45 km',
      pricePerDay: 4500, // Interpreted as Unit Price for sale items in rental context or flat rate
      rating: 4.9,
      condition: 'excellent',
      deliveryAvailable: true,
      deliveryCharge: 200,
      verified: true,
      availability: 'available',
    },
    {
      id: '4',
      title: 'Cold Storage Space - 5 Tons',
      category: 'storage',
      description: 'Temperature controlled warehouse suitable for vegetables and fruits. 24/7 power backup.',
      images: ['https://images.unsplash.com/photo-1587570889270-5b58df8bdde0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
      ownerName: 'Kaveri Warehousing',
      ownerId: 'owner4',
      ownerPhone: '+91 98765 00004',
      ownerLocation: 'Salem, TN',
      distance: '25 km',
      pricePerDay: 800,
      rating: 4.2,
      condition: 'good',
      deliveryAvailable: false,
      verified: true,
      availability: 'available',
    },
    {
      id: '5',
      title: 'Mini Truck - Tata Ace',
      category: 'transport',
      description: 'Available for local produce transport to market. 1 ton capacity.',
      images: ['https://images.unsplash.com/photo-1605218427306-022e2c6680a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
      ownerName: 'Manikandan T',
      ownerId: 'owner5',
      ownerPhone: '+91 98765 00005',
      ownerLocation: 'Tiruppur, TN',
      distance: '12 km',
      pricePerDay: 1500,
      pricePerHour: 200,
      rating: 4.6,
      condition: 'fair',
      deliveryAvailable: true,
      deliveryCharge: 0,
      verified: false,
      availability: 'available',
    },
  ]);
  const [myRequests] = useState<any[]>([]);
  const [incomingRequests] = useState([
    {
      id: '1',
      resourceTitle: 'Tractor - John Deere 5050D',
      requesterName: 'Ravi Kumar',
      requesterPhone: '+91 98765 43210',
      startDate: '2025-12-20',
      endDate: '2025-12-25',
      duration: '5 days',
      totalCost: 7500,
      deliveryRequired: true,
      message: 'Need tractor for plowing 10 acres of land. Please confirm availability.',
      status: 'pending',
    },
    {
      id: '2',
      resourceTitle: 'Rotavator Equipment',
      requesterName: 'Suresh Patil',
      requesterPhone: '+91 99887 76655',
      startDate: '2025-12-18',
      endDate: '2025-12-22',
      duration: '4 days',
      totalCost: 4000,
      deliveryRequired: false,
      message: 'I will pick up from your farm and return on time.',
      status: 'accepted',
    },
    {
      id: '3',
      resourceTitle: 'Seed Drill Machine',
      requesterName: 'Anjali Reddy',
      requesterPhone: '+91 98123 45678',
      startDate: '2025-12-16',
      endDate: '2025-12-17',
      duration: '2 days',
      totalCost: 2500,
      deliveryRequired: true,
      message: 'Urgent requirement for wheat sowing. Will pay delivery charges.',
      status: 'pending',
    },
  ]);
  const [alerts] = useState([
    {
      id: '1',
      title: 'Need Harvester Urgently',
      description:
        'Looking for a combine harvester for rice harvest. My field is ready and weather forecast shows rain in 3 days.',
      category: 'equipment',
      maxBudget: 15000,
      maxDistance: 15,
      urgency: 'high',
      requiredBy: '2025-12-22',
      responses: [
        {
          id: 'r1',
          responderName: 'Mohan Agriculture Services',
          price: 12000,
          message: 'We have John Deere combine harvester available. Can deliver within 2 hours.',
          availability: 'Available immediately',
          responderPhone: '+91 98456 78901',
        },
        {
          id: 'r2',
          responderName: 'Krishna Farm Equipment',
          price: 13500,
          message: 'Modern harvester with operator. Includes fuel and maintenance.',
          availability: 'Available from Dec 19',
          responderPhone: '+91 97654 32109',
        },
      ],
    },
    {
      id: '2',
      title: 'Spraying Equipment Needed',
      description:
        'Need pesticide spraying equipment for 20 acres cotton field. Preferably with operator.',
      category: 'equipment',
      maxBudget: 5000,
      maxDistance: 25,
      urgency: 'medium',
      requiredBy: '2025-12-25',
      responses: [
        {
          id: 'r3',
          responderName: 'Sai Agro Solutions',
          price: 4500,
          message: 'Boom sprayer with experienced operator available. Includes pesticide mixing.',
          availability: 'Available Dec 20-25',
          responderPhone: '+91 99123 45676',
        },
      ],
    },
  ]);
  const [analytics] = useState({
    totalResources: 24,
    activeRequests: 12,
    completedRentals: 45,
    totalEarnings: 125000,
    popularCategories: [
      { category: 'equipment', count: 12 },
      { category: 'tools', count: 6 },
      { category: 'transport', count: 4 },
      { category: 'storage', count: 2 },
    ],
  });

  const resourcesLoading = false;
  const incomingLoading = false;
  const alertsLoading = false;
  const analyticsLoading = false;
  const actionLoading = false;

  const refetchRequests = () => { };
  const refetchIncoming = () => { };
  const refetchAlerts = () => { };

  // Dummy action functions
  const createResourceRequest = async (data: any) => {
    console.log('Creating request:', data);
  };
  const updateRequestStatus = async (id: string, status: string) => {
    console.log('Updating status:', id, status);
  };
  const createResourceAlert = async (data: any) => {
    console.log('Creating alert:', data);
  };

  // Toast notifications
  const { toasts, addToast, removeToast } = useToast();

  // Form states
  const [requestForm, setRequestForm] = useState({
    startDate: '',
    endDate: '',
    deliveryRequired: false,
    message: '',
  });

  const [alertForm, setAlertForm] = useState({
    title: '',
    description: '',
    category: 'equipment',
    maxBudget: '',
    maxDistance: '',
    urgency: 'medium',
    requiredBy: '',
  });

  const categories = [
    { id: 'equipment', name: t('category_heavy_equipment'), icon: '🚜' },
    { id: 'tools', name: t('category_tools'), icon: '🔧' },
    { id: 'seeds', name: t('category_seeds'), icon: '🌱' },
    { id: 'fertilizer', name: t('category_fertilizer'), icon: '🧪' },
    { id: 'pesticide', name: t('category_pesticide'), icon: '🛡️' },
    { id: 'storage', name: t('category_storage'), icon: '🏪' },
    { id: 'transport', name: t('category_transport'), icon: '🚛' },
  ];

  const exportResourcesCSV = useCallback(() => {
    if (!resources || resources.length === 0) {
      addToast({ type: 'info', title: t('no_resources'), message: t('no_resources_export') });
      return;
    }
    // Select key columns for CSV export
    const data = (resources || []).map((r) => ({
      Title: r.title,
      Category: r.category,
      Owner: r.ownerName,
      Location: r.ownerLocation,
      Distance: r.distance,
      PricePerDay: r.pricePerDay,
      Rating: r.rating,
      Condition: r.condition,
    }));
    downloadCSV('resources-export.csv', data, [
      'Title',
      'Category',
      'Owner',
      'Location',
      'Distance',
      'PricePerDay',
      'Rating',
      'Condition',
    ]);
    addToast({ type: 'success', title: t('exported'), message: t('resources_exported_csv') });
  }, [resources, addToast]);

  const handleRequestResource = useCallback(
    async (resource: any) => {
      try {
        if (!requestForm.startDate || !requestForm.endDate) {
          addToast({
            type: 'error',
            title: 'Missing Information',
            message: 'Please select start and end dates',
          });
          return;
        }

        const startDate = new Date(requestForm.startDate);
        const endDate = new Date(requestForm.endDate);
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalCost =
          days * resource.pricePerDay +
          (requestForm.deliveryRequired ? resource.deliveryCharge : 0);

        await createResourceRequest({
          requesterId: 'current-farmer',
          requesterName: 'Current User',
          requesterPhone: '+91 98765 54321',
          requesterLocation: 'My Farm Location',
          resourceId: resource.id,
          resourceTitle: resource.title,
          ownerId: resource.ownerId,
          ownerName: resource.ownerName,
          startDate: requestForm.startDate,
          endDate: requestForm.endDate,
          duration: `${days} days`,
          totalCost,
          deliveryRequired: requestForm.deliveryRequired,
          message: requestForm.message,
        });

        setShowRequestModal(false);
        setRequestForm({ startDate: '', endDate: '', deliveryRequired: false, message: '' });

        addToast({
          type: 'success',
          title: 'Request Sent',
          message: `Your request for ${resource.title} has been sent to ${resource.ownerName}`,
        });

        refetchRequests();
      } catch {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to send request. Please try again.',
        });
      }
    },
    [requestForm, createResourceRequest, addToast, refetchRequests],
  );

  const handleCreateAlert = useCallback(async () => {
    try {
      if (!alertForm.title || !alertForm.description || !alertForm.maxBudget) {
        addToast({
          type: 'error',
          title: 'Missing Information',
          message: 'Please fill in all required fields',
        });
        return;
      }

      await createResourceAlert({
        farmerId: 'current-farmer',
        title: alertForm.title,
        description: alertForm.description,
        category: alertForm.category,
        maxBudget: parseInt(alertForm.maxBudget),
        maxDistance: parseInt(alertForm.maxDistance) || 20,
        urgency: alertForm.urgency,
        requiredBy: alertForm.requiredBy,
        contactInfo: '+91 98765 54321',
      });

      setShowAlertModal(false);
      setAlertForm({
        title: '',
        description: '',
        category: 'equipment',
        maxBudget: '',
        maxDistance: '',
        urgency: 'medium',
        requiredBy: '',
      });

      addToast({
        type: 'success',
        title: 'Alert Created',
        message: 'Your resource alert has been posted. Nearby farmers will be notified.',
      });

      refetchAlerts();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to create alert. Please try again.',
      });
    }
  }, [alertForm, createResourceAlert, addToast, refetchAlerts]);

  const handleUpdateRequestStatus = useCallback(
    async (requestId: string, status: string) => {
      try {
        await updateRequestStatus(requestId, status);

        addToast({
          type: 'success',
          title: 'Request Updated',
          message: `Request ${status} successfully`,
        });

        refetchIncoming();
      } catch {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to update request',
        });
      }
    },
    [updateRequestStatus, addToast, refetchIncoming],
  );

  const getConditionColor = (condition: any) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'needs-repair':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: any) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderBrowseResources = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Icon name="Search" className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              aria-label="Search resources"
              placeholder={t('placeholder_search_resources')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            aria-label={t('aria_open_filters')}
          >
            <Icon name="Filter" className="h-4 w-4" />
            <span>{t('filters')}</span>
          </button>
          <button
            onClick={exportResourcesCSV}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            aria-label={t('aria_export_csv')}
          >
            <Icon name="Download" className="h-4 w-4" />
            <span>{t('export_csv')}</span>
          </button>
        </div>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, category: '' }))}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.category === ''
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {t('all_categories') || 'All Categories'}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilters((prev) => ({ ...prev, category: category.id }))}
              className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center space-x-1 ${filters.category === category.id
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {resourcesLoading ? (
        <div>Loading resources...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources
            ?.filter(
              (resource) =>
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={resource.images[0]}
                    alt={resource.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${resource.availability === 'available'
                        ? 'bg-green-500 text-white'
                        : 'bg-amber-500 text-white'
                        }`}
                    >
                      {resource.availability === 'available' ? '● Available' : '○ Rented'}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium shadow-sm ${getConditionColor(resource.condition)}`}
                    >
                      {resource.condition}
                    </span>
                    {resource.verified && (
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{resource.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" className="h-4 w-4 text-gray-500" />
                      <span>
                        {resource.ownerLocation} • {resource.distance}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="DollarSign" className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-green-600">
                        ₹{resource.pricePerDay}/day
                      </span>
                      {resource.pricePerHour && (
                        <span className="text-gray-500">• ₹{resource.pricePerHour}/hour</span>
                      )}
                    </div>
                    {resource.deliveryAvailable && (
                      <div className="flex items-center space-x-2">
                        <Icon name="Truck" className="h-4 w-4 text-gray-500" />
                        <span>{t('delivery_available')} (+₹{resource.deliveryCharge})</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedResource(resource);
                        setShowRequestModal(true);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Icon name="Send" className="h-4 w-4" />
                      <span>{t('action_request')}</span>
                    </button>
                    <a
                      href={`tel:${resource.ownerPhone}`}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Icon name="Phone" className="h-4 w-4" />
                      <span>{t('call')}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const renderMyRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
        <div className="text-sm text-gray-600">{myRequests?.length || 0} total requests</div>
      </div>

      <div className="space-y-4">
        {myRequests?.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{request.resourceTitle}</h3>
                <p className="text-gray-600">Owner: {request.ownerName}</p>
                <p className="text-sm text-gray-500">
                  {request.startDate} to {request.endDate} • {request.duration}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : request.status === 'accepted'
                    ? 'bg-green-100 text-green-700'
                    : request.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-600">Total Cost:</span>
                <p className="font-medium text-green-600">₹{request.totalCost.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Delivery:</span>
                <p>{request.deliveryRequired ? 'Required' : 'Not required'}</p>
              </div>
            </div>

            {request.message && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <span className="text-gray-600 text-sm">Message: </span>
                <span className="text-gray-800">{request.message}</span>
              </div>
            )}

            <div className="flex space-x-2">
              <a
                href={`tel:${request.ownerName.replace(/[^+\d]/g, '')}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>Call Owner</span>
              </a>
              {request.status === 'pending' && (
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        ))}

        {(!myRequests || myRequests.length === 0) && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Icon name="Package" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No requests yet</h3>
            <p className="text-gray-600">Start browsing resources to make your first request</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderIncomingRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Incoming Requests</h2>
        <div className="text-sm text-gray-600">
          {incomingRequests?.filter((r) => r.status === 'pending').length || 0} pending requests
        </div>
      </div>

      {incomingLoading ? (
        <LoadingSpinner text="Loading incoming requests..." />
      ) : (
        <div className="space-y-4">
          {incomingRequests?.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{request.resourceTitle}</h3>
                  <p className="text-gray-600">Requester: {request.requesterName}</p>
                  <p className="text-sm text-gray-500">
                    {request.startDate} to {request.endDate} • {request.duration}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : request.status === 'accepted'
                      ? 'bg-green-100 text-green-700'
                      : request.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Total Payment:</span>
                  <p className="font-medium text-green-600">
                    ₹{request.totalCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Delivery:</span>
                  <p>{request.deliveryRequired ? 'Required' : 'Not required'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Contact:</span>
                  <p>{request.requesterPhone}</p>
                </div>
              </div>

              {request.message && (
                <div className="bg-gray-50 rounded p-3 mb-4">
                  <span className="text-gray-600 text-sm">Message: </span>
                  <span className="text-gray-800">{request.message}</span>
                </div>
              )}

              {request.status === 'pending' ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateRequestStatus(request.id, 'accepted')}
                    disabled={actionLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleUpdateRequestStatus(request.id, 'rejected')}
                    disabled={actionLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                  <a
                    href={`tel:${request.requesterPhone}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </a>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <a
                    href={`tel:${request.requesterPhone}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Requester</span>
                  </a>
                </div>
              )}
            </div>
          ))}

          {(!incomingRequests || incomingRequests.length === 0) && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Icon name="Bell" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No incoming requests</h3>
              <p className="text-gray-600">
                When farmers request your resources, they'll appear here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderResourceAlerts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Resource Alerts</h2>
        <button
          onClick={() => setShowAlertModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Alert</span>
        </button>
      </div>

      {alertsLoading ? (
        <LoadingSpinner text="Loading alerts..." />
      ) : (
        <div className="space-y-4">
          {alerts?.map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                  <p className="text-gray-600">{alert.description}</p>
                  <p className="text-sm text-gray-500">
                    Budget: ₹{alert.maxBudget.toLocaleString()} • Within {alert.maxDistance}km
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(alert.urgency)}`}
                  >
                    {alert.urgency} priority
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{alert.responses.length} responses</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Required by: {new Date(alert.requiredBy).toLocaleDateString()}
              </div>

              {alert.responses.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Responses:</h4>
                  {alert.responses.map((response) => (
                    <div key={response.id} className="bg-gray-50 rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{response.responderName}</span>
                        <span className="text-green-600 font-medium">₹{response.price}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{response.message}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{response.availability}</span>
                        <a
                          href={`tel:${response.responderPhone}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Call {response.responderPhone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {(!alerts || alerts.length === 0) && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No alerts created</h3>
              <p className="text-gray-600">
                Create alerts to let nearby farmers know what you need
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Resource Analytics</h2>

      {analyticsLoading ? (
        <LoadingSpinner text="Loading analytics..." />
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Resources</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics?.totalResources || 0}
                  </p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Requests</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics?.activeRequests || 0}
                  </p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Rentals</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {analytics?.completedRentals || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-amber-600">
                    ₹{analytics?.totalEarnings?.toLocaleString() || 0}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <div className="space-y-3">
              {analytics?.popularCategories?.map(({ category, count }) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{categories.find((c) => c.id === category)?.icon || '📦'}</span>
                    <span className="capitalize">{category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-24 bg-gray-200 rounded-full h-2"
                      role="img"
                      aria-label={`Category ${category} usage ${count}`}
                    >
                      {/* SVG-based progress bar to avoid inline styles */}
                      {(() => {
                        const percent = Math.round(
                          (count / (analytics?.totalResources || 1)) * 100,
                        );
                        return (
                          <svg
                            className="w-24 h-2"
                            viewBox="0 0 100 4"
                            preserveAspectRatio="none"
                            aria-hidden
                          >
                            <rect x="0" y="0" width="100" height="4" rx="2" fill="#E5E7EB" />
                            <rect x="0" y="0" width={percent} height="4" rx="2" fill="#10B981" />
                          </svg>
                        );
                      })()}
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'browse':
        return renderBrowseResources();
      case 'my-requests':
        return renderMyRequests();
      case 'incoming':
        return renderIncomingRequests();
      case 'alerts':
        return renderResourceAlerts();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderBrowseResources();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-xl">
                <Icon name="Wrench" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">{t('resource_sharing_title')}</h1>
                <p className="text-sm text-gray-600">{t('resource_sharing_subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'browse', name: t('tab_browse_resources'), icon: Search },
              { id: 'my-requests', name: t('tab_my_requests'), icon: Send },
              { id: 'incoming', name: t('tab_incoming_requests'), icon: Bell },
              { id: 'alerts', name: t('tab_resource_alerts'), icon: AlertTriangle },
              { id: 'analytics', name: t('tab_analytics'), icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{renderContent()}</main>

      {/* Request Modal */}
      {showRequestModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Request {selectedResource.title}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  aria-label="Request start date"
                  value={requestForm.startDate}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  aria-label="Request end date"
                  value={requestForm.endDate}
                  onChange={(e) => setRequestForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {selectedResource.deliveryAvailable && (
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={requestForm.deliveryRequired}
                      onChange={(e) =>
                        setRequestForm((prev) => ({ ...prev, deliveryRequired: e.target.checked }))
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">
                      Request delivery (+₹{selectedResource.deliveryCharge})
                    </span>
                  </label>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Any specific requirements or questions..."
                />
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => handleRequestResource(selectedResource)}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Sending...' : 'Send Request'}
              </button>
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create Resource Alert</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  aria-label="Alert title"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Need Tractor for Plowing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  aria-label="Alert description"
                  value={alertForm.description}
                  onChange={(e) =>
                    setAlertForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Describe what you need..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    aria-label="Alert category"
                    value={alertForm.category}
                    onChange={(e) =>
                      setAlertForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Budget (₹)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    aria-label="Max budget"
                    value={alertForm.maxBudget}
                    onChange={(e) =>
                      setAlertForm((prev) => ({ ...prev, maxBudget: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Distance (km)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    aria-label="Max distance"
                    value={alertForm.maxDistance}
                    onChange={(e) =>
                      setAlertForm((prev) => ({ ...prev, maxDistance: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    aria-label="Alert urgency"
                    value={alertForm.urgency}
                    onChange={(e) => setAlertForm((prev) => ({ ...prev, urgency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required By</label>
                <input
                  type="date"
                  aria-label="Required by date"
                  value={alertForm.requiredBy}
                  onChange={(e) =>
                    setAlertForm((prev) => ({ ...prev, requiredBy: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <button
                onClick={handleCreateAlert}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Creating...' : 'Create Alert'}
              </button>
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default ResourceSharing;
