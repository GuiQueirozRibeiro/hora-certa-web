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
  abaAtiva: AbaAdminAtiva;
  setAbaAtiva: (aba: AbaAdminAtiva) => void;
}

export function MenuLateralAdmin({ abaAtiva, setAbaAtiva }: MenuLateralAdminProps) {
  const getItemClass = (isActive: boolean) => `
    flex cursor-pointer items-center gap-2 md:gap-3 rounded-md p-3 md:p-3 transition-all whitespace-nowrap
    text-sm md:text-sm font-medium
    ${isActive 
      ? 'bg-zinc-700 text-white shadow-md' 
      : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-white'}
  `;

  return (
    <nav className="flex w-full">
      <ul className="flex flex-row lg:flex-col gap-2 w-full overflow-x-auto pb-2 lg:pb-0 no-scrollbar touch-pan-x">
        <li 
          onClick={() => setAbaAtiva('empresa')}
          className={getItemClass(abaAtiva === 'empresa')}
        >
          <Building2Icon className="h-5 w-5 shrink-0" />
          <span>Empresa</span>
        </li>

        <li 
          onClick={() => setAbaAtiva('endereco')}
          className={getItemClass(abaAtiva === 'endereco')}
        >
          <MapPin className="h-5 w-5 shrink-0" />
          <span>Endereço</span>
        </li>

        <li 
          onClick={() => setAbaAtiva('funcionarios')}
          className={getItemClass(abaAtiva === 'funcionarios')}
        >
          <UsersIcon className="h-5 w-5 shrink-0" />
          <span>Funcionários</span>
        </li>

        <li 
          onClick={() => setAbaAtiva('servicos')}
          className={getItemClass(abaAtiva === 'servicos')}
        >
          <ScissorsIcon className="h-5 w-5 shrink-0" />
          <span>Serviços</span>
        </li>

        <li 
          onClick={() => setAbaAtiva('horarios')}
          className={getItemClass(abaAtiva === 'horarios')}
        >
          <ClockIcon className="h-5 w-5 shrink-0" />
          <span>Horários</span>
        </li>

        <li 
          onClick={() => setAbaAtiva('configuracoes')}
          className={getItemClass(abaAtiva === 'configuracoes')}
        >
          <SettingsIcon className="h-5 w-5 shrink-0" />
          <span>Configurações</span>
        </li>
      </ul>
    </nav>
  );
}