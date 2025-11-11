import React, { useState, useMemo, useEffect } from "react";
import BarbeariaModal from "./../components/BarbeariaModal/BarbeariaModal";
import NextAppointments from "../components/Nextappointments/Nextappointments";
import { useBusinessesWithAddresses } from "../hooks/Usebusinesseswithaddresses ";
import { useAuth } from "../hooks/useAuth";
import { useAppointments } from "../hooks/Useappointments";

interface Barbearia {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  imagem: string;
  telefones: string[];
  formasPagamento: string[];
  horariosFuncionamento: { dia: string; horario: string }[];
  localizacao: { lat: number; lng: number };
}

const InicioPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage1, setCurrentPage1] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);
  const [selectedBarbearia, setSelectedBarbearia] = useState<Barbearia | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  // Verificar se há agendamentos
  const { user } = useAuth();
  const { appointments } = useAppointments({});
  const hasUpcomingAppointments = user && appointments.some(
    (apt) => (apt.status === 'scheduled' || apt.status === 'confirmed')
  );

  // Buscar estabelecimentos do Supabase
  const { businesses, loading, error } = useBusinessesWithAddresses({
    isActive: true,
    searchTerm: searchTerm,
  });

  // DEBUG: Log para verificar o que está sendo retornado
  useEffect(() => {
    console.log('=== DEBUG InicioPage ===');
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Businesses:', businesses);
    console.log('Businesses length:', businesses?.length);
    console.log('=======================');
  }, [businesses, loading, error]);

  // Converter dados do Supabase para o formato esperado
  const convertBusinessToBarbearia = (business: any): Barbearia => {
    console.log('Converting business:', business);
    
    const address = business.address;
    const addressString = address
      ? `${address.street_address || ''}, ${address.number || ''} - ${address.neighborhood || ''}, ${address.city || ''}`
      : 'Endereço não disponível';

    // Converter opening_hours do formato JSONB para o formato esperado
    const horariosFuncionamento = business.opening_hours
      ? Object.entries(business.opening_hours).map(([dia, horario]: [string, any]) => ({
          dia: dia,
          horario: horario.isClosed ? 'Fechado' : `${horario.open} - ${horario.close}`,
        }))
      : [
          { dia: "Segunda-feira", horario: "09:00 - 21:00" },
          { dia: "Terça-feira", horario: "09:00 - 21:00" },
          { dia: "Quarta-feira", horario: "09:00 - 21:00" },
          { dia: "Quinta-feira", horario: "09:00 - 21:00" },
          { dia: "Sexta-feira", horario: "09:00 - 21:00" },
          { dia: "Sábado", horario: "08:00 - 17:00" },
          { dia: "Domingo", horario: "Fechado" },
        ];

    return {
      id: business.id,
      nome: business.name,
      endereco: addressString,
      horario: "08:00 as 18:00",
      imagem: business.cover_image_url || business.image_url || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop",
      telefones: business.whatsapp_link ? [business.whatsapp_link] : ["Telefone não disponível"],
      formasPagamento: ["Dinheiro", "Cartão de crédito", "Cartão de débito", "Pix"],
      horariosFuncionamento,
      localizacao: { lat: -15.7942, lng: -47.8822 },
    };
  };

  // Memoizar a conversão dos dados
  const barbeariasList = useMemo(() => {
    if (!businesses || !businesses.length) {
      console.log('No businesses to convert');
      return [];
    }
    console.log('Converting businesses:', businesses.length);
    return businesses.map(convertBusinessToBarbearia);
  }, [businesses]);

  // Dividir em dois carrosséis (metade para cada um)
  const midPoint = Math.ceil(barbeariasList.length / 2);
  const barbearias1 = barbeariasList.slice(0, midPoint);
  const barbearias2 = barbeariasList.slice(midPoint);

  // Carrossel - 4 itens por página (1 linha de 4)
  const itemsPerPage = 4;
  const totalPages1 = Math.ceil(barbearias1.length / itemsPerPage);
  const totalPages2 = Math.ceil(barbearias2.length / itemsPerPage);

  const startIndex1 = currentPage1 * itemsPerPage;
  const barbeariasPagina1 = barbearias1.slice(
    startIndex1,
    startIndex1 + itemsPerPage
  );

  const startIndex2 = currentPage2 * itemsPerPage;
  const barbeariasPagina2 = barbearias2.slice(
    startIndex2,
    startIndex2 + itemsPerPage
  );

  const handleNext1 = () => {
    setCurrentPage1((prev) => (prev < totalPages1 - 1 ? prev + 1 : 0));
  };

  const handleNext2 = () => {
    setCurrentPage2((prev) => (prev < totalPages2 - 1 ? prev + 1 : 0));
  };

  const handleOpenModal = (barbearia: Barbearia) => {
    setSelectedBarbearia(barbearia);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBarbearia(null);
  };

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Renderizar estados de loading e erro
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando estabelecimentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <p className="text-gray-400 mb-2">Erro ao carregar estabelecimentos</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#26272B] text-white pb-10 m-0">
      {/* Notificação de sucesso */}
      {showNotification && (
        <div className="fixed top-28 right-10 bg-[#1f1f1f] rounded-lg shadow-lg p-3 flex items-center gap-3 z-50 overflow-hidden">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">
              Horário agendado
            </h4>
            <p className="text-xs text-gray-400">
              Seu horário foi agendado com suceso!
            </p>
          </div>
          <div 
            className="absolute bottom-0 left-0 h-1 bg-indigo-500"
            style={{
              animation: 'progress-bar-timer 3s linear forwards'
            }}
          />
        </div>
      )}

      {/* Próximos Agendamentos e Search Bar */}
      <div className="max-w-[1400px] mx-auto px-16 pt-8">
        {hasUpcomingAppointments ? (
          /* Layout: Agendamentos à esquerda ocupando espaço de 1 card, Search Bar ao lado */
          <div className="flex gap-6 mb-8">
            {/* Agendamentos - largura de 1 card */}
            <div className="w-[calc((100%-4.5rem)/4)]">
              <NextAppointments />
            </div>

            {/* Search Bar - ocupa o restante do espaço */}
            <div className="flex-1">
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 bg-[#0000009a] border border-[#3a3a3a] rounded-lg px-5 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
                  placeholder="Buscar Barbearia"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage1(0);
                    setCurrentPage2(0);
                  }}
                />
                <button className="bg-indigo-500 rounded-lg w-12 h-12 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                    <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Layout sem agendamentos: Apenas Search Bar */
          <div className="mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 bg-[#0000009a] border border-[#3a3a3a] rounded-lg px-5 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
                placeholder="Buscar Barbearia"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage1(0);
                  setCurrentPage2(0);
                }}
              />
              <button className="bg-indigo-500 rounded-lg w-12 h-12 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                  <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mensagem quando não há resultados */}
      {barbeariasList.length === 0 && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-500 mb-4">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-gray-400 text-lg mb-2">Nenhum estabelecimento encontrado</p>
            <p className="text-sm text-gray-500">
              {searchTerm ? `Não encontramos resultados para "${searchTerm}"` : 'Não há estabelecimentos cadastrados'}
            </p>
          </div>
        </div>
      )}

      {/* Primeiro Carrossel */}
      {barbeariasPagina1.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-16 mt-12">
          <div className="relative">
            <div className="grid grid-cols-4 gap-6">
              {barbeariasPagina1.map((barbearia) => (
                <div
                  key={barbearia.id}
                  className="bg-zinc-700 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.2)] transition-all cursor-pointer"
                  onClick={() => handleOpenModal(barbearia)}
                >
                  <div className="w-full h-40 overflow-hidden relative">
                    <img
                      src={barbearia.imagem}
                      alt={barbearia.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-white mb-2">
                      {barbearia.nome}
                    </h3>
                    <p className="text-xs text-zinc-200 mb-1 flex items-center gap-1.5">
                      <span>📍</span>
                      {barbearia.endereco}
                    </p>
                    <p className="text-xs text-zinc-200 mb-4">
                      {barbearia.horario}
                    </p>
                    <button className="w-full bg-indigo-500 rounded-lg py-3 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors">
                      Reservar horário
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages1 > 1 && (
              <button
                className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20 hover:border-indigo-500 transition-all"
                onClick={handleNext1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Segundo Carrossel */}
      {barbeariasPagina2.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-16 mt-12">
          <div className="relative">
            <div className="grid grid-cols-4 gap-6">
              {barbeariasPagina2.map((barbearia) => (
                <div
                  key={barbearia.id}
                  className="bg-zinc-700 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.2)] transition-all cursor-pointer"
                  onClick={() => handleOpenModal(barbearia)}
                >
                  <div className="w-full h-40 overflow-hidden relative">
                    <img
                      src={barbearia.imagem}
                      alt={barbearia.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-white mb-2">
                      {barbearia.nome}
                    </h3>
                    <p className="text-xs text-zinc-200 mb-1 flex items-center gap-1.5">
                      <span>📍</span>
                      {barbearia.endereco}
                    </p>
                    <p className="text-xs text-zinc-200 mb-4">
                      {barbearia.horario}
                    </p>
                    <button className="w-full bg-indigo-500 rounded-lg py-3 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors">
                      Reservar horário
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages2 > 1 && (
              <button
                className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20 hover:border-indigo-500 transition-all"
                onClick={handleNext2}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedBarbearia && (
        <BarbeariaModal
          barbearia={selectedBarbearia}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onReservationSuccess={handleShowNotification}
        />
      )}
    </div>
  );
};

export default InicioPage;