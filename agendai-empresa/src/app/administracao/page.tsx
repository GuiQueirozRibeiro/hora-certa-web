// src/app/administracao/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { NavBar } from '@/components/layout/NavBar';
import { MenuLateralAdmin } from '@/components/features/admin/MenuLateralAdmin';
import { AreaConteudoAdmin } from '@/components/features/admin/AreaConteudoAdmin';
import { DebugConsole } from '@/components/debug/DebugConsole';
import { useDebug } from '@/hooks/useDebug';

// ========================================
// TIPOS
// ========================================
export type AbaAdminAtiva = 'empresa' | 'funcionarios' | 'servicos' | 'horarios' | 'configuracoes';

// ========================================
// PÁGINA PRINCIPAL DE ADMINISTRAÇÃO
// ========================================
export default function AdministracaoPage() {
  // Estado para controlar qual aba está ativa
  const [abaAtiva, setAbaAtiva] = useState<AbaAdminAtiva>('empresa');
  
  // Hook de debug visual
  const debug = useDebug();
  
  // Log inicial quando a página carrega
  useEffect(() => {
    debug.success('Página de administração carregada', { timestamp: new Date().toISOString() });
  }, []);
  
  // Função para trocar de aba com log
  const handleAbaChange = (novaAba: AbaAdminAtiva) => {
    debug.info(`Navegando para aba: ${novaAba}`, { 
      abaAnterior: abaAtiva, 
      novaAba,
      timestamp: new Date().toISOString() 
    });
    setAbaAtiva(novaAba);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900">
      {/* Cabeçalho fixo */}
      <Header />
      
      {/* Navegação principal */}
      <NavBar />
      
      {/* Container principal com scroll */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Título da página */}
        <h1 className="text-2xl font-bold text-zinc-100 mb-6">Administração</h1>
        
        {/* Layout com menu lateral e conteúdo */}
        <div className="flex gap-6">
          
          {/* ========================================
              MENU LATERAL (Navegação de abas)
          ======================================== */}
          <aside className="w-64 shrink-0">
            <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 sticky top-6">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                Configurações
              </h2>
              <MenuLateralAdmin 
                abaAtiva={abaAtiva} 
                setAbaAtiva={handleAbaChange} 
              />
            </div>
          </aside>

          {/* ========================================
              ÁREA DE CONTEÚDO (Renderização condicional)
          ======================================== */}
          <div className="flex-1 min-w-0">
            <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
              <AreaConteudoAdmin abaAtiva={abaAtiva} />
            </div>
          </div>

        </div>
      </main>
      
      {/* ========================================
          DEBUG CONSOLE - Disponível em todas as abas
      ======================================== */}
      <DebugConsole 
        logs={debug.logs}
        isEnabled={debug.isEnabled}
        onClear={debug.clear}
        onToggle={debug.toggle}
        position="right"
        defaultMinimized={false}
      />
    </div>
  );
}
