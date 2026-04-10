// Resource Sharing API for உழவன் X
export interface Resource {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerLocation: string;
  distance: string;
  title: string;
  description: string;
  category: 'equipment' | 'tools' | 'seeds' | 'fertilizer' | 'pesticide' | 'storage' | 'transport';
  condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
  availability: 'available' | 'rented' | 'maintenance';
  pricePerDay: number;
  pricePerHour?: number;
  images: string[];
  specifications: Record<string, string>;
  availableDates: string[];
  minimumRentalPeriod: string; // e.g., "1 day", "3 hours"
  maximumRentalPeriod: string;
  deliveryAvailable: boolean;
  deliveryRadius: number; // in km
  deliveryCharge: number;
  rating: number;
  totalRentals: number;
  createdAt: string;
  lastUpdated: string;
  verified: boolean;
}

export interface ResourceRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  requesterLocation: string;
  resourceId: string;
  resourceTitle: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  duration: string;
  totalCost: number;
  deliveryRequired: boolean;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  respondedAt?: string;
  completedAt?: string;
  rating?: number;
  feedback?: string;
}

export interface ResourceAlert {
  id: string;
  farmerId: string;
  title: string;
  description: string;
  category: string;
  maxBudget: number;
  maxDistance: number;
  urgency: 'low' | 'medium' | 'high';
  requiredBy: string;
  contactInfo: string;
  status: 'active' | 'fulfilled' | 'expired';
  createdAt: string;
  responses: ResourceAlertResponse[];
}

export interface ResourceAlertResponse {
  id: string;
  alertId: string;
  responderId: string;
  responderName: string;
  responderPhone: string;
  resourceId?: string;
  message: string;
  price: number;
  availability: string;
  createdAt: string;
}

// Simulated database
const resources: Resource[] = [
  {
    id: '1',
    ownerId: 'farmer1',
    ownerName: 'Ramesh Patel',
    ownerPhone: '+91 98765 43210',
    ownerLocation: 'Village Greenfield, Sector 12',
    distance: '2.3 km',
    title: 'John Deere Tractor 5050D',
    description:
      'Well-maintained 50HP tractor perfect for plowing, cultivation, and harvesting. Includes basic implements.',
    category: 'equipment',
    condition: 'excellent',
    availability: 'available',
    pricePerDay: 1500,
    pricePerHour: 200,
    images: [
      'https://images.pexels.com/photos/158861/tractor-agriculture-machine-harvest-158861.jpeg',
    ],
    specifications: {
      'Engine Power': '50 HP',
      'Fuel Type': 'Diesel',
      Transmission: 'Manual',
      PTO: 'Yes',
      Hydraulics: 'Yes',
    },
    availableDates: ['2024-01-20', '2024-01-21', '2024-01-22', '2024-01-25'],
    minimumRentalPeriod: '4 hours',
    maximumRentalPeriod: '7 days',
    deliveryAvailable: true,
    deliveryRadius: 10,
    deliveryCharge: 300,
    rating: 4.8,
    totalRentals: 45,
    createdAt: '2024-01-10T10:00:00Z',
    lastUpdated: '2024-01-15T14:30:00Z',
    verified: true,
  },
  {
    id: '2',
    ownerId: 'farmer2',
    ownerName: 'Priya Singh',
    ownerPhone: '+91 98765 43211',
    ownerLocation: 'North Fields, Plot 8',
    distance: '3.7 km',
    title: 'Rotavator 7 Feet',
    description:
      'Heavy-duty rotavator for soil preparation. Perfect for breaking hard soil and mixing crop residues.',
    category: 'equipment',
    condition: 'good',
    availability: 'available',
    pricePerDay: 800,
    pricePerHour: 120,
    images: ['https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg'],
    specifications: {
      Width: '7 feet',
      Blades: '36 pieces',
      Weight: '450 kg',
      'Tractor Requirement': '35-50 HP',
    },
    availableDates: ['2024-01-18', '2024-01-19', '2024-01-23', '2024-01-24'],
    minimumRentalPeriod: '2 hours',
    maximumRentalPeriod: '3 days',
    deliveryAvailable: true,
    deliveryRadius: 8,
    deliveryCharge: 200,
    rating: 4.6,
    totalRentals: 32,
    createdAt: '2024-01-08T09:15:00Z',
    lastUpdated: '2024-01-14T11:20:00Z',
    verified: true,
  },
  {
    id: '3',
    ownerId: 'farmer3',
    ownerName: 'Mukesh Kumar',
    ownerPhone: '+91 98765 43212',
    ownerLocation: 'East Valley, Field C',
    distance: '1.8 km',
    title: 'Sprayer Tank 500L',
    description:
      'High-pressure sprayer for pesticide and fertilizer application. Includes various nozzles and hoses.',
    category: 'equipment',
    condition: 'excellent',
    availability: 'available',
    pricePerDay: 400,
    images: ['https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg'],
    specifications: {
      Capacity: '500 Liters',
      Pressure: '40 Bar',
      Coverage: '20 feet width',
      Nozzles: '8 pieces',
    },
    availableDates: ['2024-01-17', '2024-01-18', '2024-01-20', '2024-01-21'],
    minimumRentalPeriod: '1 day',
    maximumRentalPeriod: '5 days',
    deliveryAvailable: false,
    deliveryRadius: 0,
    deliveryCharge: 0,
    rating: 4.9,
    totalRentals: 28,
    createdAt: '2024-01-05T16:45:00Z',
    lastUpdated: '2024-01-12T08:30:00Z',
    verified: true,
  },
  {
    id: '4',
    ownerId: 'farmer4',
    ownerName: 'Anita Sharma',
    ownerPhone: '+91 98765 43213',
    ownerLocation: 'South Block, Field A',
    distance: '4.2 km',
    title: 'Harvester Combine',
    description:
      'Modern combine harvester for wheat, rice, and other grains. Includes grain tank and cleaning system.',
    category: 'equipment',
    condition: 'good',
    availability: 'available',
    pricePerDay: 3500,
    pricePerHour: 450,
    images: ['https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg'],
    specifications: {
      'Cutting Width': '12 feet',
      'Engine Power': '120 HP',
      'Grain Tank': '3500 L',
      'Suitable Crops': 'Wheat, Rice, Barley',
    },
    availableDates: ['2024-01-22', '2024-01-23', '2024-01-26', '2024-01-27'],
    minimumRentalPeriod: '1 day',
    maximumRentalPeriod: '10 days',
    deliveryAvailable: true,
    deliveryRadius: 15,
    deliveryCharge: 800,
    rating: 4.7,
    totalRentals: 18,
    createdAt: '2024-01-03T12:00:00Z',
    lastUpdated: '2024-01-13T15:45:00Z',
    verified: true,
  },
  {
    id: '5',
    ownerId: 'farmer5',
    ownerName: 'Suresh Patel',
    ownerPhone: '+91 98765 43214',
    ownerLocation: 'West Valley, Plot 15',
    distance: '5.1 km',
    title: 'Seed Drill Machine',
    description:
      'Precision seed drill for accurate sowing. Adjustable row spacing and seed rate control.',
    category: 'equipment',
    condition: 'excellent',
    availability: 'available',
    pricePerDay: 1200,
    images: ['https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg'],
    specifications: {
      Rows: '9 rows',
      'Row Spacing': '15-30 cm adjustable',
      'Seed Box': '200 kg capacity',
      'Fertilizer Box': '150 kg capacity',
    },
    availableDates: ['2024-01-19', '2024-01-20', '2024-01-24', '2024-01-25'],
    minimumRentalPeriod: '1 day',
    maximumRentalPeriod: '4 days',
    deliveryAvailable: true,
    deliveryRadius: 12,
    deliveryCharge: 400,
    rating: 4.8,
    totalRentals: 25,
    createdAt: '2024-01-07T14:20:00Z',
    lastUpdated: '2024-01-14T10:15:00Z',
    verified: true,
  },
];

