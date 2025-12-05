export type OpeningHours = {
  [key: string]: {
    open: string;
    close: string;
    isClosed?: boolean;
  };
};

export type Business = {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  business_type: string | null;
  phone: string | null;
  whatsapp_link: string | null;
  logo_url: string | null;
  image_url: string | null;
  cover_image_url: string | null;
  opening_hours: OpeningHours | null;
  is_active: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
};

export type Address = {
  id: string;
  user_id: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  street_address: string | null;
  number: string | null;
  complement: string | null;
  zipcode: string | null;
  is_primary: boolean;
  created_at: string;
};

export type BusinessWithAddress = Business & {
  address?: Address;
};

export type Appointment = {
  id: string;
  client_id: string | null;
  business_id: string | null;
  professional_id: string | null;
  service_id: string | null;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  total_price: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AppointmentWithDetails = Appointment & {
  business?: Business & { address?: Address };
  service_name?: string;
  professional_name?: string;
};

export type Service = {
  id: string;
  business_id: string | null;
  name: string;
  description: string | null;
  duration_minutes: number;
  duration: number; // Alias para duration_minutes
  price: number;
  category: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Professional = {
  id: string;
  business_id: string | null;
  name: string;
  bio: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Favorite = {
  id: string;
  user_id: string | null;
  business_id: string | null;
  created_at: string;
};