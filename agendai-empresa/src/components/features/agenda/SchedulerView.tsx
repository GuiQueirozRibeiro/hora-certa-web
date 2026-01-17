/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Plus, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { appointmentService } from '@/services/appointmentService';
import { professionalService } from '@/services/professionalService';
import { AppointmentModal } from './AppointmetsModal';
import type { AppointmentWithDetails } from '@/types/appointment';

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
  clientName: string; // ← ADICIONADO
  serviceName: string;
  time: string;
  color: { bg: string; border: string };
  hour: number;
  status?: string;
}

export function SchedulerView() {
  const { business } = useAuth();
  const { toasts, removeToast, info, success, warning } = useToast();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  // Estado para controlar visualização mobile (expandir filtros)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Estado para controlar o modal de criar agendamento
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  
  const knownAppointmentIds = useRef<Set<string>>(new Set());
  const knownAppointmentStatus = useRef<Map<string, string>>(new Map());

  // Função para carregar dados
  const loadData = useCallback(async () => {
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
      
      apptData.forEach(apt => {
        knownAppointmentIds.current.add(apt.id);
        knownAppointmentStatus.current.set(apt.id, apt.status || '');
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [business?.id]);

  // Carregar dados na inicialização
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Polling para verificar novos agendamentos
  useEffect(() => {
    if (!business?.id) return;

    const checkNewAppointments = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
        const apptData = await appointmentService.getAppointmentsByDateRange(business.id, startDate, endDate);

        // Verificar novos agendamentos
        const newAppointments = apptData.filter(apt => !knownAppointmentIds.current.has(apt.id));
        if (newAppointments.length > 0) {
          info('Novo agendamento!', `${newAppointments.length} novo(s) agendamento(s) adicionado(s).`);
          newAppointments.forEach(apt => {
            knownAppointmentIds.current.add(apt.id);
            knownAppointmentStatus.current.set(apt.id, apt.status || '');
          });
        }

        // Verificar mudanças de status
        apptData.forEach(apt => {
          const previousStatus = knownAppointmentStatus.current.get(apt.id);
          if (previousStatus && previousStatus !== apt.status) {
            if (apt.status === 'completed') {
              success('Agendamento concluído!', 'Um agendamento foi marcado como concluído.');
            } else if (apt.status === 'cancelled') {
              warning('Agendamento cancelado', 'Um agendamento foi cancelado.');
            }
            knownAppointmentStatus.current.set(apt.id, apt.status || '');
          }
        });

        setAppointments(apptData);
      } catch (error) {
        console.error('Erro ao verificar agendamentos:', error);
      }
    };

    const interval = setInterval(checkNewAppointments, 10000); // A cada 10 segundos
    return () => clearInterval(interval);
  }, [business?.id, info, success, warning]);

  // Callback para quando um novo agendamento for criado
  const handleAppointmentCreated = useCallback(() => {
    // Recarrega os dados
    loadData();
  }, [loadData]);

  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, month: prevMonth, year: prevYear, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month, year, isCurrentMonth: true });
    }
    
    const remaining = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: nextMonth, year: nextYear, isCurrentMonth: false });
    }
    
    return days;
  }, [calendarDate]);

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
          clientName: apt.client_name || 'Cliente', // ← ADICIONADO
          serviceName: apt.service_name || 'Serviço',
          time: apt.appointment_time.slice(0, 5),
          color: prof?.color || PROFESSIONAL_COLORS[0],
          hour,
          status: apt.status,
        };
      })
      .sort((a, b) => a.hour - b.hour);
  }, [appointments, professionals, selectedDate]);

  const todayProfessionals = useMemo(() => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const appointmentsToday = appointments.filter(apt => apt.appointment_date === dateStr);
    const profIds = new Set(appointmentsToday.map(apt => apt.professional_id));
    return professionals.filter(p => profIds.has(p.id));
  }, [appointments, professionals, selectedDate]);

  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  const handlePrevMonth = () => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const handleDayClick = (day: number, month: number, year: number) => {
    setSelectedDate(new Date(year, month, day));
    // No mobile, fecha os filtros ao selecionar data
    setIsMobileFiltersOpen(false);
  };
  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };
  const isSelected = (day: number, month: number, year: number) => {
    return day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };
  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Formata a data selecionada para passar ao modal
  const formattedSelectedDate = selectedDate 
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} position="top-right" />
      
      {/* Container Principal: Flex Column no Mobile, Row no Desktop */}
      <div className="flex flex-col lg:flex-row min-h-full gap-4 p-2 md:p-4 overflow-y-auto no-scrollbar">
        
        {/* === Mobile Toggle para Calendário/Filtros === */}
        <button 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="lg:hidden w-full flex items-center justify-between bg-zinc-800 p-4 rounded-xl border border-zinc-700 text-white mb-2"
        >
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} className="text-indigo-400" />
            <span className="font-medium">
              {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
            </span>
          </div>
          <ChevronRight size={20} className={`transition-transform ${isMobileFiltersOpen ? 'rotate-90' : ''}`} />
        </button>

        {/* === Coluna Esquerda / Painel Superior Mobile === */}
        <div className={`
          w-full lg:w-64 shrink-0 flex flex-col gap-4
          ${isMobileFiltersOpen ? 'block' : 'hidden lg:flex'}
        `}>
          
          {/* Mini Calendário */}
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 lg:border-none">
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} className="p-1 text-zinc-400 hover:text-white">
                <ChevronLeft size={16} />
              </button>
              <span className="text-white text-sm font-medium">{monthNames[calendarDate.getMonth()]}</span>
              <button onClick={handleNextMonth} className="p-1 text-zinc-400 hover:text-white">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-[10px] text-zinc-500 py-1">{day}</div>
              ))}
            </div>
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

          {/* Lista de Profissionais */}
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 lg:border-none">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-zinc-400" />
              <h3 className="text-white text-sm font-medium">Atendendo hoje</h3>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
              {todayProfessionals.length > 0 ? (
                todayProfessionals.map((prof) => (
                  <div key={prof.id} className={`flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50 border-l-4 ${prof.color.border}`}>
                    <div className={`w-8 h-8 rounded-full ${prof.color.bg} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-[10px] font-bold">{getInitials(prof.name)}</span>
                    </div>
                    <span className="text-white text-xs md:text-sm truncate">{prof.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-xs text-center py-2">Nenhum profissional agendado</p>
              )}
            </div>
          </div>
        </div>

        {/* === Coluna Direita / Agenda Principal === */}
        <div className="flex-1 bg-zinc-900/30 rounded-xl overflow-hidden flex flex-col border border-zinc-800/50">
          <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-white text-base md:text-lg font-semibold">
                  {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
                </h2>
                <p className="text-zinc-400 text-xs md:text-sm">
                  {weekDays[selectedDate.getDay()]}
                  {selectedDate.toDateString() === new Date().toDateString() && <span className="ml-2 text-sky-400">• Hoje</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/30">
                  {todayEvents.length} agendamentos
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {hours.map(hour => {
              const hourEvents = todayEvents.filter(e => e.hour === hour);
              return (
                <div key={hour} className="flex border-b border-zinc-800/50 min-h-20">
                  <div className="w-14 md:w-16 shrink-0 py-4 pr-2 md:pr-3 text-right border-r border-zinc-800/30 bg-zinc-900/20">
                    <span className="text-zinc-500 text-xs md:text-sm">{hour.toString().padStart(2, '0')}:00</span>
                  </div>
                  
                  {/* Área de eventos com scroll horizontal se necessário no mobile */}
                  <div className="flex-1 p-1 md:p-2 bg-zinc-800/10 flex gap-2 overflow-x-auto no-scrollbar">
                    {hourEvents.length > 0 ? (
                      hourEvents.map(event => {
                        const isCompleted = event.status === 'completed';
                        const isCancelled = event.status === 'cancelled';
                        const profBorderColor = event.color.border;
                        
                        const cardClasses = isCancelled
                          ? 'bg-zinc-700/40 opacity-60 border-2 border-dashed border-red-500/30'
                          : isCompleted
                            ? 'bg-zinc-700/60 opacity-75 border-l-4 border-green-500'
                            : `bg-zinc-800 border-l-4 ${profBorderColor}`;
                        
                        return (
                          <div 
                            key={event.id}
                            className={`${cardClasses} rounded-md md:rounded-lg p-2 min-w-[120px] md:min-w-[160px] relative transition-all hover:brightness-110`}
                          >
                             {/* Status badges */}
                             {isCompleted && <span className="block text-[8px] text-green-400 mb-1">✓ Concluído</span>}
                             {isCancelled && <span className="block text-[8px] text-red-400 mb-1">✕ Cancelado</span>}
                             
                             {/* Nome do Profissional */}
                             <p className={`text-[10px] md:text-xs font-bold truncate ${isCancelled ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                               {event.professionalName}
                             </p>
                             
                             {/* Nome do Cliente - ADICIONADO */}
                             <div className="flex items-center gap-1 mt-1">
                               <User className="h-2.5 w-2.5 md:h-3 md:w-3 text-zinc-500 shrink-0" />
                               <p className={`text-[9px] md:text-[10px] truncate ${isCancelled ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                 {event.clientName}
                               </p>
                             </div>
                             
                             {/* Nome do Serviço */}
                             <p className={`text-[9px] md:text-[10px] truncate mt-1 ${isCancelled ? 'text-zinc-600' : 'text-zinc-400'}`}>
                               {event.serviceName}
                             </p>
                             
                             {/* Horário */}
                             <p className="text-[9px] text-zinc-500 mt-1">{event.time}</p>
                          </div>
                        );
                      })
                    ) : (
                      // Espaço vazio clicável (futuro: adicionar agendamento)
                      <div className="w-full h-full"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botão Flutuante para Criar Agendamento */}
      {business && (
        <button
          onClick={() => setIsAppointmentModalOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2 z-40 group"
          title="Criar novo agendamento"
        >
          <Plus className="h-6 w-6" />
          <span className="hidden group-hover:inline-block text-sm font-medium pr-2 animate-in fade-in slide-in-from-left duration-200">
            Novo Agendamento
          </span>
        </button>
      )}

      {/* Modal de Criação de Agendamento */}
      {business && (
        <AppointmentModal
          businessId={business.id}
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          onSuccess={handleAppointmentCreated}
          initialDate={formattedSelectedDate}
        />
      )}
    </>
  );
}

export default SchedulerView;