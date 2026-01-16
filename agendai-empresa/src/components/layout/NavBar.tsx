"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavBar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="flex items-center gap-4 md:gap-16 py-0 md:py-3 bg-zinc-800 border-b border-zinc-700 overflow-x-auto no-scrollbar justify-start md:justify-center px-4 md:px-0">
      <Link
        href="/financeiro"
        className={`relative text-sm font-medium px-4 md:px-6 py-3 md:py-2 transition-all whitespace-nowrap shrink-0 ${
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
      
      <Link
        href="/agenda"
        className={`relative text-sm font-medium px-4 md:px-6 py-3 md:py-2 transition-all whitespace-nowrap shrink-0 ${
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
      
      <Link
        href="/administracao"
        className={`relative text-sm font-medium px-4 md:px-6 py-3 md:py-2 transition-all whitespace-nowrap shrink-0 ${
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