const resourceRequests: ResourceRequest[] = [
  {
    id: '1',
    requesterId: 'current-farmer',
    requesterName: 'Current User',
    requesterPhone: '+91 98765 54321',
    requesterLocation: 'My Farm Location',
    resourceId: '1',
    resourceTitle: 'John Deere Tractor 5050D',
    ownerId: 'farmer1',
    ownerName: 'Ramesh Patel',
    startDate: '2024-01-20',
    endDate: '2024-01-21',
    duration: '2 days',
    totalCost: 3300, // 2 days * 1500 + delivery
    deliveryRequired: true,
    message: 'Need for wheat harvesting in my 5-acre field.',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
  },
];

const resourceAlerts: ResourceAlert[] = [
  {
    id: '1',
    farmerId: 'current-farmer',
    title: 'Need Thresher Machine',
    description: 'Looking for a thresher machine for wheat processing. Need it for 2-3 days.',
    category: 'equipment',
    maxBudget: 2000,
    maxDistance: 10,
    urgency: 'high',
    requiredBy: '2024-01-25',
    contactInfo: '+91 98765 54321',
    status: 'active',
    createdAt: '2024-01-14T09:00:00Z',
    responses: [
      {
        id: '1',
        alertId: '1',
        responderId: 'farmer6',
        responderName: 'Raj Kumar',
        responderPhone: '+91 98765 43215',
        message: 'I have a wheat thresher available. Good condition, can deliver.',
        price: 1800,
        availability: 'Available from Jan 23-26',
        createdAt: '2024-01-14T14:30:00Z',
      },
    ],
  },
];

