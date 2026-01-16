/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Heart, MapPin, Navigation2 } from 'lucide-react';

interface Business {
  id: string;
  nome: string;
  descricao: string;
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
      className="bg-zinc-800 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer border border-zinc-500/50"
      onClick={onCardClick}
    >
      {/* Imagem e Favorito */}
      <div className="w-full h-44 overflow-hidden relative">
        <img
          src={business.imagem}
          alt={business.nome}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 w-9 h-9 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-all shadow-lg cursor-pointer"
        >
          <Heart
            size={18}
            className={isFavorited ? 'fill-indigo-500 text-indigo-500' : 'text-white'}
          />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-3">
        {/* Título e Descrição */}
        <div>
          <h3 className="text-lg font-bold text-white leading-tight mb-1.5">
            {business.nome}
          </h3>
          <p className="text-[13px] text-zinc-400 leading-relaxed line-clamp-2">
            {business.descricao}
          </p>
        </div>

        {/* Endereço e Badge de Horário */}
        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-2 text-zinc-300">
            <MapPin size={15} className="text-indigo-500 shrink-0 mt-0.5" />
            <span className="text-xs leading-tight">
              {business.endereco}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
             {/* Badge de Horário à esquerda para equilibrar o visual */}
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                business.horario === 'Fechado'
                  ? 'bg-red-500/10 text-red-500 border-red-500/20'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}
            >
              {business.horario}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-1 gap-2 mt-2">
          <button className="w-full bg-indigo-600 rounded-xl py-3 text-white text-sm font-bold hover:bg-indigo-500 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20 cursor-pointer">
            Reservar horário
          </button>
          <button
            onClick={handleDirectionsClick}
            className="w-full bg-zinc-700/50 hover:bg-zinc-700 rounded-xl py-2.5 text-zinc-300 text-sm font-semibold flex items-center justify-center gap-2 transition-all border border-zinc-600/50 cursor-pointer"
          >
            <Navigation2 size={16} />
            Como chegar
          </button>
        </div>
      </div>
    </div>
  );
};
