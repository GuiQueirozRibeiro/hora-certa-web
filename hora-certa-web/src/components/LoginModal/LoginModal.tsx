import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

type LoginMode = 'login' | 'signup' | 'reset';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
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
    signInWithApple,
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
          setError(error.message);
        } else {
          setSuccessMessage('Cadastro realizado! Verifique seu email para confirmar.');
          setTimeout(() => {
            onClose();
            onLoginSuccess?.();
          }, 2000);
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
          setError('Email/telefone ou senha incorretos');
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

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setError(null);
    setLoading(true);

    try {
      const { error } = provider === 'google' 
        ? await signInWithGoogle()
        : await signInWithApple();

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulário */}
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
        </form>

        {/* Divisor */}
        {mode === 'login' && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-sm text-gray-500">ou</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Botões de login social */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg py-3 text-white text-sm font-medium hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('apple')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg py-3 text-white text-sm font-medium hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continuar com Apple
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;