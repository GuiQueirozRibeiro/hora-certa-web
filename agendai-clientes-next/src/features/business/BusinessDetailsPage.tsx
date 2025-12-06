'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Clock, MapPin, Phone } from "lucide-react";
import ReservaModal from "../appointments/components/ReservaModal";
import { useBusinesses } from "../../hooks/Usebusinesses";
import { useBusinessesWithAddresses } from "../../hooks/Usebusinesseswithaddresses ";
import { useServices } from "../../hooks/useServices";
import { useProfessionals } from "../../hooks/useProfessionals";

interface BusinessDetailsPageProps {
  businessId: string;
}

export const BusinessDetailsPage: React.FC<BusinessDetailsPageProps> = ({ businessId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"servicos" | "profissionais" | "imagens" | "localizacao" | "avaliacoes">("servicos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(false);

  const { businesses, loading: loadingBusiness } = useBusinesses({ isActive: true });
  const business = businesses.find(b => b.id === businessId || b.id.toString() === businessId);
  
  const { businesses: businessesWithAddress } = useBusinessesWithAddresses({ isActive: true });
  const businessWithAddress = businessesWithAddress.find(b => b.id === businessId);
  const address = businessWithAddress?.address;

  const { services, loading: loadingServices } = useServices({ businessId, isActive: true });
  const { professionals, loading: loadingProfessionals } = useProfessionals(businessId);

  const handleOpenModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      router.push('/agendamentos');
    }, 2000);
  };

  const getDayOfWeek = () => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[new Date().getDay()];
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 13) {
      return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    }
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getOpeningHours = () => {
    if (!business?.opening_hours) return [];
    
    const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    const dayKeys = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    
    return days.map((day, index) => {
      const dayData = business.opening_hours?.[dayKeys[index]];
      return {
        day,
        hours: dayData?.isClosed ? 'Fechado' : `${dayData?.open || '09:00'} - ${dayData?.close || '18:00'}`,
        isToday: day === getDayOfWeek(),
      };
    });
  };

  if (loadingBusiness || (!business && businesses.length === 0)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">Estabelecimento não encontrado</p>
      </div>
    );
  }

  const fullAddress = address 
    ? `${address.street_address || ''} ${address.number || ''}, ${address.neighborhood || ''} - ${address.city || ''}/${address.state || ''}, ${address.zipcode || ''}`
    : '';

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Botão Voltar */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      {/* Header com Logo e Nome */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-800 shrink-0">
              {business.image_url || business.cover_image_url ? (
                <img 
                  src={(business.logo_url || business.image_url || business.cover_image_url) ?? undefined} 
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{business.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star size={16} fill="#FFD700" color="#FFD700" className="mr-1" />
                  <span className="text-white font-semibold">{business.average_rating.toFixed(1)}</span>
                  <span className="text-zinc-400 text-sm ml-1">({business.total_reviews} avaliações)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Container Principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagem de Capa */}
            {(business.cover_image_url || business.image_url) && (
              <div className="rounded-2xl overflow-hidden">
                <img 
                  src={(business.cover_image_url || business.image_url) ?? undefined} 
                  alt={business.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Tabs de Navegação */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="border-b border-zinc-800">
                <div className="flex overflow-x-auto scrollbar-hide">
                  <button 
                    onClick={() => setActiveTab("servicos")}
                    className={`flex-1 px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                      activeTab === "servicos" 
                        ? "text-white border-b-2 border-indigo-500 bg-zinc-800/30" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Serviços
                  </button>
                  <button 
                    onClick={() => setActiveTab("profissionais")}
                    className={`flex-1 px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                      activeTab === "profissionais" 
                        ? "text-white border-b-2 border-indigo-500 bg-zinc-800/30" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Profissionais
                  </button>
                  <button 
                    onClick={() => setActiveTab("imagens")}
                    className={`flex-1 px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                      activeTab === "imagens" 
                        ? "text-white border-b-2 border-indigo-500 bg-zinc-800/30" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Imagens
                  </button>
                  <button 
                    onClick={() => setActiveTab("localizacao")}
                    className={`flex-1 px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                      activeTab === "localizacao" 
                        ? "text-white border-b-2 border-indigo-500 bg-zinc-800/30" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Localização
                  </button>
                  <button 
                    onClick={() => setActiveTab("avaliacoes")}
                    className={`flex-1 px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                      activeTab === "avaliacoes" 
                        ? "text-white border-b-2 border-indigo-500 bg-zinc-800/30" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Avaliações
                  </button>
                </div>
              </div>

              {/* Conteúdo - Serviços */}
              {activeTab === "servicos" && (
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">Comodidades</h3>
                  <p className="text-zinc-400 text-sm mb-6">Clique no item para obter informações</p>
                  
                  {/* Grid de Comodidades */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    <button className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
                      </svg>
                      <span className="text-white text-sm">Wi-fi</span>
                    </button>
                    
                    <button className="bg-zinc-800 hover:bg-indigo-900/50 border-2 border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      <span className="text-white text-sm">Estacionamento</span>
                    </button>
                    
                    <button className="bg-[#2a2a2a] hover:bg-[#333333] rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors text-gray-500">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                      </svg>
                      <span className="text-sm line-through">Acessibilidade</span>
                    </button>
                    
                    <button className="bg-[#2a2a2a] hover:bg-[#333333] rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors text-gray-500">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span className="text-sm line-through">Atende crianças</span>
                    </button>
                  </div>

                  {/* Lista de Serviços */}
                  <h3 className="text-white font-semibold text-lg mb-4">Serviços</h3>
                  {loadingServices ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : services.length > 0 ? (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between bg-zinc-800 rounded-xl p-4 hover:bg-zinc-700 transition-colors">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 shrink-0 overflow-hidden">
                              {service.image_url ? (
                                <img 
                                  src={service.image_url}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="6" cy="6" r="3"/>
                                    <circle cx="6" cy="18" r="3"/>
                                    <line x1="20" y1="4" x2="8.12" y2="15.88"/>
                                    <line x1="14.47" y1="14.48" x2="20" y2="20"/>
                                    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
                                  </svg>
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
                            onClick={() => handleOpenModal(service)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors ml-4"
                          >
                            Agendar
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Nenhum serviço disponível no momento</p>
                    </div>
                  )}
                </div>
              )}

              {/* Conteúdo - Profissionais */}
              {activeTab === "profissionais" && (
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">Profissionais</h3>
                  {loadingProfessionals ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : professionals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {professionals.map((professional) => (
                        <div key={professional.id} className="bg-zinc-800 rounded-xl p-4 hover:bg-zinc-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-zinc-900 shrink-0 overflow-hidden">
                              {professional.user_avatar_url ? (
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
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-zinc-400">Nenhum profissional disponível</p>
                    </div>
                  )}
                </div>
              )}

              {/* Conteúdo - Imagens */}
              {activeTab === "imagens" && (
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">Galeria de Fotos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {business.cover_image_url && (
                      <div className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer">
                        <img 
                          src={business.cover_image_url ?? undefined}
                          alt="Foto do estabelecimento"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="M21 21l-4.35-4.35"/>
                            <path d="M11 8v6M8 11h6"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    {business.image_url && business.image_url !== business.cover_image_url && (
                      <div className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer">
                        <img 
                          src={business.image_url ?? undefined}
                          alt="Foto do estabelecimento"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="M21 21l-4.35-4.35"/>
                            <path d="M11 8v6M8 11h6"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    {(!business.cover_image_url && !business.image_url) && (
                      <div className="col-span-2 md:col-span-3 text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600 mb-4">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <p className="text-zinc-400">Nenhuma imagem disponível</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conteúdo - Localização */}
              {activeTab === "localizacao" && (
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">Localização</h3>
                  {address ? (
                    <>
                      <div className="mb-4">
                        <p className="text-zinc-400 mb-2">
                          {address.street_address}, {address.number}
                          {address.complement && ` - ${address.complement}`}
                        </p>
                        <p className="text-zinc-400">
                          {address.neighborhood} - {address.city}/{address.state}
                        </p>
                        <p className="text-zinc-400">CEP: {address.zipcode}</p>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-zinc-800">
                        <iframe
                          width="100%"
                          height="400"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
                            `${address.street_address}, ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.zipcode}`
                          )}`}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin size={48} className="text-zinc-600 mx-auto mb-4" />
                      <p className="text-zinc-400">Endereço não disponível</p>
                    </div>
                  )}
                </div>
              )}

              {/* Outros tabs (placeholders) */}
              {activeTab === "avaliacoes" && (
                <div className="p-6 text-center py-12">
                  <p className="text-zinc-400">Avaliações em breve</p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita - Informações Complementares */}
          <div className="space-y-6">
            {/* Localização */}
            {address && (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">Localização</h3>
                  
                  {/* Mapa */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-4 rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                  >
                    <iframe
                      width="100%"
                      height="200"
                      style={{ border: 0, pointerEvents: 'none' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=16&output=embed`}
                    />
                  </a>
                  
                  <p className="text-zinc-300 text-sm mb-1 font-medium">{fullAddress}</p>
                  
                  {/* Botão de direções */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 mt-4 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg transition-colors"
                  >
                    <MapPin size={18} />
                    <span className="font-medium text-sm">Como chegar</span>
                  </a>
                </div>
              </div>
            )}

            {/* Horário de Atendimento */}
            {business.opening_hours && (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">Horário de atendimento</h3>
                  <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Aberto
                  </span>
                </div>
                
                <div className="space-y-3">
                  {getOpeningHours().map((schedule, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between ${
                        schedule.isToday ? 'bg-zinc-800 -mx-2 px-2 py-2 rounded-lg' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${schedule.isToday ? 'text-white font-semibold' : 'text-zinc-400'}`}>
                          {schedule.day}
                        </span>
                        {schedule.isToday && (
                          <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                            Hoje
                          </span>
                        )}
                      </div>
                      <span className={`text-sm ${schedule.isToday ? 'text-white font-semibold' : 'text-zinc-400'}`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formas de Pagamento */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Formas de pagamento</h3>
              <div className="flex flex-wrap gap-2">
                {['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix'].map((payment, index) => (
                  <span key={index} className="bg-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-lg">
                    {payment}
                  </span>
                ))}
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                {business.whatsapp_link && (
                  <a
                    href={business.whatsapp_link.includes('wa.me') ? business.whatsapp_link : `https://wa.me/${business.whatsapp_link.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Contato */}
            {business.phone && (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Contato</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
                        <Phone size={20} color="#888" />
                      </div>
                      <span className="text-white text-sm">{formatPhone(business.phone)}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(business.phone || '');
                      }}
                      className="text-indigo-500 text-xs font-semibold hover:text-indigo-400"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Reserva */}
      <ReservaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
        barbeariaId={businessId}
        onReservationSuccess={handleShowNotification}
      />

      {/* Notificação de Sucesso */}
      {showNotification && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Agendamento realizado com sucesso!</span>
        </div>
      )}
    </div>
  );
};
