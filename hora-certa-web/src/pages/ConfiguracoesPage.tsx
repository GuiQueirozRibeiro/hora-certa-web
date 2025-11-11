import React, { useState } from 'react';
import { MenuLateral } from '../components/Configuracoes/MenuLateral';
import { AreaConteudo } from '../components/Configuracoes/AreaConteudo';

type AbaAtiva = 'meus-dados' | 'endereco' | 'seguranca' | 'termos' | 'pagamento' | 'favoritos';

export function ConfiguracoesPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('meus-dados');

  // O 'h-full' faz a página preencher o <main>
  // O 'bg-gray-900 text-white' define o fundo da *área de conteúdo*
  return (
    // essa div é o fundo do conteudo da pagina
    <div className="flex h-full bg-zinc-900 text-black">
      {/* aside aqui é a sideBar */}
      <aside className="relative w-56 bg-zinc-800 p-6 text-white  -mt-[5.25rem] h-[calc(100%+5.25rem)]">
        <h2 className="text-xl font-bold mb-12">Configurações</h2>
        <MenuLateral
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        />
      </aside>

      {/* 2. A ÁREA DE CONTEÚDO */}
      <main className="flex-1 p-8">
        <AreaConteudo abaAtiva={abaAtiva}/>
      </main>
    </div>
  );
}