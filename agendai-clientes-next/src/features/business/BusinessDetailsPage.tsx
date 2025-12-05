'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Phone, Star } from "lucide-react";
import ReservaModal from "../../features/appointments/components/ReservaModal";
import { useProfessionals } from "../../hooks/useProfessionals";
import { useServices } from "../../hooks/useServices";
import { useBusinesses } from "../../hooks/Usebusinesses";
import type { Service } from "../../types/types";

interface BusinessDetailsPageProps {
  businessId: string;
}

export const BusinessDetailsPage: React.FC<BusinessDetailsPageProps> = ({ businessId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"servicos" | "profissionais" | "fidelidade" | "produtos" | "avaliacoes">("servicos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const { businesses, loading: loadingBusiness } = useBusinesses({ isActive: true });
  const business = businesses.find(b => b.id === businessId || b.id.toString() === businessId);

  const { professionals, loading: loadingProfessionals } = useProfessionals(businessId);
  const { services, loading: loadingServices } = useServices({ businessId, isActive: true });

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      router.push('/agendamentos');
    }, 2000);
  };

  // Sempre mostra loading enquanto carrega ou enquanto não encontrou
  if (loadingBusiness || (!business && businesses.length === 0)) {
    return (
      <div className="min-h-screen bg-[#26272B] flex items-center justify-center">
        <div className="text-white text-lg">Carregando estabelecimento...</div>
      </div>
    );
  }

  // Só mostra "não encontrado" se terminou de carregar e realmente não encontrou
  if (!loadingBusiness && !business) {
    return (
      <div className="min-h-screen bg-[#26272B] flex flex-col items-center justify-center gap-4">
        <div className="text-white text-lg">Empresa não encontrada</div>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
        >
          Voltar para Início
        </button>
      </div>
    );
  }

  // Guard: neste ponto, business definitivamente existe
  if (!business) return null;

  return (
    <div className="min-h-screen bg-zinc-900 text-white pb-10">
      {/* Header da Empresa */}
      <div className="relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="h-48 bg-zinc-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
              {business.logo_url ? (
                <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">{business.name[0]}</span>
              )}
            </div>
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Star size={16} className="fill-yellow-500 text-yellow-500" />
              <span className="text-sm">5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {business.phone && (
            <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg">
              <Phone size={20} className="text-indigo-500" />
              <div>
                <p className="text-sm text-zinc-400">Contato</p>
                <p className="font-medium">{business.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-md mr-92">
            <Clock size={20} className="text-indigo-500" />
            <div>
              <p className="text-sm text-zinc-400">Horário</p>
              <p className="font-medium">08:00 - 19:00</p>
            </div>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <nav className="flex gap-4 border-b border-zinc-700 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("servicos")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition ${
              activeTab === "servicos"
                ? "text-indigo-500 border-b-2 border-indigo-500"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Serviços
          </button>
          <button
            onClick={() => setActiveTab("profissionais")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition ${
              activeTab === "profissionais"
                ? "text-indigo-500 border-b-2 border-indigo-500"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Profissionais
          </button>
          <button
            onClick={() => setActiveTab("fidelidade")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition ${
              activeTab === "fidelidade"
                ? "text-indigo-500 border-b-2 border-indigo-500"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Fidelidade
          </button>
          <button
            onClick={() => setActiveTab("produtos")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition ${
              activeTab === "produtos"
                ? "text-indigo-500 border-b-2 border-indigo-500"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab("avaliacoes")}
            className={`px-4 py-3 font-medium whitespace-nowrap transition ${
              activeTab === "avaliacoes"
                ? "text-indigo-500 border-b-2 border-indigo-500"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Avaliações
          </button>
        </nav>

        {/* Conteúdo das Tabs */}
        <div className="pb-10">
          {activeTab === "servicos" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Serviços</h2>
              {loadingServices ? (
                <p className="text-zinc-400">Carregando serviços...</p>
              ) : services.length === 0 ? (
                <p className="text-zinc-400">Nenhum serviço disponível.</p>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="p-4 bg-zinc-800 rounded-lg flex items-center justify-between hover:bg-zinc-700 transition"
                    >
                      <div className="flex items-center gap-4">
                        {service.image_url && (
                          <img
                            src={service.image_url}
                            alt={service.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          {service.description && (
                            <p className="text-sm text-zinc-400">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-green-500 font-bold">
                              R$ {service.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-zinc-400">
                              <Clock size={14} className="inline mr-1" />
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenModal(service)}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
                      >
                        Agendar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profissionais" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Profissionais</h2>
              {loadingProfessionals ? (
                <p className="text-zinc-400">Carregando profissionais...</p>
              ) : professionals.length === 0 ? (
                <p className="text-zinc-400">Nenhum profissional disponível.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {professionals.map((professional) => {
                    const displayName = professional.user_name || 'Profissional';
                    const avatarUrl = professional.user_avatar_url;
                    
                    return (
                      <div
                        key={professional.id}
                        className="p-4 bg-zinc-800 rounded-lg text-center"
                      >
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bold">
                              {displayName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold">{displayName}</h3>
                        {professional.bio && (
                          <p className="text-sm text-zinc-400 mt-1">{professional.bio}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "fidelidade" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Fidelidade</h2>
              <p className="text-zinc-400">Nenhum programa de fidelidade disponível.</p>
            </div>
          )}

          {activeTab === "produtos" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Produtos</h2>
              <p className="text-zinc-400">Nenhum produto encontrado.</p>
            </div>
          )}

          {activeTab === "avaliacoes" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Avaliações</h2>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="font-bold">C</span>
                    </div>
                    <div>
                      <p className="font-semibold">Carlos Jr</p>
                      <p className="text-xs text-zinc-400">05/12/2024 16:16</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className="fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Agendamento */}
      <ReservaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
        barbeariaId={businessId}
        onReservationSuccess={handleShowNotification}
      />
    </div>
  );
};
