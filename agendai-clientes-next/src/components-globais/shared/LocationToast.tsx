'use client';

import React from 'react';
import { MapPin, X, AlertCircle } from 'lucide-react';

interface LocationToastProps {
  show: boolean;
  type: 'success' | 'error' | null;
  latitude?: number | null;
  longitude?: number | null;
  errorMessage?: string | null;
  onClose: () => void;
}

export const LocationToast: React.FC<LocationToastProps> = ({
  show,
  type,
  latitude,
  longitude,
  errorMessage,
  onClose,
}) => {
  if (!show || !type) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-28 right-4 sm:right-10 bg-[#1f1f1f] rounded-lg shadow-lg p-4 flex items-start gap-3 z-50 overflow-hidden max-w-sm animate-slide-in-right`}
      role="alert"
      aria-live="polite"
    >
      {/* Ícone */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}
      >
        {isSuccess ? (
          <MapPin size={20} className="text-green-500" fill="#22c55e" />
        ) : (
          <AlertCircle size={20} className="text-red-500" />
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold text-sm ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
          {isSuccess ? 'Localização obtida!' : 'Localização indisponível'}
        </h4>
        <p className="text-xs text-gray-400 mt-1">
          {isSuccess
            ? 'Localização Obtida com sucesso'
            : errorMessage || 'Não foi possível obter sua localização'}
        </p>
        {isSuccess && (
          <p className="text-xs text-gray-500 mt-1">
            Agora você verá estabelecimentos próximos a você 
          </p>
        )}
      </div>

      {/* Botão de fechar */}
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-white transition-colors p-1"
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>

      {/* Barra de progresso */}
      <div
        className={`absolute bottom-0 left-0 h-1 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}
        style={{
          animation: 'progress-bar-timer 4s linear forwards',
        }}
      />
    </div>
  );
};

export default LocationToast;
