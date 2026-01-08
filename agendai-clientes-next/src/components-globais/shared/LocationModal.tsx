import React from 'react';
import { MapPin } from 'lucide-react';
import { useGeolocationContext } from '../../contexts/GeolocationContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationGranted?: (lat: number, lon: number) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onLocationGranted }) => {
  const { requestLocation, loading, error, latitude, longitude } = useGeolocationContext();

  if (!isOpen) return null;

  const handleRequestLocation = () => {
    requestLocation();
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
            <MapPin size={32} className="text-indigo-500" fill="#6366f1" />
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
                <MapPin size={18} className="text-white" fill="white" />
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
