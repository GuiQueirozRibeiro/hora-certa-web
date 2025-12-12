import { createClient } from '@/lib/supabase/client';
import type { Appointment, AppointmentWithDetails } from '@/types/appointment';

export const appointmentService = {
  /**
   * Busca agendamentos com detalhes de profissional e serviço
   */
  async getAppointmentsWithDetails(
    businessId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AppointmentWithDetails[]> {
    const supabase = createClient();

    let query = supabase
      .from('appointments')
      .select(`
        *,
        professionals!inner(name),
        services!inner(name, price)
      `)
      .eq('business_id', businessId);

    if (startDate) {
      query = query.gte('appointment_date', startDate);
    }

    if (endDate) {
      query = query.lte('appointment_date', endDate);
    }

    const { data, error } = await query.order('appointment_date', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar agendamentos: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      ...item,
      professional_name: item.professionals?.name,
      service_name: item.services?.name,
      service_price: item.services?.price,
    }));
  },

  /**
   * Busca agendamentos completados de uma empresa
   */
  async getCompletedAppointments(
    businessId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AppointmentWithDetails[]> {
    const supabase = createClient();

    let query = supabase
      .from('appointments')
      .select(`
        *,
        professionals!inner(name),
        services!inner(name, price)
      `)
      .eq('business_id', businessId)
      .in('status', ['completed', 'confirmed']);

    if (startDate) {
      query = query.gte('appointment_date', startDate);
    }

    if (endDate) {
      query = query.lte('appointment_date', endDate);
    }

    const { data, error } = await query.order('appointment_date', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar agendamentos completados: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      ...item,
      professional_name: item.professionals?.name,
      service_name: item.services?.name,
      service_price: item.total_price || item.services?.price,
    }));
  },
};
