import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  hasPermission: boolean | null;
}

export const useGeolocation = () => {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    hasPermission: null,
  });

  // Verificar se já existe localização salva no Local Storage
  useEffect(() => {
    const savedLat = localStorage.getItem('userLat');
    const savedLon = localStorage.getItem('userLon');

    if (savedLat && savedLon) {
      setGeolocation({
        latitude: parseFloat(savedLat),
        longitude: parseFloat(savedLon),
        error: null,
        loading: false,
        hasPermission: true,
      });
    }
  }, []);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeolocation({
        latitude: null,
        longitude: null,
        error: 'Seu navegador não suporta geolocalização',
        loading: false,
        hasPermission: false,
      });
      return;
    }

    setGeolocation(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Salvar no Local Storage
        localStorage.setItem('userLat', latitude.toString());
        localStorage.setItem('userLon', longitude.toString());

        setGeolocation({
          latitude,
          longitude,
          error: null,
          loading: false,
          hasPermission: true,
        });
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Você negou o acesso à localização';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informações de localização indisponíveis';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo esgotado ao tentar obter localização';
            break;
        }

        setGeolocation({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false,
          hasPermission: false,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos
      }
    );
  };

  const clearLocation = () => {
    localStorage.removeItem('userLat');
    localStorage.removeItem('userLon');
    setGeolocation({
      latitude: null,
      longitude: null,
      error: null,
      loading: false,
      hasPermission: null,
    });
  };

  return {
    ...geolocation,
    requestLocation,
    clearLocation,
    hasLocation: geolocation.latitude !== null && geolocation.longitude !== null,
  };
};
