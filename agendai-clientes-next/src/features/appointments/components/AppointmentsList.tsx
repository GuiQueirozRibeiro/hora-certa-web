/**
 * Lista de agendamentos por categoria com suporte a estado vazio.
 */
import React from 'react';
import type { AppointmentWithDetails } from '../../../types/types';
import { AppointmentCard } from './AppointmentCard';

interface AppointmentsListProps {
  title: string;
  appointments: AppointmentWithDetails[];
  statusLabel: string;
  statusColor: string;
  selectedAppointmentId: string | null;
  onSelectAppointment: (appointment: AppointmentWithDetails) => void;
  emptyMessage?: string;
}

export function AppointmentsList({
  title,
  appointments,
  statusLabel,
  statusColor,
  selectedAppointmentId,
  onSelectAppointment,
  emptyMessage = 'Nenhum agendamento',
}: AppointmentsListProps) {
  return (
    <div className="mb-6">
      <h2 className="text-white font-semibold text-base mb-3">{title}</h2>
      
      {appointments.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
          <p className="text-gray-400 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div>
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              statusLabel={statusLabel}
              statusColor={statusColor}
              isSelected={selectedAppointmentId === appointment.id}
              onClick={onSelectAppointment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
