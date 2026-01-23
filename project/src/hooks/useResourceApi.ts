import { useState, useEffect, useCallback } from 'react';
import { resourceApi } from '../utils/resourceApi';

// Custom hook for resource API state management
export function useResourceApi<T>(apiFunction: () => Promise<T>, dependencies: any[] = []) {
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
export function useResources(filters?: {
  category?: string;
  maxDistance?: number;
  maxPrice?: number;
  availability?: string;
  condition?: string;
}) {
  return useResourceApi(() => resourceApi.getResources(filters), [filters]);
}

export function useResourceRequests(filters?: {
  ownerId?: string;
  requesterId?: string;
  status?: string;
}) {
  return useResourceApi(() => resourceApi.getResourceRequests(filters), [filters]);
}

export function useResourceAlerts(filters?: {
  farmerId?: string;
  category?: string;
  status?: string;
}) {
  return useResourceApi(() => resourceApi.getResourceAlerts(filters), [filters]);
}

export function useResourceAnalytics() {
  return useResourceApi(() => resourceApi.getResourceAnalytics(), []);
}

// Action hooks for mutations
export function useResourceActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createResource = async (resourceData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await resourceApi.createResource(resourceData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resource');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createResourceRequest = async (requestData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await resourceApi.createResourceRequest(requestData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (
    requestId: string,
    status: any,
    feedback?: string,
    rating?: number,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await resourceApi.updateRequestStatus(requestId, status, feedback, rating);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createResourceAlert = async (alertData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await resourceApi.createResourceAlert(alertData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create alert');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const respondToAlert = async (alertId: string, responseData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await resourceApi.respondToAlert(alertId, responseData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to respond to alert');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createResource,
    createResourceRequest,
    updateRequestStatus,
    createResourceAlert,
    respondToAlert,
    loading,
    error,
  };
}
