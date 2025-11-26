import React from 'react';

interface RegisterFormStep1Props {
  nomeCompleto: string;
  nomeEstabelecimento: string;
  ddd: string;
  telefone: string;
  cnpjCpf: string;
  email: string;
  senha: string;
  onNomeCompletoChange: (value: string) => void;
  onNomeEstabelecimentoChange: (value: string) => void;
  onDddChange: (value: string) => void;
  onTelefoneChange: (value: string) => void;
  onCnpjCpfChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSenhaChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

const RegisterFormStep1: React.FC<RegisterFormStep1Props> = ({
  nomeCompleto,
  nomeEstabelecimento,
  ddd,
  telefone,
  cnpjCpf,
  email,
  senha,
  onNomeCompletoChange,
  onNomeEstabelecimentoChange,
  onDddChange,
  onTelefoneChange,
  onCnpjCpfChange,
  onEmailChange,
  onSenhaChange,
  onSubmit,
  onSwitchToLogin,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Nome completo */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nome completo
        </label>
        <input
          type="text"
          value={nomeCompleto}
          onChange={(e) => onNomeCompletoChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite seu nome completo"
          required
        />
      </div>

      {/* Nome do estabelecimento */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nome do estabelecimento
        </label>
        <input
          type="text"
          value={nomeEstabelecimento}
          onChange={(e) => onNomeEstabelecimentoChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite o nome do estabelecimento"
          required
        />
      </div>

      {/* DDD + Telefone */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          DDD + telefone
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={ddd}
            onChange={(e) => onDddChange(e.target.value.replace(/\D/g, '').slice(0, 2))}
            className="w-20 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            placeholder="DDD"
            maxLength={2}
            required
          />
          <input
            type="text"
            value={telefone}
            onChange={(e) => onTelefoneChange(e.target.value.replace(/\D/g, '').slice(0, 9))}
            className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            placeholder="Telefone"
            maxLength={9}
            required
          />
        </div>
      </div>

      {/* CNPJ/CPF */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          CNPJ/CPF
        </label>
        <input
          type="text"
          value={cnpjCpf}
          onChange={(e) => onCnpjCpfChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite o CNPJ ou CPF"
          maxLength={18}
          required
        />
      </div>

      {/* E-mail */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite seu e-mail"
          required
        />
      </div>

      {/* Senha */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Senha
        </label>
        <input
          type="password"
          value={senha}
          onChange={(e) => onSenhaChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Crie uma senha"
          required
          minLength={6}
        />
      </div>

      {/* Botão de submit */}
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mt-6"
      >
        Confirmar
      </button>

      {/* Link para login */}
      <p className="text-center text-sm text-gray-400 mt-4">
        Já tem uma conta?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Fazer login
        </button>
      </p>
    </form>
  );
};

export default RegisterFormStep1;
