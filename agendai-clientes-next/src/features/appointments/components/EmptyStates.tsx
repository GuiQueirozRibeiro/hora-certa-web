/**
 * Estados vazios da página de agendamentos: sem seleção, loading e não autenticado.
 */
'use client';

import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

const NoSelection: React.FC = () => {
  return (
    <div className="rounded-xl p-12 text-center">
      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar size={32} className="text-gray-400" />
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
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] bg-zinc-900">
      <div className="text-center">
        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-indigo-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Faça login para ver seus agendamentos
        </h3>
        <p className="text-gray-400 mb-8 max-w-md">
          Entre com sua conta para visualizar, gerenciar e acompanhar todos os seus agendamentos
        </p>
        <button
          onClick={onLogin}
          className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer"
        >
          Fazer Login
        </button>
      </div>
    </div>
  );
};

const NotAuthenticatedSettings: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] bg-zinc-900">
      <div className="text-center">
        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-indigo-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Faça login para acessar suas configurações
        </h3>
        <p className="text-gray-400 mb-8 max-w-md">
          Entre com sua conta para visualizar e gerenciar as configurações do seu perfil
        </p>
        <button
          onClick={onLogin}
          className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer"
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
  NotAuthenticatedSettings,
};
