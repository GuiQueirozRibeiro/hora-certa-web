'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { signUp } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showError('Erro de validação', 'As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      showError('Erro de validação', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name);
      showSuccess('Conta criada com sucesso!');
      // O useAuth já redireciona para /administracao/setup
    } catch (err: any) {
      showError('Erro ao criar conta', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome completo */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nome completo *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite seu nome completo"
          required
          disabled={loading}
        />
      </div>

      {/* E-mail */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          E-mail *
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

      {/* Senha */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Senha *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Crie uma senha (mínimo 6 caracteres)"
          required
          minLength={6}
          disabled={loading}
        />
      </div>

      {/* Confirmar Senha */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Confirmar senha *
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Digite a senha novamente"
          required
          minLength={6}
          disabled={loading}
        />
      </div>

      {/* Informação */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
        <p className="text-xs text-indigo-300">
          Após criar sua conta, você será direcionado para configurar sua empresa.
        </p>
      </div>

      {/* Botão de submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Criando conta...' : 'Criar Conta'}
      </button>

      {/* Link para login */}
      <p className="text-center text-sm text-gray-400 mt-4">
        Já tem uma conta?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          disabled={loading}
        >
          Fazer login
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;
