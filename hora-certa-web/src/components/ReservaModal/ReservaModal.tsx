import React, { useState } from 'react';

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: { nome: string; preco: number };
  barbeariaId: number;
}

const ReservaModal: React.FC<ReservaModalProps> = ({ isOpen, onClose, service }) => {
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
  const [selectedProfessional, setSelectedProfessional] = useState<string>('Rafael Pereira');

  // Lista de profissionais disponíveis
  const profissionais = ['Rafael Pereira', 'João Silva', 'Carlos Santos', 'Pedro Oliveira'];

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

  if (!isOpen) return null;

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

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor, selecione uma data e horário');
      return;
    }
    
    console.log({
      servico: service.nome,
      preco: service.preco,
      data: selectedDate,
      hora: selectedTime,
      profissional: selectedProfessional
    });
    
    // Aqui você pode adicionar a lógica para enviar a reserva para o backend
    alert('Reserva confirmada!');
    onClose();
  };

  return (
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
                  onClick={() => horario.disponivel && setSelectedTime(horario.hora)}
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

        {/* Resumo da Reserva */}
        <div className="border-t border-b border-gray-700 py-4 mb-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">{service.nome}</span>
            <span className="font-semibold">R$ {service.preco.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Data</span>
            <span className="font-semibold">{formatDate(selectedDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Hora</span>
            <span className="font-semibold">{selectedTime || '--:--'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Profissional</span>
            <select
              value={selectedProfessional}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="bg-[#2a2a2a] border border-gray-600 rounded-md px-3 py-1 text-sm text-white outline-none focus:border-indigo-500"
            >
              {profissionais.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão de Confirmação */}
        <button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className={`w-full rounded-lg py-3 text-white text-sm font-semibold transition-colors ${
            selectedDate && selectedTime
              ? 'bg-indigo-500 hover:bg-indigo-600'
              : 'bg-gray-700 cursor-not-allowed'
          }`}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default ReservaModal;