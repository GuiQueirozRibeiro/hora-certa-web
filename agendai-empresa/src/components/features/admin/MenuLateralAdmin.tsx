'use client';

import { 
  Building2Icon, 
  UsersIcon, 
  ScissorsIcon, 
  ClockIcon, 
  SettingsIcon,
  MapPin
} from 'lucide-react';
import { AbaAdminAtiva } from '@/app/administracao/page';

type MenuLateralAdminProps = {
  abaAtiva: AbaAdminAtiva; // Estado atual da aba
  setAbaAtiva: (aba: AbaAdminAtiva) => void; // Função para mudar o estado
}

// ========================================
// COMPONENTE DE MENU LATERAL
// ========================================
/**
 * Menu de navegação lateral para a área de administração.
 * Permite alternar entre diferentes seções de configuração.
 */
export function MenuLateralAdmin({ abaAtiva, setAbaAtiva }: MenuLateralAdminProps) {
  return (
    <nav className="flex">
      <ul className="flex flex-col gap-2 w-full">
        
        {/* ========================================
            ITEM: Dados da Empresa
        ======================================== */}
        <li 
          onClick={() => setAbaAtiva('empresa')}
          className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all
            ${abaAtiva === 'empresa' 
              ? 'bg-zinc-700 text-white font-semibold' 
              : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'}`}
        >
          <Building2Icon className="h-5 w-5" />
          <span>Dados da Empresa</span>
        </li>

        {/* ========================================
            ITEM: Endereço
        ======================================== */}
        <li 
          onClick={() => setAbaAtiva('endereco')}
          className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all
            ${abaAtiva === 'endereco' 
              ? 'bg-zinc-700 text-white font-semibold' 
              : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'}`}
        >
          <MapPin className="h-5 w-5" />
          <span>Endereço</span>
        </li>

        {/* ========================================
            ITEM: Funcionários
        ======================================== */}
        <li 
          onClick={() => setAbaAtiva('funcionarios')}
          className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all
            ${abaAtiva === 'funcionarios' 
              ? 'bg-zinc-700 text-white font-semibold' 
              : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'}`}
        >
          <UsersIcon className="h-5 w-5" />
          <span>Funcionários</span>
        </li>

        {/* ========================================
            ITEM: Serviços
        ======================================== */}
        <li 
          onClick={() => setAbaAtiva('servicos')}
          className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all
            ${abaAtiva === 'servicos' 
              ? 'bg-zinc-700 text-white font-semibold' 
              : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'}`}
        >
          <ScissorsIcon className="h-5 w-5" />
          <span>Serviços</span>
        </li>
        {/* ========================================
            ITEM: Horários
        ======================================== */}
        <li 
          onClick={() => setAbaAtiva('horarios')}
          className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all
            ${abaAtiva === 'horarios' 
              ? 'bg-zinc-700 text-white font-semibold' 
              : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'}`}
        >
          <ClockIcon className="h-5 w-5" />
          <span>Horários de Funcionamento</span>
        </li>

        {/* ========================================
            ITEM: Configurações
        ======================================== */}
        <li 
          onClick={() => setAbaAtiva('configuracoes')}
          className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all
            ${abaAtiva === 'configuracoes' 
              ? 'bg-zinc-700 text-white font-semibold' 
              : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'}`}
        >
          <SettingsIcon className="h-5 w-5" />
          <span>Configurações</span>
        </li>
      </ul>
    </nav>
  );
}

