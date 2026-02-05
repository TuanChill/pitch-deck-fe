import { env } from '@/config/env';
import Axios, { AxiosError, AxiosResponse } from 'axios';

// Backend API base URL (from Phase 01 API integration)
const baseUrl = env.NEXT_PUBLIC_API_BASE || 'http://localhost:8082';

const axiosOptions = {
  baseURL: baseUrl,
  timeout: 60000 * 5, // 5 minutes
  headers: {
    'Content-Type': 'application/json'
  },
  maxContentLength: 1024 * 1024 * 1024, // 1GB limit
  maxBodyLength: 1024 * 1024 * 1024 // 1GB limit
};

export const httpClient = Axios.create(axiosOptions);

// Response interceptor for global error handling
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);
