'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { signIn } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      success('Login realizado com sucesso!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      error('Erro ao fazer login', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite seu e-mail"
          required
          disabled={loading}
        />
      </div>

      {/* Campo Senha */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Senha
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite sua senha"
          required
          minLength={6}
          disabled={loading}
        />
      </div>

      {/* Link Esqueci a senha */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => console.log('Recuperar senha')}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          disabled={loading}
        >
          Esqueceu a senha?
        </button>
      </div>

      {/* Botão de submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      {/* Link para criar conta */}
      {onSwitchToSignup && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            disabled={loading}
          >
            Criar conta
          </button>
        </p>
      )}
    </form>
  );
};

export default LoginForm;
