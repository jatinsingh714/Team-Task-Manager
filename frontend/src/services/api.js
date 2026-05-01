import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

if (import.meta.env.PROD && !apiBaseUrl) {
  console.error('VITE_API_URL must be set for production builds.');
}

const API = apiBaseUrl || '/api';

const api = axios.create({
  baseURL: API,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tt_manager_token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to reach the backend API.';

    error.apiMessage = message;
    return Promise.reject(error);
  }
);

export { API };
export default api;
