'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ReservaModal from './components/ReservaModal';
import { useBusinessDetailsViewModel } from './hooks/useBusinessDetailsViewModel';
import {
  LoadingSpinner,
  BusinessNotFound,
  BackButton,
  BusinessHeader,
  TabNavigation,
  TabContent,
  ImageGalleryCard,
  LocationCard,
  OpeningHoursCard,
  SocialLinksCard,
  ContactCard,
  SuccessNotification,
} from './components';

interface BusinessDetailsPageProps {
  businessId: string;
}

/**
 * BusinessDetailsPage - Componente principal
 * 
 * Segue os princípios SOLID:
 * - Single Responsibility: Apenas orquestra a montagem da UI
 * - Open/Closed: Aberto para extensão via novos componentes
 * - Liskov Substitution: Componentes são substituíveis
 * - Interface Segregation: Interfaces específicas para cada componente
 * - Dependency Inversion: Depende de abstrações (hooks, componentes)
 * 
 * Segue o padrão MVVM:
 * - Model: types/index.ts
 * - ViewModel: hooks/useBusinessDetailsViewModel.ts
 * - View: Este arquivo + componentes em components/
 */
export const BusinessDetailsPage: React.FC<BusinessDetailsPageProps> = ({ businessId }) => {
  const router = useRouter();
  
  const {
    state,
    actions,
    business,
    address,
    services,
    professionals,
    isLoading,
    loadingServices,
    loadingProfessionals,
    fullAddress,
    openingHours,
    isCurrentlyOpen,
    carouselImageRef,
  } = useBusinessDetailsViewModel({ businessId });

  // Estados de loading e erro
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!business) {
    return <BusinessNotFound />;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navegação */}
      <BackButton onBack={() => router.back()} />

      {/* Header do Estabelecimento */}
      <BusinessHeader business={business} />

      {/* Container Principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Coluna Esquerda - Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-800 overflow-hidden">
              <TabNavigation 
                activeTab={state.activeTab} 
                onTabChange={actions.setActiveTab} 
              />
              <TabContent
                activeTab={state.activeTab}
                services={services}
                professionals={professionals}
                loadingServices={loadingServices}
                loadingProfessionals={loadingProfessionals}
                onScheduleService={actions.openModal}
              />
            </div>
          </div>

          {/* Coluna Direita - Informações Complementares */}
          <div className="space-y-6">
            {/* Galeria de Imagens */}
            <ImageGalleryCard
              business={business}
              currentImageIndex={state.currentImageIndex}
              onNavigate={actions.handleManualNavigation}
              carouselImageRef={carouselImageRef}
            />

            {/* Localização */}
            {address && (
              <LocationCard address={address} fullAddress={fullAddress} />
            )}

            {/* Horário de Atendimento */}
            {openingHours.length > 0 && (
              <OpeningHoursCard 
                schedules={openingHours} 
                isCurrentlyOpen={isCurrentlyOpen} 
              />
            )}

            {/* Redes Sociais */}
            <SocialLinksCard 
              whatsapp_number={business.whatsapp_number} 
              instagramLink={business.instagram_link}
            />

            {/* Contato */}
            <ContactCard phone={business.phone} />
          </div>
        </div>
      </div>

      {/* Modal de Reserva */}
      <ReservaModal
        isOpen={state.isModalOpen}
        onClose={actions.closeModal}
        service={state.selectedService}
        barbeariaId={businessId}
        onReservationSuccess={actions.showSuccessNotification}
      />

      {/* Notificação de Sucesso */}
      <SuccessNotification show={state.showNotification} />
    </div>
  );
};
