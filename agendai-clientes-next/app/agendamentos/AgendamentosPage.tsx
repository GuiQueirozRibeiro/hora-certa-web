'use client';

import React, { useState, useMemo } from 'react';
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
import { Business } from '../../src/types/types';

const AgendamentosPage: React.FC = () => {
  const { user } = useAuth();
  const { appointments: allAppointments, loading, refetch } = useAppointments({});
  const { cancelAppointment, completeAppointment, isProcessing } = useAppointmentActions();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

  // 1. Filtros Estáveis
  const confirmedAppointments = useMemo(() => 
    allAppointments.filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed'),
    [allAppointments]
  );

  const completedAppointments = useMemo(() => 
    allAppointments.filter(apt => apt.status === 'completed'),
    [allAppointments]
  );

  // 2. Seleção Derivada (Mata o erro de loop infinito)
  const selectedAppointment = useMemo(() => {
    if (selectedId) {
      return allAppointments.find(apt => apt.id === selectedId) || null;
    }
    return confirmedAppointments[0] || null;
  }, [selectedId, confirmedAppointments, allAppointments]);

  // Handlers Otimizados
  const handleSelectAppointment = (appointment: AppointmentWithDetails) => {
    setSelectedId(appointment.id);
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
      // Se o agendamento cancelado era o selecionado, limpamos a seleção
      if (selectedId === appointmentToCancel) {
        setSelectedId(null);
      }
    } else {
      alert('Erro ao cancelar agendamento.');
    }
  };

  const handleCompleteAppointment = async () => {
    if (!selectedAppointment) return;
    const result = await completeAppointment(selectedAppointment.id);

    if (result.success) {
      await refetch();
      setSelectedId(null); // Limpa seleção após finalizar
    } else {
      alert('Erro ao finalizar agendamento.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <EmptyStates.NotAuthenticated onLogin={() => setShowLoginModal(true)} />
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginSuccess={() => setShowLoginModal(false)} />
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen bg-zinc-900"><EmptyStates.Loading /></div>;
  }

  return (
    <div className="w-full mx-auto px-8 py-6 min-h-screen bg-zinc-800">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-200 mb-1">Agendamentos</h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 space-y-6">
          <AppointmentsList
            title="Confirmados"
            appointments={confirmedAppointments}
            statusLabel="Confirmado"
            statusColor="bg-green-600"
            selectedAppointmentId={selectedAppointment?.id || null}
            onSelectAppointment={handleSelectAppointment}
            emptyMessage="Nenhum agendamento confirmado"
          />

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

        <div className="col-span-8">
          {selectedAppointment ? (
            <div className="bg-[#1E1E1E] rounded-xl p-6">
              <BusinessMap appointment={selectedAppointment} />
              
              <div className="my-6">
                <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Sobre nós</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Bem-vindo à {selectedAppointment.business?.description}
                </p>
              </div>

              <BusinessContact appointment={selectedAppointment} />
              <ServiceDetails appointment={selectedAppointment} />
              
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