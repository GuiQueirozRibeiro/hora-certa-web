import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/SupabaseClient';
import { useAuth } from './useAuth';
import type { Appointment, AppointmentWithDetails } from '../types/types';

interface UseAppointmentsReturn {
  appointments: AppointmentWithDetails[];
  loading: boolean;
  error: string | null;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'client_id'>) => Promise<{ success: boolean; error: string | null; data?: Appointment }>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<{ success: boolean; error: string | null }>;
  cancelAppointment: (id: string) => Promise<{ success: boolean; error: string | null }>;
  deleteAppointment: (id: string) => Promise<{ success: boolean; error: string | null }>;
  refetch: () => Promise<void>;
}

export const useAppointments = (filters?: {
  status?: string;
  fromDate?: string;
  toDate?: string;
}): UseAppointmentsReturn => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('appointments')
        .select('*, professional:professionals (*, user:users (name)), service:services (*)')
        .eq('client_id', user.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });
        

      // Aplicar filtros
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.fromDate) {
        query = query.gte('appointment_date', filters.fromDate);
      }

      if (filters?.toDate) {
        query = query.lte('appointment_date', filters.toDate);
      }

      const { data: appointmentsData, error: appointmentsError } = await query;

      if (appointmentsError) {
        throw appointmentsError;
      }

      // Buscar detalhes dos estabelecimentos para cada agendamento
      if (appointmentsData && appointmentsData.length > 0) {
        const appointmentsWithDetails = await Promise.all(
          appointmentsData.map(async (appointment) => {
            // Extrair nome do profissional através da relação professional -> user -> name
            const professionalName = appointment.professional?.user?.name || appointment.professional?.name || 'Profissional não informado';
            const serviceName = appointment.service?.name || 'Serviço não informado';

            if (appointment.business_id) {
              // Buscar dados do estabelecimento
              const { data: businessData } = await supabase
                .from('businesses')
                .select('*')
                .eq('id', appointment.business_id)
                .single();

              // Buscar endereço do estabelecimento através da tabela addresses_businesses
              const { data: addressData } = await supabase
                .from('addresses_businesses')
                .select('*')
                .eq('business_id', appointment.business_id)
                .eq('is_primary', true)
                .maybeSingle();

              return {
                ...appointment,
                professional_name: professionalName,
                service_name: serviceName,
                business: businessData ? {
                  ...businessData,
                  address: addressData || undefined,
                } : undefined,
              };
            }

            return {
              ...appointment,
              professional_name: professionalName,
              service_name: serviceName,
            };
          })
        );

        setAppointments(appointmentsWithDetails);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar agendamentos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, filters?.status, filters?.fromDate, filters?.toDate]);

  useEffect(() => {
    // Só busca se: nunca buscou OU se o usuário mudou
    const userChanged = userIdRef.current !== user?.id;
    
    if (user && (!hasFetchedRef.current || userChanged)) {
      userIdRef.current = user.id;
      hasFetchedRef.current = true;
      fetchAppointments();
    } else if (!user) {
      hasFetchedRef.current = false;
      userIdRef.current = null;
    }
  }, [fetchAppointments, user]);

  const createAppointment = async (
    appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'client_id'>
  ): Promise<{ success: boolean; error: string | null; data?: Appointment }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            ...appointment,
            client_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchAppointments(); // Recarregar lista
      return { success: true, error: null, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar agendamento';
      return { success: false, error: errorMessage };
    }
  };

  const updateAppointment = async (
    id: string,
    updates: Partial<Appointment>
  ): Promise<{ success: boolean; error: string | null }> => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .eq('client_id', user?.id);

      if (error) {
        throw error;
      }

      await fetchAppointments(); // Recarregar lista
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar agendamento';
      return { success: false, error: errorMessage };
    }
  };

  const cancelAppointment = async (id: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .eq('client_id', user?.id);

      if (error) {
        throw error;
      }

      await fetchAppointments(); // Recarregar lista
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar agendamento';
      return { success: false, error: errorMessage };
    }
  };

  const deleteAppointment = async (id: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .eq('client_id', user?.id);

      if (error) {
        throw error;
      }

      await fetchAppointments(); // Recarregar lista
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir agendamento';
      return { success: false, error: errorMessage };
    }
  };

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    refetch: fetchAppointments,
  };
};