/**
 * Card de agendamento com status, serviço, profissional e data.
 * Dependência: useDateFormatter para formatação de data/hora.
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
  const profissional = appointment.professional_name;

  return (
    <div
      onClick={() => onClick(appointment)}
      className={`rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 cursor-pointer transition-all flex items-center justify-between gap-2 sm:gap-4 ${
        isSelected 
          ? 'bg-zinc-900 border-2 border-indigo-500' 
          : 'bg-zinc-900 border-2 border-transparent hover:border-[#2a2a2a]'
      }`}
    >
      {/* Lado esquerdo - Informações */}
      <div className="flex-1 min-w-0">
        {/* Badge de status */}
        <div className="mb-1 sm:mb-2">
          <span className={`${statusColor} text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded`}>
            {statusLabel}
          </span>
        </div>

        {/* Nome do serviço */}
        <h3 className="text-white font-semibold text-sm sm:text-base mb-0.5 sm:mb-1 truncate">
          {appointment.service_name || 'Serviço não informado'}
        </h3>
        
        {/* Nome do profissional */}
        <p className="text-gray-400 text-xs sm:text-sm truncate">
          {profissional}
        </p>
      </div>

      {/* Lado direito - Data e hora em quadrado cinza */}
      <div className="bg-zinc-600 rounded-lg px-3 sm:px-5 py-2 sm:py-4 text-center min-w-[70px] sm:min-w-[90px] shrink-0">
        <div className="text-zinc-800 text-[10px] sm:text-xs uppercase mb-0.5 sm:mb-1">{date.month}</div>
        <div className="text-zinc-200 text-2xl sm:text-3xl font-bold leading-none mb-1 sm:mb-2">{date.day}</div>
        <div className="text-zinc-200 text-xs sm:text-sm font-medium">
          {formatTime(appointment.appointment_time)}
        </div>
      </div>
    </div>
  );
}
