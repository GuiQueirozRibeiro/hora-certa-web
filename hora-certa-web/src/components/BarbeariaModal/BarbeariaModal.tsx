import React, { useState } from "react";
import ReservaModal from "../ReservaModal/ReservaModal";
import { useProfessionals } from "../../hooks/useProfessionals";
import { useServices } from "../../hooks/useServices";
import type { Service } from "../../types/types";

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

interface BarbeariaModalProps {
  barbearia: Barbearia;
  isOpen: boolean;
  onClose: () => void;
  onReservationSuccess: () => void;
}

const BarbeariaModal: React.FC<BarbeariaModalProps> = ({
  barbearia,
  isOpen,
  onClose,
  onReservationSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<
    "servicos" | "profissionais" | "detalhes"
  >("servicos");
  const [isReservaOpen, setIsReservaOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const { professionals, loading, error } = useProfessionals(barbearia.id.toString());

  const { services, loading: loadingServices, error: errorServices } = useServices({businessId: barbearia.id, isActive: true});

  const handleOpenReservaModal = (servico: Service) => {
    setSelectedService(servico);
    setIsReservaOpen(true);
  };


  const handleCloseReservaModal = () => {
    setIsReservaOpen(false);
    setSelectedService(null);
    onClose();
  };

  // Extrair número de telefone de uma URL do WhatsApp
  const extractPhoneFromUrl = (telefoneOrUrl: string): string => {
    // Se for uma URL do WhatsApp, extrair o número
    if (telefoneOrUrl.includes("wa.me/")) {
      const match = telefoneOrUrl.match(/wa\.me\/(\d+)/);
      return match ? match[1] : telefoneOrUrl;
    }
    // Se já for um número, retornar diretamente
    return telefoneOrUrl.replace(/\D/g, "");
  };

  // Formatar número de telefone para exibição
  const formatPhoneNumber = (telefoneOrUrl: string): string => {
    const phoneNumber = extractPhoneFromUrl(telefoneOrUrl);

    // Remover todos os caracteres não numéricos
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Formatar para (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (cleaned.length === 13) {
      // Formato: +55 (XX) XXXXX-XXXX
      return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(
        9
      )}`;
    } else if (cleaned.length === 12) {
      // Formato: +55 (XX) XXXX-XXXX
      return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 8)}-${cleaned.slice(
        8
      )}`;
    } else if (cleaned.length === 11) {
      // Formato: (XX) XXXXX-XXXX
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7
      )}`;
    } else if (cleaned.length === 10) {
      // Formato: (XX) XXXX-XXXX
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
        6
      )}`;
    }

    return phoneNumber;
  };

  const handleCopyPhone = (telefone: string) => {
    const phoneNumber = extractPhoneFromUrl(telefone);
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(telefone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#1a1a1a] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com imagem */}
        <div className="relative h-32 w-full">
          <img
            src={barbearia.imagem}
            alt={barbearia.nome}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          {/* Botão de fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" />
            </svg>
          </button>

          {/* Info da barbearia */}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-0.5">
              {barbearia.nome}
            </h2>
            <p className="text-xs text-gray-300 flex items-center gap-1">
              <span>📍</span>
              {barbearia.endereco}
            </p>
          </div>
        </div>

        {/* Tabs de navegação */}
        <div className="flex border-b border-gray-800 bg-[#0f0f0f]">
          <button
            onClick={() => setActiveTab("servicos")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "servicos"
                ? "text-indigo-500 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Serviços
          </button>
          <button
            onClick={() => setActiveTab("profissionais")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "profissionais"
                ? "text-indigo-500 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Profissionais
          </button>
          <button
            onClick={() => setActiveTab("detalhes")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "detalhes"
                ? "text-indigo-500 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Detalhes
          </button>
        </div>

        {/* Conteúdo das abas */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          {/* Aba Serviços */}
          {activeTab === "servicos" && (
            <div className="p-5">
              {loadingServices && (
                <p className="text-gray-400 text-center">Carregando serviços...</p>
              )}

              {errorServices && (
                <p className="text-red-500 text-center">
                  Erro ao buscar serviços: {errorServices}
                </p>
              )}

              {!loadingServices && !errorServices && (
                <div className="space-y-3">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center gap-4 bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#333333] transition-colors"
                      >
                        <div className="w-16 h-16 rounded-lg bg-[#3a3a3a] flex items-center justify-center flex-shrink-0">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500"
                          >
                            <circle cx="6" cy="6" r="3"></circle>
                            <circle cx="6" cy="18" r="3"></circle>
                            <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                            <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                            <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm mb-0.5">
                            {service.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                            {service.description}
                          </p>
                          <p className="text-sm font-bold text-white">
                            R$ {service.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenReservaModal(service)}
                          className="bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex-shrink-0"
                        >
                          Agendar
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">
                      Nenhum serviço encontrado para esta barbearia.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Aba Profissionais */}
          {activeTab === "profissionais" && (
            <div className="p-5">
              <h3 className="text-white font-semibold text-base mb-4">
                Profissionais
              </h3>

              {/* -> 4. ADICIONE A LÓGICA DE CARREGAMENTO E ERRO */}
              {loading && (
                <p className="text-gray-400 text-center">
                  Carregando profissionais...
                </p>
              )}
              {error && (
                <p className="text-red-500 text-center">
                  Erro ao buscar profissionais: {error}
                </p>
              )}

              {/* -> 5. RENDERIZE A LISTA DE PROFISSIONAIS DO HOOK */}
              {!loading && !error && (
                <div className="space-y-3">
                  {/* Verifique se há profissionais antes de mapear */}
                  {professionals.length > 0 ? (
                    professionals.map((profissional) => (
                      <div
                        key={profissional.id} // Use o ID real do profissional
                        className="flex items-center justify-between bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#333333] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            // Use a URL do avatar do usuário associado
                            src={
                              profissional.user_avatar_url ||
                              "https://i.pravatar.cc/150"
                            } // Uma imagem padrão caso não haja avatar
                            alt={profissional.user_name} // Use o nome real
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <span className="text-white font-medium text-sm">
                            {profissional.user_name} {/* Use o nome real */}
                          </span>
                        </div>
                        <button className="bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                          Ver mais
                        </button>
                      </div>
                    ))
                  ) : (
                    // Mensagem para quando não houver profissionais cadastrados
                    <p className="text-gray-500 text-center">
                      Nenhum profissional encontrado para esta barbearia.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Aba Detalhes */}
          {activeTab === "detalhes" && (
            <div className="p-5">
              {/* Mapa - Clicável para abrir no Google Maps */}
              <div className="mb-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${barbearia.localizacao.lat},${barbearia.localizacao.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative w-full h-48 bg-[#2a2a2a] rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group"
                >
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, pointerEvents: "none" }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${barbearia.localizacao.lat},${barbearia.localizacao.lng}&z=16&output=embed`}
                    className="absolute inset-0"
                  ></iframe>
                  <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                </a>
                <p className="text-white font-semibold text-base mt-3 mb-0.5">
                  {barbearia.nome}
                </p>
                <p className="text-xs text-gray-500">{barbearia.endereco}</p>
              </div>

              {/* Sobre nós */}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-base mb-3">
                  SOBRE NÓS
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Bem-vindo à {barbearia.nome}, onde tradição encontra estilo.
                  Neste espaço acolhedor e refinado, oferecemos serviços de
                  barbearia com um toque de modernidade. Nossa equipe de
                  profissionais especializados está pronta para proporcionar a
                  você uma experiência única e personalizada.
                </p>
              </div>

              {/* Contato - Seguindo design do Figma */}
              <div className="mb-6">
                {barbearia.telefones.map((telefone, index) => (
                  <div key={index} className="mb-3 space-y-2">
                    {/* Botão de entrar em contato via WhatsApp */}
                    <a
                      href={
                        telefone.includes("wa.me/")
                          ? telefone
                          : `https://wa.me/${extractPhoneFromUrl(telefone)}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Entrar em contato
                    </a>

                    {/* Número do telefone com botão de copiar - Estilo do Figma */}
                    <div className="flex items-center justify-between bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                              fill="none"
                              stroke="#888"
                            />
                          </svg>
                        </div>
                        <span className="text-white text-sm font-medium">
                          {formatPhoneNumber(telefone)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyPhone(telefone)}
                        className="bg-transparent text-indigo-500 text-sm font-semibold hover:text-indigo-400 transition-colors px-3 py-1.5"
                      >
                        {copiedPhone === telefone ? "Copiado!" : "Copiar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Horários */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-base">
                    Seguindo
                  </h3>
                  <button className="text-indigo-500 text-xs font-semibold hover:text-indigo-400">
                    Fechado
                  </button>
                </div>
                <div className="space-y-2">
                  {barbearia.horariosFuncionamento.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-400">{item.dia}</span>
                      <span className="text-white">{item.horario}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Em parceria com */}
              <div className="mb-6 text-center">
                <p className="text-gray-500 text-xs mb-2">Em parceria com</p>
                <div className="inline-flex items-center gap-2 text-white font-bold text-xl">
                  <span className="text-indigo-500">FSW</span>
                  <span>BARBER</span>
                </div>
              </div>

              {/* Formas de pagamento */}
              <div>
                <h3 className="text-white font-semibold text-base mb-3">
                  Formas de pagamento
                </h3>
                <div className="flex flex-wrap gap-2">
                  {barbearia.formasPagamento.map((forma, index) => (
                    <span
                      key={index}
                      className="bg-[#2a2a2a] text-gray-400 text-xs px-3 py-2 rounded-lg"
                    >
                      {forma}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReservaModal
        isOpen={isReservaOpen}
        onClose={handleCloseReservaModal}
        service={selectedService}
        barbeariaId={barbearia.id}
        onReservationSuccess={onReservationSuccess}
      />
    </div>
  );
};

export default BarbeariaModal;
