/**
 * ViewModel do LoginModal. Gerencia estados, validações e autenticação.
 * Dependência: useAuth hook.
 */
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import type { LoginMode, LoginStep } from './types';

interface UseLoginModalViewModelProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function useLoginModalViewModel({ onClose, onLoginSuccess }: UseLoginModalViewModelProps) {
  const [step, setStep] = useState<LoginStep>('initial');
  const [mode, setMode] = useState<LoginMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    resetPassword,
  } = useAuth();

  // Validações
  const isEmail = useCallback((value: string) => value.includes('@'), []);

  // Título dinâmico
  const title = useMemo(() => {
    if (step === 'initial') return 'Fazer Login';
    switch (mode) {
      case 'signup':
        return 'Criar Conta';
      case 'reset':
        return 'Recuperar Senha';
      default:
        return 'Fazer Login';
    }
  }, [step, mode]);

  // Texto do botão
  const buttonText = useMemo(() => {
    if (loading) return 'Carregando...';
    switch (mode) {
      case 'signup':
        return 'Criar conta';
      case 'reset':
        return 'Enviar email';
      default:
        return 'Entrar';
    }
  }, [loading, mode]);

  // Handlers de reset de senha
  const handleResetPassword = useCallback(async () => {
    if (!isEmail(email)) {
      setError('Por favor, insira um email válido para recuperação de senha');
      return false;
    }

    const { error: resetError } = await resetPassword(email);
    if (resetError) {
      setError(resetError.message);
      return false;
    }

    setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
    setTimeout(() => {
      setMode('login');
      setSuccessMessage(null);
    }, 3000);
    return true;
  }, [email, isEmail, resetPassword]);

  // Handler de cadastro
  const handleSignup = useCallback(async () => {
    if (!isEmail(email)) {
      setError('Por favor, insira um email válido para cadastro');
      return false;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    const { error: signupError } = await signUpWithEmail(email, password);
    if (signupError) {
      setError(signupError.message);
      return false;
    }

    setSuccessMessage('Cadastro realizado! Verifique seu email para confirmar sua conta antes de fazer login.');
    setTimeout(() => {
      setMode('login');
      setSuccessMessage(null);
    }, 5000);
    return true;
  }, [email, password, isEmail, signUpWithEmail]);

  // Handler de login
  const handleLogin = useCallback(async () => {
    if (!isEmail(email)) {
      setError('Por favor, insira um email válido');
      return false;
    }

    const result = await signInWithEmail(email, password);

    if (result.error) {
      if (result.error.message.includes('Email not confirmed')) {
        setError('Email não confirmado. Por favor, verifique sua caixa de entrada e confirme seu email antes de fazer login.');
      } else if (result.error.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos. Se você acabou de se cadastrar, verifique seu email para confirmar sua conta.');
      } else {
        setError(`Erro ao fazer login: ${result.error.message}`);
      }
      return false;
    }

    onClose();
    onLoginSuccess?.();
    return true;
  }, [email, password, isEmail, signInWithEmail, onClose, onLoginSuccess]);

  // Submit do formulário
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'reset') {
        await handleResetPassword();
      } else if (mode === 'signup') {
        await handleSignup();
      } else {
        await handleLogin();
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [mode, handleResetPassword, handleSignup, handleLogin]);

  // Login com Google
  const handleGoogleLogin = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        setError(googleError.message);
      }
    } catch {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [signInWithGoogle]);

  // Ir para formulário de email
  const goToEmailLogin = useCallback(() => {
    setStep('email-login');
  }, []);

  // Ir para cadastro
  const goToSignup = useCallback(() => {
    setMode('signup');
    setStep('email-login');
  }, []);

  // Mudar modo (login, signup, reset)
  const changeMode = useCallback((newMode: LoginMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  }, []);

  // Voltar para tela inicial
  const goBack = useCallback(() => {
    setStep('initial');
    setMode('login');
    setError(null);
  }, []);

  // Fechar modal e resetar estados
  const closeModal = useCallback(() => {
    setStep('initial');
    setMode('login');
    setError(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
    onClose();
  }, [onClose]);

  // Atualizar campos
  const updateEmail = useCallback((value: string) => setEmail(value), []);
  const updatePassword = useCallback((value: string) => setPassword(value), []);

  return {
    // Estados
    step,
    mode,
    email,
    password,
    loading,
    error,
    successMessage,
    title,
    buttonText,

    // Ações
    handleSubmit,
    handleGoogleLogin,
    goToEmailLogin,
    goToSignup,
    changeMode,
    goBack,
    closeModal,
    updateEmail,
    updatePassword,
  };
}
