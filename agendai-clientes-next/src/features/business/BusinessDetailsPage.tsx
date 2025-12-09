'use client';

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from 'gsap';
import { ArrowLeft, Star, Clock, MapPin, Phone, Store, Scissors, Check } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
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
  const [activeTab, setActiveTab] = useState<"servicos" | "profissionais" | "imagens" | "avaliacoes">("servicos");
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

  const isCurrentlyOpen = (schedule: any): boolean => {
    if (!schedule.ativo) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // minutos desde meia-noite
    
    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const openTime = parseTime(schedule.horarioAbertura);
    const closeTime = parseTime(schedule.horarioFechamento);
    
    // Se tem intervalo, verificar se está no horário de funcionamento (manhã ou tarde)
    if (schedule.intervaloInicio && schedule.intervaloFim) {
      const intervalStart = parseTime(schedule.intervaloInicio);
      const intervalEnd = parseTime(schedule.intervaloFim);
      
      // Está aberto se está entre abertura-intervaloInicio OU intervalFim-fechamento
      return (currentTime >= openTime && currentTime < intervalStart) || 
             (currentTime >= intervalEnd && currentTime < closeTime);
    }
    
    // Sem intervalo, só verificar se está entre abertura e fechamento
    return currentTime >= openTime && currentTime < closeTime;
  };

  const getOpeningHours = () => {
    if (!business?.opening_hours || !Array.isArray(business.opening_hours)) return [];
    
    const currentDay = getDayOfWeek();
    
    return business.opening_hours.map((schedule) => {
      const hasInterval = schedule.intervaloInicio && schedule.intervaloFim;
      let hours = 'Fechado';
      
      if (schedule.ativo) {
        if (hasInterval) {
          hours = `${schedule.horarioAbertura} - ${schedule.intervaloInicio} | ${schedule.intervaloFim} - ${schedule.horarioFechamento}`;
        } else {
          hours = `${schedule.horarioAbertura} - ${schedule.horarioFechamento}`;
        }
      }
      
      // Normalizar strings para comparação (remover acentos e converter para minúsculas)
      const normalizeString = (str: string) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      };
      
      const isToday = normalizeString(schedule.dia) === normalizeString(currentDay);
      
      return {
        day: schedule.dia,
        hours,
        isOpen: schedule.ativo,
        isToday,
        hasInterval,
        schedule, // Manter o schedule original para verificação de horário
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Voltar</span>
          </button>
        </div>
      </div>

      {/* Header com Logo e Nome */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-zinc-800 shrink-0">
              {business.image_url || business.cover_image_url ? (
                <img 
                  src={(business.logo_url || business.image_url || business.cover_image_url) ?? undefined} 
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  <Store size={40} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 truncate">{business.name}</h1>
              <div className="flex items-center gap-1 sm:gap-2">
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

      {/* Imagem de Capa - Full Width */}
      {(business.cover_image_url || business.image_url) && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden">
            <img 
              src={(business.cover_image_url || business.image_url) ?? undefined} 
              alt={business.name}
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
            />
          </div>
        </div>
      )}

      {/* Container Principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Coluna Esquerda - Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs de Navegação */}
            <div className="bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="border-b border-zinc-800">
                <div className="flex overflow-x-auto scrollbar-hide">
                  <button 
                    onClick={() => setActiveTab("servicos")}
                    className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base whitespace-nowrap transition-colors ${
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
                  {/* Lista de Serviços */}
                  <h3 className="text-white font-semibold text-lg mb-4">Serviços</h3>
                  {loadingServices ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : services.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {services.map((service) => (
                        <div key={service.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-800 rounded-xl p-3 sm:p-4 hover:bg-zinc-700 transition-colors gap-3 sm:gap-0">
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
                            onClick={() => handleOpenModal(service)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors"
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
                  {(() => {
                    const schedules = getOpeningHours();
                    const todaySchedule = schedules.find(s => s.isToday);
                    
                    // Verificar se está aberto agora (dia ativo E dentro do horário)
                    const isOpenNow = todaySchedule?.schedule && isCurrentlyOpen(todaySchedule.schedule);
                    
                    // Debug: remover após verificar
                    console.log('Current Day:', getDayOfWeek());
                    console.log('Current Time:', new Date().toLocaleTimeString('pt-BR'));
                    console.log('All Schedules:', schedules);
                    console.log('Today Schedule:', todaySchedule);
                    console.log('Is Open Now:', isOpenNow);
                    
                    return isOpenNow ? (
                      <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Aberto
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Fechado
                      </span>
                    );
                  })()}
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
                      <span className={`text-sm ${
                        schedule.isToday ? 'text-white font-semibold' : 
                        schedule.isOpen ? 'text-zinc-400' : 'text-red-400'
                      }`}>
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
                  <span 
                    key={index} 
                    className="payment-badge bg-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        scale: 1.1,
                        y: -4,
                        backgroundColor: '#4f46e5',
                        color: '#ffffff',
                        duration: 0.3,
                        ease: 'power2.out'
                      });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, {
                        scale: 1,
                        y: 0,
                        backgroundColor: '#27272a',
                        color: '#d4d4d8',
                        duration: 0.3,
                        ease: 'power2.out'
                      });
                    }}
                  >
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
                    <FontAwesomeIcon icon={faWhatsapp} className="text-2xl text-white" />
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
          <Check size={24} strokeWidth={2} />
          <span>Agendamento realizado com sucesso!</span>
        </div>
      )}
    </div>
  );
};
