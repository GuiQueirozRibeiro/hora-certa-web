'use client';

import React from 'react';

interface CancelModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  isOpen,
  isProcessing,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 bg-[#26272B] hover:bg-[#2f3035] disabled:bg-[#26272B] disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isProcessing ? 'Cancelando...' : 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
};
