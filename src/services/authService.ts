// src/services/authService.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { store } from '../redux/store';
import { RootState } from '../redux/store';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://staffbridgesapi.techwagger.com',
  timeout: 30000, // ✅ Increased timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      // Get token from Redux store
      const state: RootState = store.getState();
      const token = state.auth.token;

      // Add token to headers if it exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle responses and errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // ✅ Better error handling - safe extraction
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const errorMessage = 
      typeof error.response?.data === 'object' && error.response?.data !== null
        ? (error.response.data as any)?.message || (error.response.data as any)?.error || statusText
        : statusText || error.message;

    // Handle specific status codes
    switch (status) {
      case 413:
        break;
      case 401:
        store.dispatch({ type: 'auth/resetAuth' });
        break;
      case 400:
        break;
      case 500:
        break;
      default:
    }

    return Promise.reject(error);
  }
);

// src/services/authService.ts

export const logoutApi = (userId: number) => {
  return axiosInstance.post('/auth/user-logout', {
    userId,
  });
};


export default axiosInstance;