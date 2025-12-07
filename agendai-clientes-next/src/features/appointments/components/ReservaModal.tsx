import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useAppointments } from '../../../hooks/Useappointments';
import { useProfessionals } from '../../../hooks/useProfessionals';
import { useProfessionalSchedules } from '../../../hooks/useProfessionalSchedules';
import LoginModal from '../../auth/components/LoginModal';
import type { Service } from '../../../types/types';

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  barbeariaId: string;
  onReservationSuccess: () => void;
}

const ReservaModal: React.FC<ReservaModalProps> = ({ 
  isOpen, 
  onClose, 
  service,
  barbeariaId,
  onReservationSuccess 
}) => {
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const { professionals, loading: loadingProfessionals } = useProfessionals(barbeariaId);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  
  // Buscar horários do profissional selecionado
  const { schedules, loading: loadingSchedules } = useProfessionalSchedules({
    professionalId: selectedProfessionalId || undefined,
    isActive: true
  });
  
  // Inicializa com o domingo da semana atual
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    const weekStart = new Date(today);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ hora: string; disponivel: boolean }[]>([]);

  // Atualizar horários disponíveis quando profissional ou data mudarem
  useEffect(() => {
    if (!selectedProfessionalId || !selectedDate) {
      setAvailableTimeSlots([]);
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    
    // Buscar schedule do profissional para o dia
    const schedule = schedules.find(s => 
      s.professional_id === selectedProfessionalId && 
      s.day_of_week === dayOfWeek && 
      s.is_active
    );

    // Se não há schedule para este dia específico E há schedules cadastrados para o profissional
    if (!schedule && schedules.length > 0) {
      setAvailableTimeSlots([]);
      setError('O profissional não trabalha neste dia');
      return;
    }

    // Definir horário padrão se não houver schedule cadastrado
    const startTime = schedule ? schedule.start_time : '09:00:00';
    const endTime = schedule ? schedule.end_time : '18:00:00';

    // Gerar slots de horário
    const slots: { hora: string; disponivel: boolean }[] = [];
    const [startHour, startMinute] = startTime.substring(0, 5).split(':').map(Number);
    const [endHour, endMinute] = endTime.substring(0, 5).split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push({ hora: timeString, disponivel: true });
      
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }
    }

    setAvailableTimeSlots(slots);
    setError(null);
  }, [selectedProfessionalId, selectedDate, schedules]);

  // Helper: Gerar 7 dias da semana
  const getWeekDays = (weekStart: Date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
    });
  };

  // Helper: Verificar se data é disponível
  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return false;
    
    // Se não há profissional selecionado, permitir qualquer data futura
    if (!selectedProfessionalId) return true;
    
    // Se está carregando os horários, permitir seleção (será validado depois)
    if (loadingSchedules) return true;
    
    // Se não há schedules cadastrados, permitir todos os dias (profissional sem horário definido)
    if (schedules.length === 0) return true;
    
    // Verificar se o profissional trabalha neste dia
    const schedule = schedules.find(s => 
      s.professional_id === selectedProfessionalId && 
      s.day_of_week === date.getDay() && 
      s.is_active
    );
    return schedule !== undefined;
  };

  // Helper: Verificar se data está selecionada
  const isDateSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  // Helper: Formatar data para exibição
  const formatDate = (date: Date | null) => {
    if (!date) return '--/--';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  // Helper: Navegar entre semanas
  const navigateWeek = (direction: 'prev' | 'next') => {
    const offset = direction === 'prev' ? -7 : 7;
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + offset);
    setCurrentWeekStart(newWeekStart);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  if (!isOpen || !service) return null;

  const weekDays = getWeekDays(currentWeekStart);
  const monthNames = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const formattedMonth = monthNames[currentWeekStart.getMonth()];

  const handleConfirm = async () => {
    // Verificar login
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Por favor, selecione uma data e horário');
      return;
    }

    if (!selectedProfessionalId && professionals.length > 0) {
      setError('Por favor, selecione um profissional');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Formatar data para ISO
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      console.log('📝 Criando agendamento:', {
        business_id: barbeariaId,
        professional_id: selectedProfessionalId,
        service_name: service.name,
        appointment_date: dateStr,
        appointment_time: selectedTime,
      });

      // Criar agendamento
      const result = await createAppointment({
        business_id: barbeariaId,
        professional_id: selectedProfessionalId,
        service_id: service.id,
        appointment_date: dateStr,
        appointment_time: selectedTime,
        duration_minutes: service.duration_minutes,
        total_price: service.price,
        status: 'scheduled',
        notes: `Serviço: ${service.name}`,
      });

      if (result.success) {
        console.log('✅ Agendamento criado com sucesso!', result.data);
        onReservationSuccess();
        onClose();
      } else {
        setError(result.error || 'Erro ao criar agendamento');
      }
    } catch (err) {
      console.error('❌ Erro ao confirmar reserva:', err);
      setError('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-6 text-white max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Fazer Reserva</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Status de Login */}
          {!user && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-amber-500 text-sm font-medium mb-1">
                    Login necessário
                  </p>
                  <p className="text-amber-500/70 text-xs">
                    Você precisa fazer login para realizar uma reserva
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Seleção de Profissional */}
          {professionals.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Selecione o Profissional</h3>
              {loadingProfessionals ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {professionals.map((professional) => (
                    <button
                      key={professional.id}
                      onClick={() => {
                        setSelectedProfessionalId(professional.id);
                        setSelectedDate(null);
                        setSelectedTime(null);
                        setError(null);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        selectedProfessionalId === professional.id
                          ? 'bg-indigo-500'
                          : 'bg-[#2a2a2a] hover:bg-[#333]'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                        {professional.user_avatar_url ? (
                          <img 
                            src={professional.user_avatar_url} 
                            alt={professional.user_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-semibold text-lg">
                            {professional.user_name?.charAt(0).toUpperCase() || 'P'}
                          </span>
                        )}
                      </div>

                      {/* Informações */}
                      <div className="flex-1 text-left">
                        <p className="text-white font-medium text-sm">
                          {professional.user_name || 'Profissional'}
                        </p>
                        {professional.experience_years && (
                          <p className="text-gray-400 text-xs">
                            {professional.experience_years} anos de experiência
                          </p>
                        )}
                        {professional.average_rating > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={12} fill="#fbbf24" className="text-amber-400" />
                            <span className="text-xs text-gray-400">
                              {professional.average_rating.toFixed(1)} ({professional.total_reviews} avaliações)
                            </span>
                          </div>
                        )}
                        {/* Dias de trabalho */}
                        {schedules.length > 0 && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-500">
                              {(() => {
                                const professionalSchedules = schedules.filter(
                                  s => s.professional_id === professional.id && s.is_active
                                );
                                const daysMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                                const workDays = [...new Set(professionalSchedules.map(s => s.day_of_week))]
                                  .sort()
                                  .map(day => daysMap[day]);
                                return workDays.length > 0 ? `Trabalha: ${workDays.join(', ')}` : 'Sem agenda cadastrada';
                              })()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Check icon */}
                      {selectedProfessionalId === professional.id && (
                        <Check size={20} className="text-white" strokeWidth={2.5} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Calendário Semanal */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Selecione a Data</h3>
            
            {!selectedProfessionalId && professionals.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <p className="text-blue-400 text-sm">
                  Selecione um profissional primeiro para ver os dias disponíveis
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigateWeek('prev')}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-semibold text-sm">{formattedMonth}</span>
              <button
                onClick={() => navigateWeek('next')}
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
                    onClick={() => {
                      if (available) {
                        setSelectedDate(date);
                        setSelectedTime(null);
                        setError(null);
                      }
                    }}
                    disabled={!available}
                    className={`py-2 rounded-full transition-colors relative ${
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

          {/* Horários Disponíveis */}
          {selectedDate && selectedProfessionalId && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Horários disponíveis</h3>
              {loadingSchedules ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : availableTimeSlots.length === 0 ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-amber-500 text-sm">
                    O profissional não trabalha neste dia. Selecione outra data.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {availableTimeSlots.map((horario) => (
                  <button
                    key={horario.hora}
                    onClick={() => {
                      if (horario.disponivel) {
                        setSelectedTime(horario.hora);
                        setError(null);
                      }
                    }}
                    disabled={!horario.disponivel}
                    className={`w-full flex items-center rounded-md transition-colors ${
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
              )}
            </div>
          )}
          
          {/* Aviso para selecionar profissional */}
          {selectedDate && !selectedProfessionalId && professionals.length > 0 && (
            <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-amber-500 text-sm">
                Selecione um profissional para ver os horários disponíveis
              </p>
            </div>
          )}

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Resumo da Reserva */}
          <div className="border-t border-b border-gray-700 py-4 mb-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{service.name}</span>
              <span className="font-semibold">R$ {service.price.toFixed(2)}</span>
            </div>
            {selectedProfessionalId && professionals.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Profissional</span>
                <span className="font-semibold">
                  {professionals.find(p => p.id === selectedProfessionalId)?.user_name || 'N/A'}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Data</span>
              <span className="font-semibold">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Hora</span>
              <span className="font-semibold">{selectedTime || '--:--'}</span>
            </div>
          </div>

          {/* Botão de Confirmação */}
          <button
            onClick={handleConfirm}
            disabled={loading || (!user && false)}
            className={`w-full rounded-lg py-3 text-white text-sm font-semibold transition-colors ${
              loading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            {loading ? 'Criando reserva...' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>

      {/* Modal de Login */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
        }}
      />
    </>
  );
};

export default ReservaModal;
