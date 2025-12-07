'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments } from '../../hooks/Useappointments';
import type { AppointmentWithDetails } from '../../types/types';
import { useDateFormatter } from './hooks/useDateFormatter';
import { useAppointmentActions } from './hooks/useAppointmentActions';
import { usePhoneCopy } from './hooks/usePhoneCopy';
import { AppointmentCard } from './components/AppointmentCard';
import { CancelModal } from './components/CancelModal';
import { EmptyStates } from './components/EmptyStates';
import LoginModal from '../auth/components/LoginModal';

export const AppointmentsPage: React.FC = () => {
  // Authentication
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Data Fetching
  const { appointments: allAppointments, loading, refetch } = useAppointments({});

  // State Management
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

  // Custom Hooks
  const { formatDate, formatTime } = useDateFormatter();
  const { isProcessing, cancelAppointment, completeAppointment } = useAppointmentActions();
  const { formatPhoneNumber, handleCopyPhone, copiedPhone } = usePhoneCopy();

  // Computed Values
  const confirmedAppointments = allAppointments.filter(
    (apt) => apt.status === 'scheduled' || apt.status === 'confirmed'
  );

  const completedAppointments = allAppointments.filter(
    (apt) => apt.status === 'completed'
  );

  // Auto-select first appointment
  useEffect(() => {
    if (!selectedAppointment && confirmedAppointments.length > 0) {
      setSelectedAppointment(confirmedAppointments[0]);
    }
  }, [confirmedAppointments, selectedAppointment]);

  // Event Handlers
  const handleOpenCancelModal = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setAppointmentToCancel(null);
  };

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    const result = await cancelAppointment(appointmentToCancel);
    
    if (result.success) {
      await refetch();
      handleCloseCancelModal();
      
      if (selectedAppointment?.id === appointmentToCancel) {
        setSelectedAppointment(null);
      }
    } else {
      alert('Erro ao cancelar agendamento. Tente novamente.');
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    const result = await completeAppointment(appointmentId);
    
    if (result.success) {
      await refetch();
      setSelectedAppointment(null);
    } else {
      alert('Erro ao finalizar agendamento. Tente novamente.');
    }
  };

  // Render: Unauthenticated
  if (!user) {
    return (
      <>
        <EmptyStates.NotAuthenticated onLogin={() => setShowLoginModal(true)} />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => setShowLoginModal(false)}
        />
      </>
    );
  }

  // Render: Main Content
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 min-h-screen bg-zinc-800">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-200 mb-1">Agendamentos</h1>
      </div>

      {/* Loading */}
      {loading && <EmptyStates.Loading />}

      {/* Main Layout */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column - Appointment List - Esconde em mobile quando tem seleção */}
          <div className={`lg:col-span-4 ${selectedAppointment ? 'hidden lg:block' : 'block'}`}>
            {/* Confirmed Section */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-white font-semibold text-sm sm:text-base mb-2 sm:mb-3">Confirmados</h2>
              {confirmedAppointments.length === 0 ? (
                <div className="bg-[#1a1a1a] rounded-lg p-4 sm:p-6 text-center">
                  <p className="text-gray-400 text-xs sm:text-sm">Nenhum agendamento confirmado</p>
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
                      onClick={(apt) => setSelectedAppointment(apt)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Section */}
            <div>
              <h2 className="text-white font-semibold text-sm sm:text-base mb-2 sm:mb-3">Finalizados</h2>
              {completedAppointments.length === 0 ? (
                <div className="bg-[#1a1a1a] rounded-lg p-4 sm:p-6 text-center">
                  <p className="text-gray-400 text-xs sm:text-sm">Nenhum agendamento finalizado</p>
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
                      onClick={(apt) => setSelectedAppointment(apt)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details - Mostra em mobile quando tem seleção */}
          <div className={`lg:col-span-8 ${selectedAppointment ? 'block' : 'hidden lg:block'}`}>
            {selectedAppointment ? (
              <div className="bg-[#1a1a1a] rounded-lg p-4 sm:p-6">
                {/* Botão voltar apenas em mobile */}
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="lg:hidden flex items-center gap-2 text-zinc-400 hover:text-white mb-4 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Voltar
                </button>
                <p className="text-gray-400 text-sm sm:text-base">Detalhes do agendamento removidos</p>
              </div>
            ) : (
              <EmptyStates.NoSelection />
            )}
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      <CancelModal
        isOpen={showCancelModal}
        isProcessing={isProcessing}
        onClose={handleCloseCancelModal}
        onConfirm={handleCancelAppointment}
      />
    </div>
  );
};
