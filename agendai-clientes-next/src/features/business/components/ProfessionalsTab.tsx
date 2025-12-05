'use client';

import React from 'react';
import { useProfessionals } from '../../../hooks/useProfessionals';

interface ProfessionalsTabProps {
  businessId: string;
}

/**
 * Componente para exibir a lista de profissionais na aba "Profissionais" do BarbeariaModal
 * 
 * USO: Substitua a seção {activeTab === "profissionais" && (...)} no BarbeariaModal.tsx
 * por este componente
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path 
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" 
                fill="#9CA3AF"
              />
            </svg>
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
        {professionals.map((professional) => (
          <div
            key={professional.id}
            className="flex items-center justify-between bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#333333] transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {professional.user_avatar_url ? (
                  <img 
                    src={professional.user_avatar_url} 
                    alt={professional.user_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">
                    {professional.user_name?.charAt(0).toUpperCase() || 'P'}
                  </span>
                )}
              </div>

              {/* Informações */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">
                    {professional.user_name || 'Profissional'}
                  </span>
                  {professional.average_rating > 0 && (
                    <div className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
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
            </div>

            {/* Botão Ver mais */}
            <button className="bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex-shrink-0">
              Ver perfil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalsTab;
