'use client';

import React from 'react';

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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
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
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <p className="text-gray-400 text-lg mb-2">Nenhum estabelecimento encontrado</p>
        <p className="text-sm text-gray-500">
          {searchTerm ? `Não encontramos resultados para "${searchTerm}"` : 'Não há estabelecimentos cadastrados'}
        </p>
      </div>
    </div>
  );
};
