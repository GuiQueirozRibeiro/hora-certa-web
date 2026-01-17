/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/client';
import type { Appointment, AppointmentWithDetails } from '@/types/appointment';

export const appointmentService = {
  /**
   * Busca agendamentos por data específica com detalhes do cliente e profissional
   */
  async getAppointmentsByDate(
    businessId: string,
    date: string
  ): Promise<AppointmentWithDetails[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        professionals!inner(id, name),
        services(name, price),
        client:users!appointments_client_id_fkey(id, name)
      `)
      .eq('business_id', businessId)
      .eq('appointment_date', date)
      .order('appointment_time', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar agendamentos: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      ...item,
      professional_name: item.professionals?.name,
      // Prioriza: 1) nome do user (app), 2) client_name manual, 3) fallback
      client_name: item.client?.name || item.client_name || 'Cliente',
      service_name: item.services?.name,
      service_price: item.services?.price,
    }));
  },

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
        services!inner(name, price),
        client:users!appointments_client_id_fkey(id, name)
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
      // Prioriza: 1) nome do user (app), 2) client_name manual, 3) fallback
      client_name: item.client?.name || item.client_name || 'Cliente',
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
        services!inner(name, price),
        client:users!appointments_client_id_fkey(id, name)
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
      // Prioriza: 1) nome do user (app), 2) client_name manual, 3) fallback
      client_name: item.client?.name || item.client_name || 'Cliente',
      service_name: item.services?.name,
      service_price: item.total_price || item.services?.price,
    }));
  },

  /**
   * Busca agendamentos por período de datas
   */
  async getAppointmentsByDateRange(
    businessId: string,
    startDate: string,
    endDate: string
  ): Promise<AppointmentWithDetails[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        professionals!inner(id, name),
        services(name, price),
        client:users!appointments_client_id_fkey(id, name)
      `)
      .eq('business_id', businessId)
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar agendamentos: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      ...item,
      professional_name: item.professionals?.name,
      // Prioriza: 1) nome do user (app), 2) client_name manual, 3) fallback
      client_name: item.client?.name || item.client_name || 'Cliente',
      service_name: item.services?.name,
      service_price: item.services?.price,
    }));
  },

  /**
   * Cria um novo agendamento
   */
  async createAppointment(
    appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'> & { client_name?: string }
  ): Promise<Appointment> {
    const supabase = createClient();

    // Envia tudo, incluindo client_name
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar agendamento: ${error.message}`);
    }

    return data;
  },

  /**
   * Atualiza um agendamento existente
   */
  async updateAppointment(
    appointmentId: string,
    updates: Partial<Appointment>
  ): Promise<Appointment> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar agendamento: ${error.message}`);
    }

    return data;
  },

  /**
   * Deleta um agendamento
   */
  async deleteAppointment(appointmentId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (error) {
      throw new Error(`Erro ao deletar agendamento: ${error.message}`);
    }
  },
};