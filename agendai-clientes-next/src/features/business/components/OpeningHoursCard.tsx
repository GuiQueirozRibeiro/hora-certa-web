'use client';

import React from 'react';
import type { ParsedSchedule } from '../types';

interface OpeningHoursCardProps {
  schedules: ParsedSchedule[];
  isCurrentlyOpen: boolean;
}

/**
 * Card de horário de atendimento com status aberto/fechado.
 * Destaca o dia atual na lista de horários.
 */
export const OpeningHoursCard: React.FC<OpeningHoursCardProps> = ({ schedules, isCurrentlyOpen }) => {
  if (schedules.length === 0) {
    return null;
  }

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Horário de atendimento</h3>
        {isCurrentlyOpen ? (
          <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Aberto
          </span>
        ) : (
          <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Fechado
          </span>
        )}
      </div>

      <div className="space-y-3">
        {schedules.map((schedule, index) => (
          <div
            key={index}
            className={`flex items-center justify-between ${
              schedule.isToday ? 'bg-zinc-800 -mx-2 px-2 py-2 rounded-lg' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-sm ${schedule.isToday ? 'text-white font-semibold' : 'text-zinc-400'}`}>
                {schedule.day}
              </span>
              {schedule.isToday && (
                <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-0.5 rounded mr-1.5">
                  Hoje
                </span>
              )}
            </div>
            <span
              className={`text-sm ${
                schedule.isToday ? 'text-white font-semibold' : schedule.isOpen ? 'text-zinc-400' : 'text-red-400'
              }`}
            >
              {schedule.hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
