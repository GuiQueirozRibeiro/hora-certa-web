'use client';

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const Links = [
    { name: "Home", href: "#home" },
    { name: "Sobre", href: "#sobre" },
    { name: "Funções", href: "#funcoes" },
    { name: "Cadastro", href: "#cadastro" },
    { name: "Preços", href: "#precos" },
    { name: "Duvidas", href: "#faq" },
  ];
  const actions = [
    { name: "Teste Gratis", hightlight: true },
    { name: "Acessar" },
    { name: "Sou Cliente" },
  ];

  return (
    <>
      <div className="flex bg-zinc-900 w-full h-16 md:h-12 font-sans px-4 md:px-8 items-center justify-between fixed top-0 z-50 border-b border-zinc-800">

        {/* --- ESQUERDA: LOGO --- */}
        <div className="text-lg md:text-xl font-bold text-white">
          Hora<span className="text-indigo-500">Certa</span>
        </div>

        {/* --- MENU DESKTOP (escondido no mobile) --- */}
        <div className="hidden lg:block">
          <nav className="p-2 flex flex-row relative gap-8">
            {Links.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-white text-sm font-medium hover:text-indigo-600 hover:underline decoration-indigo-500 transition-all underline-offset-4"
              >
                {item.name}
              </a>
            ))}

            {/* divisoria  */}
            <div className="w-px h-6 bg-zinc-700"></div>

            {/* botoes de acoes */}
            <div className="flex gap-4">
              {actions.map((item, index) => (
                <button
                  key={index}
                  className={`text-white text-sm font-medium px-4 rounded-full cursor-pointer  ${
                    item.hightlight
                      ? "text-white border border-indigo-700 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all duration-400 hover:scale-[1.2]"
                      : "text-white hover:underline decoration-indigo-500 hover:text-indigo-600 transition-all underline-offset-4"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* --- BOTÃO HAMBURGER (visível apenas no mobile) --- */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MENU MOBILE (dropdown) --- */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 md:top-12 left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-40 shadow-lg">
          <nav className="flex flex-col p-4 gap-4">
            {Links.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-white text-base font-medium hover:text-indigo-600 transition-all text-left py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            <div className="h-px bg-zinc-700 my-2"></div>
            
            {actions.map((item, index) => (
              <button
                key={index}
                className={`text-white text-base font-medium px-4 py-2 rounded-full cursor-pointer ${
                  item.hightlight
                    ? "text-white border border-indigo-700 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
                    : "text-white hover:underline decoration-indigo-500 hover:text-indigo-600 transition-all"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
