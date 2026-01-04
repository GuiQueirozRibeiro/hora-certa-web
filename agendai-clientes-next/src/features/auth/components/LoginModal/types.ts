/**
 * Tipos do módulo LoginModal.
 */

export type LoginMode = 'login' | 'signup' | 'reset';
export type LoginStep = 'initial' | 'email-login';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export interface SocialLoginButtonsProps {
  loading: boolean;
  onGoogleLogin: () => void;
  onEmailLogin: () => void;
  onSignup: () => void;
}

export interface EmailFormProps {
  mode: LoginMode;
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onModeChange: (mode: LoginMode) => void;
  onBack: () => void;
}
