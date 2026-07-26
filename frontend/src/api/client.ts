import axios, { AxiosResponse } from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Request interceptor - inject auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token extraction, 401, and errors
client.interceptors.response.use(
  (response: AxiosResponse) => {
    // Extract token from successful response if it exists
    // Expected response format: { data: { usuario, token } }
    if (response.data?.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
