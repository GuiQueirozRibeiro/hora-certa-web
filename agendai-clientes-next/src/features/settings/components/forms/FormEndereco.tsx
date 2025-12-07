'use client';

export function FormEndereco() {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-xl sm:text-2xl text-zinc-300 font-bold mb-2 sm:mb-3">
        Endereço
      </h2>
      <p className="text-sm sm:text-base text-zinc-300 mb-4 sm:mb-6">
        Aqui você pode alterar seu endereço.
      </p>

      {/* Placeholder do Formulário */}
      <form className="flex flex-col gap-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Pais
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Brasil"
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            CEP
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="12345-678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Endereço
          </label>
          <input
            type="tel"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Rua super legal "
            
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Numero
          </label>
          <input
            type="number"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="123"
            
            />

        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Bairro
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Bairro tranquilo"
            
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Cidade
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Cidade amigavel"
            
            />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Estado
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Estado do Bem"
            
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
