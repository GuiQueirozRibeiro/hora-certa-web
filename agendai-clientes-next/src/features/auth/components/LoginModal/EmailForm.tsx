/**
 * Formulário de login/cadastro/reset com email e senha.
 */
'use client';

import React from 'react';
import type { EmailFormProps } from './types';

export const EmailForm: React.FC<EmailFormProps> = ({
  mode,
  email,
  password,
  loading,
  error,
  successMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onModeChange,
  onBack,
}) => {
  const getButtonText = () => {
    if (loading) return 'Carregando...';
    switch (mode) {
      case 'signup':
        return 'Criar conta';
      case 'reset':
        return 'Enviar email';
      default:
        return 'Entrar';
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Campo Email */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
          placeholder="Digite seu e-mail"
          required
        />
      </div>

      {/* Campo Senha */}
      {mode !== 'reset' && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
            placeholder="Digite sua senha"
            required
            minLength={6}
          />
        </div>
      )}

      {/* Mensagens de erro e sucesso */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <p className="text-green-500 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Link Esqueci a senha */}
      {mode === 'login' && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onModeChange('reset')}
            className="text-sm text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Esqueceu a senha?
          </button>
        </div>
      )}

      {/* Botão de submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-lg py-3 text-white text-sm font-semibold transition-colors cursor-pointer ${
          loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
        }`}
      >
        {getButtonText()}
      </button>

      {/* Links para alternar entre modos */}
      {mode === 'login' && (
        <p className="text-center text-sm text-gray-400">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={() => onModeChange('signup')}
            className="text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Criar conta
          </button>
        </p>
      )}

      {(mode === 'signup' || mode === 'reset') && (
        <p className="text-center text-sm text-gray-400">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={() => onModeChange('login')}
            className="text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Fazer login
          </button>
        </p>
      )}

      {/* Botão Voltar */}
      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        ← Voltar
      </button>
    </form>
  );
};
