'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { appointmentService } from '@/services/appointmentService';
import { professionalService } from '@/services/professionalService';
import type { AppointmentWithDetails } from '@/types/appointment';

// Cores para os profissionais (cores vibrantes como no Figma)
const PROFESSIONAL_COLORS = [
  { bg: 'bg-emerald-500', border: 'border-l-emerald-500' },
  { bg: 'bg-yellow-400', border: 'border-l-yellow-400' },
  { bg: 'bg-cyan-400', border: 'border-l-cyan-400' },
  { bg: 'bg-pink-500', border: 'border-l-pink-500' },
  { bg: 'bg-green-600', border: 'border-l-green-600' },
  { bg: 'bg-purple-500', border: 'border-l-purple-500' },
  { bg: 'bg-orange-500', border: 'border-l-orange-500' },
  { bg: 'bg-rose-500', border: 'border-l-rose-500' },
];

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

interface Professional {
  id: string;
  name: string;
  color: { bg: string; border: string };
  avatar?: string;
}

interface ScheduleEvent {
  id: string;
  professionalName: string;
  serviceName: string;
  time: string;
  color: { bg: string; border: string };
  hour: number;
}

export function SchedulerView() {
  const { business } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Busca dados iniciais
  useEffect(() => {
    async function loadData() {
      if (!business?.id) return;
      
      setLoading(true);
      try {
        const profData = await professionalService.getProfessionalsByBusinessId(business.id);
        const mappedProfs = profData.map((prof, index) => ({
          id: prof.id,
          name: prof.user?.name || (prof as any).name || prof.specialties?.[0] || 'Profissional',
          color: PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length],
        }));
        setProfessionals(mappedProfs);

        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
        const apptData = await appointmentService.getAppointmentsByDateRange(business.id, startDate, endDate);
        setAppointments(apptData);
        
        // Debug: log para verificar os dados
        console.log('Profissionais carregados:', mappedProfs);
        console.log('Agendamentos carregados:', apptData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [business?.id]);

  // Gera dias do calendário
  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
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
    const remaining = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: nextMonth, year: nextYear, isCurrentMonth: false });
    }
    
    return days;
  }, [calendarDate]);

  // Eventos do dia selecionado
  const todayEvents: ScheduleEvent[] = useMemo(() => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    
    return appointments
      .filter(apt => apt.appointment_date === dateStr)
      .map(apt => {
        const prof = professionals.find(p => p.id === apt.professional_id);
        const hour = parseInt(apt.appointment_time.split(':')[0]);
        return {
          id: apt.id,
          professionalName: prof?.name || 'Profissional',
          serviceName: apt.service_name || 'Serviço',
          time: apt.appointment_time.slice(0, 5),
          color: prof?.color || PROFESSIONAL_COLORS[0],
          hour,
        };
      })
      .sort((a, b) => a.hour - b.hour);
  }, [appointments, professionals, selectedDate]);

  // Profissionais que atendem hoje
  const todayProfessionals = useMemo(() => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    
    // Pega os IDs dos profissionais que têm agendamentos no dia selecionado
    const appointmentsToday = appointments.filter(apt => apt.appointment_date === dateStr);
    const profIds = new Set(appointmentsToday.map(apt => apt.professional_id));
    
    const result = professionals.filter(p => profIds.has(p.id));
    
    // Debug
    console.log('Data selecionada:', dateStr);
    console.log('Agendamentos do dia:', appointmentsToday);
    console.log('IDs dos profissionais com agendamento:', Array.from(profIds));
    console.log('IDs dos profissionais carregados:', professionals.map(p => p.id));
    console.log('Profissionais atendendo hoje:', result);
    
    return result;
  }, [appointments, professionals, selectedDate]);

  // Horários do dia (8h às 20h)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  const handlePrevMonth = () => {
    setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day: number, month: number, year: number) => {
    return day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };

  // Função para obter iniciais
  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full gap-4 p-4 overflow-y-auto no-scrollbar">
      {/* Coluna Esquerda - Mini Calendário + Profissionais */}
      <div className="w-64 shrink-0 flex flex-col gap-4">
        {/* Mini Calendário */}
        <div className="bg-zinc-900/50 rounded-xl p-4">
          {/* Header do calendário */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handlePrevMonth}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-white text-sm font-medium">
              {monthNames[calendarDate.getMonth()]}
            </span>
            <button 
              onClick={handleNextMonth}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[10px] text-zinc-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Grid dos dias */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, idx) => (
              <button
                key={idx}
                onClick={() => handleDayClick(d.day, d.month, d.year)}
                className={`
                  h-7 w-7 flex items-center justify-center text-xs rounded-full transition-all
                  ${!d.isCurrentMonth ? 'text-zinc-600' : 'text-zinc-200 hover:bg-zinc-800'}
                  ${isToday(d.day, d.month, d.year) && !isSelected(d.day, d.month, d.year) ? 'bg-sky-500 text-white font-medium' : ''}
                  ${isSelected(d.day, d.month, d.year) ? 'bg-indigo-600 text-white font-medium ring-2 ring-indigo-400' : ''}
                `}
              >
                {d.day}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Profissionais Atendendo Hoje */}
        <div className="bg-zinc-900/50 rounded-xl p-4">
          <h3 className="text-white text-sm font-medium mb-4">Atendendo hoje</h3>
          <div className="space-y-2">
            {todayProfessionals.length > 0 ? (
              todayProfessionals.map((prof) => (
                <div 
                  key={prof.id}
                  className={`flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50 border-l-4 ${prof.color.border}`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full ${prof.color.bg} flex items-center justify-center`}>
                    <span className="text-white text-xs font-medium">{getInitials(prof.name)}</span>
                  </div>
                  <span className="text-white text-sm">{prof.name}</span>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-sm text-center py-4">
                Nenhum profissional com agendamento neste dia
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Coluna Direita - Grade de Horários */}
      <div className=" pl-22 flex-1 bg-zinc-900/30 rounded-xl overflow-hidden flex flex-col">
        {/* Header com data selecionada */}
        <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-lg font-semibold">
                {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]} de {selectedDate.getFullYear()}
              </h2>
              <p className="text-zinc-400 text-sm">
                {weekDays[selectedDate.getDay()].charAt(0) + weekDays[selectedDate.getDay()].slice(1).toLowerCase()}
                {selectedDate.toDateString() === new Date().toDateString() && (
                  <span className="ml-2 text-sky-400 font-medium">• Hoje</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {todayEvents.length > 0 ? (
                <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium border border-indigo-500/30">
                  {todayEvents.length} {todayEvents.length === 1 ? 'agendamento' : 'agendamentos'}
                </span>
              ) : (
                <span className="bg-zinc-800 text-zinc-500 px-3 py-1 rounded-full text-sm">
                  Nenhum agendamento
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Grid de Agendamentos */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {hours.map(hour => {
            const hourEvents = todayEvents.filter(e => e.hour === hour);
            
            return (
              <div key={hour} className="flex border-b border-zinc-800/50">
                {/* Coluna de hora */}
                <div className="w-16 shrink-0 py-4 pr-3 text-right">
                  <span className="text-zinc-500 text-sm">{hour.toString().padStart(2, '0')}:00</span>
                </div>
                
                {/* Área de eventos */}
                <div className="flex-1 py-2 px-2 min-h-14 bg-zinc-800/20 flex gap-2">
                  {hourEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`${event.color.bg} rounded-lg px-3 py-2 min-w-[120px]`}
                    >
                      <p className="text-white text-xs font-medium">{event.professionalName}</p>
                      <p className="text-white/70 text-[10px]">{event.serviceName}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SchedulerView;
