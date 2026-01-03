// Types e Interfaces para o módulo Business
// Seguindo o princípio de Interface Segregation (ISP)
// Reutiliza tipos globais para manter consistência

import type { 
  Business as GlobalBusiness, 
  Service as GlobalService, 
  Address as GlobalAddress,
  DaySchedule
} from '../../../types/types';

export type TabType = "servicos" | "profissionais" | "imagens" | "avaliacoes";

// Re-exporta tipos globais
export type Business = GlobalBusiness;
export type Service = GlobalService;
export type Address = GlobalAddress;
export type BusinessSchedule = DaySchedule;

export interface ParsedSchedule {
  day: string;
  hours: string;
  isOpen: boolean;
  isToday: boolean;
  hasInterval: boolean;
  schedule: BusinessSchedule;
}

export interface Professional {
  id: string;
  user_name?: string;
  user_avatar_url?: string;
}

export interface BusinessDetailsViewModelState {
  activeTab: TabType;
  isModalOpen: boolean;
  selectedService: Service | null;
  showNotification: boolean;
  currentImageIndex: number;
}

export interface BusinessDetailsViewModelActions {
  setActiveTab: (tab: TabType) => void;
  openModal: (service: Service) => void;
  closeModal: () => void;
  showSuccessNotification: () => void;
  handleManualNavigation: (index: number) => void;
}

export interface UseBusinessDetailsViewModel {
  // State
  state: BusinessDetailsViewModelState;
  
  // Actions
  actions: BusinessDetailsViewModelActions;
  
  // Data
  business: Business | undefined;
  address: Address | undefined;
  services: Service[];
  professionals: Professional[];
  
  // Loading states
  isLoading: boolean;
  loadingServices: boolean;
  loadingProfessionals: boolean;
  
  // Computed
  fullAddress: string;
  openingHours: ParsedSchedule[];
  isCurrentlyOpen: boolean;
  
  // Refs
  carouselImageRef: React.RefObject<HTMLImageElement | null>;
}
