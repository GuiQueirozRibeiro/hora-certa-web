export interface Appointment {
  id: string;
  client_id?: string;
  business_id: string;
  professional_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  total_price: number;
  status?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AppointmentWithDetails extends Appointment {
  professional_name?: string;
  client_name?: string;
  service_name?: string;
  service_price?: number;
}
