export function FormMeusDados() {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-2xl text-zinc-300 font-bold mb-3">
        Meus Dados
      </h2>
      <p className="text-zinc-300 mb-6">
        Aqui você pode alterar suas informações de perfil.
      </p>

      {/* Placeholder do Formulário */}
      <form className="flex flex-col gap-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">

        <div>

          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Fulano Taldo"
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="fulano.taldo@gmail.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Data de Aniversario
          </label>
          <input
            type="date"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="(xx) x xxxx-xxxx"
            
            />
        </div>

      </div>

        <button
          type="submit"
          className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
          Salvar Alterações
        </button>

      </form>
    </div>
  );
}