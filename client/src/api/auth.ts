import api from './api';
import { AxiosError } from 'axios';

// Define user interface
interface User {
  id: string;
  email: string;
  name: string;
}

// Define response interfaces
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RegisterResponse {
  accessToken: string;
  user: User;
}

interface LogoutResponse {
  message: string;
}

interface GetCurrentUserResponse {
  user: User;
}

// Define error response interface
interface ApiError {
  message: string;
}

// Description: Login user
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { accessToken: string, refreshToken: string, user: { id: string, email: string, name: string } }
export const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/api/auth/login', data);
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Register user
// Endpoint: POST /api/auth/register
// Request: { name: string, email: string, password: string }
// Response: { accessToken: string, user: { id: string, email: string, name: string } }
export const register = async (data: { name: string; email: string; password: string }): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>('/api/auth/register', data);
    
    // Store only accessToken for newly registered users
    localStorage.setItem('accessToken', response.data.accessToken);
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Logout user
// Endpoint: POST /api/auth/logout
// Request: { refreshToken: string }
// Response: { message: string }
export const logout = async (): Promise<LogoutResponse> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      await api.post<LogoutResponse>('/api/auth/logout', { refreshToken });
    }
    
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    return { message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear tokens even if API call fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};

// Description: Get current user
// Endpoint: GET /api/auth/me
// Request: {}
// Response: { user: { id: string, email: string, name: string } }
export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  try {
    const response = await api.get<GetCurrentUserResponse>('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('Failed to load user:', error);
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || axiosError.message);
  }
};
