import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

// Custom hook for API state management
export function useApi<T>(apiFunction: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Specific hooks for different entities
export function useWorkers(filters?: {
  skills?: string[];
  maxDistance?: number;
  available?: boolean;
  gender?: string;
  minWorkHours?: number;
  landId?: string;
}) {
  return useApi(() => api.getWorkers(filters), [filters?.available, filters?.gender, filters?.maxDistance, filters?.minWorkHours, JSON.stringify(filters?.skills), filters?.landId]);
}

export function useJobs(filters?: { skills?: string[]; urgent?: boolean; maxDistance?: number; userId?: string }) {
  return useApi(() => api.getJobs(filters), [filters?.userId, filters?.urgent]);
}

export function useLands(userId?: string) {
  return useApi(() => api.getLands(userId), [userId]);
}

export function useNotifications() {
  return useApi(() => api.getNotifications(), []);
}

export function useAnalytics() {
  return useApi(() => api.getAnalytics(), []);
}

// Action hooks for mutations
export function useJobActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJob = async (jobData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.createJob(jobData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (jobId: string, workerData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.applyForJob(jobId, workerData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply for job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createJob, applyForJob, loading, error };
}

export function useLandActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLand = async (landData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.createLand(landData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create land');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLand = async (id: string, updates: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.updateLand(id, updates);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update land');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLand = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.deleteLand(id);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete land');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createLand, updateLand, deleteLand, loading, error };
}

export function useAgroShops(filters?: { open?: boolean }) {
  return useApi(() => api.getAgroShops(filters), [filters]);
}
