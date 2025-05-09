import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// The actual error context will be set at runtime
let addApiError: ((message: string, statusCode?: number) => void) | null = null;

export const setApiErrorHandler = (handler: (message: string, statusCode?: number) => void) => {
  addApiError = handler;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const statusCode = error.response?.status;
    let errorMessage = 'Došlo je do greške.';

    if (error.response?.data) {
      // Try to get a more specific error message
      const data = error.response.data as any;
      if (data.message) {
        if (Array.isArray(data.message)) {
          errorMessage = data.message.join(', ');
        } else {
          errorMessage = data.message;
        }
      } else if (data.error) {
        errorMessage = data.error;
      } else {
        errorMessage = JSON.stringify(data);
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Add the error to global state if handler is available
    if (addApiError) {
      addApiError(errorMessage, statusCode);
    } else {
      console.error('API Error:', errorMessage, statusCode);
    }

    // Handle authentication errors
    if (statusCode === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient; 