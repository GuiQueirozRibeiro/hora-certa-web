'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

type LoginMode = 'login' | 'signup' | 'reset';
type LoginStep = 'initial' | 'email-login';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState<LoginStep>('initial');
  const [mode, setMode] = useState<LoginMode>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    signInWithEmail,
    signInWithPhone,
    signInWithGoogle,
    signUpWithEmail,
    resetPassword,
  } = useAuth();

  if (!isOpen) return null;

  // Verificar se é email ou telefone
  const isEmail = (value: string) => {
    return value.includes('@');
  };

  const isPhone = (value: string) => {
    return /^\+?[\d\s()-]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'reset') {
        // Reset de senha
        if (!isEmail(emailOrPhone)) {
          setError('Por favor, insira um email válido para recuperação de senha');
          setLoading(false);
          return;
        }

        const { error } = await resetPassword(emailOrPhone);
        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
          setTimeout(() => {
            setMode('login');
            setSuccessMessage(null);
          }, 3000);
        }
      } else if (mode === 'signup') {
        // Cadastro
        if (!isEmail(emailOrPhone)) {
          setError('Por favor, insira um email válido para cadastro');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres');
          setLoading(false);
          return;
        }

        const { error } = await signUpWithEmail(emailOrPhone, password);
        if (error) {
          console.error('Erro de cadastro:', error);
          setError(error.message);
        } else {
          console.log('Cadastro realizado com sucesso! Usuário precisa confirmar email.');
          setSuccessMessage('Cadastro realizado! Verifique seu email para confirmar sua conta antes de fazer login.');
          // Não fecha o modal nem chama onLoginSuccess até confirmar email
          setTimeout(() => {
            setMode('login');
            setSuccessMessage(null);
          }, 5000);
        }
      } else {
        // Login
        let result;
        
        if (isEmail(emailOrPhone)) {
          result = await signInWithEmail(emailOrPhone, password);
        } else if (isPhone(emailOrPhone)) {
          result = await signInWithPhone(emailOrPhone, password);
        } else {
          setError('Por favor, insira um email ou telefone válido');
          setLoading(false);
          return;
        }

        if (result.error) {
          // Log para debug
          console.error('Erro de login:', result.error);
          
          // Mensagens de erro mais específicas
          if (result.error.message.includes('Email not confirmed')) {
            setError('Email não confirmado. Por favor, verifique sua caixa de entrada e confirme seu email antes de fazer login.');
          } else if (result.error.message.includes('Invalid login credentials')) {
            setError('Email ou senha incorretos. Se você acabou de se cadastrar, verifique seu email para confirmar sua conta.');
          } else {
            setError(`Erro ao fazer login: ${result.error.message}`);
          }
        } else {
          onClose();
          onLoginSuccess?.();
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
      console.error('Erro de autenticação:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
      console.error('Erro de autenticação social:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (step === 'initial') {
      return 'Fazer Login';
    }
    switch (mode) {
      case 'signup':
        return 'Criar Conta';
      case 'reset':
        return 'Recuperar Senha';
      default:
        return 'Fazer Login';
    }
  };

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

  const handleCloseModal = () => {
    setStep('initial');
    setMode('login');
    setError(null);
    setSuccessMessage(null);
    setEmailOrPhone('');
    setPassword('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleCloseModal}
    >
      <div
        className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{getTitle()}</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Passo 1: Opções de Login */}
        {step === 'initial' && (
          <div className="space-y-3">
            {/* Botão Google */}
            <button
              type="button"
              onClick={handleSocialLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg py-3 px-4 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faGoogle} className="text-xl" />
              Entrar com Google
            </button>

            {/* Botão Entrar com Email */}
            <button
              type="button"
              onClick={() => setStep('email-login')}
              className="w-full flex items-center justify-center gap-3 bg-[#2a2a2a] hover:bg-[#333333] border border-[#3a3a3a] text-white rounded-lg py-3 px-4 text-sm font-medium transition-colors"
            >
              <Mail size={20} />
              Entrar com email
            </button>

            {/* Botão Novo Cadastro */}
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setStep('email-login');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 px-4 text-sm font-medium transition-colors"
            >
              Novo cadastro
            </button>
          </div>
        )}

        {/* Passo 2: Formulário de Email/Senha */}
        {step === 'email-login' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Email/Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {mode === 'reset' ? 'E-mail' : 'E-mail ou telefone'}
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
                placeholder={mode === 'reset' ? 'Digite seu e-mail' : 'Digite seu e-mail ou telefone'}
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
                  onChange={(e) => setPassword(e.target.value)}
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
                  onClick={() => setMode('reset')}
                  className="text-sm text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            {/* Botão de submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg py-3 text-white text-sm font-semibold transition-colors ${
                loading
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600'
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
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-indigo-500 hover:text-indigo-400 transition-colors"
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
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  Fazer login
                </button>
              </p>
            )}

            {/* Botão Voltar */}
            <button
              type="button"
              onClick={() => {
                setStep('initial');
                setMode('login');
                setError(null);
              }}
              className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Voltar
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;