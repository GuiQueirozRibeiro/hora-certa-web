'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  
  const getActiveTab = () => {
    if (pathname === '/agendamentos') return 'agendamentos';
    if (pathname === '/perfil') return 'perfil';
    return 'inicio';
  };
  
  const activeTab = getActiveTab();
  return (
    <nav className="flex justify-center gap-10 py-3 bg-zinc-800">
      <Link
        href="/"
        className={`relative text-sm font-medium px-4 py-2 transition-colors ${
          activeTab === 'inicio' ? 'text-indigo-500' : 'text-zinc-200 hover:text-white hover:font-bold'
        }`}
      >
        Início
        {activeTab === 'inicio' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
        )}
      </Link>
      <Link
        href="/agendamentos"
        className={`relative text-sm font-medium px-4 py-2 transition-colors ${
          activeTab === 'agendamentos' ? 'text-indigo-500' : 'text-zinc-200 hover:text-white hover:font-bold'
        }`}
      >
        Agendamentos
        {activeTab === 'agendamentos' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
        )}
      </Link>
      <Link
        href="/perfil"
        className={`relative text-sm font-medium px-4 py-2 transition-colors ${
          activeTab === 'perfil' ? 'text-indigo-500' : 'text-zinc-200 hover:text-white hover:font-bold'
        }`}
      >
        Perfil
        {activeTab === 'perfil' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
        )}
      </Link>
    </nav>
  );
};

export default Navigation;
