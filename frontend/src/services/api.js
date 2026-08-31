const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorBody.detail || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

// --- Farms ---
export const getFarms = () => request('/farms');

export const getFarm = (farmId) => request(`/farms/${farmId}`);

export const createFarm = (farmData) =>
  request('/farms', {
    method: 'POST',
    body: JSON.stringify(farmData),
  });

export const updateFarm = (farmId, farmData) =>
  request(`/farms/${farmId}`, {
    method: 'PUT',
    body: JSON.stringify(farmData),
  });

export const deleteFarm = (farmId) =>
  request(`/farms/${farmId}`, { method: 'DELETE' });

// --- Weather ---
export const getWeather = (farmId) => request(`/weather/${farmId}`);

// --- Risk Assessment ---
export const assessRisk = (farmId) =>
  request(`/risk/${farmId}/assess`, { method: 'POST' });

export const getLatestRisk = (farmId) => request(`/risk/${farmId}/latest`);

export const getRiskHistory = (farmId) => request(`/risk/${farmId}/history`);

// --- Health ---
export const healthCheck = () => request('/health');
