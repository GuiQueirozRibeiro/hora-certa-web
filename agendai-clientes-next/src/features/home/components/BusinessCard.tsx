'use client';

import React from 'react';
import { Heart, MapPin, Navigation2 } from 'lucide-react';

interface Business {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  imagem: string;
  localizacao?: { lat: number; lng: number };
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
  // Gerar URL do Google Maps para direções
  const getDirectionsUrl = () => {
    if (business.localizacao?.lat && business.localizacao?.lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${business.localizacao.lat},${business.localizacao.lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.endereco)}`;
  };

  const handleDirectionsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir a página do estabelecimento
    window.open(getDirectionsUrl(), '_blank', 'noopener,noreferrer');
  };

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
          className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all cursor-pointer"
        >
          <Heart
            size={20}
            className={isFavorited ? 'fill-yellow-400 text-yellow-400' : 'text-white'}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-white mb-2">
          {business.nome}
        </h3>
        <p className="text-xs text-zinc-200 mb-1 flex items-center gap-1.5">
          <MapPin size={14} />
          {business.endereco}
        </p>
        <p className="text-xs text-zinc-200 mb-4">
          {business.horario}
        </p>
        <button className="w-full bg-indigo-500 rounded-lg py-3 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors cursor-pointer">
          Reservar horário
        </button>
        <button
          onClick={handleDirectionsClick}
          className="w-full mt-2 bg-zinc-600 hover:bg-zinc-500 rounded-lg py-2.5 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Navigation2 size={16} />
          Como chegar
        </button>
      </div>
    </div>
  );
};
