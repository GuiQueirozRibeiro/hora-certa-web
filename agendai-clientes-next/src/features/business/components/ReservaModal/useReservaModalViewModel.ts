/**
 * ViewModel do ReservaModal. Gerencia estados, lógica de negócio e validações.
 * Dependências: useAuth, useAppointments, useProfessionals, useProfessionalSchedules.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useAppointments } from '../../../../hooks/Useappointments';
import { useProfessionals } from '../../../../hooks/useProfessionals';
import { useProfessionalSchedules } from '../../../../hooks/useProfessionalSchedules';
import type { Service } from '../../../../types/types';
import type { TimeSlot } from './types';

interface UseReservaModalViewModelProps {
  service: Service | null;
  barbeariaId: string;
  onReservationSuccess: () => void;
  onClose: () => void;
}

export function useReservaModalViewModel({
  service,
  barbeariaId,
  onReservationSuccess,
  onClose,
}: UseReservaModalViewModelProps) {
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const { professionals, loading: loadingProfessionals } = useProfessionals(barbeariaId);
  
  // Estados
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  
  // Semana atual (começa no domingo)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    const weekStart = new Date(today);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  });

  // Buscar horários do profissional selecionado
  const { schedules, loading: loadingSchedules } = useProfessionalSchedules({
    professionalId: selectedProfessionalId || undefined,
    isActive: true,
  });

  // Gerar slots de horário quando profissional ou data mudarem
  useEffect(() => {
    if (!selectedProfessionalId || !selectedDate) {
      setAvailableTimeSlots([]);
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    const schedule = schedules.find(
      (s) => s.professional_id === selectedProfessionalId && s.day_of_week === dayOfWeek && s.is_active
    );

    if (!schedule && schedules.length > 0) {
      setAvailableTimeSlots([]);
      setError('O profissional não trabalha neste dia');
      return;
    }

    const startTime = schedule ? schedule.start_time : '09:00:00';
    const endTime = schedule ? schedule.end_time : '18:00:00';

    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = startTime.substring(0, 5).split(':').map(Number);
    const [endHour, endMinute] = endTime.substring(0, 5).split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push({ hora: timeString, disponivel: true });

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }
    }

    setAvailableTimeSlots(slots);
    setError(null);
  }, [selectedProfessionalId, selectedDate, schedules]);

  // Gerar dias da semana
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      return day;
    });
  }, [currentWeekStart]);

  // Nome do mês formatado
  const currentMonth = useMemo(() => {
    const monthNames = [
      'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
      'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
    ];
    return monthNames[currentWeekStart.getMonth()];
  }, [currentWeekStart]);

  // Verificar se data está disponível
  const isDateAvailable = useCallback(
    (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (date < today) return false;
      if (!selectedProfessionalId) return true;
      if (loadingSchedules) return true;
      if (schedules.length === 0) return true;

      const schedule = schedules.find(
        (s) => s.professional_id === selectedProfessionalId && s.day_of_week === date.getDay() && s.is_active
      );
      return schedule !== undefined;
    },
    [selectedProfessionalId, loadingSchedules, schedules]
  );

  // Formatar data para exibição
  const formatDate = useCallback((date: Date | null) => {
    if (!date) return '--/--';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }, []);

  // Navegar entre semanas
  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    const offset = direction === 'prev' ? -7 : 7;
    setCurrentWeekStart((prev) => {
      const newWeekStart = new Date(prev);
      newWeekStart.setDate(prev.getDate() + offset);
      return newWeekStart;
    });
    setSelectedDate(null);
    setSelectedTime(null);
  }, []);

  // Selecionar profissional
  const selectProfessional = useCallback((id: string) => {
    setSelectedProfessionalId(id);
    setSelectedDate(null);
    setSelectedTime(null);
    setError(null);
  }, []);

  // Selecionar data
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setError(null);
  }, []);

  // Selecionar horário
  const selectTime = useCallback((time: string) => {
    setSelectedTime(time);
    setError(null);
  }, []);

  // Nome do profissional selecionado
  const selectedProfessionalName = useMemo(() => {
    if (!selectedProfessionalId) return null;
    const professional = professionals.find((p) => p.id === selectedProfessionalId);
    return professional?.user_name || null;
  }, [selectedProfessionalId, professionals]);

  // Confirmar reserva
  const handleConfirm = useCallback(async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Por favor, selecione uma data e horário');
      return;
    }

    if (!selectedProfessionalId && professionals.length > 0) {
      setError('Por favor, selecione um profissional');
      return;
    }

    if (!service) return;

    setLoading(true);
    setError(null);

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];

      const result = await createAppointment({
        business_id: barbeariaId,
        professional_id: selectedProfessionalId,
        service_id: service.id,
        appointment_date: dateStr,
        appointment_time: selectedTime,
        duration_minutes: service.duration_minutes,
        total_price: service.price,
        status: 'scheduled',
        notes: `Serviço: ${service.name}`,
      });

      if (result.success) {
        onReservationSuccess();
        onClose();
      } else {
        setError(result.error || 'Erro ao criar agendamento');
      }
    } catch {
      setError('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [
    user,
    selectedDate,
    selectedTime,
    selectedProfessionalId,
    professionals.length,
    service,
    barbeariaId,
    createAppointment,
    onReservationSuccess,
    onClose,
  ]);

  // Fechar modal de login
  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  return {
    // Estados
    user,
    professionals,
    loadingProfessionals,
    schedules,
    loadingSchedules,
    selectedProfessionalId,
    selectedDate,
    selectedTime,
    loading,
    error,
    availableTimeSlots,
    weekDays,
    currentMonth,
    showLoginModal,
    selectedProfessionalName,
    
    // Ações
    selectProfessional,
    selectDate,
    selectTime,
    navigateWeek,
    isDateAvailable,
    formatDate,
    handleConfirm,
    closeLoginModal,
  };
}
