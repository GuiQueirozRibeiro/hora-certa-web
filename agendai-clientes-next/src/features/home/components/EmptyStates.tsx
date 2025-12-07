'use client';

import React from 'react';
import { AlertCircle, Search } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Carregando estabelecimentos...</p>
      </div>
    </div>
  );
};

export const ErrorState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="text-red-500 mb-4">
          <AlertCircle size={48} className="mx-auto" />
        </div>
        <p className="text-gray-400 mb-2">Erro ao carregar estabelecimentos</p>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="text-gray-500 mb-4">
          <Search size={64} className="mx-auto" />
        </div>
        <p className="text-gray-400 text-lg mb-2">Nenhum estabelecimento encontrado</p>
        <p className="text-sm text-gray-500">
          {searchTerm ? `Não encontramos resultados para "${searchTerm}"` : 'Não há estabelecimentos cadastrados'}
        </p>
      </div>
    </div>
  );
};
