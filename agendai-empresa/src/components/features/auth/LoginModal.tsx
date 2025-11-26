import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterFormStep1 from './RegisterForm';
import RegisterFormStep2 from './RegisterFormStep2';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

type LoginStep = 'initial' | 'email-login' | 'signup-address';
type LoginMode = 'login' | 'signup';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState<LoginStep>('initial');
  const [mode, setMode] = useState<LoginMode>('login');
  
  // Campos de login
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Campos de cadastro - Etapa 1
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState('');
  const [ddd, setDdd] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Campos de cadastro - Etapa 2 (Endereço)
  const [pais, setPais] = useState('');
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');

  if (!isOpen) return null;

  // Função para formatar CPF ou CNPJ
  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  const handleCnpjCpfChange = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 14);
    const formatted = formatCpfCnpj(numbers);
    setCnpjCpf(formatted);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { emailOrPhone, password });
    onLoginSuccess?.();
    onClose();
  };

  const handleSignupStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('signup-address');
  };

  const handleSignupStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cadastro completo:', {
      nomeCompleto, nomeEstabelecimento, ddd, telefone,
      cnpjCpf, email, senha, pais, cep, estado, 
      cidade, bairro, rua, numero
    });
    alert('Cadastro realizado com sucesso!');
    handleCloseModal();
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login com ${provider}`);
    onLoginSuccess?.();
    onClose();
  };

  const handleCloseModal = () => {
    setStep('initial');
    setMode('login');
    setEmailOrPhone('');
    setPassword('');
    setNomeCompleto('');
    setNomeEstabelecimento('');
    setDdd('');
    setTelefone('');
    setCnpjCpf('');
    setEmail('');
    setSenha('');
    setPais('');
    setCep('');
    setEstado('');
    setCidade('');
    setBairro('');
    setRua('');
    setNumero('');
    onClose();
  };

  const getTitle = () => {
    if (step === 'initial') return 'Fazer Login';
    if (step === 'signup-address') return 'Dados para cadastro';
    return mode === 'signup' ? 'Dados para cadastro' : 'Fazer Login';
  };

  return (
    <div className="w-full bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white text-center">{getTitle()}</h2>
      </div>

        {/* Conteúdo do Modal */}
        {step === 'initial' && (
          <div className="space-y-3">
            {/* Botão Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg py-3 px-4 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </button>

            {/* Botão Apple */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              className="w-full flex items-center justify-center gap-3 bg-[#2a2a2a] hover:bg-[#333333] border border-[#3a3a3a] text-white rounded-lg py-3 px-4 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Entrar com Apple
            </button>

            {/* Botão Email */}
            <button
              type="button"
              onClick={() => setStep('email-login')}
              className="w-full flex items-center justify-center gap-3 bg-[#2a2a2a] hover:bg-[#333333] border border-[#3a3a3a] text-white rounded-lg py-3 px-4 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Entrar com Email
            </button>

            {/* Separador */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3a3a3a]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1a1a] text-gray-400">Não tem cadastro?</span>
              </div>
            </div>

            {/* Botão Cadastrar */}
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setStep('email-login');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 px-4 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Cadastrar
            </button>
          </div>
        )}

        {step === 'email-login' && mode === 'login' && (
          <>
            <LoginForm
              emailOrPhone={emailOrPhone}
              password={password}
              onEmailChange={setEmailOrPhone}
              onPasswordChange={setPassword}
              onSubmit={handleLoginSubmit}
              onForgotPassword={() => console.log('Recuperar senha')}
              onSwitchToSignup={() => setMode('signup')}
            />
            <button
              type="button"
              onClick={() => setStep('initial')}
              className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors mt-4"
            >
              ← Voltar
            </button>
          </>
        )}

        {step === 'email-login' && mode === 'signup' && (
          <>
            <RegisterFormStep1
              nomeCompleto={nomeCompleto}
              nomeEstabelecimento={nomeEstabelecimento}
              ddd={ddd}
              telefone={telefone}
              cnpjCpf={cnpjCpf}
              email={email}
              senha={senha}
              onNomeCompletoChange={setNomeCompleto}
              onNomeEstabelecimentoChange={setNomeEstabelecimento}
              onDddChange={setDdd}
              onTelefoneChange={setTelefone}
              onCnpjCpfChange={handleCnpjCpfChange}
              onEmailChange={setEmail}
              onSenhaChange={setSenha}
              onSubmit={handleSignupStep1Submit}
              onSwitchToLogin={() => setMode('login')}
            />
            <button
              type="button"
              onClick={() => setStep('initial')}
              className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors mt-2"
            >
              ← Voltar
            </button>
          </>
        )}

        {step === 'signup-address' && (
          <RegisterFormStep2
            pais={pais}
            cep={cep}
            estado={estado}
            cidade={cidade}
            bairro={bairro}
            rua={rua}
            numero={numero}
            onPaisChange={setPais}
            onCepChange={setCep}
            onEstadoChange={setEstado}
            onCidadeChange={setCidade}
            onBairroChange={setBairro}
            onRuaChange={setRua}
            onNumeroChange={setNumero}
            onSubmit={handleSignupStep2Submit}
            onBack={() => setStep('email-login')}
          />
        )}
    </div>
  );
};

export default LoginModal;
