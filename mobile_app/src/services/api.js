import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Expo, use the IP address of your machine for local development with physical devices/emulators
// e.g., http://192.168.1.x:8000/api
// For Android Emulator to localhost, you can use http://10.0.2.2:8000/api
const API_BASE = 'http://192.168.43.138:8000/api'; 

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---
export const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email); // OAuth2 expects username
  formData.append('password', password);
  
  const response = await apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// --- Farms ---
export const getFarms = async () => {
  const response = await apiClient.get('/farms');
  return response.data;
};

export const getFarm = async (farmId) => {
  const response = await apiClient.get(`/farms/${farmId}`);
  return response.data;
};

export const createFarm = async (farmData) => {
  const response = await apiClient.post('/farms', farmData);
  return response.data;
};

export const deleteFarm = async (farmId) => {
  const response = await apiClient.delete(`/farms/${farmId}`);
  return response.data;
};

// --- Weather & Analysis ---
export const getWeather = async (farmId) => {
  const response = await apiClient.get(`/weather/${farmId}`);
  return response.data;
};

export const getLatestRisk = async (farmId) => {
  const response = await apiClient.get(`/analysis/risk/${farmId}/latest`);
  return response.data;
};

// --- Missing Features APIs ---
export const getActivities = async (farmId) => {
  const response = await apiClient.get(`/activities/${farmId}`);
  return response.data;
};

export const createActivity = async (farmId, activityData) => {
  const response = await apiClient.post(`/activities/${farmId}`, activityData);
  return response.data;
};

export const getNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const getChatHistory = async (farmId) => {
  const response = await apiClient.get(`/chat/${farmId}`);
  return response.data;
};

export const sendChatMessage = async (farmId, message) => {
  const response = await apiClient.post(`/chat/${farmId}`, { message });
  return response.data;
};
