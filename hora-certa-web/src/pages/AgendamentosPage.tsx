import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppointments } from '../hooks/Useappointments';
import LoginModal from '../components/LoginModal/LoginModal';
import type { AppointmentWithDetails } from '../types/types';
import { supabase } from '../lib/SupabaseClient';

const AgendamentosPage: React.FC = () => {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Buscar todos os agendamentos
  const { appointments: allAppointments, loading, refetch } = useAppointments({});

  // Filtrar agendamentos confirmados (scheduled e confirmed)
  const confirmedAppointments = allAppointments.filter(
    (apt) => apt.status === 'scheduled' || apt.status === 'confirmed'
  );

  // Filtrar agendamentos finalizados
  const completedAppointments = allAppointments.filter(
    (apt) => apt.status === 'completed'
  );

  // Selecionar primeiro agendamento automaticamente
  React.useEffect(() => {
    if (!selectedAppointment && confirmedAppointments.length > 0) {
      setSelectedAppointment(confirmedAppointments[0]);
    }
  }, [confirmedAppointments]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return { day, month };
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 13) {
      return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    } else if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const handleCopyPhone = (telefone: string) => {
    const phoneNumber = telefone.replace(/\D/g, '');
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(telefone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const openCancelModal = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setAppointmentToCancel(null);
  };

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentToCancel);

      if (error) throw error;

      // Atualizar lista de agendamentos
      await refetch();
      
      // Fechar modal
      closeCancelModal();
      
      // Se o agendamento cancelado era o selecionado, limpar seleção
      if (selectedAppointment?.id === appointmentToCancel) {
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Erro ao cancelar agendamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', appointmentId);

      if (error) throw error;

      // Atualizar lista de agendamentos
      await refetch();
      
      // Limpar seleção
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Erro ao finalizar agendamento:', error);
      alert('Erro ao finalizar agendamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const AppointmentCard = ({ 
    appointment, 
    statusLabel, 
    statusColor,
    isSelected 
  }: { 
    appointment: AppointmentWithDetails; 
    statusLabel: string;
    statusColor: string;
    isSelected: boolean;
  }) => {
    const date = formatDate(appointment.appointment_date);
    const profissional = appointment.professional_name || 'Fulano Taldo';


    return (
      <div
        onClick={() => setSelectedAppointment(appointment)}
        className={`rounded-lg p-4 mb-3 cursor-pointer transition-all flex items-center justify-between ${
          isSelected 
            ? 'bg-[#2a2a2a] border-2 border-indigo-500' 
            : 'bg-[#1a1a1a] border-2 border-transparent hover:border-[#2a2a2a]'
        }`}
      >
        {/* Lado esquerdo - Informações */}
        <div className="flex-1">
          {/* Badge de status */}
          <div className="mb-2">
            <span className={`${statusColor} text-white text-xs font-semibold px-2.5 py-1 rounded`}>
              {statusLabel}
            </span>
          </div>

          {/* Nome do serviço */}
          <h3 className="text-white font-semibold text-base mb-1">
            {appointment.service_name || 'Corte de cabelo'}
          </h3>
          
          {/* Nome do profissional */}
          <p className="text-gray-400 text-sm">
            {profissional}
          </p>
        </div>

        {/* Lado direito - Data e hora em quadrado cinza */}
        <div className="bg-[#3a3a3a] rounded-lg px-5 py-4 text-center min-w-[90px]">
          <div className="text-gray-400 text-xs uppercase mb-1">{date.month}</div>
          <div className="text-white text-3xl font-bold leading-none mb-2">{date.day}</div>
          <div className="text-white text-sm font-medium">
            {formatTime(appointment.appointment_time)}
          </div>
        </div>
      </div>
    );
  };

  // Se não estiver logado
  if (!user) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                  fill="#6366f1"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Faça login para ver seus agendamentos</h3>
            <p className="text-gray-400 mb-8 max-w-md">
              Entre com sua conta para visualizar, gerenciar e acompanhar todos os seus agendamentos
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => setShowLoginModal(false)}
        />
      </>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-6 min-h-screen">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Agendamentos</h1>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando agendamentos...</p>
          </div>
        </div>
      )}

      {/* Layout de 2 colunas */}
      {!loading && (
        <div className="grid grid-cols-12 gap-6">
          {/* COLUNA ESQUERDA - Lista de agendamentos */}
          <div className="col-span-4">
            {/* Seção: Confirmados */}
            <div className="mb-6">
              <h2 className="text-white font-semibold text-base mb-3">Confirmados</h2>
              {confirmedAppointments.length === 0 ? (
                <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
                  <p className="text-gray-400 text-sm">Nenhum agendamento confirmado</p>
                </div>
              ) : (
                <div>
                  {confirmedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      statusLabel="Confirmado"
                      statusColor="bg-green-600"
                      isSelected={selectedAppointment?.id === appointment.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Seção: Finalizados */}
            <div>
              <h2 className="text-white font-semibold text-base mb-3">Finalizados</h2>
              {completedAppointments.length === 0 ? (
                <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
                  <p className="text-gray-400 text-sm">Nenhum agendamento finalizado</p>
                </div>
              ) : (
                <div>
                  {completedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      statusLabel="Finalizado"
                      statusColor="bg-gray-600"
                      isSelected={selectedAppointment?.id === appointment.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLUNA DIREITA - Detalhes do agendamento/empresa */}
          <div className="col-span-8">
            {selectedAppointment ? (
              <div className="bg-[#1E1E1E] rounded-xl p-6">
                {/* Mapa - Clicável para abrir no Google Maps */}
                <div className="mb-6">
                  {selectedAppointment.business?.address?.street_address ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${selectedAppointment.business.address.street_address}, ${selectedAppointment.business.address.number || ''} ${selectedAppointment.business.address.neighborhood || ''} ${selectedAppointment.business.address.city || ''}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative w-full h-48 bg-[#2a2a2a] rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group"
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0, pointerEvents: "none" }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          `${selectedAppointment.business.address.street_address}, ${selectedAppointment.business.address.number || ''} ${selectedAppointment.business.address.neighborhood || ''} ${selectedAppointment.business.address.city || ''}`
                        )}&z=16&output=embed`}
                        className="absolute inset-0"
                      ></iframe>
                      <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                    </a>
                  ) : (
                    <div className="w-full h-48 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Mapa não disponível</p>
                    </div>
                  )}
                  
                  {/* Informações da empresa abaixo do mapa */}
                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={selectedAppointment.business?.image_url || 
                           selectedAppointment.business?.cover_image_url || 
                           'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=80&h=80&fit=crop'}
                      alt={selectedAppointment.business?.name || 'Estabelecimento'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-white font-bold text-base">
                        {selectedAppointment.business?.name || 'Estabelecimento'}
                      </h2>
                      <p className="text-gray-400 text-xs">
                        {selectedAppointment.business?.address?.street_address ? 
                          `${selectedAppointment.business.address.street_address}, ${selectedAppointment.business.address.number || ''} - ${selectedAppointment.business.address.neighborhood || ''}, ${selectedAppointment.business.address.city || ''}` :
                          'Endereço não disponível'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sobre nós */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">
                    Sobre nós
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Bem-vindo à {selectedAppointment.business?.name || 'nosso estabelecimento'}, onde tradição encontra estilo. 
                    Neste espaço acolhedor e refinado, oferecemos serviços de barbearia com um toque de 
                    modernidade. Nossa equipe de profissionais especializados está pronta para proporcionar 
                    a você uma experiência única e personalizada.
                  </p>
                </div>

                {/* Contato */}
                <div className="mb-6">
                  {selectedAppointment.business?.whatsapp_link && (
                    <>
                      <a
                        href={selectedAppointment.business.whatsapp_link.includes('wa.me') 
                          ? selectedAppointment.business.whatsapp_link 
                          : `https://wa.me/${selectedAppointment.business.whatsapp_link.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full mb-3"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Entrar em contato
                      </a>

                      {/* Telefone */}
                      <div className="flex items-center justify-between bg-[#0d0d0d] rounded-lg p-4 border border-[#2a2a2a]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                            </svg>
                          </div>
                          <span className="text-white text-sm">
                            {formatPhoneNumber(selectedAppointment.business.whatsapp_link)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyPhone(selectedAppointment.business!.whatsapp_link!)}
                          className="text-indigo-500 text-sm font-semibold hover:text-indigo-400"
                        >
                          {copiedPhone === selectedAppointment.business!.whatsapp_link ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Detalhes do serviço - Card Confirmado */}
                <div className="bg-[#0d0d0d] rounded-lg p-5 border border-[#2a2a2a] mb-6">
                  <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
                    Confirmado
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-semibold text-base mb-2">
                        {selectedAppointment.service_name || 'Corte de Cabelo'}
                      </h4>
                      <div className="text-gray-400 text-xs space-y-1">
                        <p>Data: {formatDate(selectedAppointment.appointment_date).day} de {formatDate(selectedAppointment.appointment_date).month}</p>
                        <p>Horário: {formatTime(selectedAppointment.appointment_time)}</p>
                        <p>Barbearia: {selectedAppointment.business?.name || 'Não informado'}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Total</span>
                      <span className="text-white font-bold text-lg">
                        R${Number(selectedAppointment.total_price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => openCancelModal(selectedAppointment.id)}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Processando...' : 'Cancelar Agendamento'}
                  </button>
                  <button
                    onClick={() => handleCompleteAppointment(selectedAppointment.id)}
                    disabled={isProcessing}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Processando...' : 'Marcar como Finalizado'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                      fill="#9CA3AF"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Selecione um agendamento
                </h3>
                <p className="text-gray-400 text-sm">
                  Clique em um agendamento à esquerda para ver os detalhes
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141518] rounded-xl max-w-sm w-full p-8 shadow-2xl">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-white mb-3">
                Cancelar Reserva
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tem certeza que deseja cancelar esse agendamento?
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                onClick={closeCancelModal}
                disabled={isProcessing}
                className="flex-1 bg-[#26272B] hover:bg-[#2f3035] disabled:bg-[#26272B] disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelAppointment}
                disabled={isProcessing}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isProcessing ? 'Cancelando...' : 'Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendamentosPage;