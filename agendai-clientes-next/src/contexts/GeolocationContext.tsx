'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  hasPermission: boolean | null;
  locationName: string | null;
}

interface GeolocationContextType extends GeolocationState {
  requestLocation: () => void;
  clearLocation: () => void;
  hasLocation: boolean;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
  showLocationToast: boolean;
  setShowLocationToast: (show: boolean) => void;
  toastType: 'success' | 'error' | null;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

const LOCATION_ASKED_KEY = 'locationAsked';
const LOCATION_DENIED_KEY = 'locationDenied';
const USER_LAT_KEY = 'userLat';
const USER_LON_KEY = 'userLon';

export const GeolocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    hasPermission: null,
    locationName: null,
  });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showLocationToast, setShowLocationToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);

  // Função para solicitar localização - declarada antes dos useEffects
  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeolocation((prev) => ({
        ...prev,
        error: 'Seu navegador não suporta geolocalização',
        loading: false,
        hasPermission: false,
      }));
      setToastType('error');
      setShowLocationToast(true);
      localStorage.setItem(LOCATION_ASKED_KEY, 'true');
      return;
    }

    setGeolocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Salvar no Local Storage
        localStorage.setItem(USER_LAT_KEY, latitude.toString());
        localStorage.setItem(USER_LON_KEY, longitude.toString());
        localStorage.setItem(LOCATION_ASKED_KEY, 'true');
        localStorage.removeItem(LOCATION_DENIED_KEY); // Limpar estado negado

        setGeolocation({
          latitude,
          longitude,
          error: null,
          loading: false,
          hasPermission: true,
          locationName: null,
        });

        // Mostrar toast de sucesso
        setToastType('success');
        setShowLocationToast(true);
        setShowLocationModal(false);
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

        localStorage.setItem(LOCATION_ASKED_KEY, 'true');
        localStorage.setItem(LOCATION_DENIED_KEY, 'true');

        setGeolocation({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false,
          hasPermission: false,
          locationName: null,
        });

        // Mostrar toast de erro
        setToastType('error');
        setShowLocationToast(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  }, []);

  // Monitorar mudanças na permissão de localização
  useEffect(() => {
    const checkPermissionStatus = async () => {
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          
          // Listener para mudanças de permissão
          const handlePermissionChange = () => {
            console.log('[Geolocation] Permission state changed:', result.state);
            
            if (result.state === 'denied') {
              // Permissão foi revogada - limpar tudo
              localStorage.removeItem(USER_LAT_KEY);
              localStorage.removeItem(USER_LON_KEY);
              localStorage.setItem(LOCATION_DENIED_KEY, 'true');
              
              setGeolocation({
                latitude: null,
                longitude: null,
                error: 'Localização bloqueada',
                loading: false,
                hasPermission: false,
                locationName: null,
              });

              // Mostrar toast de aviso
              setToastType('error');
              setShowLocationToast(true);
            } else if (result.state === 'granted') {
              // Permissão foi concedida - verificar se já temos coordenadas
              const savedLat = localStorage.getItem(USER_LAT_KEY);
              const savedLon = localStorage.getItem(USER_LON_KEY);
              
              // Limpar estado de negado
              localStorage.removeItem(LOCATION_DENIED_KEY);
              
              if (savedLat && savedLon) {
                // Já temos coordenadas salvas, usar elas
                setGeolocation({
                  latitude: parseFloat(savedLat),
                  longitude: parseFloat(savedLon),
                  error: null,
                  loading: false,
                  hasPermission: true,
                  locationName: null,
                });
              } else {
                // Não temos coordenadas, solicitar a localização automaticamente
                console.log('[Geolocation] Permission granted, requesting location...');
                requestLocation();
              }
            } else if (result.state === 'prompt') {
              // Permissão está em estado "perguntar" - limpar estado negado
              const locationDenied = localStorage.getItem(LOCATION_DENIED_KEY);
              if (locationDenied === 'true') {
                localStorage.removeItem(LOCATION_DENIED_KEY);
                setGeolocation(prev => ({
                  ...prev,
                  hasPermission: null,
                }));
              }
            }
          };

          result.addEventListener('change', handlePermissionChange);

          // Verificação inicial
          handlePermissionChange();

          return () => {
            result.removeEventListener('change', handlePermissionChange);
          };
        } catch (error) {
          console.error('[Geolocation] Error checking permission:', error);
        }
      }
    };

    checkPermissionStatus();
  }, [requestLocation]);

  // Verificar se já existe localização salva no Local Storage
  useEffect(() => {
    const savedLat = localStorage.getItem(USER_LAT_KEY);
    const savedLon = localStorage.getItem(USER_LON_KEY);
    const locationAsked = localStorage.getItem(LOCATION_ASKED_KEY);
    const locationDenied = localStorage.getItem(LOCATION_DENIED_KEY);

    if (savedLat && savedLon) {
      setGeolocation({
        latitude: parseFloat(savedLat),
        longitude: parseFloat(savedLon),
        error: null,
        loading: false,
        hasPermission: true,
        locationName: null,
      });
    } else if (locationDenied === 'true') {
      // Usuário já negou anteriormente
      setGeolocation(prev => ({
        ...prev,
        hasPermission: false,
      }));
    } else if (!locationAsked) {
      // Se nunca perguntamos antes, mostrar o modal após um pequeno delay
      const timer = setTimeout(() => {
        setShowLocationModal(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (showLocationToast) {
      const timer = setTimeout(() => {
        setShowLocationToast(false);
        setToastType(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showLocationToast]);

  const clearLocation = useCallback(() => {
    localStorage.removeItem(USER_LAT_KEY);
    localStorage.removeItem(USER_LON_KEY);
    localStorage.removeItem(LOCATION_ASKED_KEY);
    localStorage.removeItem(LOCATION_DENIED_KEY);
    setGeolocation({
      latitude: null,
      longitude: null,
      error: null,
      loading: false,
      hasPermission: null,
      locationName: null,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    localStorage.setItem(LOCATION_ASKED_KEY, 'true');
    localStorage.setItem(LOCATION_DENIED_KEY, 'true');
    setShowLocationModal(false);
    // Marcar como negado para exibir o estado de localização requerida
    setGeolocation(prev => ({
      ...prev,
      hasPermission: false,
    }));
  }, []);

  return (
    <GeolocationContext.Provider
      value={{
        ...geolocation,
        requestLocation,
        clearLocation,
        hasLocation: geolocation.latitude !== null && geolocation.longitude !== null,
        showLocationModal,
        setShowLocationModal: handleCloseModal,
        showLocationToast,
        setShowLocationToast,
        toastType,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
};

export const useGeolocationContext = () => {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error('useGeolocationContext must be used within a GeolocationProvider');
  }
  return context;
};
