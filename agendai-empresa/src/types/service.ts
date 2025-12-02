// Service Domain Types
export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category?: string;
  is_active: boolean;
}

export interface CreateServiceData {
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category?: string;
  is_active?: boolean;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {}

export interface ServiceValidationError {
  field: string;
  message: string;
}

export interface ServiceFormState {
  data: ServiceFormData;
  isLoading: boolean;
  isSaving: boolean;
  errors: ServiceValidationError[];
  isDirty: boolean;
}
