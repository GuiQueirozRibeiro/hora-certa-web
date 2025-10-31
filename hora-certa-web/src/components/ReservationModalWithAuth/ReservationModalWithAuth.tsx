import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../LoginModal/LoginModal';

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: { nome: string; preco: number } | null;
  barbeariaId?: number;
  onReservationSuccess: () => void;
}

const ReservaModalWithAuth: React.FC<ReservaModalProps> = ({ 
  isOpen, 
  onClose, 
  service,
  barbeariaId,
  onReservationSuccess 
}) => {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !service) return null;

  // Função para criar reserva
  const handleCreateReservation = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Por favor, selecione data e horário');
      return;
    }

    setLoading(true);

    try {
      // Aqui você faria a chamada para criar a reserva no Supabase
      const reservationData = {
        user_id: user.id,
        business_id: barbeariaId,
        service_name: service.nome,
        service_price: service.preco,
        reservation_date: selectedDate.toISOString().split('T')[0],
        reservation_time: selectedTime,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      // Exemplo de chamada ao Supabase:
      /*
      const { error } = await supabase
        .from('reservations')
        .insert([reservationData]);

      if (error) throw error;
      */

      console.log('Reserva criada:', reservationData);
      
      onReservationSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      alert('Erro ao criar reserva. Tente novamente.');
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
          className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-6 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Fazer Reserva</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Informações do Serviço */}
          <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-white mb-2">{service.nome}</h3>
            <p className="text-indigo-500 font-bold">R$ {service.preco.toFixed(2)}</p>
          </div>

          {/* Status de Login */}
          {!user ? (
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
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {user.email}
                  </p>
                  <p className="text-green-500 text-xs">
                    Logado
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Seleção de Data/Hora (simplificado) */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Data
              </label>
              <input
                type="date"
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Horário
              </label>
              <select
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500"
              >
                <option value="">Selecione um horário</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
            </div>
          </div>

          {/* Botão de Confirmação */}
          <button
            onClick={handleCreateReservation}
            disabled={loading}
            className={`w-full rounded-lg py-3 text-white text-sm font-semibold transition-colors ${
              loading
                ? 'bg-gray-700 cursor-not-allowed'
                : user
                ? 'bg-indigo-500 hover:bg-indigo-600'
                : 'bg-gray-700'
            }`}
          >
            {loading ? 'Criando reserva...' : user ? 'Confirmar Reserva' : 'Fazer Login'}
          </button>

          {!user && (
            <p className="text-center text-xs text-gray-500 mt-3">
              Ao clicar em "Fazer Login", você será direcionado para a tela de autenticação
            </p>
          )}
        </div>
      </div>

      {/* Modal de Login */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          // Após login, o modal de reserva continua aberto
        }}
      />
    </>
  );
};

export default ReservaModalWithAuth;
