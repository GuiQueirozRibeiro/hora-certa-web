import React from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationGranted?: (lat: number, lon: number) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onLocationGranted }) => {
  const { requestLocation, loading, error, latitude, longitude } = useGeolocation();

  if (!isOpen) return null;

  const handleRequestLocation = async () => {
    requestLocation();
    // Aguarda um pouco para verificar se a localização foi obtida
    setTimeout(() => {
      const lat = localStorage.getItem('userLat');
      const lon = localStorage.getItem('userLon');
      if (lat && lon) {
        onLocationGranted?.(parseFloat(lat), parseFloat(lon));
        onClose();
      }
    }, 1000);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleSkip}
    >
      <div
        className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone de Localização */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="#6366f1"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold text-center mb-2">
          Encontrar estabelecimentos próximos
        </h2>

        {/* Descrição */}
        <p className="text-sm text-gray-400 text-center mb-6">
          Permita o acesso à sua localização para encontrarmos os melhores estabelecimentos perto de você
        </p>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Mensagem de sucesso */}
        {latitude && longitude && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
            <p className="text-green-500 text-sm text-center">
              ✓ Localização obtida com sucesso!
            </p>
          </div>
        )}

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={handleRequestLocation}
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-3 px-4 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Obtendo localização...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    fill="white"
                  />
                </svg>
                Permitir localização
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-full bg-transparent hover:bg-white/10 text-gray-400 rounded-lg py-3 px-4 text-sm font-medium transition-colors"
          >
            Agora não
          </button>
        </div>

        {/* Informação de privacidade */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Sua localização é usada apenas para melhorar sua experiência e não será compartilhada
        </p>
      </div>
    </div>
  );
};

export default LocationModal;
