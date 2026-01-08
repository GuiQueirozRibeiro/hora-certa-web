import { useState, useEffect } from 'react';
import { supabase } from '../lib/SupabaseClient';

interface ProfessionalSchedule {
  id: string;
  professional_id: string;
  day_of_week: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

interface UseProfessionalSchedulesOptions {
  professionalId?: string;
  dayOfWeek?: number;
  isActive?: boolean;
}

export const useProfessionalSchedules = (options: UseProfessionalSchedulesOptions = {}) => {
  const [schedules, setSchedules] = useState<ProfessionalSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, [options.professionalId, options.dayOfWeek, options.isActive]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('professional_schedules')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      // Aplicar filtros opcionais
      if (options.professionalId) {
        query = query.eq('professional_id', options.professionalId);
      }

      if (options.dayOfWeek !== undefined) {
        query = query.eq('day_of_week', options.dayOfWeek);
      }

      if (options.isActive !== undefined) {
        query = query.eq('is_active', options.isActive);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setSchedules(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para obter os dias da semana que o profissional trabalha
  const getWorkingDays = (professionalId: string): number[] => {
    const professionalSchedules = schedules.filter(
      (s) => s.professional_id === professionalId && s.is_active
    );
    
    const uniqueDays = [...new Set(professionalSchedules.map((s) => s.day_of_week))];
    return uniqueDays.sort((a, b) => a - b);
  };

  // Função auxiliar para verificar se o profissional trabalha em um dia específico
  const isWorkingOnDay = (professionalId: string, dayOfWeek: number): boolean => {
    return schedules.some(
      (s) => s.professional_id === professionalId && 
            s.day_of_week === dayOfWeek && 
            s.is_active
    );
  };

  // Função auxiliar para obter os horários de trabalho de um profissional em um dia específico
  const getScheduleForDay = (professionalId: string, dayOfWeek: number): ProfessionalSchedule | null => {
    return schedules.find(
      (s) => s.professional_id === professionalId && 
            s.day_of_week === dayOfWeek && 
            s.is_active
    ) || null;
  };

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
    getWorkingDays,
    isWorkingOnDay,
    getScheduleForDay,
  };
};
