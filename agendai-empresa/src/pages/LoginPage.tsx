import fundoLogin from '../assets/fundo-login.jpg';
import LoginModal from '../components/features/auth/LoginModal';

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-no-repeat bg-center bg-cover"
        style={{ 
          backgroundImage: `url(${fundoLogin})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">
              Agend<span className="text-indigo-500">ai</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginModal
            isOpen={true}
            onClose={() => {}}
            onLoginSuccess={() => {
              console.log('Login realizado com sucesso!');
              // Aqui você pode redirecionar para o dashboard
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
