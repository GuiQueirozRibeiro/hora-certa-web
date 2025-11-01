import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments } from '../../hooks/Useappointments';
import type { AppointmentWithDetails } from '../../types/types';

const NextAppointments: React.FC = () => {
  const { user } = useAuth();
  const { appointments, loading } = useAppointments({});

  // Filtrar apenas agendamentos confirmados (scheduled e confirmed) futuros
  const upcomingAppointments = appointments
    .filter((apt) => apt.status === 'scheduled' || apt.status === 'confirmed')
    .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
    .slice(0, 1); // Pegar apenas o próximo

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return { day, month };
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  // Se não houver usuário logado, não mostrar nada
  if (!user) {
    return null;
  }

  // Se não houver agendamentos, não mostrar nada
  if (upcomingAppointments.length === 0) {
    return null;
  }

  const appointment = upcomingAppointments[0];
  const date = formatDate(appointment.appointment_date);
  const profissional = appointment.professional_name || 'Fulano Taldo';

  return (
    <div>
      <h2 className="text-white font-semibold text-xl mb-4">Agendamentos</h2>
      
      {/* Card de Agendamento */}
      <div className="rounded-lg p-4 bg-[#1a1a1a] border-2 border-indigo-500 flex items-center justify-between">
        {/* Lado esquerdo - Informações */}
        <div className="flex-1">
          {/* Badge de status */}
          <div className="mb-2">
            <span className="bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
              Confirmado
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
        <div className="bg-[#3a3a3a] rounded-lg px-5 py-4 text-center min-w-[90px]">
          <div className="text-gray-400 text-xs uppercase mb-1">{date.month}</div>
          <div className="text-white text-3xl font-bold leading-none mb-2">{date.day}</div>
          <div className="text-white text-sm font-medium">
            {formatTime(appointment.appointment_time)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextAppointments;