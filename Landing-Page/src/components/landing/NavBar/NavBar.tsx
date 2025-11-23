import { useState } from "react";

export function NavBar() {
  const [active, setActive] = useState();

  const Links = [
    { name: "Home" },
    { name: "Sobre" },
    { name: "Funções" },
    { name: "Preços" },
  ];
  const actions = [
    { name: "Teste Gratis", hightlight: true },
    { name: "Acessar" },
    { name: "Sou Cliente" },
  ];

  return (
    <div className="flex bg-zinc-900 w-full h-16 font-sans px-8 items-center justify-between fixed top-0 z-50 border-b border-zinc-800">

      {/* --- ESQUERDA: LOGO --- */}
      <div className="text-xl font-bold text-white">
        Hora<span className="text-indigo-500">Certa</span>
      </div>

      {/* --- DIREITA: MENU + AÇÕES --- */}
      <div>
        {/* links de navegação */}
        <nav className="p-2 flex flex-row relative gap-8">
          {Links.map((item, index) => (
            <button
              key={index}
              className="text-white text-sm font-medium hover:text-indigo-600 hover:underline decoration-indigo-500 transition-all underline-offset-4"
            >
              {item.name}
            </button>
          ))}

          {/* divisoria  */}
          <div className="w-px h-6 bg-zinc-700"></div>

          {/* botoes de acoes */}
          <div className="flex gap-4">
            {actions.map((item, index) => (
              <button
                key={index}
                className={`text-white text-sm font-medium px-4 p-1 rounded-full ${
                  item.hightlight
                    ? "text-white border border-indigo-700 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all duration-[400ms] hover:scale-[1.2]"
                    : "text-white hover:underline decoration-indigo-500 hover:text-indigo-600 transition-all underline-offset-4"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
