export function Footer() {
  const navigation = [
    { name: "Home", href: "#" },
    { name: "Sobre", href: "#" },
    { name: "Funções", href: "#" },
    { name: "Preços", href: "#" },
    { name: "Ajuda", href: "#" },
    { name: "Privacidade", href: "#" },
  ];

  const legal = [
    { name: "Termos", href: "#" },
    { name: "Privacidade", href: "#" },
    { name: "Cookies", href: "#" },
  ];

  return (
    <footer className="w-full bg-indigo-700 text-white">
      {/* Seção Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        
        {/* Logo e Links */}
        <div className="flex flex-col items-center gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-base font-bold">
              Hora<span className="text-indigo-300">Certa</span>
            </span>
          </div>

          {/* Links de Navegação */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-xs text-white/80 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Divisória */}
        <div className="border-t border-white/10 my-4"></div>

        {/* Copyright e Links Legais */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <p className="text-white/60">
            © 2025 HoraCerta. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center gap-4">
            {legal.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
