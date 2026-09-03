import axios from 'axios';

// Configure the base URL for the FastAPI backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Service
export const authAPI = {
  // Login expects application/x-www-form-urlencoded as per OAuth2 spec standard used in FastAPI
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI OAuth2PasswordRequestForm uses 'username'
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Farms Service
export const farmsAPI = {
  getFarms: async () => {
    const response = await api.get('/farms');
    return response.data;
  },
  
  getFarm: async (farmId) => {
    const response = await api.get(`/farms/${farmId}`);
    return response.data;
  },
  
  createFarm: async (farmData) => {
    const response = await api.post('/farms', farmData);
    return response.data;
  },
  
  updateFarm: async (farmId, farmData) => {
    const response = await api.put(`/farms/${farmId}`, farmData);
    return response.data;
  },
  
  deleteFarm: async (farmId) => {
    const response = await api.delete(`/farms/${farmId}`);
    return response.data;
  }
};

// Weather Service
export const weatherAPI = {
  getWeather: async (farmId) => {
    const response = await api.get(`/weather/${farmId}`);
    return response.data;
  }
};

// AI Analysis & Risk Service
export const analysisAPI = {
  getLatestAnalysis: async (farmId) => {
    const response = await api.get(`/analysis/${farmId}/latest`);
    return response.data;
  },
  
  requestNewAnalysis: async (farmId, language = 'en') => {
    const response = await api.post(`/analysis/${farmId}/analyze?lang=${language}`);
    return response.data;
  }
};

// Chatbot Service
export const chatAPI = {
  getHistory: async (farmId) => {
    const response = await api.get(`/chat/${farmId}/history`);
    return response.data;
  },
  
  sendMessage: async (farmId, text, language = 'en') => {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('language', language);
    const response = await api.post(`/chat/${farmId}/message`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteHistory: async (farmId) => {
    const response = await api.delete(`/chat/${farmId}/history`);
    return response.data;
  }
};

// Notifications Service
export const notificationsAPI = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  
  markAsRead: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },
  
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

// Activities Service
export const activitiesAPI = {
  getActivities: async (farmId) => {
    const response = await api.get(`/activities/farms/${farmId}/activities`);
    return response.data;
  },
  
  createActivity: async (farmId, activityData) => {
    const response = await api.post(`/activities/farms/${farmId}/activities`, activityData);
    return response.data;
  }
};

export default api;
