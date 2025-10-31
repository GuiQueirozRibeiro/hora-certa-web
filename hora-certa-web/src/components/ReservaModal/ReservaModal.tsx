import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments } from '../../hooks/Useappointments';
import { useProfessionals } from '../../hooks/useProfessionals';
import LoginModal from '../LoginModal/LoginModal';

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: { nome: string; preco: number } | null;
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
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Horários disponíveis (exemplo)
  const horariosDisponiveis = [
    { hora: '09:00', disponivel: true },
    { hora: '10:00', disponivel: true },
    { hora: '11:00', disponivel: true },
    { hora: '12:00', disponivel: false },
    { hora: '13:00', disponivel: false },
    { hora: '14:00', disponivel: true },
    { hora: '15:00', disponivel: true },
    { hora: '16:00', disponivel: true },
    { hora: '17:00', disponivel: true },
    { hora: '18:00', disponivel: false }
  ];

  if (!isOpen || !service) return null;

  // Função para obter os 7 dias da semana atual
  const getWeekDays = (weekStart: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeekStart);

  // Navegação de semana
  const handlePreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Verificar se a data é hoje ou futura
  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  // Verificar se a data está selecionada
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Formatar mês/ano
  const monthNames = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];

  // Pega o mês da primeira data da semana
  const formattedMonth = monthNames[currentWeekStart.getMonth()];

  // Formatar data para exibição
  const formatDate = (date: Date | null) => {
    if (!date) return '--/--';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

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
        service_name: service.nome,
        appointment_date: dateStr,
        appointment_time: selectedTime,
      });

      // Criar agendamento
      const result = await createAppointment({
        business_id: barbeariaId,
        professional_id: selectedProfessionalId,
        service_id: null,
        service_name: service.nome,
        appointment_date: dateStr,
        appointment_time: selectedTime,
        duration_minutes: 60,
        total_price: service.preco,
        status: 'scheduled',
        notes: `Serviço: ${service.nome}`,
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status de Login */}
          {!user && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                  <path 
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" 
                    fill="#f59e0b"
                  />
                </svg>
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
                        setError(null);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        selectedProfessionalId === professional.id
                          ? 'bg-indigo-500'
                          : 'bg-[#2a2a2a] hover:bg-[#333]'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span className="text-xs text-gray-400">
                              {professional.average_rating.toFixed(1)} ({professional.total_reviews} avaliações)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Check icon */}
                      {selectedProfessionalId === professional.id && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path 
                            d="M5 13l4 4L19 7" 
                            stroke="white" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Calendário Semanal */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePreviousWeek}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <span className="font-semibold text-sm">{formattedMonth}</span>
              <button
                onClick={handleNextWeek}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/>
                </svg>
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
                    className={`py-2 rounded-full transition-colors ${
                      selected
                        ? 'bg-indigo-500 text-white'
                        : available
                        ? 'hover:bg-gray-700 text-white'
                        : 'text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horários Disponíveis */}
          {selectedDate && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Horários disponíveis</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {horariosDisponiveis.map((horario) => (
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
              <span className="text-gray-400">{service.nome}</span>
              <span className="font-semibold">R$ {service.preco.toFixed(2)}</span>
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