// API Utility connected to Backend
const API_URL = 'http://localhost:3000/api';

export interface Worker {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  location: string;
  distance: string;
  rating: number;
  available: boolean;
  gender: string;
  experience: number;
  completedJobs: number;
  profileImage?: string;
  languages: string[];
  hourlyRate: number;
  verified: boolean;
  maxTravelKm?: number;
  availableHoursPerDay?: number;
  distanceKm?: number;
}

export interface Job {
  id: string;
  userId?: string;
  title: string;
  description: string;
  farmOwner: string;
  farmOwnerPhone: string;
  location: string;
  distance: string;
  workers: number;
  date: string;
  time: string;
  duration: string;
  payment: string;
  hourlyRate: number;
  skills: string[];
  urgent: boolean;
  verified: boolean;
  rating: number;
  status: 'active' | 'completed' | 'cancelled' | 'in-progress';
  applicants: WorkerApplication[];
  requirements: string[];
  benefits: string[];
}

export interface WorkerApplication {
  id: string; // usually _id from subdocument
  workerId: string;
  workerName: string;
  workerPhone: string;
  workerRating: number;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
}

export interface Land {
  id: string;
  userId?: string;
  name: string;
  location: string;
  crop: string;
  acreage: number;
  stage: string;
  plantedDate: string;
  expectedHarvest: string;
  soilType: string;
  irrigationType: string;
  status: 'preparation' | 'sowing' | 'growing' | 'flowering' | 'harvest';
  lastUpdated: string;
  coordinates?: { lat: number; lng: number };
  parts?: Array<{ crop: string; area: number; stage: string }>;
  notes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  product: string;
  buyer: string;
  seller: string;
  amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate: string;
  trackingId?: string;
  quantity: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate: string;
  lastActive: string;
  phone?: string;
  location?: string;
}

export const api = {
  // --- Helper to handle fetch errors ---
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      // In development, handle CORS/Proxy issues if backend is down or not proxying
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed: ${res.statusText}`);
      }
      return res.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  },

  // --- Worker APIs ---
  async getWorkers(filters?: { skills?: string[]; maxDistance?: number; available?: boolean; gender?: string; minWorkHours?: number, landId?: string }): Promise<Worker[]> {
    const params = new URLSearchParams();
    if (filters?.available !== undefined) params.append('available', String(filters.available));
    if (filters?.gender && filters.gender !== 'all') params.append('gender', filters.gender);
    if (filters?.maxDistance) params.append('maxDistance', String(filters.maxDistance));
    if (filters?.minWorkHours) params.append('minWorkHours', String(filters.minWorkHours));
    if (filters?.landId) params.append('landId', filters.landId);

    return this.request<Worker[]>(`/workers?${params.toString()}`);
  },

  async getWorkerById(id: string): Promise<Worker | null> {
    // Current backend doesn't implement individual GET /workers/:id, 
    // but we can fetch all and find, OR implement it. 
    // For now, let's fetch list and find.
    const workers = await this.getWorkers();
    return workers.find(w => w.id === id) || null;
  },

  async contactWorker(workerId: string, message: string): Promise<boolean> {
    // Placeholder as backend doesn't have a contact endpoint yet
    console.log(`Contacting worker ${workerId}: ${message}`);
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  },

  // --- Job APIs ---
  async getJobs(filters?: { skills?: string[]; urgent?: boolean; maxDistance?: number; userId?: string }): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters?.urgent !== undefined) params.append('urgent', String(filters.urgent));
    if (filters?.userId) params.append('userId', filters.userId);
    return this.request<Job[]>(`/jobs?${params.toString()}`);
  },

  async createJob(jobData: Omit<Job, 'id' | 'applicants' | 'status'>): Promise<Job> {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  async deleteJob(id: string): Promise<boolean> {
    await this.request(`/jobs/${id}`, { method: 'DELETE' });
    return true;
  },

  async applyForJob(
    jobId: string,
    workerData: { id: string; name: string; phone: string; rating: number; message?: string }
  ): Promise<boolean> {
    await this.request(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(workerData),
    });
    return true;
  },

  async getJobApplications(jobId: string): Promise<WorkerApplication[]> {
    return this.request<WorkerApplication[]>(`/jobs/${jobId}/applications`);
  },

  async updateApplicationStatus(
    jobId: string,
    applicationId: string,
    status: 'accepted' | 'rejected',
  ): Promise<boolean> {
    await this.request(`/jobs/${jobId}/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return true;
  },

  // --- Land APIs ---
  async getLands(userId?: string): Promise<Land[]> {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<Land[]>(`/lands${query}`);
  },

  async createLand(landData: Omit<Land, 'id' | 'lastUpdated'>): Promise<Land> {
    return this.request<Land>('/lands', {
      method: 'POST',
      body: JSON.stringify(landData),
    });
  },

  async updateLand(id: string, updates: Partial<Land>): Promise<Land | null> {
    return this.request<Land>(`/lands/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteLand(id: string): Promise<boolean> {
    await this.request(`/lands/${id}`, { method: 'DELETE' });
    return true;
  },

  // --- Notification APIs (Local State for now) ---
  async getNotifications(): Promise<Array<{ id: string; message: string; type: string; timestamp: string; read: boolean }>> {
    try {
      // Fetch notifications (optionally pass userId if available in context)
      const data = await this.request<any[]>('/notifications');
      return data.map(n => ({
        ...n,
        timestamp: n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now'
      }));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  },

  async markNotificationRead(id: string): Promise<boolean> {
    await this.request(`/notifications/${id}/read`, { method: 'PATCH' });
    return true;
  },

  async markAllNotificationsRead(): Promise<boolean> {
    await this.request('/notifications/mark-all-read', { method: 'POST' });
    return true;
  },

  // --- Analytics APIs ---
  async getAnalytics(): Promise<{ totalJobs: number; activeJobs: number; completedJobs: number; totalWorkers: number; totalOrders: number; revenue: number; averageRating: number; totalEarnings: number }> {
    return this.request('/analytics');
  },

  // --- Order APIs ---
  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/orders');
  },

  async deleteOrder(id: string): Promise<boolean> {
    await this.request(`/orders/${id}`, { method: 'DELETE' });
    return true;
  },

  // --- User APIs ---
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  },

  async deleteUser(id: string): Promise<boolean> {
    await this.request(`/users/${id}`, { method: 'DELETE' });
    return true;
  },

  // --- Agro Shop APIs ---
  async getAgroShops(filters?: { open?: boolean }): Promise<AgroShop[]> {
    const params = new URLSearchParams();
    if (filters?.open !== undefined) params.append('open', String(filters.open));
    return this.request<AgroShop[]>(`/agroshops?${params.toString()}`);
  },

  async getAgroShopById(id: string): Promise<AgroShop | null> {
    return this.request<AgroShop>(`/agroshops/${id}`);
  },

  async updateShopPrices(
    shopId: string,
    productPrices: Array<{ name: string; price: number; unit: string }>
  ): Promise<{ success: boolean; message: string; shop: AgroShop }> {
    return this.request(`/agroshops/${shopId}/prices`, {
      method: 'PATCH',
      body: JSON.stringify({ productPrices }),
    });
  },
};

export interface AgroShop {
  id: string;
  name: string;
  location: string;
  distance: string;
  phone: string;
  email?: string;
  products: string[];
  productPrices: {
    name: string;
    price: number;
    unit: string;
    lastUpdated: string;
  }[];
  rating: number;
  reviewCount?: number;
  open: boolean;
  openingHours?: { open: string; close: string };
  address?: string;
  coordinates?: { lat: number; lng: number };
  verified: boolean;
  image?: string;
  description?: string;
}
