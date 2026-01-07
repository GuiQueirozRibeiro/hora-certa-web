'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useAppointments } from "../../hooks/Useappointments";
import { useFavorites } from "../../hooks/useFavorites";
import { useBusinessesWithAddresses } from "../../hooks/Usebusinesseswithaddresses ";
import { useSearchDebounce } from "./hooks/useSearchDebounce";
import { useBusinessData, type Business } from "./hooks/useBusinessData";
import { useGeolocationContext } from "../../contexts/GeolocationContext";
import { SearchBar } from "./components/SearchBar";
import { BusinessCard } from "./components/BusinessCard";
import { LoadingState, ErrorState, EmptyState } from "./components/EmptyStates";
import { SuccessNotification } from "./components/SuccessNotification";
import { LocationRequiredState } from "./components/LocationRequiredState";
import NextAppointments from "../appointments/components/NextAppointments";
import { createBusinessSlug } from "../../lib/slugify";

export const HomePage: React.FC = () => {
  // State Management
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);

  // Geolocation Context
  const { 
    hasLocation, 
    hasPermission, 
    requestLocation, 
    loading: locationLoading 
  } = useGeolocationContext();

  // Custom Hooks
  const { searchTerm, debouncedValue, isSearching, setSearchTerm } = useSearchDebounce();
  const { user } = useAuth();
  const { appointments } = useAppointments({});
  const { isFavorited, addFavorite, removeFavorite } = useFavorites();

  // Data Fetching - só busca se tiver localização
  const { businesses, loading, error } = useBusinessesWithAddresses({
    isActive: true,
    searchTerm: debouncedValue,
  });

  // Data Transformation
  const businessList = useBusinessData(businesses);

  // Verificar se deve mostrar estado de localização requerida
  // Mostra quando: não tem localização E (permissão foi negada OU ainda não foi perguntado e modal fechou)
  const showLocationRequired = !hasLocation && hasPermission === false;

  // Computed Values
  const hasUpcomingAppointments = user && appointments.some(
    (apt) => (apt.status === 'scheduled' || apt.status === 'confirmed')
  );

  // Event Handlers
  const handleOpenBusiness = (business: Business) => {
    const slug = createBusinessSlug(business.nome);
    router.push(`/empresa/${slug}`);
  };

  const handleToggleFavorite = async (businessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Você precisa estar logado para favoritar');
      return;
    }

    const favoritado = isFavorited(businessId);
    if (favoritado) {
      await removeFavorite(businessId, true);
    } else {
      await addFavorite(businessId);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#26272B] text-white pb-10">
      {/* Notification */}
      <SuccessNotification show={showNotification} />

      {/* Search Section - só mostra se tiver localização */}
      {!showLocationRequired && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 pt-6 sm:pt-8">
          <NextAppointments />
          <div className="mb-6 sm:mb-8">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isSearching={isSearching}
            />
          </div>
        </div>
      )}

      {/* Estado de Localização Requerida */}
      {showLocationRequired && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 pt-6 sm:pt-8">
          <LocationRequiredState 
            onRequestLocation={requestLocation}
            loading={locationLoading}
          />
        </div>
      )}

      {/* Content States - só mostra se tiver localização */}
      {!showLocationRequired && (
        <>
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}
          {businessList.length === 0 && !loading && !error && (
            <EmptyState searchTerm={searchTerm} />
          )}

          {/* Business Grid */}
          {!loading && !error && businessList.length > 0 && (
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 mt-8 sm:mt-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {businessList.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    isFavorited={isFavorited(business.id)}
                    onCardClick={() => handleOpenBusiness(business)}
                    onToggleFavorite={(e) => handleToggleFavorite(business.id, e)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
