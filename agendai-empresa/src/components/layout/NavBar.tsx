// src/components/layout/NavBar.tsx
"use client"; // 1. Necessário porque usamos hooks (usePathname)

import Link from "next/link";
import { usePathname } from "next/navigation";

// 2. Não precisamos mais de interface de Props! O componente é independente.
export function NavBar() {
  const pathname = usePathname(); // Pega a rota atual (ex: '/agenda')

  // Função auxiliar para verificar se o link está ativo
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="flex justify-center gap-16 py-3 bg-zinc-800 border-b border-zinc-700">
      
      {/* --- LINK FINANCEIRO --- */}
      <Link
        href="/financeiro"
        className={`relative text-sm font-medium px-6 py-2 transition-all ${
          isActive('/financeiro')
            ? 'text-indigo-400'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        Financeiro
        {isActive('/financeiro') && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
        )}
      </Link>
      
      {/* --- LINK AGENDA --- */}
      <Link
        href="/agenda"
        className={`relative text-sm font-medium px-6 py-2 transition-all ${
          isActive('/agenda')
            ? 'text-indigo-400'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        Agenda
        {isActive('/agenda') && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
        )}
      </Link>
      
      {/* --- LINK ADMINISTRAÇÃO --- */}
      <Link
        href="/administracao"
        className={`relative text-sm font-medium px-6 py-2 transition-all ${
          isActive('/administracao')
            ? 'text-indigo-400'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        Administração
        {isActive('/administracao') && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
        )}
      </Link>

    </nav>
  );
}
