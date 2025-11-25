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
      title: "Lembrete de Horários",
      description:
        "Notificações automáticas para clientes sobre seus agendamentos.",
    },
    {
      icon: Handshake,
      title: "Programa de Fidelidade",
      description: "Fidelize clientes com sistemas de pontos e recompensas.",
    },
    {
      icon: Mail,
      title: "Envio de Notícias e Promoções",
      description: "Comunique-se diretamente com seus clientes sobre ofertas.",
    },
    {
      icon: CreditCard,
      title: "Pagamento On-line",
      description: "Aceite pagamentos digitais de forma segura e prática.",
    },
    {
      icon: FileText,
      title: "Relatórios Gerenciais",
      description: "Análises completas do seu negócio em tempo real.",
    },
    {
      icon: Gift,
      title: "Pacotes de Serviços e Produtos",
      description: "Crie combos e ofertas especiais para seus clientes.",
    },
    {
      icon: Truck,
      title: "Gestão de Estoque",
      description: "Controle produtos e materiais com facilidade.",
    },
    {
      icon: ClipboardList,
      title: "Comandas e Controle de Consumo",
      description: "Gerencie o consumo de produtos durante o atendimento.",
    },
    {
      icon: Cake,
      title: "Aniversariantes",
      description: "Lembre-se automaticamente dos aniversários dos clientes.",
    },
    {
      icon: List,
      title: "Lista de Espera",
      description: "Organize filas e otimize o tempo de atendimento.",
    },
    {
      icon: MessageCircle,
      title: "Mensagens de Retorno Automáticas",
      description: "Reconquiste clientes inativos automaticamente.",
    },
    {
      icon: Star,
      title: "Pesquisa de Satisfação",
      description: "Colete feedback e melhore continuamente seu serviço.",
    },
    {
      icon: Users,
      title: "Clube de Clientes",
      description: "Crie uma comunidade engajada em torno do seu negócio.",
    },
    {
      icon: Monitor,
      title: "Site do Estabelecimento",
      description: "Tenha sua própria página web profissional.",
    },
    {
      icon: User,
      title: "Comissões e Vales",
      description: "Gerencie pagamentos de profissionais com transparência.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Título da Seção */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
            Funcionalidades do AppBarber
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar sua barbearia em um único lugar
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
          <button className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg text-sm hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/20 uppercase tracking-wider">
            Veja Todas as Funcionalidades
          </button>
        </div>
      </div>
    </section>
  );
}
