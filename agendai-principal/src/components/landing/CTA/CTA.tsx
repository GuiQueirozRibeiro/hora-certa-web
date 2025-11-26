export function CTA() {
  return (
    <section className="w-full py-16 md:py-20 bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Título */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Comece seu teste grátis
        </h2>

        {/* Subtítulo */}
        <p className="text-sm md:text-base text-zinc-400 mb-8">
          Junte-se a milhares de barbearias que já estão crescendo com o HoraCerta.
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-6 py-3 bg-zinc-800 text-white text-sm font-semibold rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-all duration-200 active:scale-95">
            Sou Cliente
          </button>
          <button className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-indigo-500/30">
            Sou Barbearia
          </button>
        </div>
      </div>
    </section>
  );
}
