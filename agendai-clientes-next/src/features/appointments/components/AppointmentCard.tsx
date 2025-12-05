/**
 * Componente AppointmentCard
 * Single Responsibility: Renderizar card de agendamento
 * Open/Closed: Extensível via props
 */
'use client';

import React from 'react';
import type { AppointmentWithDetails } from '../../../types/types';
import { useDateFormatter } from '../hooks/useDateFormatter';

interface AppointmentCardProps {
  appointment: AppointmentWithDetails;
  statusLabel: string;
  statusColor: string;
  isSelected: boolean;
  onClick: (appointment: AppointmentWithDetails) => void;
}

export function AppointmentCard({
  appointment,
  statusLabel,
  statusColor,
  isSelected,
  onClick,
}: AppointmentCardProps) {
  const { formatDate, formatTime } = useDateFormatter();
  const date = formatDate(appointment.appointment_date);
  const profissional = appointment.professional_name || 'Fulano Taldo';

  return (
    <div
      onClick={() => onClick(appointment)}
      className={`rounded-lg p-4 mb-3 cursor-pointer transition-all flex items-center justify-between ${
        isSelected 
          ? 'bg-zinc-900 border-2 border-indigo-500' 
          : 'bg-zinc-900 border-2 border-transparent hover:border-[#2a2a2a]'
      }`}
    >
      {/* Lado esquerdo - Informações */}
      <div className="flex-1">
        {/* Badge de status */}
        <div className="mb-2">
          <span className={`${statusColor} text-white text-xs font-semibold px-2.5 py-1 rounded`}>
            {statusLabel}
          </span>
        </div>

        {/* Nome do serviço */}
        <h3 className="text-white font-semibold text-base mb-1">
          {appointment.service_name || 'Corte de cabelo'}
        </h3>
        
        {/* Nome do profissional */}
        <p className="text-gray-400 text-sm">
          {profissional}
        </p>
      </div>

      {/* Lado direito - Data e hora em quadrado cinza */}
      <div className="bg-zinc-600 rounded-lg px-5 py-4 text-center min-w-[90px]">
        <div className="text-zinc-800 text-xs uppercase mb-1">{date.month}</div>
        <div className="text-zinc-200 text-3xl font-bold leading-none mb-2">{date.day}</div>
        <div className="text-zinc-200 text-sm font-medium">
          {formatTime(appointment.appointment_time)}
        </div>
      </div>
    </div>
  );
};
