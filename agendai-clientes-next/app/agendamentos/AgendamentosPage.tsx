'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import { useAppointments } from '../../src/hooks/Useappointments';
import { useAppointmentActions } from '../../src/features/appointments/hooks/useAppointmentActions';
import LoginModal from '../../src/features/auth/components/LoginModal';
import { AppointmentsList } from '../../src/features/appointments/components/AppointmentsList';
import { BusinessMap } from '../../src/features/appointments/components/BusinessMap';
import { BusinessContact } from '../../src/features/appointments/components/BusinessContact';
import { ServiceDetails } from '../../src/features/appointments/components/ServiceDetails';
import { AppointmentActions } from '../../src/features/appointments/components/AppointmentActions';
import { CancelModal } from '../../src/features/appointments/components/CancelModal';
import { EmptyStates } from '../../src/features/appointments/components/EmptyStates';
import type { AppointmentWithDetails } from '../../src/types/types';

/**
 * AgendamentosPage - Página de gerenciamento de agendamentos
 * 
 * Princípios SOLID aplicados:
 * - Single Responsibility: Página apenas orquestra componentes e lógica
 * - Open/Closed: Extensível via novos componentes
 * - Dependency Inversion: Depende de hooks (abstrações), não de Supabase direto
 */
const AgendamentosPage: React.FC = () => {
  // Hooks de autenticação e dados
  const { user } = useAuth();
  const { appointments: allAppointments, loading, refetch } = useAppointments({});
  const { cancelAppointment, completeAppointment, isProcessing } = useAppointmentActions();

  // Estado local do componente
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

  // Filtrar agendamentos por status
  const confirmedAppointments = allAppointments.filter(
    (apt) => apt.status === 'scheduled' || apt.status === 'confirmed'
  );

  const completedAppointments = allAppointments.filter(
    (apt) => apt.status === 'completed'
  );

  // Selecionar primeiro agendamento automaticamente
  useEffect(() => {
    if (!selectedAppointment && confirmedAppointments.length > 0) {
      setSelectedAppointment(confirmedAppointments[0]);
    }
  }, [confirmedAppointments, selectedAppointment]);

  // Handlers
  const handleSelectAppointment = (appointment: AppointmentWithDetails) => {
    setSelectedAppointment(appointment);
  };

  const openCancelModal = () => {
    if (selectedAppointment) {
      setAppointmentToCancel(selectedAppointment.id);
      setShowCancelModal(true);
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setAppointmentToCancel(null);
  };

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    const result = await cancelAppointment(appointmentToCancel);

    if (result.success) {
      await refetch();
      closeCancelModal();

      if (selectedAppointment?.id === appointmentToCancel) {
        setSelectedAppointment(null);
      }
    } else {
      alert('Erro ao cancelar agendamento. Tente novamente.');
    }
  };

  const handleCompleteAppointment = async () => {
    if (!selectedAppointment) return;

    const result = await completeAppointment(selectedAppointment.id);

    if (result.success) {
      await refetch();
      setSelectedAppointment(null);
    } else {
      alert('Erro ao finalizar agendamento. Tente novamente.');
    }
  };

  // Estado de não autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <EmptyStates.NotAuthenticated onLogin={() => setShowLoginModal(true)} />
        
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => setShowLoginModal(false)}
        />
      </div>
    );
  }

  // Estado de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <EmptyStates.Loading />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-6 min-h-screen bg-zinc-800">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-200 mb-1">Agendamentos</h1>
      </div>

      {/* Layout de 2 colunas */}
      <div className="grid grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA - Lista de agendamentos */}
        <div className="col-span-4">
          {/* Agendamentos Confirmados */}
          <AppointmentsList
            title="Confirmados"
            appointments={confirmedAppointments}
            statusLabel="Confirmado"
            statusColor="bg-green-600"
            selectedAppointmentId={selectedAppointment?.id || null}
            onSelectAppointment={handleSelectAppointment}
            emptyMessage="Nenhum agendamento confirmado"
          />

          {/* Agendamentos Finalizados */}
          <AppointmentsList
            title="Finalizados"
            appointments={completedAppointments}
            statusLabel="Finalizado"
            statusColor="bg-gray-600"
            selectedAppointmentId={selectedAppointment?.id || null}
            onSelectAppointment={handleSelectAppointment}
            emptyMessage="Nenhum agendamento finalizado"
          />
        </div>

        {/* COLUNA DIREITA - Detalhes do agendamento */}
        <div className="col-span-8">
          {selectedAppointment ? (
            <div className="bg-[#1E1E1E] rounded-xl p-6">
              {/* Mapa e informações do estabelecimento */}
              <BusinessMap appointment={selectedAppointment} />

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
              <BusinessContact appointment={selectedAppointment} />

              {/* Detalhes do serviço */}
              <ServiceDetails appointment={selectedAppointment} />

              {/* Botões de ação */}
              <AppointmentActions
                onCancel={openCancelModal}
                onComplete={handleCompleteAppointment}
                isProcessing={isProcessing}
              />
            </div>
          ) : (
            <EmptyStates.NoSelection />
          )}
        </div>
      </div>

      {/* Modal de Cancelamento */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={closeCancelModal}
        onConfirm={handleCancelAppointment}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default AgendamentosPage;