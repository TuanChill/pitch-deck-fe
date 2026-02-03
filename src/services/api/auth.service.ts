import { API_URL } from '@/constants/api';
import { httpClient } from '@/services/http';
import type { LoginRequest, LoginResponse } from '@/types/request/auth';
import type { User } from '@/types/user';

/**
 * Get current user information
 */
export const getMe = async (): Promise<User> => {
  const response = await httpClient.get(`${API_URL.GET_ME}`);

  return response.data;
};

/**
 * Login user with username and password
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await httpClient.post(`${API_URL.LOGIN || '/auth/login'}`, {
    ...credentials,
    type: 'local'
  });

  return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  const response = await httpClient.post(`${API_URL.LOGOUT || '/auth/logout'}`);

  return response.data;
};

/**
 * Refresh access token
 */
export const refreshToken = async (): Promise<{ token: string }> => {
  const response = await httpClient.post(`${API_URL.REFRESH_TOKEN || '/auth/refresh'}`);

  return response.data;
};
