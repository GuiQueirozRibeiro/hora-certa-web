/**
 * Botões de login social e opções iniciais.
 */
'use client';

import React from 'react';
import { Mail } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import type { SocialLoginButtonsProps } from './types';

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  loading,
  onGoogleLogin,
  onEmailLogin,
  onSignup,
}) => {
  return (
    <div className="space-y-3">
      {/* Botão Google */}
      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg py-3 px-4 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FontAwesomeIcon icon={faGoogle} className="text-xl" />
        Entrar com Google
      </button>

      {/* Botão Entrar com Email */}
      <button
        type="button"
        onClick={onEmailLogin}
        className="w-full flex items-center justify-center gap-3 bg-[#2a2a2a] hover:bg-[#333333] border border-[#3a3a3a] text-white rounded-lg py-3 px-4 text-sm font-medium transition-colors"
      >
        <Mail size={20} />
        Entrar com email
      </button>

      {/* Botão Novo Cadastro */}
      <button
        type="button"
        onClick={onSignup}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 px-4 text-sm font-medium transition-colors"
      >
        Novo cadastro
      </button>
    </div>
  );
};
