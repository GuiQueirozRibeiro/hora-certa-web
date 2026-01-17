'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import { NavBar } from '@/components/layout/NavBar';
import { MenuLateralAdmin } from '@/components/features/admin/MenuLateralAdmin';
import { AreaConteudoAdmin } from '@/components/features/admin/AreaConteudoAdmin';

export type AbaAdminAtiva = 'empresa' | 'endereco' | 'funcionarios' | 'servicos' | 'horarios' | 'configuracoes';

export default function AdministracaoPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAdminAtiva>('empresa');
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  
  const handleAbaChange = (novaAba: AbaAdminAtiva) => {
    setAbaAtiva(novaAba);
    setMenuMobileAberto(false); // Fecha o menu ao selecionar uma aba
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900">
      <Header />
      <NavBar />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100">Administração</h1>
          
          {/* Botão Menu Mobile */}
          <button
            onClick={() => setMenuMobileAberto(!menuMobileAberto)}
            className="lg:hidden p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700 transition-colors"
            aria-label="Menu"
          >
            {menuMobileAberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu Mobile Overlay */}
        {menuMobileAberto && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMenuMobileAberto(false)}
          />
        )}
        
        {/* Layout Flex Column (Mobile) -> Row (Desktop) */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 relative">
          
          {/* Menu de Navegação */}
          <aside className={`
            w-full lg:w-64 shrink-0
            lg:relative
            ${menuMobileAberto ? 'fixed top-0 left-0 h-full z-50 p-4' : 'hidden lg:block'}
          `}>
            <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 lg:sticky lg:top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Configurações
                </h2>
                {/* Botão fechar dentro do menu mobile */}
                <button
                  onClick={() => setMenuMobileAberto(false)}
                  className="lg:hidden p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <MenuLateralAdmin 
                abaAtiva={abaAtiva} 
                setAbaAtiva={handleAbaChange} 
              />
            </div>
          </aside>

          {/* Área de Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 md:p-6">
              <AreaConteudoAdmin abaAtiva={abaAtiva} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}