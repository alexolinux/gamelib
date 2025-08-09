import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  //baseURL: import.meta.env.VITE_BACKEND_URL || 'http://backend:3000/api',
});

export default api;
