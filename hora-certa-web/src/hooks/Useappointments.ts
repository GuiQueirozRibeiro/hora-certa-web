import { useState, useEffect } from 'react';
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

  const fetchAppointments = async () => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useAppointments] Buscando agendamentos...');
      setLoading(true);
      setError(null);

      let query = supabase
        .from('appointments')
        .select('*')
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

      console.log(`✅ [useAppointments] ${appointmentsData?.length || 0} agendamentos encontrados`);

      // Buscar detalhes dos estabelecimentos para cada agendamento
      if (appointmentsData && appointmentsData.length > 0) {
        const appointmentsWithDetails = await Promise.all(
          appointmentsData.map(async (appointment) => {
            if (appointment.business_id) {
              // Buscar dados do estabelecimento
              const { data: businessData } = await supabase
                .from('businesses')
                .select('*')
                .eq('id', appointment.business_id)
                .single();

              if (businessData && businessData.owner_id) {
                // Buscar endereço do estabelecimento
                const { data: addressData } = await supabase
                  .from('addresses')
                  .select('*')
                  .eq('user_id', businessData.owner_id)
                  .eq('is_primary', true)
                  .single();

                return {
                  ...appointment,
                  business: {
                    ...businessData,
                    address: addressData || undefined,
                  },
                };
              }

              return {
                ...appointment,
                business: businessData || undefined,
              };
            }

            return appointment;
          })
        );

        setAppointments(appointmentsWithDetails);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar agendamentos';
      console.error('❌ [useAppointments] Erro:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user, filters?.status, filters?.fromDate, filters?.toDate]);

  const createAppointment = async (
    appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'client_id'>
  ): Promise<{ success: boolean; error: string | null; data?: Appointment }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      console.log('📝 [useAppointments] Criando agendamento...', appointment);

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

      console.log('✅ [useAppointments] Agendamento criado com sucesso!', data);
      await fetchAppointments(); // Recarregar lista
      return { success: true, error: null, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar agendamento';
      console.error('❌ [useAppointments] Erro ao criar:', err);
      return { success: false, error: errorMessage };
    }
  };

  const updateAppointment = async (
    id: string,
    updates: Partial<Appointment>
  ): Promise<{ success: boolean; error: string | null }> => {
    try {
      console.log('✏️ [useAppointments] Atualizando agendamento:', id, updates);

      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .eq('client_id', user?.id);

      if (error) {
        throw error;
      }

      console.log('✅ [useAppointments] Agendamento atualizado!');
      await fetchAppointments(); // Recarregar lista
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar agendamento';
      console.error('❌ [useAppointments] Erro ao atualizar:', err);
      return { success: false, error: errorMessage };
    }
  };

  const cancelAppointment = async (id: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      console.log('❌ [useAppointments] Cancelando agendamento:', id);

      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .eq('client_id', user?.id);

      if (error) {
        throw error;
      }

      console.log('✅ [useAppointments] Agendamento cancelado!');
      await fetchAppointments(); // Recarregar lista
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar agendamento';
      console.error('❌ [useAppointments] Erro ao cancelar:', err);
      return { success: false, error: errorMessage };
    }
  };

  const deleteAppointment = async (id: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      console.log('🗑️ [useAppointments] Excluindo agendamento:', id);

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .eq('client_id', user?.id);

      if (error) {
        throw error;
      }

      console.log('✅ [useAppointments] Agendamento excluído!');
      await fetchAppointments(); // Recarregar lista
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir agendamento';
      console.error('❌ [useAppointments] Erro ao excluir:', err);
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