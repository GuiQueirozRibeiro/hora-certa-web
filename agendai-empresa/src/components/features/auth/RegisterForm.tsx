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
  const [emailError, setEmailError] = useState(false);

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
    setEmailError(false); // Resetamos o erro visual ao tentar novamente

    try {
      await signUp(formData.email, formData.password, formData.name);
      showSuccess('Conta criada com sucesso!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
  
      const errorMessage = err.message || err.error_description || '';
      

      console.log("Erro capturado:", errorMessage);

      if (errorMessage.includes('already registered') || errorMessage.includes('registered')) {
        setEmailError(true); 
        showError('E-mail já cadastrado', 'Este e-mail já está em uso. Tente fazer login.');
      } else if (err.status === 422 || errorMessage.includes('422')) {
        setEmailError(true);
        showError('Verifique os dados', 'E-mail inválido ou já cadastrado.');
      } else if (errorMessage.includes('rate limit')) {
        showError('Muitas tentativas', 'Aguarde um momento antes de tentar novamente.');
      } else {
        showError('Erro ao criar conta', errorMessage);
      }
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
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (emailError) setEmailError(false); // Limpa o erro ao digitar
            }}
            className={`w-full bg-[#2a2a2a] border ${emailError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#3a3a3a]'
              } rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all`}
            placeholder="Digite seu e-mail"
            required
            disabled={loading}
          />
          {emailError && (
            <p className="text-xs text-red-400 mt-1">Este e-mail já está vinculado a uma conta.</p>
          )}
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mt-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </button>

        {/* Link para login */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer"
            disabled={loading}
          >
            Fazer login
          </button>
        </p>
    </form>
  );
};

export default RegisterForm;
