import axios from 'axios';

export const axiosInstance = axios.create({
  // @ts-ignore
  baseURL: import.meta.env.MODE === 'development' ? `${import.meta.env.VITE_APP_API_URL}/api` : '/api',
  withCredentials: true,
});
