import Image from 'next/image';

export function Hero() {
  return (
    <section
      className="relative w-full min-h-screen md:h-[80vh] flex items-center justify-center bg-fixed bg-center bg-cover bg-no-repeat mt-16 md:mt-12"
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight">
          Você acabou de encontrar o sistema que enche sua agenda.
        </h1>

        <a  className="bg-indigo-600 text-white font-bold px-6 py-3 md:px-8 md:py-4 rounded-lg text-sm md:text-base hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/20 mb-8 md:mb-12 uppercase tracking-wider w-full sm:w-auto max-w-xs sm:max-w-none cursor-pointer"
        href="https://sistema.agendai.tec.br/login/"
        >
          Inicie essa experiência
        </a>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-white/80 mt-10">
          <p className="text-sm md:text-base mb-2 sm:mb-0">Baixe o aplicativo nas Stores</p>
        </div>

        <div className="flex justify-center mt-4 md:mt-5 px-4">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none items-center">
            <a href="#" className="hover:opacity-80 transition-opacity flex items-center">
              <Image 
                src="/app-store-badge.png" 
                alt="Baixar na App Store" 
                width={140} 
                height={47}
                className="h-12 md:h-10 w-auto"
              />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity flex items-center">
              <Image 
                src="/GooglePlay.png" 
                alt="Disponível no Google Play" 
                width={156} 
                height={47}
                className="h-12 md:h-14 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
