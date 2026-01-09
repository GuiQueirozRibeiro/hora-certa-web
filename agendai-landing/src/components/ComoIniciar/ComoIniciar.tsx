import { Iphone } from "../../ui/iphone";

export function ComoIniciar() {
  const passos = [
    {
      numero: "1",
      titulo: "Faça o Cadastro",
      descricao: "Faça o cadastro no Agendai, informando os dados básicos do seu estabelecimento."
    },
    {
      numero: "2",
      titulo: "Preencha o Passo a Passo inicial",
      descricao: "Informe os cadastros básicos do estabelecimento, como serviços, profissionais, jornada de trabalho."
    },
    {
      numero: "3",
      titulo: "Teste grátis por 30 dias",
      descricao: "Usufrua de todas as funcionalidades do sistema por 30 dias gratuitamente."
    }
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Título */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Como começar
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Coluna Esquerda: Passos */}
          <div className="space-y-5">
            {passos.map((passo) => (
              <div key={passo.numero} className="flex gap-4">
                {/* Número */}
                <div className="shrink-0">
                  <div className="w-11 h-11 rounded-full bg-zinc-800 border-2 border-indigo-500 flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-400">
                      {passo.numero}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-bold text-indigo-400 mb-1">
                    {passo.titulo}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {passo.descricao}
                  </p>
                </div>
              </div>
            ))}

            {/* Botão CTA */}
            <div className="pt-2">
              <a className="bg-orange-500 text-white font-bold px-6 py-2.5 rounded-lg text-xs hover:bg-orange-600 transition-all shadow-lg uppercase tracking-wider w-full sm:w-auto cursor-pointer"
              href="https://sistema.agendai.tec.br/login/"
              >
                Clique aqui e cadastre-se agora
              </a>
            </div>
          </div>

          {/* Coluna Direita: Dispositivos */}
          <div className="relative flex items-center justify-center h-80 lg:h-96">
            {/* MacBook */}
            <div className="relative z-10 animate-float max-w-md w-full">
              {/* Tela */}
              <div className="bg-zinc-950 rounded-lg border-[3px] border-zinc-700 p-2 shadow-2xl">
                <img src="/image.png" alt="" />
              </div>
              {/* Base */}
              <div className="h-1.5 bg-zinc-700 rounded-b mx-auto w-3/4"></div>
              <div className="h-1 bg-zinc-600 rounded-b mx-auto w-1/2"></div>
            </div>

            {/* iPhone */}
            <div className="absolute right-4 md:right-8 bottom-8 z-20 animate-float-delay w-28 md:w-32">
              <Iphone 
                src="/AGENDAI-NOVAID1-BLACK.png"
                className="drop-shadow-2xl"
              />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-delay {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 3s ease-in-out infinite 0.5s;
        }
      `}</style>
    </section>
  );
}
