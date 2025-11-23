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
    <section className={`w-full py-24 ${colors.background}`}>
      
      {/* Container Centralizado */}
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* --- COLUNA DA ESQUERDA: A História --- */}
          <div>
            <div className={`inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider ${colors.brand} uppercase bg-indigo-200 rounded-full`}>
              Nossa Solução
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-6">
              Sobre o Hora Certa
            </h2>

            <p className="text-lg text-zinc-200 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla magni dolor laudantium obcaecati velit odit necessitatibus inventore est enim architecto omnis iste a, optio, laboriosam.
            </p>
            
            <p className="text-lg text-zinc-200 leading-relaxed">
              Nosso objetivo é simplificar a gestão do seu negócio, conectando profissionais e clientes de forma eficiente e moderna.
            </p>
          </div>

          {/* --- COLUNA DA DIREITA: Os Módulos (Cards) --- */}
          <div className="flex flex-col gap-6">
            
            {/* Card 1: WebAdmin */}
            <div className={`flex gap-5 p-6 rounded-2xl ${colors.bg_card} border border-zinc-600 hover:border-indigo-400 transition-colors`}>
              {/* Ícone com fundo colorido */}
              <div className="shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-lg text-white">
                  <Monitor size={24} />
                </div>
              </div>
              
              {/* Texto do Card */}
              <div>
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Módulo WebAdmin</h3>
                <p className="text-zinc-200 leading-relaxed">
                  Gestão completa do estabelecimento: controle de profissionais, histórico de clientes, estoque e relatórios financeiros. Tudo na nuvem, seguro e acessível de qualquer lugar.
                </p>
              </div>
            </div>

            {/* Card 2: Aplicativo */}
            <div className={`flex gap-5 p-6 rounded-2xl ${colors.bg_card} border border-zinc-600 hover:border-indigo-400 transition-colors`}>
              {/* Ícone */}
              <div className="shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-lg text-white">
                  <Smartphone size={24} />
                </div>
              </div>
              
              {/* Texto do Card */}
              <div>
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Módulo Aplicativo</h3>
                <p className="text-zinc-200 leading-relaxed">
                  Para profissionais (agenda e comissões) e para clientes (agendamentos, promoções e lembretes). Aproximando a barbearia do seu público.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}