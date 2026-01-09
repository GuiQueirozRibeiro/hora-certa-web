'use client';

import {
  Clock,
  Handshake,
  Mail,
  CreditCard,
  FileText,
  Gift,
  Truck,
  ClipboardList,
  Cake,
  List,
  MessageCircle,
  Star,
  Users,
  Monitor,
  User,
} from "lucide-react";
import { useState } from "react";

export function Funcionalidades() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const funcionalidades = [
    {
      icon: Clock,
      title: "Lembrete de horários",
      description: "Evita furos e reduz atrasos automaticamente.",
    },
    {
      icon: Mail,
      title: "Notificações e promoções",
      description: "Divulgue ofertas e comunique sua base com um clique.",
    },
    {
      icon: FileText,
      title: "Relatórios gerenciais",
      description: "Veja onde está ganhando, perdendo e como crescer.",
    },
    {
      icon: Gift,
      title: "Pacotes de serviços e produtos",
      description: "Venda combos e aumente o ticket médio sem esforço.",
    },
    {
      icon: CreditCard,
      title: "Pagamentos online",
      description: "Mais praticidade para o cliente e menos falhas na cobrança",
    },
    {
      icon: ClipboardList,
      title: "Comandas e consumo",
      description: "Organização total dos serviços realizados no atendimento.",
    },
    {
      icon: Cake,
      title: "Aniversariantes",
      description: "Ação automática para gerar retorno e encantamento.",
    },
    {
      icon: List,
      title: "Lista de espera",
      description: "Preencha horários vagos de forma instantânea.",
    },
    {
      icon: MessageCircle,
      title: "Mensagens automáticas",
      description: "Retorno rápido e comunicação constante com o cliente. (incluso com o adicional de IA)",
    },
    {
      icon: Star,
      title: "Pesquisa de satisfação",
      description: "Entenda a experiência e melhore seu atendimento.",
    },
    {
      icon: Monitor,
      title: "Site do estabelecimento",
      description: "Presença profissional e mais visibilidade na região.",
    },
    {
      icon: User,
      title: "Comissões e vales",
      description: "Transparência total para sua equipe e controle para você.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Título da Seção */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
            Funcionalidades do Agendai
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm max-w-2xl mx-auto">
            Tudo o que sua barbearia precisa para atrair, organizar e faturar. Em um único sistema.
          </p>
        </div>

        {/* Grid de Funcionalidades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {funcionalidades.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                bg-zinc-900 border border-zinc-700 rounded-lg p-4
                transition-all duration-300 cursor-pointer
                ${
                  hoveredIndex === index
                    ? "border-indigo-500 shadow-lg shadow-indigo-500/20 transform scale-105 bg-zinc-800"
                    : "hover:border-zinc-600"
                }
              `}
            >
              {/* Ícone */}
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-lg mb-3
                  transition-all duration-300
                  ${
                    hoveredIndex === index
                      ? "bg-indigo-600 scale-110"
                      : "bg-zinc-800"
                  }
                `}
              >
                <item.icon
                  size={20}
                  className={`
                    transition-colors duration-300
                    ${hoveredIndex === index ? "text-white" : "text-indigo-400"}
                  `}
                />
              </div>

              {/* Título */}
              <h3
                className={`
                  text-xs md:text-sm font-bold mb-1.5
                  transition-colors duration-300
                  ${hoveredIndex === index ? "text-indigo-400" : "text-white"}
                `}
              >
                {item.title}
              </h3>

              {/* Descrição */}
              <p className="text-xs text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Botão Ver Todas */}
        <div className="text-center mt-10 md:mt-12">
          <button className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg text-sm hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/20 uppercase tracking-wider cursor-pointer">
            Veja Todas as Funcionalidades
          </button>
        </div>
      </div>
    </section>
  );
}
