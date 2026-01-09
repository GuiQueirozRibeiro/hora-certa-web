'use client';

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(SVGSVGElement | null)[]>([]);

  const faqs = [
    {
      pergunta: "Existe um teste grátis disponível?",
      resposta: "Sim, você pode experimentar gratuitamente por 30 dias. Se quiser, forneceremos uma ligação de integração personalizada de 30 minutos para que você comece a usar o mais rápido possível."
    },
    {
      pergunta: "Posso mudar meu plano depois?",
      resposta: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças serão refletidas imediatamente e o valor será ajustado proporcionalmente."
    },
    {
      pergunta: "Qual é a política de cancelamento?",
      resposta: "Você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento e você continuará tendo acesso até o final do período pago."
    },
    {
      pergunta: "Como funciona a cobrança?",
      resposta: "A cobrança é feita mensalmente ou anualmente, dependendo do plano escolhido. Aceitamos cartão de crédito e boleto bancário. O pagamento é processado automaticamente."
    },
    {
      pergunta: "Como altero o email da minha conta?",
      resposta: "Você pode alterar o email da sua conta nas configurações de perfil. Basta acessar 'Minha Conta' > 'Configurações' > 'Email' e fazer a alteração."
    }
  ];

  useEffect(() => {
    contentRefs.current.forEach((content, index) => {
      if (content) {
        if (index === activeIndex) {
          // Anima abertura
          gsap.to(content, {
            height: "auto",
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
          });
          
          // Anima ícone
          if (iconRefs.current[index]) {
            gsap.to(iconRefs.current[index], {
              rotation: 180,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        } else {
          // Anima fechamento
          gsap.to(content, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in"
          });
          
          // Anima ícone
          if (iconRefs.current[index]) {
            gsap.to(iconRefs.current[index], {
              rotation: 0,
              duration: 0.3,
              ease: "power2.in"
            });
          }
        }
      }
    });
  }, [activeIndex]);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full py-10 md:py-12 bg-zinc-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Título */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
            Perguntas Frequentes
          </h2>
          <p className="text-zinc-400 text-xs">
            Tudo que você precisa saber sobre o produto e cobrança.
          </p>
        </div>

        {/* Container dos FAQs */}
        <div className="bg-zinc-800 rounded-xl p-3 md:p-4 border border-zinc-700">
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden"
              >
                {/* Pergunta - Clicável */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-3 md:p-4 text-left hover:bg-zinc-800 transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-xs md:text-sm font-semibold text-white pr-3">
                    {faq.pergunta}
                  </span>
                  <ChevronDown
                    ref={(el) => {
                      iconRefs.current[index] = el;
                    }}
                    size={18}
                    className="text-indigo-500 shrink-0"
                  />
                </button>

                {/* Resposta - Animada */}
                <div
                  ref={(el) => {
                    contentRefs.current[index] = el;
                  }}
                  style={{ height: 0, opacity: 0, overflow: "hidden" }}
                >
                  <div className="px-3 md:px-4 pb-3 md:pb-4">
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {faq.resposta}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA adicional */}
        <div className="mt-6 md:mt-8 text-center bg-zinc-800 rounded-xl p-4 md:p-6 border border-zinc-700">
          <h3 className="text-sm md:text-base font-bold text-white mb-1">
            Ainda tem dúvidas?
          </h3>
          <p className="text-xs text-zinc-400 mb-3">
            Não encontrou a resposta que procurava? Entre em contato com nossa equipe.
          </p>
          <a className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 transition-all duration-200 active:scale-95 cursor-pointer"
          href="https://wa.me/5533998217341"
          >
            Entrar em Contato
          </a>
        </div>
      </div>
    </section>
  );
}
