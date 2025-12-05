'use client';

import { useState } from 'react';
import { MenuLateral } from './components/MenuLateral';
import { AreaConteudo } from './components/AreaConteudo';

type AbaAtiva = 'meus-dados' | 'endereco' | 'seguranca' | 'termos' | 'pagamento' | 'favoritos';

interface SettingsPageProps {
  onNavigateToTermos?: (tipo: 'termos' | 'privacidade') => void;
}

export function SettingsPage({ onNavigateToTermos }: SettingsPageProps) {
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
