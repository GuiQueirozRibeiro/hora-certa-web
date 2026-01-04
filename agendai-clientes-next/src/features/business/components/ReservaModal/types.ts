/**
 * Tipos do módulo ReservaModal.
 */
import type { Service } from '../../../../types/types';
import type { Professional } from '../../../../hooks/useProfessionals';

export interface TimeSlot {
  hora: string;
  disponivel: boolean;
}

export interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  barbeariaId: string;
  onReservationSuccess: () => void;
}

export interface ProfessionalSelectorProps {
  professionals: Professional[];
  selectedProfessionalId: string | null;
  loading: boolean;
  schedules: { professional_id: string; day_of_week: number; is_active: boolean }[];
  onSelect: (id: string) => void;
}

export interface DateSelectorProps {
  weekDays: Date[];
  selectedDate: Date | null;
  currentMonth: string;
  selectedProfessionalId: string | null;
  hasProfessionals: boolean;
  isDateAvailable: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
}

export interface TimeSelectorProps {
  timeSlots: TimeSlot[];
  selectedTime: string | null;
  loading: boolean;
  onSelectTime: (time: string) => void;
}

export interface ReservationSummaryProps {
  serviceName: string;
  servicePrice: number;
  professionalName: string | null;
  selectedDate: Date | null;
  selectedTime: string | null;
}
