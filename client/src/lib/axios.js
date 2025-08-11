// lib/axios.js - Axios instance with interceptors
import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

const getTokenFromStore = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Get the persisted store from localStorage
      const persistedStore = localStorage.getItem('persist:root');
      if (!persistedStore) return null;
      
      const parsedStore = JSON.parse(persistedStore);
      if (!parsedStore.user) return null;
      
      const userData = JSON.parse(parsedStore.user);
      return userData.token || null;
    } catch (error) {
      console.error('Error getting token from store:', error);
      return null;
    }
  };
  
// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token =getTokenFromStore();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add common headers
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';


    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     // Log successful responses in development
//     if (process.env.NODE_ENV === 'development') {
//       console.log('✅ Response:', response.status, response.config.url);
//     }

//     return response;
//   },
//   (error) => {
//     // Handle different error scenarios
//     if (error.response) {
//       const { status, data } = error.response;

//       switch (status) {
//         case 401:
//           // Unauthorized - redirect to login
//           if (typeof window !== 'undefined') {
//             localStorage.removeItem('token');
//             window.location.href = '/login';
//           }
//           break;
        
//         case 403:
//           // Forbidden
//           console.error('Access forbidden:', data?.message);
//           break;
        
//         case 404:
//           console.error('Resource not found:', error.config.url);
//           break;
        
//         case 500:
//           console.error('Server error:', data?.message);
//           break;
        
//         default:
//           console.error(`HTTP ${status}:`, data?.message);
//       }
//     } else if (error.request) {
//       // Network error
//       console.error('Network error:', error.message);
//     } else {
//       console.error('Error:', error.message);
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;