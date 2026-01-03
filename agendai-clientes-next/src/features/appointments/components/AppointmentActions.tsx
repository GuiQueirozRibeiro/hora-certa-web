/**
 * Botões de ação do agendamento (cancelar).
 */
import React from 'react';

interface AppointmentActionsProps {
  onCancel: () => void;
  onComplete: () => void;
  isProcessing: boolean;
}

export function AppointmentActions({
  onCancel,
  onComplete,
  isProcessing,
}: AppointmentActionsProps) {
  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={onCancel}
        disabled={isProcessing}
        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {isProcessing ? 'Processando...' : 'Cancelar Agendamento'}
      </button>
    </div>
  );
}
