// Professional Domain Types

export interface WorkingHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface Professional {
  id: string;
  user_id: string;
  business_id: string;
  specialties?: string[];
  bio?: string;
  experience_years?: number;
  is_active: boolean;
  average_rating: number;
  total_reviews: number;
  working_hours?: WorkingHours;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalFormData {
  name: string;
  email: string;
  password: string;
  specialties?: string[];
  bio?: string;
  experience_years?: number;
  working_hours?: WorkingHours;
}

export interface CreateProfessionalData {
  name: string;
  email: string;
  password: string;
  business_id: string;
  specialties?: string[];
  bio?: string;
  experience_years?: number;
  working_hours?: WorkingHours;
}

export interface UpdateProfessionalData {
  name?: string;
  specialties?: string[];
  bio?: string;
  experience_years?: number;
  is_active?: boolean;
  working_hours?: WorkingHours;
}

export interface ProfessionalValidationError {
  field: string;
  message: string;
}

export interface ProfessionalFormState {
  data: ProfessionalFormData;
  isLoading: boolean;
  isSaving: boolean;
  errors: ProfessionalValidationError[];
  isDirty: boolean;
}

// Extended type with user data for display
export interface ProfessionalWithUser extends Professional {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}