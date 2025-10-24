import React, { useState } from "react";
import ReservaModal from "../ReservaModal/ReservaModal";

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
}

interface Profissional {
  id: number;
  nome: string;
  foto: string;
}

interface Barbearia {
  id: number;
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
}

const BarbeariaModal: React.FC<BarbeariaModalProps> = ({
  barbearia,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "servicos" | "profissionais" | "detalhes"
  >("servicos");
  const [isReservaOpen, setIsReservaOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleOpenReservaModal = (servico) => {
    setSelectedService(servico);
    setIsReservaOpen(true);
  };

  const handleCloseReservaModal = () => {
    setIsReservaOpen(false);
    setSelectedService(null);
  };
  // Dados mock de serviços
  const servicos: Servico[] = [
    {
      id: 1,
      nome: "Corte de Cabelo",
      descricao: "Corte moderno e estilizado conforme seu gosto",
      preco: 45.0,
      imagem:
        "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      nome: "Barba",
      descricao: "Aparo e modelagem de barba profissional",
      preco: 35.0,
      imagem:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      nome: "Sobrancelha",
      descricao: "Design e modelagem de sobrancelhas",
      preco: 15.0,
      imagem:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      nome: "Hidratação",
      descricao: "Tratamento capilar com produtos premium",
      preco: 60.0,
      imagem:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      nome: "Pézinho",
      descricao: "Finalização e contorno do corte",
      preco: 20.0,
      imagem:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100&h=100&fit=crop",
    },
  ];

  // Dados mock de profissionais
  const profissionais: Profissional[] = [
    {
      id: 1,
      nome: "Rafael Pereira 1",
      foto: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      nome: "Rafael Pereira 2",
      foto: "https://i.pravatar.cc/150?img=13",
    },
    {
      id: 3,
      nome: "Rafael Pereira 3",
      foto: "https://i.pravatar.cc/150?img=14",
    },
    {
      id: 4,
      nome: "Rafael Pereira 4",
      foto: "https://i.pravatar.cc/150?img=15",
    },
    {
      id: 5,
      nome: "Rafaela Pereira 5",
      foto: "https://i.pravatar.cc/150?img=16",
    },
    {
      id: 6,
      nome: "Rafael Pereira 6",
      foto: "https://i.pravatar.cc/150?img=17",
    },
  ];

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
              <div className="space-y-3">
                {servicos.map((servico) => (
                  <div
                    key={servico.id}
                    className="flex items-center gap-3 bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#333333] transition-colors"
                  >
                    <img
                      src={servico.imagem}
                      alt={servico.nome}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm mb-0.5">
                        {servico.nome}
                      </h3>
                      <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                        {servico.descricao}
                      </p>
                      <p className="text-sm font-bold text-white">
                        R$ {servico.preco.toFixed(2)}
                      </p>
                    </div>
                    <button onClick={() => handleOpenReservaModal(servico)} className="bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex-shrink-0">
                      Agendar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aba Profissionais */}
          {activeTab === "profissionais" && (
            <div className="p-5">
              <h3 className="text-white font-semibold text-base mb-4">
                Profissionais
              </h3>
              <div className="space-y-3">
                {profissionais.map((profissional) => (
                  <div
                    key={profissional.id}
                    className="flex items-center justify-between bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#333333] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={profissional.foto}
                        alt={profissional.nome}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="text-white font-medium text-sm">
                        {profissional.nome}
                      </span>
                    </div>
                    <button className="bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                      Ver mais
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aba Detalhes */}
          {activeTab === "detalhes" && (
            <div className="p-5">
              {/* Mapa */}
              <div className="mb-6">
                <div className="relative w-full h-48 bg-[#2a2a2a] rounded-lg overflow-hidden">
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/${barbearia.localizacao.lng},${barbearia.localizacao.lat},14,0/800x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`}
                    alt="Mapa"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
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

              {/* Telefones */}
              <div className="mb-6">
                {barbearia.telefones.map((telefone, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#2a2a2a] rounded-lg p-3 mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1a1a1a] rounded flex items-center justify-center flex-shrink-0">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"
                            fill="#888"
                          />
                          <path
                            d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 00-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 00.043-1.391L6.859 3.513a1 1 0 00-1.391-.087l-2.17 1.861a1 1 0 00-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 00.648-.291l1.86-2.171a.997.997 0 00-.086-1.391l-4.064-3.696z"
                            fill="#888"
                          />
                        </svg>
                      </div>
                      <span className="text-white text-sm">{telefone}</span>
                    </div>
                    <button className="text-indigo-500 text-xs font-semibold hover:text-indigo-400">
                      Copiar
                    </button>
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
      />
    </div>
  );
};

export default BarbeariaModal;
