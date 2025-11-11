export function FormSeguranca() {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-2xl text-zinc-300 font-bold mb-3">
        Segurança
      </h2>
      <p className="text-zinc-300 mb-6">
        Aqui você pode alterar sua senha.
      </p>

      {/* Placeholder do Formulário */}
      <form className="flex flex-col gap-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">

        <div>

          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Senha atual
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="*******************"
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Nova Senha
          </label>
          <input
            type="email"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="SenhaForte123"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Confirme sua nova Senha
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="*******************"
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