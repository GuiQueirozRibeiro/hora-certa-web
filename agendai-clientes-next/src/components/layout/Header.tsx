'use client';

import React, { useState } from 'react';
import { Layers, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import LoginModal from '../../features/auth/components/LoginModal';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-8 md:px-16 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
            <img 
              src="/Ativo 2.svg" 
              alt="Logo Agendai" 
              className="w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "/Ativo 2.png";
              }}
            />
          </div>
          <span className="text-xl sm:text-2xl md:text-[28px] font-bold tracking-tight">
            <span className="text-white">Agend</span><span className="text-indigo-500">ai</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-white">
                  {profile?.name || user.email?.split('@')[0] || 'Usuário'}
                </span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  {profile?.image_url ? (
                    <img 
                      src={profile.image_url} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="uppercase">
                      {profile?.name?.[0] || user.email?.[0] || 'U'}
                    </span>
                  )}
                </button>
                
                {/* Menu dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#26272B] rounded-lg shadow-lg border border-[#2a2a2a] py-2 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2a2a2a] transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-white">Visitante</span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-indigo-600 transition-color"
              >
                Entrar
              </button>
            </>
          )}
        </div>
      </header>

      {/* Modal de Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          console.log('Login realizado com sucesso!');
        }}
      />
    </>
  );
};

export default Header;
