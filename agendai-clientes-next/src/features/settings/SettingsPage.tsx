'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MenuLateral } from './components/MenuLateral';
import { AreaConteudo } from './components/AreaConteudo';
import { EmptyStates } from '../appointments/components/EmptyStates';
import LoginModal from '../auth/components/LoginModal';
import { Menu, X } from 'lucide-react';

type AbaAtiva = 'meus-dados' | 'seguranca' | 'termos' | 'pagamento' | 'favoritos';

interface SettingsPageProps {
  onNavigateToTermos?: (tipo: 'termos' | 'privacidade') => void;
}

export function SettingsPage({ onNavigateToTermos }: SettingsPageProps) {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('meus-dados');
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Evita erro de hidratação
  if (!isClient) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <EmptyStates.Loading />
      </div>
    );
  }

  // Estado de não autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <EmptyStates.NotAuthenticatedSettings onLogin={() => setShowLoginModal(true)} />
        
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => setShowLoginModal(false)}
        />
      </div>
    );
  }

  const handleMenuItemClick = (aba: AbaAtiva) => {
    setAbaAtiva(aba);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-zinc-900 text-black min-h-screen">
      {/* Botão Menu Mobile */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-20 right-4 z-50 bg-indigo-500 text-white p-3 rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para mobile */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative
        w-64 lg:w-56
        bg-zinc-800 p-4 sm:p-6 text-white
        z-40
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-screen lg:h-auto
        overflow-y-auto
      `} style={{ minHeight: 'calc(100vh - 120px)' }}>
        <h2 className="text-lg sm:text-xl font-bold mb-8 sm:mb-12">Configurações</h2>
        <MenuLateral
          abaAtiva={abaAtiva}
          setAbaAtiva={handleMenuItemClick}
        />
      </aside>

      {/* Área de Conteúdo */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 bg-zinc-900">
        <AreaConteudo abaAtiva={abaAtiva} onNavigateToTermos={onNavigateToTermos} />
      </main>
    </div>
  );
}
