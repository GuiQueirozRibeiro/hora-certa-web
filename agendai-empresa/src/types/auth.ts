export type UserType = 'client' | 'business' | 'professional';

export interface User {
  id: string;
  email: string;
  name?: string;
  user_type: UserType;
  created_at: string;
}

export interface AuthError {
  message: string;
}

// Business Types
export interface Business {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  business_type?: string;
  whatsapp_link?: string;
  image_url?: string;
  cover_image_url?: string;
  images?: string[];
  opening_hours?: any[]; // JSONB structure for opening hours
  is_active: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessData {
  name: string;
  description?: string;
  business_type?: string;
  whatsapp_link?: string;
  opening_hours?: any[];
}
