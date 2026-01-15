'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, Scissors } from 'lucide-react';
import type { TabType, Service, Professional } from '../types';
import { formatPrice, formatTime } from '../utils';
import { InlineLoadingSpinner } from './LoadingStates';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * Navegação por abas (Serviços, Profissionais, Avaliações).
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'servicos', label: 'Serviços' },
    { id: 'profissionais', label: 'Profissionais' },
    { id: 'avaliacoes', label: 'Avaliações' },
  ];

  return (
    <div className="border-b border-zinc-800">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-indigo-500 bg-zinc-800/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

interface ServiceCardProps {
  service: Service;
  onSchedule: (service: Service) => void;
}

/**
 * Card de serviço com informações e botão de agendar.
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSchedule }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-800 rounded-xl p-3 sm:p-4 hover:bg-zinc-700 transition-colors gap-3 sm:gap-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 rounded-full bg-zinc-900 shrink-0 overflow-hidden">
          {service.image_url ? (
            <Image
              src={service.image_url}
              alt={service.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <Scissors size={24} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold text-base mb-1">{service.name}</h4>
          <p className="text-zinc-400 text-sm mb-1">{service.description || 'Serviço profissional'}</p>
          <div className="flex items-center gap-4">
            <span className="text-green-500 font-bold text-lg">{formatPrice(service.price)}</span>
            <span className="text-zinc-500 text-sm flex items-center gap-1">
              <Clock size={14} />
              {formatTime(service.duration_minutes)}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onSchedule(service)}
        className="bg-indigo-500 hover:bg-indigo-600 text-white w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors cursor-pointer"
      >
        Agendar
      </button>
    </div>
  );
};

interface ServicesListProps {
  services: Service[];
  loading: boolean;
  onSchedule: (service: Service) => void;
}

/**
 * Lista de serviços disponíveis. Exibe loading ou estado vazio quando necessário.
 */
export const ServicesList: React.FC<ServicesListProps> = ({ services, loading, onSchedule }) => {
  if (loading) {
    return <InlineLoadingSpinner />;
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Nenhum serviço disponível no momento</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} onSchedule={onSchedule} />
      ))}
    </div>
  );
};

interface ProfessionalCardProps {
  professional: Professional;
}

/**
 * Card de profissional com avatar e nome.
 */
export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  return (
    <div className="bg-zinc-800 rounded-xl p-4 hover:bg-zinc-700 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-zinc-900 shrink-0 overflow-hidden">
          {professional.user_avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={professional.user_avatar_url}
              alt={professional.user_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
              {professional.user_name?.charAt(0).toUpperCase() || 'P'}
            </div>
          )}
        </div>
        <div>
          <h4 className="text-white font-semibold">{professional.user_name || 'Profissional'}</h4>
        </div>
      </div>
    </div>
  );
};

interface ProfessionalsListProps {
  professionals: Professional[];
  loading: boolean;
}

/**
 * Grid de profissionais. Exibe loading ou estado vazio quando necessário.
 */
export const ProfessionalsList: React.FC<ProfessionalsListProps> = ({ professionals, loading }) => {
  if (loading) {
    return <InlineLoadingSpinner />;
  }

  if (professionals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">Nenhum profissional disponível</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {professionals.map((professional) => (
        <ProfessionalCard key={professional.id} professional={professional} />
      ))}
    </div>
  );
};

interface TabContentProps {
  activeTab: TabType;
  services: Service[];
  professionals: Professional[];
  loadingServices: boolean;
  loadingProfessionals: boolean;
  onScheduleService: (service: Service) => void;
}

/**
 * Container do conteúdo das abas. Renderiza lista de acordo com a aba ativa.
 */
export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  services,
  professionals,
  loadingServices,
  loadingProfessionals,
  onScheduleService,
}) => {
  return (
    <div className="p-6">
      {activeTab === 'servicos' && (
        <>
          <h3 className="text-white font-semibold text-lg mb-4">Serviços</h3>
          <ServicesList services={services} loading={loadingServices} onSchedule={onScheduleService} />
        </>
      )}

      {activeTab === 'profissionais' && (
        <>
          <h3 className="text-white font-semibold text-lg mb-4">Profissionais</h3>
          <ProfessionalsList professionals={professionals} loading={loadingProfessionals} />
        </>
      )}

      {activeTab === 'avaliacoes' && (
        <div className="text-center py-12">
          <p className="text-zinc-400">Avaliações são feitas via aplicativo</p>
        </div>
      )}
    </div>
  );
};
