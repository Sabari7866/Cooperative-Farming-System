// API Utility connected to Backend
const API_URL = 'http://localhost:3001/api';

export interface Worker {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  location: string;
  distance: string;
  rating: number;
  available: boolean;
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
  async getWorkers(filters?: { skills?: string[]; maxDistance?: number; available?: boolean }): Promise<Worker[]> {
    const params = new URLSearchParams();
    if (filters?.available !== undefined) params.append('available', String(filters.available));
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
    // Backend doesn't utilize DB for notifications yet, keep mock
    return [
      { id: '1', message: 'Backend connected successfully', type: 'system', timestamp: 'Just now', read: false }
    ];
  },

  async markNotificationRead(id: string): Promise<boolean> {
    return true;
  },

  async markAllNotificationsRead(): Promise<boolean> {
    return true;
  },

  // --- Analytics APIs ---
  async getAnalytics(): Promise<{ totalJobs: number; activeJobs: number; completedJobs: number; totalWorkers: number; averageRating: number; totalEarnings: number }> {
    return this.request('/analytics');
  },
};
