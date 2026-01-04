/**
 * Modal de login/cadastro/recuperação de senha.
 * View que compõe os componentes e conecta com o ViewModel.
 */
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useLoginModalViewModel } from './useLoginModalViewModel';
import { SocialLoginButtons } from './SocialLoginButtons';
import { EmailForm } from './EmailForm';
import type { LoginModalProps } from './types';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const vm = useLoginModalViewModel({ onClose, onLoginSuccess });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={vm.closeModal}
    >
      <div
        className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{vm.title}</h2>
          <button
            onClick={vm.closeModal}
            className="text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Passo 1: Opções de Login */}
        {vm.step === 'initial' && (
          <SocialLoginButtons
            loading={vm.loading}
            onGoogleLogin={vm.handleGoogleLogin}
            onEmailLogin={vm.goToEmailLogin}
            onSignup={vm.goToSignup}
          />
        )}

        {/* Passo 2: Formulário de Email/Senha */}
        {vm.step === 'email-login' && (
          <EmailForm
            mode={vm.mode}
            email={vm.email}
            password={vm.password}
            loading={vm.loading}
            error={vm.error}
            successMessage={vm.successMessage}
            onEmailChange={vm.updateEmail}
            onPasswordChange={vm.updatePassword}
            onSubmit={vm.handleSubmit}
            onModeChange={vm.changeMode}
            onBack={vm.goBack}
          />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
