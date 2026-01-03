'use client';

import React from 'react';

/**
 * Spinner de loading em tela cheia.
 */
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-zinc-400">Carregando...</p>
      </div>
    </div>
  );
};

/**
 * Componente de erro quando estabelecimento não é encontrado
 */
export const BusinessNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <p className="text-zinc-400">Estabelecimento não encontrado</p>
    </div>
  );
};

/**
 * Loading spinner inline menor
 */
export const InlineLoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
};
