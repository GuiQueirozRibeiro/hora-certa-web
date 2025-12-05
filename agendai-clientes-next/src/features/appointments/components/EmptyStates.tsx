/**
 * Estados vazios para a página de agendamentos
 * Single Responsibility: Cada componente renderiza um estado específico
 */
'use client';

import React from 'react';

const NoSelection: React.FC = () => {
  return (
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
  );
};

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Carregando agendamentos...</p>
      </div>
    </div>
  );
};

const NotAuthenticated: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
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
        <h3 className="text-2xl font-bold text-white mb-3">
          Faça login para ver seus agendamentos
        </h3>
        <p className="text-gray-400 mb-8 max-w-md">
          Entre com sua conta para visualizar, gerenciar e acompanhar todos os seus agendamentos
        </p>
        <button
          onClick={onLogin}
          className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Fazer Login
        </button>
      </div>
    </div>
  );
};

// Exportar como namespace para uso: EmptyStates.NoSelection, EmptyStates.Loading, etc.
export const EmptyStates = {
  NoSelection,
  Loading,
  NotAuthenticated,
};
