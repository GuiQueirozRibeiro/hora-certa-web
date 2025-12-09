import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

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
              Entrar com Google
            </button>

            {/* Botão Entrar com Email */}
            <button
              type="button"
              onClick={() => setStep('email-login')}
              className="w-full flex items-center justify-center gap-3 bg-[#2a2a2a] hover:bg-[#333333] border border-[#3a3a3a] text-white rounded-lg py-3 px-4 text-sm font-medium transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
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