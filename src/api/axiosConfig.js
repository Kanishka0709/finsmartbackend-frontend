import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8099';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session-based authentication
});

// Add request interceptor to handle authentication
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any additional headers if needed
    console.log('Making request to:', config.url, 'with method:', config.method);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url, 'with status:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data, 'for URL:', error.config?.url);
    if (error.response && error.response.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;




