/**
 * Seletor de horário para reserva.
 */
'use client';

import React from 'react';
import type { TimeSelectorProps } from './types';

export const TimeSlotSelector: React.FC<TimeSelectorProps> = ({
  timeSlots,
  selectedTime,
  loading,
  onSelectTime,
}) => {
  if (loading) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Horários disponíveis</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Horários disponíveis</h3>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-500 text-sm">
            O profissional não trabalha neste dia. Selecione outra data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3">Horários disponíveis</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {timeSlots.map((horario) => (
          <button
            key={horario.hora}
            onClick={() => horario.disponivel && onSelectTime(horario.hora)}
            disabled={!horario.disponivel}
            className={`w-full flex items-center rounded-md transition-colors cursor-pointer ${
              selectedTime === horario.hora
                ? 'bg-indigo-500'
                : horario.disponivel
                ? 'bg-[#2a2a2a] hover:bg-[#333]'
                : 'bg-[#2a2a2a] cursor-not-allowed'
            }`}
          >
            <div
              className={`w-1 h-12 rounded-l-md ${
                horario.disponivel ? 'bg-green-500' : 'bg-transparent'
              }`}
            />
            <span
              className={`flex-1 text-sm font-medium pl-4 ${
                !horario.disponivel ? 'text-gray-600 line-through' : ''
              }`}
            >
              {horario.hora}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
