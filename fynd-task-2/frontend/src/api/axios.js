import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add admin token for admin routes
apiClient.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/admin/')) {
      const adminToken = sessionStorage.getItem('adminToken');
      if (adminToken) {
        config.headers['X-ADMIN-TOKEN'] = adminToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Handle 401 for admin routes
    if (error.response?.status === 401 && error.config?.url?.includes('/admin/')) {
      sessionStorage.removeItem('adminToken');
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);

export default apiClient;
