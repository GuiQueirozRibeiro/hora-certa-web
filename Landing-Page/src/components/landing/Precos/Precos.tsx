import { Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Precos() {
  const [isAnual, setIsAnual] = useState(false);
  const [displayPrecos, setDisplayPrecos] = useState([99, 199, 399]);
  const priceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const cardBadgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationsRef = useRef<gsap.core.Tween[]>([]);
  const isAnimatingRef = useRef(false);

  const planos = [
    {
      nome: "Básico",
      descricao: "Ideal para pequenas barbearias",
      precoMensal: 99,
      precoAnual: 990,
      destaque: false,
      recursos: [
        "Até 2 profissionais",
        "Agendamento online",
        "Gestão de clientes",
        "Suporte por email",
      ],
    },
    {
      nome: "Premium",
      descricao: "Para barbearias em crescimento",
      precoMensal: 199,
      precoAnual: 1990,
      destaque: true,
      recursos: [
        "Até 5 profissionais",
        "Todas funcionalidades",
        "Programa de fidelidade",
        "Relatórios avançados",
        "Suporte prioritário",
      ],
    },
    {
      nome: "Enterprise",
      descricao: "Para grandes estabelecimentos",
      precoMensal: 399,
      precoAnual: 3990,
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
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
      animationsRef.current.push(toggleAnim);
    }

    // Anima o badge de desconto
    if (badgeRef.current && isAnual) {
      const badgeAnim = gsap.fromTo(
        badgeRef.current,
        { scale: 0, opacity: 0, x: -10 },
        { scale: 1, opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
      animationsRef.current.push(badgeAnim);
    }

    // Anima os badges dos cards
    cardBadgeRefs.current.forEach((badge, index) => {
      if (badge) {
        if (isAnual) {
          const cardBadgeAnim = gsap.fromTo(
            badge,
            { scale: 0, opacity: 0, y: -20 },
            { 
              scale: 1, 
              opacity: 1, 
              y: 0, 
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
            duration: 0.5,
            delay: index * 0.1,
            ease: "back.in(1.7)"
          });
          animationsRef.current.push(cardBadgeAnim);
        }
      }
    });

    // Anima os preços com contagem
    const targetPrices = planos.map(plano => isAnual ? plano.precoAnual : plano.precoMensal);
    
    planos.forEach((plano, index) => {
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
              priceRefs.current[index]!.textContent = `$${Math.round(obj.value)}`;
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
  }, [isAnual]);

  return (
    <section className="w-full py-12 md:py-16 bg-zinc-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Título */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            Escolha o plano ideal para seu negócio
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm">
            Escolha entre nossos 3 planos acessíveis
          </p>
        </div>

        {/* Toggle Mensal/Anual */}
        <div className="flex items-center justify-center gap-3 mb-8 md:mb-10">
          <span className={`text-sm transition-all duration-300 ${!isAnual ? 'text-white font-semibold' : 'text-zinc-400'}`}>
            Mensal
          </span>
          <button
            ref={toggleRef}
            onClick={() => {
              if (!isAnimatingRef.current) {
                setIsAnual(!isAnual);
              }
            }}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              isAnual ? 'bg-indigo-600' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                isAnual ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm transition-all duration-300 ${isAnual ? 'text-white font-semibold' : 'text-zinc-400'}`}>
            Anual
          </span>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{ opacity: 0, transform: 'translateX(-50%) scale(0)' }}
              >
                <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-semibold shadow-lg">
                  Economize 20%
                </span>
              </div>

              {/* Cabeçalho do Card */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plano.nome}</h3>
                <p className="text-xs text-zinc-400 mb-4">{plano.descricao}</p>
                
                {/* Preço */}
                <div className="mb-4 overflow-hidden">
                  <span 
                    ref={(el) => {
                      priceRefs.current[index] = el;
                    }}
                    className="inline-block text-3xl md:text-4xl font-bold text-white"
                  >
                    ${displayPrecos[index]}
                  </span>
                  <span className="text-zinc-400 text-sm">
                    /{isAnual ? 'ano' : 'mês'}
                  </span>
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
