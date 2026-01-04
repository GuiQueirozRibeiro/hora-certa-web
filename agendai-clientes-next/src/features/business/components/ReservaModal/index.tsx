/**
 * Modal de reserva de agendamento. Composição de componentes menores.
 * View que utiliza o ViewModel useReservaModalViewModel.
 */
'use client';

import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import LoginModal from '../../../auth/components/LoginModal';
import { useReservaModalViewModel } from './useReservaModalViewModel';
import { ProfessionalSelector } from './ProfessionalSelector';
import { DateSelector } from './DateSelector';
import { TimeSlotSelector } from './TimeSlotSelector';
import { ReservationSummary } from './ReservationSummary';
import type { ReservaModalProps } from './types';

const ReservaModal: React.FC<ReservaModalProps> = ({
  isOpen,
  onClose,
  service,
  barbeariaId,
  onReservationSuccess,
}) => {
  const vm = useReservaModalViewModel({
    service,
    barbeariaId,
    onReservationSuccess,
    onClose,
  });

  if (!isOpen || !service) return null;

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
              className="text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Status de Login */}
          {!vm.user && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-amber-500 text-sm font-medium mb-1">Login necessário</p>
                  <p className="text-amber-500/70 text-xs">
                    Você precisa fazer login para realizar uma reserva
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Seleção de Profissional */}
          <ProfessionalSelector
            professionals={vm.professionals}
            selectedProfessionalId={vm.selectedProfessionalId}
            loading={vm.loadingProfessionals}
            schedules={vm.schedules}
            onSelect={vm.selectProfessional}
          />

          {/* Calendário Semanal */}
          <DateSelector
            weekDays={vm.weekDays}
            selectedDate={vm.selectedDate}
            currentMonth={vm.currentMonth}
            selectedProfessionalId={vm.selectedProfessionalId}
            hasProfessionals={vm.professionals.length > 0}
            isDateAvailable={vm.isDateAvailable}
            onSelectDate={vm.selectDate}
            onNavigateWeek={vm.navigateWeek}
          />

          {/* Horários Disponíveis */}
          {vm.selectedDate && vm.selectedProfessionalId && (
            <TimeSlotSelector
              timeSlots={vm.availableTimeSlots}
              selectedTime={vm.selectedTime}
              loading={vm.loadingSchedules}
              onSelectTime={vm.selectTime}
            />
          )}

          {/* Aviso para selecionar profissional */}
          {vm.selectedDate && !vm.selectedProfessionalId && vm.professionals.length > 0 && (
            <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-amber-500 text-sm">
                Selecione um profissional para ver os horários disponíveis
              </p>
            </div>
          )}

          {/* Mensagem de erro */}
          {vm.error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-500 text-sm">{vm.error}</p>
            </div>
          )}

          {/* Resumo da Reserva */}
          <ReservationSummary
            serviceName={service.name}
            servicePrice={service.price}
            professionalName={vm.selectedProfessionalName}
            selectedDate={vm.selectedDate}
            selectedTime={vm.selectedTime}
          />

          {/* Botão de Confirmação */}
          <button
            onClick={vm.handleConfirm}
            disabled={vm.loading}
            className={`w-full rounded-lg py-3 text-white text-sm font-semibold transition-colors cursor-pointer ${
              vm.loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            {vm.loading ? 'Criando reserva...' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>

      {/* Modal de Login */}
      <LoginModal
        isOpen={vm.showLoginModal}
        onClose={vm.closeLoginModal}
        onLoginSuccess={vm.closeLoginModal}
      />
    </>
  );
};

export default ReservaModal;
