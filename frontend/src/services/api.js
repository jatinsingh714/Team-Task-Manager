import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD && !apiBaseUrl) {
  throw new Error('VITE_API_URL must be set for production builds.');
}

const api = axios.create({
  baseURL: apiBaseUrl || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tt_manager_token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
