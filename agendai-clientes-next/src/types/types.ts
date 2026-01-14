export type DaySchedule = {
  dia: string;
  ativo: boolean;
  diaAbreviado: string;
  intervaloFim: string;
  horarioAbertura: string;
  intervaloInicio: string;
  horarioFechamento: string;
};

export type OpeningHours = DaySchedule[];

export type Business = {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  business_type: string | null;
  phone: string | null;
  whatsapp_link: string | null;
  image_url: string | null; // Logo do estabelecimento
  images: string[] | null; // Array de imagens para o carrossel
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
  lat: number | null;
  long: number | null;
};

export type BusinessWithAddressAndDistance = BusinessWithAddress & {
  distance?: number; // distância em km
};

/**
 * Calcula a distância entre dois pontos usando a fórmula de Haversine
 * @param lat1 Latitude do ponto 1
 * @param lon1 Longitude do ponto 1
 * @param lat2 Latitude do ponto 2
 * @param lon2 Longitude do ponto 2
 * @returns Distância em quilômetros
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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

export type WorkingHoursDay = {
  day: string;
  start: string;
  end: string;
  enabled: boolean;
};

export type WorkingHours = WorkingHoursDay[];

export type Professional = {
  id: string;
  business_id: string | null;
  name: string;
  bio: string | null;
  image_url: string | null;
  is_active: boolean;
  working_hours?: WorkingHours | null;
  created_at: string;
  updated_at: string;
};

export type Favorite = {
  id: string;
  user_id: string | null;
  business_id: string | null;
  created_at: string;
};