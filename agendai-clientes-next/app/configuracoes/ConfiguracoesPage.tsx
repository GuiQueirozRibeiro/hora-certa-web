'use client';

import { useState } from 'react';
import { MenuLateral } from '../../src/features/settings/components/MenuLateral';
import { AreaConteudo } from '../../src/features/settings/components/AreaConteudo';
import type { AbaAtiva } from '../../src/features/settings/types';

interface ConfiguracoesPageProps {
  onNavigateToTermos?: (tipo: 'termos' | 'privacidade') => void;
}

export function ConfiguracoesPage({ onNavigateToTermos }: ConfiguracoesPageProps) {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('meus-dados');

  return (
    <div className="flex bg-zinc-900 text-black">
      {/* aside aqui é a sideBar */}
      <aside className="w-56 bg-zinc-800 p-6 text-white" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <h2 className="text-xl font-bold mb-12">Configurações</h2>
        <MenuLateral
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        />
      </aside>

      {/* 2. A ÁREA DE CONTEÚDO */}
      <main className="flex-1 p-10 bg-zinc-900">
        <AreaConteudo abaAtiva={abaAtiva} onNavigateToTermos={onNavigateToTermos} />
      </main>
    </div>
  );
}