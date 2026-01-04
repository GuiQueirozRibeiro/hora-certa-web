/**
 * Seletor de profissional para reserva.
 */
'use client';

import React from 'react';
import { Check } from 'lucide-react';
import type { ProfessionalSelectorProps } from './types';

export const ProfessionalSelector: React.FC<ProfessionalSelectorProps> = ({
  professionals,
  selectedProfessionalId,
  loading,
  schedules,
  onSelect,
}) => {
  if (professionals.length === 0) return null;

  const getWorkDays = (professionalId: string) => {
    const professionalSchedules = schedules.filter(
      (s) => s.professional_id === professionalId && s.is_active
    );
    const daysMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const workDays = [...new Set(professionalSchedules.map((s) => s.day_of_week))]
      .sort()
      .map((day) => daysMap[day]);
    return workDays.length > 0 ? `Trabalha: ${workDays.join(', ')}` : 'Sem agenda cadastrada';
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3">Selecione o Profissional</h3>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {professionals.map((professional) => (
            <button
              key={professional.id}
              onClick={() => onSelect(professional.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                selectedProfessionalId === professional.id
                  ? 'bg-indigo-500'
                  : 'bg-[#2a2a2a] hover:bg-[#333]'
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
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
              <div className="flex-1 text-left">
                <p className="text-white font-medium text-sm">
                  {professional.user_name || 'Profissional'}
                </p>
                {schedules.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{getWorkDays(professional.id)}</p>
                )}
              </div>

              {/* Check icon */}
              {selectedProfessionalId === professional.id && (
                <Check size={20} className="text-white" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
