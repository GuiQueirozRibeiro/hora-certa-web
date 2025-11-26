import { Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Precos() {
  const [planoPeriodo, setPlanoPeriodo] = useState<'anual' | 'semestral' | 'mensal'>('anual');
  const [displayPrecos, setDisplayPrecos] = useState([28.90, 49.90, 88.00, 126.90]);
  const priceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const toggleRef = useRef<HTMLDivElement>(null);
  const cardBadgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationsRef = useRef<gsap.core.Tween[]>([]);
  const isAnimatingRef = useRef(false);

  const planos = [
    {
      nome: "1 Profissional",
      descricao: "",
      precoMensal: 49.90,
      precoSemestral: 39.40,
      precoAnual: 28.90,
      descontoMensal: 0,
      descontoSemestral: 15,
      descontoAnual: 30,
      destaque: false,
      recursos: [
        "Agendamento online",
        "Gestão de clientes",
        "Suporte por email",
      ],
    },
    {
      nome: "2 a 5 Profissionais",
      descricao: "",
      precoMensal: 79.90,
      precoSemestral: 64.90,
      precoAnual: 49.90,
      descontoMensal: 0,
      descontoSemestral: 15,
      descontoAnual: 30,
      destaque: false,
      recursos: [
        "Todas funcionalidades",
        "Programa de fidelidade",
        "Relatórios avançados",
        "Suporte prioritário",
      ],
    },
    {
      nome: "6 a 15 Profissionais",
      descricao: "",
      precoMensal: 134.50,
      precoSemestral: 111.00,
      precoAnual: 88.00,
      descontoMensal: 0,
      descontoSemestral: 15,
      descontoAnual: 30,
      destaque: true,
      recursos: [
        "Múltiplas unidades",
        "API personalizada",
        "Treinamento dedicado",
        "Suporte prioritário",
      ],
    },
    {
      nome: "+15 Profissionais",
      descricao: "",
      precoMensal: 189.90,
      precoSemestral: 158.50,
      precoAnual: 126.90,
      descontoMensal: 0,
      descontoSemestral: 15,
      descontoAnual: 30,
      destaque: false,
      recursos: [
        "Profissionais ilimitados",
        "Múltiplas unidades",
        "API personalizada",
        "Treinamento dedicado",
        "Suporte 24/7",
      ],
    },
  ];

  const getPrecoAtual = (plano: typeof planos[0]) => {
    switch (planoPeriodo) {
      case 'anual':
        return plano.precoAnual;
      case 'semestral':
        return plano.precoSemestral;
      case 'mensal':
        return plano.precoMensal;
    }
  };

  const getDescontoAtual = (plano: typeof planos[0]) => {
    switch (planoPeriodo) {
      case 'anual':
        return plano.descontoAnual;
      case 'semestral':
        return plano.descontoSemestral;
      case 'mensal':
        return plano.descontoMensal;
    }
  };

  useEffect(() => {
    // Previne cliques rápidos
    if (isAnimatingRef.current) {
      return;
    }
    
    isAnimatingRef.current = true;

    // Cancela todas as animações anteriores
    animationsRef.current.forEach(anim => anim.kill());
    animationsRef.current = [];

    // Anima o toggle
    if (toggleRef.current) {
      const toggleAnim = gsap.to(toggleRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
      animationsRef.current.push(toggleAnim);
    }

    // Anima os badges dos cards
    cardBadgeRefs.current.forEach((badge, index) => {
      if (badge) {
        if (planoPeriodo !== 'mensal') {
          const cardBadgeAnim = gsap.fromTo(
            badge,
            { scale: 0, opacity: 0, y: -20, x: '-50%' },
            { 
              scale: 1, 
              opacity: 1, 
              y: 0,
              x: '-50%',
              duration: 0.5, 
              delay: index * 0.1,
              ease: "back.out(1.7)" 
            }
          );
          animationsRef.current.push(cardBadgeAnim);
        } else {
          const cardBadgeAnim = gsap.to(badge, {
            scale: 0,
            opacity: 0,
            y: -20,
            x: '-50%',
            duration: 0.5,
            delay: index * 0.1,
            ease: "back.in(1.7)"
          });
          animationsRef.current.push(cardBadgeAnim);
        }
      }
    });

    // Anima os preços com contagem
    const targetPrices = planos.map(plano => getPrecoAtual(plano));
    
    planos.forEach((_plano, index) => {
      const targetPrice = targetPrices[index];
      const currentPrice = displayPrecos[index];
      
      if (priceRefs.current[index]) {
        // Animação de fade e escala
        const fadeAnim = gsap.fromTo(
          priceRefs.current[index],
          { opacity: 0, scale: 0.8, y: -10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
        animationsRef.current.push(fadeAnim);

        // Animação de contagem dos números
        const obj = { value: currentPrice };
        const countAnim = gsap.to(obj, {
          value: targetPrice,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: () => {
            if (priceRefs.current[index]) {
              priceRefs.current[index]!.textContent = obj.value.toFixed(2).replace('.', ',');
            }
          },
          onComplete: () => {
            if (index === planos.length - 1) {
              setDisplayPrecos(targetPrices);
              isAnimatingRef.current = false;
            }
          }
        });
        animationsRef.current.push(countAnim);
      }
    });
  }, [planoPeriodo]);

  return (
    <section className="w-full py-12 md:py-16 bg-zinc-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Título */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            Escolha o plano ideal para seu negócio
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm">
            Escolha entre nossos 4 planos acessíveis
          </p>
        </div>

        {/* Toggle Anual/Semestral/Mensal */}
        <div 
          ref={toggleRef}
          className="flex items-center justify-center gap-0 mb-8 md:mb-10 bg-zinc-700 rounded-lg p-1 max-w-md mx-auto"
        >
          <button
            onClick={() => {
              if (!isAnimatingRef.current) {
                setPlanoPeriodo('anual');
              }
            }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              planoPeriodo === 'anual' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <div className="text-center">
              <div>ANUAL</div>
              <div className="text-xs mt-0.5">30% DE DESCONTO</div>
            </div>
          </button>
          <button
            onClick={() => {
              if (!isAnimatingRef.current) {
                setPlanoPeriodo('semestral');
              }
            }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              planoPeriodo === 'semestral' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <div className="text-center">
              <div>SEMESTRAL</div>
              <div className="text-xs mt-0.5">15% DE DESCONTO</div>
            </div>
          </button>
          <button
            onClick={() => {
              if (!isAnimatingRef.current) {
                setPlanoPeriodo('mensal');
              }
            }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              planoPeriodo === 'mensal' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <div className="text-center">
              <div>MENSAL</div>
            </div>
          </button>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {planos.map((plano, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 relative ${
                plano.destaque
                  ? 'bg-zinc-950 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105'
                  : 'bg-zinc-900 border border-zinc-700'
              }`}
            >
              {/* Badge Economize */}
              <div 
                ref={(el) => {
                  cardBadgeRefs.current[index] = el;
                }}
                className="absolute -top-3 left-1/2 pointer-events-none"
                style={{ opacity: 0, transform: 'translateX(-50%) scale(0)' }}
              >
                <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-semibold shadow-lg">
                  {getDescontoAtual(plano)}% OFF
                </span>
              </div>

              {/* Cabeçalho do Card */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plano.nome}</h3>
                <p className="text-xs text-zinc-400 mb-4">{plano.descricao}</p>
                
                {/* Preço */}
                <div className="mb-4 overflow-hidden">
                  <div className="flex items-start justify-center gap-1">
                    <span className="text-sm text-zinc-400 mt-1">R$</span>
                    <span 
                      ref={(el) => {
                        priceRefs.current[index] = el;
                      }}
                      className="inline-block text-3xl md:text-4xl font-bold text-white"
                    >
                      {displayPrecos[index].toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-zinc-400 text-sm mt-1">
                      /mês
                    </span>
                  </div>
                </div>

                {/* Botão */}
                <button
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    plano.destaque
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/30'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-600'
                  }`}
                >
                  Começar Agora
                </button>
              </div>

              {/* Lista de Recursos */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase">
                  O que está incluído:
                </p>
                {plano.recursos.map((recurso, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-zinc-300">{recurso}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
