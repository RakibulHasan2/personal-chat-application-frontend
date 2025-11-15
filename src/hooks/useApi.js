import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useApi = (apiCall, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result.data || result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [...dependencies, fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export const useUsers = () => {
  return useApi(() => apiService.getUsers());
};

export const useMessages = () => {
  return useApi(() => apiService.getMessages());
};

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (messageData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.sendMessage(messageData);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading,
    error,
  };
};