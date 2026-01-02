'use client';

import React, { useMemo, useState } from 'react';

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export type ViewMode = 'day' | 'week' | 'month';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  color?: string;
}

interface ContinuousCalendarProps {
  events?: CalendarEvent[];
  onDayClick?: (day: number, month: number, year: number) => void;
}

export const ContinuousCalendar: React.FC<ContinuousCalendarProps> = ({ 
  events = [],
  onDayClick
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const monthOptions = monthNames.map((month, index) => ({ name: month, value: `${index}` }));

  // Agrupa eventos por data
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(event => {
      const key = `${event.date.getFullYear()}-${event.date.getMonth()}-${event.date.getDate()}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(event);
    });
    return map;
  }, [events]);

  // Navegação
  const handlePrev = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'day') {
        newDate.setDate(newDate.getDate() - 1);
      } else if (viewMode === 'week') {
        newDate.setDate(newDate.getDate() - 7);
      } else if (viewMode === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setFullYear(newDate.getFullYear() - 1);
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'day') {
        newDate.setDate(newDate.getDate() + 1);
      } else if (viewMode === 'week') {
        newDate.setDate(newDate.getDate() + 7);
      } else if (viewMode === 'month') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(monthIndex);
      return newDate;
    });
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    if (!onDayClick) return;
    onDayClick(day, month, year);
  };

  // Gera título baseado na visualização
  const getTitle = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    if (viewMode === 'day') {
      return `${day} de ${monthNames[month]} de ${year}`;
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(day - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${monthNames[month]} de ${year}`;
      } else {
        return `${startOfWeek.getDate()} ${monthNames[startOfWeek.getMonth()].slice(0, 3)} - ${endOfWeek.getDate()} ${monthNames[endOfWeek.getMonth()].slice(0, 3)} ${year}`;
      }
    } else if (viewMode === 'month') {
      return `${monthNames[month]} de ${year}`;
    }
    return `${year}`;
  };

  // Gera dias para a visualização do mês
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];
    
    // Dias do mês anterior
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, month: prevMonth, year: prevYear, isCurrentMonth: false });
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month, year, isCurrentMonth: true });
    }
    
    // Dias do próximo mês
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const remaining = 42 - days.length; // 6 semanas
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: nextMonth, year: nextYear, isCurrentMonth: false });
    }
    
    return days;
  };

  // Gera dias para a visualização da semana
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days: { day: number; month: number; year: number; date: Date }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        date
      });
    }
    return days;
  };

  // Horários para visualização de dia/semana (0h - 23h)
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0:00 - 23:00

  // Renderiza visualização do DIA
  const renderDayView = () => {
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const dateKey = `${year}-${month}-${day}`;
    const dayEvents = eventsByDate.get(dateKey) || [];

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[60px_1fr] gap-0">
          {hours.map(hour => {
            const hourEvents = dayEvents.filter(e => {
              const eventHour = e.time ? parseInt(e.time.split(':')[0]) : 0;
              return eventHour === hour;
            });
            
            return (
              <React.Fragment key={hour}>
                <div className="text-[11px] text-zinc-500 text-right pr-2 py-3 border-b border-zinc-700/50">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div 
                  className="border-b border-l border-zinc-700/50 py-2 px-2 min-h-12 hover:bg-zinc-700/30 cursor-pointer transition-colors"
                  onClick={() => handleDayClick(day, month, year)}
                >
                  {hourEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`rounded px-2 py-1 text-xs text-white mb-1 ${event.color || 'bg-indigo-600'}`}
                    >
                      {event.time && <span className="font-medium">{event.time} - </span>}
                      {event.title}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderiza visualização da SEMANA
  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
    return (
      <div className="flex-1 overflow-y-auto">
        {/* Header com dias da semana */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] sticky top-0 bg-zinc-800 z-10">
          <div className="border-b border-zinc-700"></div>
          {weekDays.map((d, idx) => {
            const isToday = d.day === today.getDate() && d.month === today.getMonth() && d.year === today.getFullYear();
            return (
              <div key={idx} className="text-center py-2 border-b border-l border-zinc-700">
                <div className="text-[10px] text-zinc-500 uppercase">{daysOfWeek[idx]}</div>
                <div className={`text-sm font-medium ${isToday ? 'bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' : 'text-zinc-300'}`}>
                  {d.day}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Grid de horários */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="text-[10px] text-zinc-500 text-right pr-2 py-2 border-b border-zinc-700/50">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {weekDays.map((d, idx) => {
                const dateKey = `${d.year}-${d.month}-${d.day}`;
                const dayEvents = eventsByDate.get(dateKey) || [];
                const hourEvents = dayEvents.filter(e => {
                  const eventHour = e.time ? parseInt(e.time.split(':')[0]) : 0;
                  return eventHour === hour;
                });
                
                return (
                  <div 
                    key={idx}
                    className="border-b border-l border-zinc-700/50 p-0.5 min-h-10 hover:bg-zinc-700/30 cursor-pointer transition-colors"
                    onClick={() => handleDayClick(d.day, d.month, d.year)}
                  >
                    {hourEvents.map(event => (
                      <div 
                        key={event.id}
                        className={`rounded px-1 py-0.5 text-[9px] text-white truncate ${event.color || 'bg-indigo-600'}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Renderiza visualização do MÊS
  const renderMonthView = () => {
    const days = getMonthDays();
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="flex-1 flex flex-col">
        {/* Header dias da semana */}
        <div className="grid grid-cols-7 border-b border-zinc-700">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="text-center py-1.5 text-[11px] font-medium text-zinc-400">
              {day}
            </div>
          ))}
        </div>
        
        {/* Semanas */}
        <div className="flex-1 grid grid-rows-6">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 border-b border-zinc-700/50">
              {week.map((d, dayIdx) => {
                const isToday = d.day === today.getDate() && d.month === today.getMonth() && d.year === today.getFullYear();
                const dateKey = `${d.year}-${d.month}-${d.day}`;
                const dayEvents = eventsByDate.get(dateKey) || [];
                
                return (
                  <div 
                    key={dayIdx}
                    className={`relative p-1 border-l border-zinc-700/50 first:border-l-0 min-h-[70px] cursor-pointer hover:bg-zinc-700/30 transition-colors ${!d.isCurrentMonth ? 'bg-zinc-800/50' : ''}`}
                    onClick={() => handleDayClick(d.day, d.month, d.year)}
                  >
                    <span className={`text-[11px] ${isToday ? 'bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center' : d.isCurrentMonth ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {d.day}
                    </span>
                    
                    {/* Eventos */}
                    <div className="mt-0.5 space-y-0.5">
                      {dayEvents.slice(0, 2).map(event => (
                        <div 
                          key={event.id}
                          className={`rounded px-1 py-0.5 text-[9px] text-white truncate ${event.color || 'bg-indigo-600'}`}
                          title={event.title}
                        >
                          {event.time && `${event.time} `}{event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-zinc-500">+{dayEvents.length - 2} mais</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-zinc-800 text-zinc-100 shadow-xl border border-zinc-700 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-3 pt-3 pb-2 border-b border-zinc-700">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Controles de visualização */}
          <div className="flex items-center gap-1 bg-zinc-700/50 rounded-lg p-0.5">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === mode 
                    ? 'bg-indigo-500 text-white' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-600/50'
                }`}
              >
                {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>

          {/* Navegação */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="rounded-full border border-zinc-600 p-1 transition-colors hover:bg-zinc-700"
            >
              <svg className="size-4 text-zinc-300" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
              </svg>
            </button>
            <h2 className="text-sm font-semibold text-zinc-100 min-w-[180px] text-center">
              {getTitle()}
            </h2>
            <button
              onClick={handleNext}
              className="rounded-full border border-zinc-600 p-1 transition-colors hover:bg-zinc-700"
            >
              <svg className="size-4 text-zinc-300" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
              </svg>
            </button>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleToday} 
              className="rounded-lg border border-zinc-600 bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-100 hover:bg-zinc-600 transition-colors"
            >
              Hoje
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </div>
    </div>
  );
};

export default ContinuousCalendar;