// API Functions
export const resourceApi = {
  // Resource APIs
  async getResources(filters?: {
    category?: string;
    maxDistance?: number;
    maxPrice?: number;
    availability?: string;
    condition?: string;
  }): Promise<Resource[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filteredResources = [...resources];

    if (filters?.category) {
      filteredResources = filteredResources.filter(
        (resource) => resource.category === filters.category,
      );
    }

    if (filters?.maxDistance) {
      filteredResources = filteredResources.filter(
        (resource) => parseFloat(resource.distance) <= filters.maxDistance!,
      );
    }

    if (filters?.maxPrice) {
      filteredResources = filteredResources.filter(
        (resource) => resource.pricePerDay <= filters.maxPrice!,
      );
    }

    if (filters?.availability) {
      filteredResources = filteredResources.filter(
        (resource) => resource.availability === filters.availability,
      );
    }

    if (filters?.condition) {
      filteredResources = filteredResources.filter(
        (resource) => resource.condition === filters.condition,
      );
    }

    return filteredResources;
  },

  async getResourceById(id: string): Promise<Resource | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return resources.find((resource) => resource.id === id) || null;
  },

  async createResource(
    resourceData: Omit<Resource, 'id' | 'createdAt' | 'lastUpdated' | 'totalRentals'>,
  ): Promise<Resource> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newResource: Resource = {
      ...resourceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      totalRentals: 0,
    };

    resources.push(newResource);
    return newResource;
  },

  async updateResource(id: string, updates: Partial<Resource>): Promise<Resource | null> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const resourceIndex = resources.findIndex((resource) => resource.id === id);
    if (resourceIndex === -1) return null;

    resources[resourceIndex] = {
      ...resources[resourceIndex],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    return resources[resourceIndex];
  },

  // Resource Request APIs
  async createResourceRequest(
    requestData: Omit<ResourceRequest, 'id' | 'createdAt' | 'status'>,
  ): Promise<ResourceRequest> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newRequest: ResourceRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    resourceRequests.push(newRequest);
    return newRequest;
  },

  async getResourceRequests(filters?: {
    ownerId?: string;
    requesterId?: string;
    status?: string;
  }): Promise<ResourceRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    let filteredRequests = [...resourceRequests];

    if (filters?.ownerId) {
      filteredRequests = filteredRequests.filter((request) => request.ownerId === filters.ownerId);
    }

    if (filters?.requesterId) {
      filteredRequests = filteredRequests.filter(
        (request) => request.requesterId === filters.requesterId,
      );
    }

    if (filters?.status) {
      filteredRequests = filteredRequests.filter((request) => request.status === filters.status);
    }

    return filteredRequests;
  },

  async updateRequestStatus(
    requestId: string,
    status: 'accepted' | 'rejected' | 'completed' | 'cancelled',
    feedback?: string,
    rating?: number,
  ): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const request = resourceRequests.find((r) => r.id === requestId);
    if (!request) return false;

    request.status = status;
    request.respondedAt = new Date().toISOString();

    if (status === 'completed') {
      request.completedAt = new Date().toISOString();
      if (feedback) request.feedback = feedback;
      if (rating) request.rating = rating;
    }

    return true;
  },

  // Resource Alert APIs
  async createResourceAlert(
    alertData: Omit<ResourceAlert, 'id' | 'createdAt' | 'responses' | 'status'>,
  ): Promise<ResourceAlert> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const newAlert: ResourceAlert = {
      ...alertData,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      responses: [],
    };

    resourceAlerts.push(newAlert);
    return newAlert;
  },

  async getResourceAlerts(filters?: {
    farmerId?: string;
    category?: string;
    status?: string;
  }): Promise<ResourceAlert[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredAlerts = [...resourceAlerts];

    if (filters?.farmerId) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.farmerId === filters.farmerId);
    }

    if (filters?.category) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.category === filters.category);
    }

    if (filters?.status) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.status === filters.status);
    }

    return filteredAlerts;
  },

  async respondToAlert(
    alertId: string,
    responseData: Omit<ResourceAlertResponse, 'id' | 'createdAt' | 'alertId'>,
  ): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const alert = resourceAlerts.find((a) => a.id === alertId);
    if (!alert) return false;

    const newResponse: ResourceAlertResponse = {
      ...responseData,
      id: Date.now().toString(),
      alertId: alertId,
      createdAt: new Date().toISOString(),
    };

    alert.responses.push(newResponse);
    return true;
  },

  // Analytics APIs
  async getResourceAnalytics(): Promise<{
    totalResources: number;
    activeRequests: number;
    completedRentals: number;
    totalEarnings: number;
    averageRating: number;
    popularCategories: Array<{ category: string; count: number }>;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const completedRequests = resourceRequests.filter((r) => r.status === 'completed');
    const totalEarnings = completedRequests.reduce((sum, r) => sum + r.totalCost, 0);
    const averageRating =
      completedRequests.length > 0
        ? completedRequests.reduce((sum, r) => sum + (r.rating || 0), 0) / completedRequests.length
        : 0;

    const categoryCount = resources.reduce(
      (acc, resource) => {
        acc[resource.category] = (acc[resource.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const popularCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalResources: resources.length,
      activeRequests: resourceRequests.filter((r) => r.status === 'pending').length,
      completedRentals: completedRequests.length,
      totalEarnings,
      averageRating,
      popularCategories,
    };
  },
};
