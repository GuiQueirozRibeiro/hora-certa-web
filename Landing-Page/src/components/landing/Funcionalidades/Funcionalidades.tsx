import { Calendar, Smile, TrendingUp } from "lucide-react";

export function Funcionalidades() {
  const objetivos = [
    {
      icon: Calendar,
      title: "Otimizar seu Tempo",
      description: "Organize sua agenda e estimule mais agendamentos através do aplicativo.",
    },
    {
      icon: Smile,
      title: "Fidelizar seu Cliente",
      description: "Fidelize através do Agendamento On-line, Programa de Fidelidade, Envio de Promoções e Mensagens de Retorno automáticas.",
    },
    {
      icon: TrendingUp,
      title: "Aumentar seu Faturamento",
      description: "Aumente seu movimento em até 40% e tenha um maior faturamento em sua barbearia.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Título da Seção */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
            Nosso Objetivo
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm max-w-2xl mx-auto">
            Ajudamos sua barbearia a crescer com ferramentas simples e eficientes
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {objetivos.map((item, index) => (
            <div
              key={index}
              className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 md:p-8 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              {/* Ícone */}
              <div className="flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-xl mb-5">
                <item.icon size={28} className="text-white" />
              </div>

              {/* Título */}
              <h3 className="text-base md:text-lg font-bold text-white mb-3">
                {item.title}
              </h3>

              {/* Descrição */}
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
