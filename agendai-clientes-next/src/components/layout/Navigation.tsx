'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const indicatorRef = useRef<HTMLDivElement>(null);
  const inicioRef = useRef<HTMLAnchorElement>(null);
  const agendamentosRef = useRef<HTMLAnchorElement>(null);
  const perfilRef = useRef<HTMLAnchorElement>(null);
  const isFirstRender = useRef(true);
  
  const getActiveTab = () => {
    if (pathname === '/agendamentos') return 'agendamentos';
    if (pathname === '/perfil') return 'perfil';
    return 'inicio';
  };
  
  const activeTab = getActiveTab();

  useEffect(() => {
    const activeElement = 
      activeTab === 'inicio' ? inicioRef.current :
      activeTab === 'agendamentos' ? agendamentosRef.current :
      perfilRef.current;

    if (activeElement && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeElement;
      
      if (isFirstRender.current) {
        // Primeira renderização - posiciona sem animação
        gsap.set(indicatorRef.current, {
          left: offsetLeft,
          width: offsetWidth
        });
        isFirstRender.current = false;
      } else {
        // Animação de transição entre abas
        gsap.to(indicatorRef.current, {
          left: offsetLeft,
          width: offsetWidth,
          duration: 0.4,
          ease: 'power3.out'
        });
      }
    }
  }, [activeTab]);

  return (
    <nav className="relative flex justify-center gap-6 sm:gap-10 py-3 bg-zinc-800 overflow-x-auto">
      <Link
        ref={inicioRef}
        href="/"
        className={`relative text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 pt-2 transition-colors whitespace-nowrap ${
          activeTab === 'inicio' ? 'text-indigo-500' : 'text-zinc-200 hover:text-white hover:font-bold'
        }`}
      >
        Início
        {activeTab === 'inicio' && <span className="text-indicator" />}
      </Link>
      <Link
        ref={agendamentosRef}
        href="/agendamentos"
        className={`relative text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 transition-colors whitespace-nowrap ${
          activeTab === 'agendamentos' ? 'text-indigo-500' : 'text-zinc-200 hover:text-white hover:font-bold'
        }`}
      >
        Agendamentos
        {activeTab === 'agendamentos' && <span className="text-indicator" />}
      </Link>
      <Link
        ref={perfilRef}
        href="/perfil"
        className={`relative text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 pt-2 transition-colors whitespace-nowrap ${
          activeTab === 'perfil' ? 'text-indigo-500' : 'text-zinc-200 hover:text-white hover:font-bold'
        }`}
      >
        Perfil
        {activeTab === 'perfil' && <span className="text-indicator" />}
      </Link>
      
      {/* Linha indicadora animada */}
      <div
        ref={indicatorRef}
        className="absolute bottom-0 h-0.5 bg-indigo-500"
        style={{ left: 0, width: 0 }}
      />
    </nav>
  );
};

export default Navigation;
