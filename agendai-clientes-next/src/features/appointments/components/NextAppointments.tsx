/**
 * Exibe os próximos agendamentos do usuário na home.
 * Dependências: useAuth, useAppointments.
 */
'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useAppointments } from '../../../hooks/Useappointments';
import { AppointmentCard } from './AppointmentCard';
import type { AppointmentWithDetails } from '../../../types/types';

export default function NextAppointments() {
  const router = useRouter();
  const { user } = useAuth();
  const { appointments, loading } = useAppointments({
    status: 'scheduled',
  });

  // Filtrar apenas agendamentos futuros
  const upcomingAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
      return aptDate >= new Date();
    })
    .slice(0, 2); // Mostrar apenas os próximos 2

  const handleAppointmentClick = (appointment: AppointmentWithDetails) => {
    router.push('/agendamentos');
  };

  if (!user) return null;

  

  if (upcomingAppointments.length === 0) {
    return null; // Não mostrar nada se não houver agendamentos
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
          <Calendar size={20} className="text-indigo-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Próximos Agendamentos</h2>
      </div>

      {/* Lista de Agendamentos */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {upcomingAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            statusLabel="Agendado"
            statusColor="bg-blue-500"
            isSelected={false}
            onClick={handleAppointmentClick}
          />
        ))}
      </div>
    </div>
  );
}
