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
}

export interface Job {
  id: string;
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
  async getWorkers(filters?: { skills?: string[]; maxDistance?: number; available?: boolean; gender?: string }): Promise<Worker[]> {
    const params = new URLSearchParams();
    if (filters?.available !== undefined) params.append('available', String(filters.available));
    if (filters?.gender && filters.gender !== 'all') params.append('gender', filters.gender);
    // Note: skills and distance filtering would ideally happen on backend. 
    // Here we just fetch all suitable ones or pass params if backend supports.

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
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  },

  // --- Job APIs ---
  async getJobs(filters?: { skills?: string[]; urgent?: boolean; maxDistance?: number }): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters?.urgent !== undefined) params.append('urgent', String(filters.urgent));
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
    // Not implemented as separate endpoint in backend yet.
    // Fetch generic job list or implement /jobs/:id
    return [];
  },

  async updateApplicationStatus(
    jobId: string,
    applicationId: string,
    status: 'accepted' | 'rejected',
  ): Promise<boolean> {
    // Placeholder
    return true;
  },

  // --- Land APIs ---
  async getLands(): Promise<Land[]> {
    return this.request<Land[]>('/lands');
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
    return true;
  },

  async markAllNotificationsRead(): Promise<boolean> {
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
