import React from 'react';

interface LoginFormProps {
  emailOrPhone: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  emailOrPhone,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  onSwitchToSignup,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Campo Email/Telefone */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          type="text"
          value={emailOrPhone}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite seu e-mail"
          required
        />
      </div>

      {/* Campo Senha */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite sua senha"
          required
          minLength={6}
        />
      </div>

      {/* Link Esqueci a senha */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Esqueceu a senha?
        </button>
      </div>

      {/* Botão de submit */}
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mt-6"
      >
        Entrar
      </button>

      {/* Link para criar conta */}
      <p className="text-center text-sm text-gray-400 mt-4">
        Não tem uma conta?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Criar conta
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
