import React from 'react';

interface RegisterFormStep2Props {
  pais: string;
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  onPaisChange: (value: string) => void;
  onCepChange: (value: string) => void;
  onEstadoChange: (value: string) => void;
  onCidadeChange: (value: string) => void;
  onBairroChange: (value: string) => void;
  onRuaChange: (value: string) => void;
  onNumeroChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const RegisterFormStep2: React.FC<RegisterFormStep2Props> = ({
  pais,
  cep,
  estado,
  cidade,
  bairro,
  rua,
  numero,
  onPaisChange,
  onCepChange,
  onEstadoChange,
  onCidadeChange,
  onBairroChange,
  onRuaChange,
  onNumeroChange,
  onSubmit,
  onBack,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* País */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          País*
        </label>
        <input
          type="text"
          value={pais}
          onChange={(e) => onPaisChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Brasil"
          required
        />
      </div>

      {/* CEP */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          CEP*
        </label>
        <input
          type="text"
          value={cep}
          onChange={(e) => onCepChange(e.target.value.replace(/\D/g, '').slice(0, 8))}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite o CEP"
          maxLength={8}
          required
        />
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Estado*
        </label>
        <input
          type="text"
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite o estado"
          required
        />
      </div>

      {/* Cidade */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Cidade*
        </label>
        <input
          type="text"
          value={cidade}
          onChange={(e) => onCidadeChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite a cidade"
          required
        />
      </div>

      {/* Bairro */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bairro*
        </label>
        <input
          type="text"
          value={bairro}
          onChange={(e) => onBairroChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite o bairro"
          required
        />
      </div>

      {/* Rua */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Rua*
        </label>
        <input
          type="text"
          value={rua}
          onChange={(e) => onRuaChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite a rua"
          required
        />
      </div>

      {/* Número */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Número*
        </label>
        <input
          type="text"
          value={numero}
          onChange={(e) => onNumeroChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite o número"
          required
        />
      </div>

      {/* Botão de submit */}
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mt-6 cursor-pointer"
      >
        Confirmar
      </button>

      {/* Botão Voltar */}
      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors mt-2 cursor-pointer"
      >
        ← Voltar
      </button>
    </form>
  );
};

export default RegisterFormStep2;
