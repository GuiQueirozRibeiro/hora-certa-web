'use client';

import React from 'react';
import Image from 'next/image';
import { User, Star } from 'lucide-react';
import { useProfessionals } from '../../../hooks/useProfessionals';

interface ProfessionalsTabProps {
  businessId: string;
}

/**
 * Lista de profissionais do estabelecimento.
 * Dependência: useProfessionals hook para buscar dados.
 */
const ProfessionalsTab: React.FC<ProfessionalsTabProps> = ({ businessId }) => {
  const { professionals, loading, error } = useProfessionals(businessId);

  if (loading) {
    return (
      <div className="p-5">
        <h3 className="text-white font-semibold text-base mb-4">Profissionais</h3>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Carregando profissionais...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <h3 className="text-white font-semibold text-base mb-4">Profissionais</h3>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div className="p-5">
        <h3 className="text-white font-semibold text-base mb-4">Profissionais</h3>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <User size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-400 text-sm">Nenhum profissional cadastrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h3 className="text-white font-semibold text-base mb-4">
        Profissionais ({professionals.length})
      </h3>
      <div className="space-y-3">
        {professionals.map((professional) => {
          const getInitials = (name: string) => {
            if (!name) return '?';
            const names = name.trim().split(' ');
            if (names.length === 1) return names[0].charAt(0).toUpperCase();
            return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
          };

          return (
            <div
              key={professional.id}
              className="flex items-center gap-3 bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#333333] transition-colors"
            >
              {/* Avatar */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden bg-indigo-500 shrink-0 ${
                  !professional.is_active ? 'opacity-50' : ''
                }`}
              >
                {professional.user_avatar_url ? (
                  <Image
                    src={professional.user_avatar_url}
                    alt={professional.user_name || 'Profissional'}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.textContent = getInitials(professional.user_name || 'Profissional');
                      }
                    }}
                  />
                ) : (
                  getInitials(professional.user_name || 'Profissional')
                )}
              </div>

              {/* Informações */}
              <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">
                  {professional.user_name || 'Profissional'}
                </span>
                {professional.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={12} fill="#fbbf24" className="text-amber-400" />
                    <span className="text-xs text-gray-400">
                      {professional.average_rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Experiência e especialidades */}
              <div className="flex flex-col gap-1 mt-1">
                {professional.experience_years && (
                  <p className="text-xs text-gray-400">
                    {professional.experience_years} anos de experiência
                  </p>
                )}
                {professional.specialties && professional.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {professional.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botão Ver mais */}
            <button className="bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors shrink-0">
              Ver perfil
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessionalsTab;
