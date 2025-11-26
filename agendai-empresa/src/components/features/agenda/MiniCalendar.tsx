'use client';

import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importa o idioma português
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Lógica Matemática do Calendário:
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // Pega o domingo anterior ao dia 1 (para preencher o grid)
  const startDate = startOfWeek(monthStart); 
  // Pega o sábado depois do último dia (para fechar o grid)
  const endDate = endOfWeek(monthEnd);       

  // Gera a lista de todos os dias que vão aparecer
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 w-full">
      
      {/* Cabeçalho (Mês e Botões) */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button 
          onClick={() => setCurrentDate(subMonths(currentDate, 1))} 
          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        
        <span className="text-white text-sm font-semibold capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </span>
        
        <button 
          onClick={() => setCurrentDate(addMonths(currentDate, 1))} 
          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dias da Semana (D S T Q Q S S) */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-zinc-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Grid dos Dias (Números) */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-1">
        {calendarDays.map((day) => {
          // Estilos condicionais
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date()); 

          return (
            <button
              key={day.toString()}
              className={`
                h-8 w-full flex items-center justify-center rounded-md text-sm transition-all
                
                ${!isCurrentMonth ? 'text-zinc-700' : 'text-zinc-300 hover:bg-zinc-800'}
                
                ${isToday ? 'bg-indigo-600 text-white hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/20' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}