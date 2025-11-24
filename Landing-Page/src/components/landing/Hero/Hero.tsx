import { FaGoogle, FaApple } from "react-icons/fa";

export function Hero() {
  return (
    <section
      className="relative w-full min-h-[100vh] md:h-[80vh] flex items-center justify-center bg-fixed bg-center bg-cover bg-no-repeat mt-16 md:mt-12"
      style={{
        // Substitua por sua imagem de barbearia
        backgroundImage:
          "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* 3. O CONTEÚDO (TEXTO E BOTÕES) */}
      {/* z-10: Para ficar EM CIMA da máscara escura */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto py-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight">
          Hora<span className="text-indigo-500">Certa</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-zinc-200 mb-8 md:mb-10 font-light px-4">
          Uma nova experiência para uma antiga tradição.
        </p>

        <button className="bg-indigo-600 text-white font-bold px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/20 mb-8 md:mb-12 uppercase tracking-wider w-full sm:w-auto max-w-xs sm:max-w-none">
          Inicie essa experiência
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-white/80">
          <p className="text-sm md:text-base mb-2 sm:mb-0">Baixe o aplicativo nas Stores</p>
        </div>

        <div className="flex justify-center mt-4 md:mt-5 text-white px-4">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none">
            <button className="border border-white/30 rounded-lg p-3 md:p-2 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
              <FaApple size={22}/>
              <span className="text-sm md:text-xs font-bold">App Store</span>
            </button>
            <button className="border border-white/30 rounded-lg p-3 md:p-2 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
              <FaGoogle size={20}/>
              <span className="text-sm md:text-xs font-bold">Google Play</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
