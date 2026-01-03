'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useBusinesses } from '../../../hooks/Usebusinesses';
import { useBusinessesWithAddresses } from '../../../hooks/Usebusinesseswithaddresses ';
import { useServices } from '../../../hooks/useServices';
import { useProfessionals } from '../../../hooks/useProfessionals';
import { getOpeningHours, checkIsOpenNow } from '../utils';
import type { 
  TabType, 
  Service, 
  UseBusinessDetailsViewModel,
  Address,
  BusinessSchedule
} from '../types';

const CAROUSEL_AUTOPLAY_INTERVAL = 4000;

interface UseBusinessDetailsViewModelProps {
  businessId: string;
}

/**
 * ViewModel para BusinessDetailsPage
 * Segue o padrão MVVM separando lógica de negócio da apresentação
 * Aplica o princípio de Single Responsibility (SRP)
 */
export const useBusinessDetailsViewModel = ({ 
  businessId 
}: UseBusinessDetailsViewModelProps): UseBusinessDetailsViewModel => {
  const router = useRouter();
  
  // State
  const [activeTab, setActiveTab] = useState<TabType>('servicos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Refs
  const carouselImageRef = useRef<HTMLImageElement | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Data fetching
  const { businesses, loading: loadingBusiness } = useBusinesses({ isActive: true });
  const business = businesses.find(b => b.id === businessId || b.id.toString() === businessId);
  
  const { businesses: businessesWithAddress } = useBusinessesWithAddresses({ isActive: true });
  const businessWithAddress = businessesWithAddress.find(b => b.id === businessId);
  const address = businessWithAddress?.address as Address | undefined;
  
  const { services, loading: loadingServices } = useServices({ businessId, isActive: true });
  const { professionals, loading: loadingProfessionals } = useProfessionals(businessId);
  
  // Função para mudar imagem com animação GSAP
  const changeImageWithAnimation = useCallback((newIndex: number) => {
    if (carouselImageRef.current) {
      gsap.to(carouselImageRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentImageIndex(newIndex);
          gsap.fromTo(
            carouselImageRef.current,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
          );
        }
      });
    } else {
      setCurrentImageIndex(newIndex);
    }
  }, []);
  
  // Autoplay do carrossel
  useEffect(() => {
    if (business?.images && business.images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        const nextIndex = (currentImageIndex + 1) % business.images!.length;
        changeImageWithAnimation(nextIndex);
      }, CAROUSEL_AUTOPLAY_INTERVAL);
      
      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [currentImageIndex, business?.images, changeImageWithAnimation]);
  
  // Actions
  const handleManualNavigation = useCallback((newIndex: number) => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    changeImageWithAnimation(newIndex);
  }, [changeImageWithAnimation]);
  
  const openModal = useCallback((service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  }, []);
  
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedService(null);
  }, []);
  
  const showSuccessNotification = useCallback(() => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      router.push('/agendamentos');
    }, 2000);
  }, [router]);
  
  // Computed values
  const fullAddress = address 
    ? `${address.street_address || ''} ${address.number || ''}, ${address.neighborhood || ''} - ${address.city || ''}/${address.state || ''}, ${address.zipcode || ''}`
    : '';
  
  const openingHours = getOpeningHours(business?.opening_hours as BusinessSchedule[] | undefined);
  const isCurrentlyOpenNow = checkIsOpenNow(business?.opening_hours as BusinessSchedule[] | undefined);
  const isLoading = loadingBusiness || (!business && businesses.length === 0);
  
  return {
    // State
    state: {
      activeTab,
      isModalOpen,
      selectedService,
      showNotification,
      currentImageIndex,
    },
    
    // Actions
    actions: {
      setActiveTab,
      openModal,
      closeModal,
      showSuccessNotification,
      handleManualNavigation,
    },
    
    // Data
    business: business as any,
    address,
    services: services as Service[],
    professionals: professionals as any[],
    
    // Loading states
    isLoading,
    loadingServices,
    loadingProfessionals,
    
    // Computed
    fullAddress,
    openingHours,
    isCurrentlyOpen: isCurrentlyOpenNow,
    
    // Refs
    carouselImageRef,
  };
};
