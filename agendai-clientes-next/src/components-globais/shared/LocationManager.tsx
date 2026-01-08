'use client';

import React from 'react';
import { useGeolocationContext } from '../../contexts/GeolocationContext';
import LocationModal from './LocationModal';
import { LocationToast } from './LocationToast';

/**
 * Componente que gerencia a exibição do modal de localização e o toast de feedback.
 * Deve ser usado dentro do GeolocationProvider.
 */
export const LocationManager: React.FC = () => {
  const {
    showLocationModal,
    setShowLocationModal,
    showLocationToast,
    setShowLocationToast,
    toastType,
    latitude,
    longitude,
    error,
    requestLocation,
  } = useGeolocationContext();

  const handleLocationGranted = (lat: number, lon: number) => {
    // A lógica já está no contexto, apenas fechamos o modal
    setShowLocationModal(false);
  };

  return (
    <>
      {/* Modal de solicitação de localização */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationGranted={handleLocationGranted}
      />

      {/* Toast de feedback */}
      <LocationToast
        show={showLocationToast}
        type={toastType}
        latitude={latitude}
        longitude={longitude}
        errorMessage={error}
        onClose={() => setShowLocationToast(false)}
      />
    </>
  );
};

export default LocationManager;
