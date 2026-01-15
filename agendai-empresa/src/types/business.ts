// Business Domain Types
export interface BusinessFormData {
  name: string;
  description?: string;
  business_type?: string;
  whatsapp_link?: string;
  instagram_link?: string;
  image_url?: string;
  cover_image_url?: string;
  images: string[];
}

export interface BusinessValidationError {
  field: string;
  message: string;
}

export interface BusinessFormState {
  data: BusinessFormData;
  isLoading: boolean;
  isSaving: boolean;
  errors: BusinessValidationError[];
  isDirty: boolean;
}
