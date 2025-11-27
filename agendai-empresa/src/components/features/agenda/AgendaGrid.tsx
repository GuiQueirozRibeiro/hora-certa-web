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
          {/* Colunas dos profissionais - fixas no topo */}
          <div className="sticky top-0 bg-zinc-900 z-10 pb-2 mb-2">
            <div className="flex">
              <div className="w-16" /> {/* Espaço para horários */}
              {professionals.map((prof) => (
                <div 
                  key={prof.id} 
                  className="flex-1 text-center px-2"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${prof.color}`} />
                    <span className="text-xs font-medium text-zinc-300 truncate">{prof.name}</span>
                  </div>
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
                
                {/* Colunas para cada profissional */}
                {professionals.map((prof, index) => (
                  <div 
                    key={prof.id} 
                    className={`flex-1 relative group border-r border-zinc-800/30 ${
                      index === professionals.length - 1 ? 'border-r-0' : ''
                    }`}
                  >
                    {/* Linha tracejada da meia hora */}
                    <div className="absolute top-8 left-0 right-0 border-t border-zinc-800/30 border-dashed" />
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 hover:bg-white/5 transition-colors cursor-pointer rounded-sm" />
                  </div>
                ))}
              </div>
            ))}

            {/* Agendamentos (posicionados absolutamente) */}
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
              <div className="absolute top-0 left-16 right-0 bottom-0">
                {professionals.map((prof, profIndex) => {
                  const profAppointments = appointments.filter(apt => apt.professionalId === prof.id);
                  const totalProfessionals = professionals.length;

                  return (
                    <div
                      key={prof.id}
                      className="absolute top-0 bottom-0"
                      style={{
                        left: `${(100 / totalProfessionals) * profIndex}%`,
                        width: `${100 / totalProfessionals}%`,
                      }}
                    >
                      {profAppointments.map((appointment) => {
                        const height = getAppointmentHeight(appointment.startTime, appointment.endTime);
                        const style = getAppointmentStyle(appointment.startTime);

                        return (
                          <div
                            key={appointment.id}
                            className="absolute pointer-events-auto cursor-pointer group"
                            style={{
                              ...style,
                              left: '8px',
                              right: '8px',
                              height: `${height}px`,
                              minHeight: '24px',
                            }}
                          >
                            <div className="flex items-center h-full gap-2">
                              <div 
                                className={`w-1 h-full rounded-full ${appointment.color}`}
                              />
                              <span className="text-xs text-zinc-300 group-hover:text-white transition-colors truncate font-medium">
                                {appointment.clientName}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}