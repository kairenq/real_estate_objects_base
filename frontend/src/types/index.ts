export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface RealEstateObject {
  id: number;
  title: string;
  description?: string;
  property_type: string;
  address: string;
  city: string;
  price: number;
  area?: number;
  rooms?: number;
  floor?: number;
  total_floors?: number;
  year_built?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  owner_id?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface CreateRealEstateRequest {
  title: string;
  description?: string;
  property_type: string;
  address: string;
  city: string;
  price: number;
  area?: number;
  rooms?: number;
  floor?: number;
  total_floors?: number;
  year_built?: number;
}

export interface UpdateRealEstateRequest {
  title?: string;
  description?: string;
  property_type?: string;
  address?: string;
  city?: string;
  price?: number;
  area?: number;
  rooms?: number;
  floor?: number;
  total_floors?: number;
  year_built?: number;
  is_active?: boolean;
}
