import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import LoginModal from '../LoginModal/LoginModal';

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
      <header className="flex justify-between items-center px-16 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <span className="text-[28px] font-bold tracking-tight">
            <span className="text-indigo-500">Hora</span> <span className="text-white">Certa</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex flex-col items-end">
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
                  className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold hover:bg-indigo-600 transition-colors"
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
              <div className="flex flex-col items-end">
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
                className="px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
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