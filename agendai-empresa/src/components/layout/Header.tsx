'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user, business, signOut, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);
  const displayName = business?.name || user?.name || user?.email?.split('@')[0] || 'Usuário';

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!user && !loading) {
    return null;
  }

  return (
    <header className="flex justify-between items-center px-4 md:px-8 py-3 bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <img src="/ativo-2.svg" alt="" className='h-6 w-6 md:h-8 md:w-8'/>
        <h1 className="text-xl md:text-2xl font-bold truncate">
          <span className="text-white">Agend</span>
          <span className="text-indigo-500">ai</span>{' '}
          <span className="text-white pl-1 md:pl-2 hidden xs:inline">Empresas</span>
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {loading ? (
          <div className="flex flex-col items-end">
            <div className="h-4 w-24 md:w-32 bg-zinc-700 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-white max-w-[120px] md:max-w-none truncate">
              {displayName}
            </span>
            <span className="text-xs text-gray-400 hidden md:block">{formattedDate}</span>
          </div>
        )}
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => !loading && setDropdownOpen(!dropdownOpen)}
            disabled={loading}
            className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : getInitials(displayName)}
          </button>

          {dropdownOpen && !loading && (
            <div className="absolute right-0 mt-2 w-56 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-zinc-700">
                <p className="text-sm font-medium text-white truncate">
                  {displayName}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  <LogOut size={16} />
                  <span>Encerrar Sessão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;