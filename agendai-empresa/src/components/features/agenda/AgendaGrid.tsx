'use client';

import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);

// Tipos
interface Professional {
  id: number;
  name: string;
  color: string;
}

interface Appointment {
  id: number;
  professionalId: number;
  professionalName: string;
  clientName: string;
  service: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface AgendaGridProps {
  selectedDate: Date;
  professionals: Professional[];
  appointments: Appointment[];
}

export function AgendaGrid({ selectedDate, professionals, appointments }: AgendaGridProps) {
  // Altura de cada hora em pixels (h-16 = 4rem = 64px)
  const HOUR_HEIGHT = 64;
  
  // Calcula a posição do agendamento no grid
  const getAppointmentStyle = (startTime: string) => {
    const [hour, minute] = startTime.split(':').map(Number);
    const startHour = 8; // Horário inicial do grid
    const topPosition = ((hour - startHour) * HOUR_HEIGHT) + ((minute / 60) * HOUR_HEIGHT);
    return { top: `${topPosition}px` };
  };

  // Calcula a altura do agendamento
  const getAppointmentHeight = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    return (durationMinutes / 60) * HOUR_HEIGHT;
  };

  return (
    <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 p-4 overflow-hidden flex flex-col">
      {/* Cabeçalho com data selecionada */}
      <div className="mb-4 pb-3 border-b border-zinc-800 shrink-0">
        <h2 className="text-lg font-semibold text-zinc-100 capitalize">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </h2>
        <p className="text-sm text-zinc-400">
          {appointments.length} {appointments.length === 1 ? 'agendamento' : 'agendamentos'}
        </p>
      </div>

      {/* Container com scroll */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="relative min-h-full">
          {/* Legenda dos profissionais - fixas no topo */}
          <div className="sticky top-0 bg-zinc-900 z-10 pb-3 mb-2 border-b border-zinc-800">
            <div className="flex items-center gap-4 pl-16">
              {professionals.map((prof) => (
                <div 
                  key={prof.id} 
                  className="flex items-center gap-2"
                >
                  <div className={`w-1 h-4 rounded-full ${prof.color}`} />
                  <span className="text-xs font-medium text-zinc-300">{prof.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de horários */}
          <div className="relative">
            {HOURS.map((hour, index) => (
              <div key={hour} className="flex h-16 border-b border-zinc-800/50">
                {/* Coluna da Hora */}
                <div className={`w-16 text-xs font-medium text-zinc-500 text-right pr-4 shrink-0 ${index === 0 ? 'pt-0' : '-mt-2.5'}`}>
                  {hour.toString().padStart(2, '0')}:00
                </div>
                
                {/* Área do grid */}
                <div className="flex-1 relative">
                  {/* Linha tracejada da meia hora */}
                  <div className="absolute top-8 left-0 right-0 border-t border-zinc-800/30 border-dashed" />
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 hover:bg-white/5 transition-colors cursor-pointer rounded-sm" />
                </div>
              </div>
            ))}

            {/* Agendamentos lado a lado */}
            <div className="absolute top-0 left-16 right-0 bottom-0 pointer-events-none">
              {appointments.map((appointment) => {
                const height = getAppointmentHeight(appointment.startTime, appointment.endTime);
                const topPosition = getAppointmentStyle(appointment.startTime).top;
                
                // Ordena todos os agendamentos por horário e ID
                const sortedAppointments = [...appointments].sort((a, b) => 
                  a.startTime.localeCompare(b.startTime) || a.id - b.id
                );
                
                // Encontra o índice deste agendamento na lista ordenada
                const globalIndex = sortedAppointments.findIndex(apt => apt.id === appointment.id);

                return (
                  <div
                    key={appointment.id}
                    className="absolute pointer-events-auto cursor-pointer group"
                    style={{
                      top: topPosition,
                      left: `${(globalIndex % 8) * 120}px`, // 8 colunas, rotaciona depois
                      width: '115px',
                      height: `${height}px`,
                      minHeight: '24px',
                    }}
                  >
                    <div className="flex items-center h-full gap-2 px-2">
                      <div 
                        className={`w-1 h-full rounded-full shrink-0 ${appointment.color}`}
                      />
                      <span className="text-xs text-zinc-300 group-hover:text-white transition-colors truncate font-medium">
                        {appointment.clientName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}