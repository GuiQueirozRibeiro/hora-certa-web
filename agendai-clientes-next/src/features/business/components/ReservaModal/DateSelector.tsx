/**
 * Seletor de data (calendário semanal) para reserva.
 */
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DateSelectorProps } from './types';

export const DateSelector: React.FC<DateSelectorProps> = ({
  weekDays,
  selectedDate,
  currentMonth,
  selectedProfessionalId,
  hasProfessionals,
  isDateAvailable,
  onSelectDate,
  onNavigateWeek,
}) => {
  const isDateSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3">Selecione a Data</h3>

      {!selectedProfessionalId && hasProfessionals && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
          <p className="text-blue-400 text-sm">
            Selecione um profissional primeiro para ver os dias disponíveis
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => onNavigateWeek('prev')}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-semibold text-sm">{currentMonth}</span>
        <button
          onClick={() => onNavigateWeek('next')}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-2">
        <span>D</span>
        <span>S</span>
        <span>T</span>
        <span>Q</span>
        <span>Q</span>
        <span>S</span>
        <span>S</span>
      </div>

      {/* Dias da semana atual */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {weekDays.map((date, index) => {
          const available = isDateAvailable(date);
          const selected = isDateSelected(date);
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <button
              key={index}
              onClick={() => available && onSelectDate(date)}
              disabled={!available}
              className={`py-2 rounded-full transition-colors relative cursor-pointer ${
                selected
                  ? 'bg-indigo-500 text-white font-semibold'
                  : available
                  ? 'hover:bg-gray-700 text-white'
                  : isPast
                  ? 'text-gray-700 cursor-not-allowed line-through'
                  : 'text-gray-600 cursor-not-allowed opacity-40'
              }`}
              title={
                !available && !isPast && selectedProfessionalId
                  ? 'Profissional não trabalha neste dia'
                  : ''
              }
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
