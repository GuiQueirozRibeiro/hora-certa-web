'use client';

import React from 'react';

interface Business {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  imagem: string;
}

interface BusinessCardProps {
  business: Business;
  isFavorited: boolean;
  onCardClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  isFavorited,
  onCardClick,
  onToggleFavorite,
}) => {
  return (
    <div
      className="bg-zinc-700 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.2)] transition-all cursor-pointer"
      onClick={onCardClick}
    >
      <div className="w-full h-40 overflow-hidden relative">
        <img
          src={business.imagem}
          alt={business.nome}
          className="w-full h-full object-cover"
        />
        {/* Botão de Favoritar */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
        >
          {isFavorited ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD700">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          )}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-white mb-2">
          {business.nome}
        </h3>
        <p className="text-xs text-zinc-200 mb-1 flex items-center gap-1.5">
          <span>📍</span>
          {business.endereco}
        </p>
        <p className="text-xs text-zinc-200 mb-4">
          {business.horario}
        </p>
        <button className="w-full bg-indigo-500 rounded-lg py-3 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors">
          Reservar horário
        </button>
      </div>
    </div>
  );
};
