'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { NavBar } from '@/components/layout/NavBar';
import { MenuLateralAdmin } from '@/components/features/admin/MenuLateralAdmin';
import { AreaConteudoAdmin } from '@/components/features/admin/AreaConteudoAdmin';

export type AbaAdminAtiva = 'empresa' | 'endereco' | 'funcionarios' | 'servicos' | 'horarios' | 'configuracoes';

export default function AdministracaoPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAdminAtiva>('empresa');
  
  const handleAbaChange = (novaAba: AbaAdminAtiva) => {
    setAbaAtiva(novaAba);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900">
      <Header />
      <NavBar />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <h1 className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 md:mb-6">Administração</h1>
        
        {/* Layout Flex Column (Mobile) -> Row (Desktop) */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          
          {/* Menu de Navegação */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-2 md:p-4 lg:sticky lg:top-6">
              <h2 className="hidden lg:block text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                Configurações
              </h2>
              {/* MenuLateralAdmin agora é responsável por ser responsivo */}
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