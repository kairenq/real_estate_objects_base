import axios from 'axios';
import type {
  User,
  RealEstateObject,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  CreateRealEstateRequest,
  UpdateRealEstateRequest,
} from '../types';

// Получаем API URL из переменной окружения или используем localhost по умолчанию
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_URL,
});

// Добавляем interceptor для автоматической отправки токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await api.post<AuthResponse>('/auth/login', formData);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users/');
    return response.data;
  },

  getUser: async (userId: number): Promise<User> => {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
};

// Real Estate API
export const realEstateAPI = {
  getAll: async (params?: {
    city?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
  }): Promise<RealEstateObject[]> => {
    const response = await api.get<RealEstateObject[]>('/real-estate/', { params });
    return response.data;
  },

  getById: async (id: number): Promise<RealEstateObject> => {
    const response = await api.get<RealEstateObject>(`/real-estate/${id}`);
    return response.data;
  },

  create: async (data: CreateRealEstateRequest): Promise<RealEstateObject> => {
    const response = await api.post<RealEstateObject>('/real-estate/', data);
    return response.data;
  },

  update: async (id: number, data: UpdateRealEstateRequest): Promise<RealEstateObject> => {
    const response = await api.put<RealEstateObject>(`/real-estate/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/real-estate/${id}`);
  },

  getMyObjects: async (): Promise<RealEstateObject[]> => {
    const response = await api.get<RealEstateObject[]>('/real-estate/my/objects');
    return response.data;
  },
};

export default api;
