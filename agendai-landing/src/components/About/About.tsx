import { Monitor, Smartphone} from 'lucide-react';


const colors = {
      background: "bg-zinc-800", // Aquele preto profundo
      bg_card: "bg-zinc-700", // Aquele preto profundo
      text: "text-zinc-100",      // Um branco suave
      brand: "text-indigo-600",     // O seu Roxo/Indigo
      button: "bg-[#6366f1] hover:bg-[#4f46e5]", // Botão com hover
   }

export function About() {
  return (
    <section className={`w-full py-12 md:py-16 lg:py-24 ${colors.background}`}>
      
      {/* Container Centralizado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* --- COLUNA DA ESQUERDA: A História --- */}
          <div>
            <div className={`inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider ${colors.brand} uppercase bg-indigo-200 rounded-full`}>
              Nossa Solução
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-100 mb-4 md:mb-6">
              Sobre o Agendai
            </h2>

            <p className="text-sm md:text-base text-zinc-200 mb-4 leading-relaxed">
              O Agendai nasceu com uma visão clara: ajudar barbearias a lotarem a agenda, aumentarem sua visibilidade na região e faturarem de forma previsível.
            </p>

            <p className="text-sm md:text-base text-zinc-200 mb-4 leading-relaxed">
              Enquanto muitos sistemas complicam, a gente simplifica. Enquanto outros só organizam horários, o Agendai cria crescimento real: ele conecta sua barbearia aos clientes próximos, facilita o agendamento, automatiza a fidelização e entrega a gestão que faltava para sua empresa dar o próximo passo.
            </p>
            
            <p className="text-sm md:text-base text-zinc-200 mb-4 leading-relaxed">
              Hoje, o Agendai é a escolha de quem quer profissionalizar o negócio, reduzir furos de horário, atrair mais clientes e transformar talento em faturamento.
            </p>

            <p className="text-sm md:text-base text-zinc-200 font-semibold leading-relaxed">
              Simples para usar.<br/>
              Poderoso para escalar.<br/>
              Feito para quem quer crescer.
            </p>
          </div>

          {/* --- COLUNA DA DIREITA: Os Módulos (Cards) --- */}
          <div className="flex flex-col gap-4 md:gap-6">
            
            {/* Card 1: WebAdmin */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-5 p-5 md:p-6 rounded-2xl ${colors.bg_card} border border-zinc-600 hover:border-indigo-400 transition-colors`}>
              {/* Ícone com fundo colorido */}
              <div className="shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-lg text-white">
                  <Monitor size={24} />
                </div>
              </div>
              
              {/* Texto do Card */}
              <div>
                <h3 className="text-base md:text-lg font-bold text-zinc-100 mb-2">Gestão que dá ritmo ao seu negócio</h3>
                <p className="text-xs md:text-sm text-zinc-200 leading-relaxed">
                  Controle de profissionais, histórico de clientes, estoque e relatórios financeiros. Tudo integrado, seguro e 100% na nuvem. A estrutura que sua barbearia precisa para crescer com organização e previsibilidade.
                </p>
              </div>
            </div>

            {/* Card 2: Aplicativo */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-5 p-5 md:p-6 rounded-2xl ${colors.bg_card} border border-zinc-600 hover:border-indigo-400 transition-colors`}>
              {/* Ícone */}
              <div className="shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-lg text-white">
                  <Smartphone size={24} />
                </div>
              </div>
              
              {/* Texto do Card */}
              <div>
                <h3 className="text-base md:text-lg font-bold text-zinc-100 mb-2">Experiência completa para equipe e clientes</h3>
                <p className="text-xs md:text-sm text-zinc-200 leading-relaxed">
                  Profissionais com agenda e comissões organizadas. Clientes com agendamentos fáceis, promoções e lembretes automáticos. O Agendai aproxima sua barbearia do público e mantém sua agenda sempre em movimento.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}