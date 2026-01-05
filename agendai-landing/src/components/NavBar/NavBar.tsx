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
    { name: "Teste Gratis", hightlight: true, href: "https://sistema.agendai.tec.br/login/" },
    { name: "Acessar", href: "https://sites.agendai.tec.br/" },
    { name: "Sou Cliente", href: "https://sistema.agendai.tec.br/login/" },
  ];

  return (
    <>
      <div className="flex bg-zinc-900 w-full h-16 md:h-12 font-sans px-4 md:px-8 items-center justify-between fixed top-0 z-50 border-b border-zinc-800">
        {/* --- ESQUERDA: LOGO --- */}
         <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
            <img 
              src="/Ativo 2.svg" 
              alt="Logo Agendai" 
              className="w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "/Ativo 2.png";
              }}
            />
          </div>
          <span className="text-xl sm:text-2xl md:text-[28px] font-bold tracking-tight">
            <span className="text-white">Agend</span><span className="text-indigo-500">ai</span>
          </span>
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
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white text-sm font-medium px-4 rounded-full cursor-pointer inline-flex items-center ${
                    item.hightlight
                      ? "text-white border border-indigo-700 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all duration-400 hover:scale-[1.2]"
                      : "text-white hover:underline decoration-indigo-500 hover:text-indigo-600 transition-all underline-offset-4"
                  }`}
                >
                  {item.name}
                </a>
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
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white text-base font-medium px-4 py-2 rounded-full cursor-pointer inline-flex items-center justify-center ${
                  item.hightlight
                    ? "text-white border border-indigo-700 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
                    : "text-white hover:underline decoration-indigo-500 hover:text-indigo-600 transition-all"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
