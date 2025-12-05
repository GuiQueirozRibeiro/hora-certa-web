'use client';

import { useAuth } from '../../../hooks/useAuth';
import { useAppointments } from '../../../hooks/Useappointments';

export default function NextAppointments() {
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

  if (!user) return null;

  if (loading) {
    return (
      <div className="bg-[#0000009a] border border-[#3a3a3a] rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Próximos Agendamentos</h2>
        </div>
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (upcomingAppointments.length === 0) {
    return null; // Não mostrar nada se não houver agendamentos
  }

  return (
    <div className="bg-[#0000009a] border border-[#3a3a3a] rounded-lg p-6 mb-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              stroke="#6366f1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Próximos Agendamentos</h2>
      </div>

      {/* Lista de Agendamentos */}
      <div className="space-y-3">
        {upcomingAppointments.map((appointment) => {
          const aptDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
          const isToday = new Date().toDateString() === aptDate.toDateString();

          return (
            <div
              key={appointment.id}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                {/* Informações do Agendamento */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {appointment.business?.name && (
                      <h3 className="font-semibold text-white">
                        {appointment.business.name}
                      </h3>
                    )}
                    {isToday && (
                      <span className="px-2 py-1 bg-indigo-500 text-white text-xs rounded-full font-semibold">
                        HOJE
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="text-gray-300">
                      <span className="text-gray-400">📅</span>{' '}
                      {aptDate.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                      })}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">🕐</span> {appointment.appointment_time}
                    </p>
                    {appointment.business?.address && (
                      <p className="text-gray-300">
                        <span className="text-gray-400">📍</span>{' '}
                        {appointment.business.address.street_address}, {appointment.business.address.number}
                      </p>
                    )}
                  </div>
                </div>

                {/* Valor */}
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-400">
                    R$ {appointment.total_price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {appointment.duration_minutes} min
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão Ver Todos */}
      <button className="w-full mt-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
        Ver todos os agendamentos →
      </button>
    </div>
  );
}
