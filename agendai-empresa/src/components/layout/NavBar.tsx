import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

type NavTab = 'financeiro' | 'agenda' | 'administracao';

interface MainNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const MainNavBar: React.FC<MainNavBarProps> = ({ activeTab, onTabChange }) => {
  const financeiroRef = useRef<HTMLButtonElement>(null);
  const agendaRef = useRef<HTMLButtonElement>(null);
  const administracaoRef = useRef<HTMLButtonElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const tabs = {
    financeiro: financeiroRef,
    agenda: agendaRef,
    administracao: administracaoRef,
  };

  useEffect(() => {
    const activeButton = tabs[activeTab].current;
    const indicator = indicatorRef.current;

    if (activeButton && indicator) {
      const { offsetLeft, offsetWidth } = activeButton;

      gsap.to(indicator, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [activeTab]);

  const handleTabClick = (tab: NavTab) => {
    const button = tabs[tab].current;
    
    if (button) {
      // Animação de scale no botão clicado
      gsap.fromTo(
        button,
        { scale: 0.95 },
        { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
    
    onTabChange(tab);
  };

  return (
    <nav className="flex justify-center py-3 bg-zinc-800 border-b border-zinc-700">
      <div className="relative flex gap-16">
        <button
          ref={financeiroRef}
          onClick={() => handleTabClick('financeiro')}
          className={`relative text-sm font-medium px-6 py-2 transition-colors ${
            activeTab === 'financeiro' 
              ? 'text-indigo-400' 
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Financeiro
        </button>
        
        <button
          ref={agendaRef}
          onClick={() => handleTabClick('agenda')}
          className={`relative text-sm font-medium px-6 py-2 transition-colors ${
            activeTab === 'agenda' 
              ? 'text-indigo-400' 
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Agenda
        </button>
        
        <button
          ref={administracaoRef}
          onClick={() => handleTabClick('administracao')}
          className={`relative text-sm font-medium px-6 py-2 transition-colors ${
            activeTab === 'administracao' 
              ? 'text-indigo-400' 
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Administração
        </button>

        {/* Indicador animado */}
        <div
          ref={indicatorRef}
          className="absolute bottom-0 h-0.5 bg-indigo-500 rounded-full"
          style={{ width: 0, transform: 'translateX(0)' }}
        />
      </div>
    </nav>
  );
};

export default MainNavBar;
