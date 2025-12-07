'use client';

import { InfoIcon, ReceiptIcon, ShieldIcon, StarIcon } from "lucide-react";

type AbaAtiva = 'meus-dados' | 'seguranca' | 'termos' | 'pagamento' | 'favoritos';

interface MenuLateralProps {
  abaAtiva: AbaAtiva;
  setAbaAtiva: (aba: AbaAtiva) => void;
}

export function MenuLateral({ abaAtiva, setAbaAtiva }: MenuLateralProps) {
  return (
    <nav className="flex">
      <ul className="flex flex-col gap-2 w-full">
        <li 
          onClick={() => setAbaAtiva('meus-dados')}
          className={`flex cursor-pointer items-center gap-3 rounded-md p-2 
            ${abaAtiva === 'meus-dados' ? 'bg-zinc-600 text-white font-bold' : 'text-zinc-200 hover:text-white hover:font-bold'}`}
        >
          <InfoIcon className="h-5 w-5"/>
          <span>Meus dados</span>
        </li>

        <li 
          onClick={() => setAbaAtiva('seguranca')}
          className={`flex cursor-pointer items-center gap-3 rounded-md p-2 
            ${abaAtiva === 'seguranca' ? 'bg-zinc-600 text-white font-bold' : 'text-zinc-200 hover:text-white hover:font-bold'}`}
        >
          <ShieldIcon className="h-5 w-5"/>
          <span>Segurança</span>
        </li>

        <li 
          onClick={() => setAbaAtiva('termos')}
          className={`flex cursor-pointer items-center gap-3 rounded-md p-2 
            ${abaAtiva === 'termos' ? 'bg-zinc-600 text-white font-bold' : 'text-zinc-200 hover:text-white hover:font-bold'}`}
        >
          <ReceiptIcon className="h-5 w-5"/>
          <span>Termos</span>
        </li>

        <li 
          onClick={() => setAbaAtiva('favoritos')}
          className={`flex cursor-pointer items-center gap-3 rounded-md p-2 
            ${abaAtiva === 'favoritos' ? 'bg-zinc-600 text-white font-bold' : 'text-zinc-200 hover:text-white hover:font-bold'}`}
        >
          <StarIcon className="h-5 w-5"/>
          <span>Favoritos</span>
        </li>
      </ul>
    </nav>
  );
}
