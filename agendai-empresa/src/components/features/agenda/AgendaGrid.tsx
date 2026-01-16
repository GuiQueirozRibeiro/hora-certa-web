'use client';

import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);

interface Professional {
  id: string;
  name: string;
  color: string;
}

interface Appointment {
  id: string;
  professionalId: string;
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
  loading?: boolean;
}

export function AgendaGrid({ selectedDate, professionals, appointments, loading }: AgendaGridProps) {
  const HOUR_HEIGHT = 64;
  
  const getAppointmentStyle = (startTime: string) => {
    const [hour, minute] = startTime.split(':').map(Number);
    const startHour = 8;
    const topPosition = ((hour - startHour) * HOUR_HEIGHT) + ((minute / 60) * HOUR_HEIGHT);
    return { top: `${topPosition}px` };
  };

  const getAppointmentHeight = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    return (durationMinutes / 60) * HOUR_HEIGHT;
  };

  return (
    <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 p-3 md:p-4 overflow-hidden flex flex-col">
      <div className="mb-4 pb-3 border-b border-zinc-800 shrink-0">
        <h2 className="text-base md:text-lg font-semibold text-zinc-100 capitalize">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </h2>
        <p className="text-xs md:text-sm text-zinc-400">
          {appointments.length} {appointments.length === 1 ? 'agendamento' : 'agendamentos'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
        <div className="relative min-h-full min-w-[600px] md:min-w-full">
          <div className="sticky top-0 bg-zinc-900 z-10 pb-3 mb-2 border-b border-zinc-800">
            <div className="flex items-center gap-4 pl-14 md:pl-16 overflow-x-auto no-scrollbar">
              {professionals.map((prof) => (
                <div key={prof.id} className="flex items-center gap-2 shrink-0">
                  <div className={`w-1 h-3 md:h-4 rounded-full ${prof.color}`} />
                  <span className="text-xs font-medium text-zinc-300">{prof.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {HOURS.map((hour, index) => (
              <div key={hour} className="flex h-16 border-b border-zinc-800/50">
                <div className={`w-14 md:w-16 text-xs font-medium text-zinc-500 text-right pr-3 md:pr-4 shrink-0 ${index === 0 ? 'pt-0' : '-mt-2.5'}`}>
                  {hour.toString().padStart(2, '0')}:00
                </div>
                
                <div className="flex-1 relative">
                  <div className="absolute top-8 left-0 right-0 border-t border-zinc-800/30 border-dashed" />
                  <div className="absolute inset-0 hover:bg-white/5 transition-colors cursor-pointer rounded-sm" />
                </div>
              </div>
            ))}

            <div className="absolute top-0 left-14 md:left-16 right-0 bottom-0 pointer-events-none">
              {appointments.map((appointment) => {
                const height = getAppointmentHeight(appointment.startTime, appointment.endTime);
                const topPosition = getAppointmentStyle(appointment.startTime).top;
                
                const sortedAppointments = [...appointments].sort((a, b) => 
                  a.startTime.localeCompare(b.startTime) || a.id.localeCompare(b.id)
                );
                const globalIndex = sortedAppointments.findIndex(apt => apt.id === appointment.id);
                const colWidth = 100;
                
                return (
                  <div
                    key={appointment.id}
                    className="absolute pointer-events-auto cursor-pointer group hover:z-20"
                    style={{
                      top: topPosition,
                      left: `${(globalIndex % 5) * (colWidth + 5)}px`,
                      width: `${colWidth}px`,
                      height: `${height}px`,
                      minHeight: '28px',
                    }}
                  >
                    <div className={`w-full h-full rounded-md border-l-4 ${appointment.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-20 ')} bg-zinc-800/90 hover:bg-zinc-700 transition-colors shadow-sm overflow-hidden p-1`}>
                      <div className="text-[10px] md:text-xs font-semibold text-zinc-200 truncate">
                        {appointment.clientName}
                      </div>
                      <div className="text-[9px] text-zinc-400 truncate hidden md:block">
                        {appointment.service}
                      </div>
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