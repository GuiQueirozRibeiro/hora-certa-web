/**
 * Detalhes do serviço agendado (nome, data, horário, preço).
 * Dependência: useDateFormatter para formatação.
 */
import React from 'react';
import type { AppointmentWithDetails } from '../../../types/types';
import { useDateFormatter } from '../hooks/useDateFormatter';

interface ServiceDetailsProps {
  appointment: AppointmentWithDetails;
}

export function ServiceDetails({ appointment }: ServiceDetailsProps) {
  const { formatDate, formatTime } = useDateFormatter();
  const date = formatDate(appointment.appointment_date);

  return (
    <div className="bg-[#0d0d0d] rounded-lg p-5 border border-[#2a2a2a] mb-6">
      <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
        Confirmado
      </h3>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-white font-semibold text-base mb-2">
            {appointment.service_name || 'Corte de Cabelo'}
          </h4>
          
          <div className="text-gray-400 text-xs space-y-1">
            <p>
              Data: {date.day} de {date.month}
            </p>
            <p>Horário: {formatTime(appointment.appointment_time)}</p>
            <p>Barbearia: {appointment.business?.name || 'Não informado'}</p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
          <span className="text-gray-400 text-sm">Total</span>
          <span className="text-white font-bold text-lg">
            R${Number(appointment.total_price || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
