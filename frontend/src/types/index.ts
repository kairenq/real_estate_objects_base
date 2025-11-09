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
  images?: string[];
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
  images?: string[];
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
  images?: string[];
  is_active?: boolean;
}

// Бронирования
export interface Booking {
  id: number;
  user_id: number;
  real_estate_id: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  message?: string;
  created_at: string;
  updated_at: string;
  user_username?: string;
  real_estate_title?: string;
}

export interface CreateBookingRequest {
  real_estate_id: number;
  start_date: string;
  end_date: string;
  message?: string;
}

export interface UpdateBookingRequest {
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  start_date?: string;
  end_date?: string;
}

// Избранное
export interface Favorite {
  id: number;
  user_id: number;
  real_estate_id: number;
  created_at: string;
  real_estate_title?: string;
  real_estate_price?: number;
  real_estate_city?: string;
}

export interface CreateFavoriteRequest {
  real_estate_id: number;
}

// Сообщения и диалоги
export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_username?: string;
}

export interface CreateMessageRequest {
  conversation_id: number;
  content: string;
}

export interface Conversation {
  id: number;
  real_estate_id: number;
  buyer_id: number;
  seller_id: number;
  created_at: string;
  updated_at: string;
  buyer_username?: string;
  seller_username?: string;
  real_estate_title?: string;
  last_message?: string;
  unread_count?: number;
}

export interface CreateConversationRequest {
  real_estate_id: number;
}
