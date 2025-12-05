// src/services/authService.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { store } from '../redux/store';
import { RootState } from '../redux/store';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://staffbridgesapi.techwagger.com',
  timeout: 10000,
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
        console.log('Token added to request:', token.substring(0, 20) + '...');
      }

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle responses and errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('Response error:', error.response?.status, error.response?.data);

    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      console.log('Token expired, clearing auth state');
      store.dispatch({ type: 'auth/resetAuth' });
      
      // Optional: You can navigate to login screen here
      // navigation.reset({ index: 0, routes: [{ name: 'PhoneLoginScreen' }] });
    }

    // Handle 500 Server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;