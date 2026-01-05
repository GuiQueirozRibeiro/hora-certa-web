'use client';

import React from 'react';
import { ArrowLeft, Store, Star } from 'lucide-react';
import type { Business } from '../types';

interface BackButtonProps {
  onBack: () => void;
}

/**
 * Botão de voltar
 */
export const BackButton: React.FC<BackButtonProps> = ({ onBack }) => {
  return (
    <div className="bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Voltar</span>
        </button>
      </div>
    </div>
  );
};

interface BusinessHeaderProps {
  business: Business;
}

/**
 * Header com informações do estabelecimento (imagem, nome, avaliação).
 * Recebe dados do Business via props.
 */
export const BusinessHeader: React.FC<BusinessHeaderProps> = ({ business }) => {
  return (
    <div className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-3 sm:gap-4">

          {/* DIV DA IMAGEM DO ESTABELECIMENTO  */}
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-zinc-800 shrink-0">
            {business.image_url ? (
              <img 
                src={business.image_url} 
                alt={business.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                <Store size={40} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-white mb-1 truncate">
              {business.name}
            </h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center">
                <Star size={16} fill="#FFD700" color="#FFD700" className="mr-1" />
                <span className="text-white font-semibold">{business.average_rating.toFixed(1)}</span>
                <span className="text-zinc-400 text-sm ml-1">({business.total_reviews} avaliações)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
