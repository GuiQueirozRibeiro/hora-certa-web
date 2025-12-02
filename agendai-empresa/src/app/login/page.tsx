'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // DEBUG STATES
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDebugLogs([]);
    
    addLog('🚀 Iniciando processo de login');
    
    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error('Nome é obrigatório');
        }
        addLog('📝 Modo: Cadastro');
        addLog(`📧 Email: ${email}`);
        addLog('🔐 Chamando signUp...');
        
        await signUp(email, password, name);
        
        addLog('✅ Cadastro concluído!');
      } else {
        addLog('🔐 Modo: Login');
        addLog(`📧 Email: ${email}`);
        addLog('🔑 Chamando signIn...');
        
        await signIn(email, password);
        
        addLog('✅ Login concluído!');
      }
      
      addLog('🎉 Sucesso! Redirecionando...');
    } catch (err: any) {
      addLog(`❌ ERRO: ${err.message}`);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-900 flex">
      {/* COLUNA ESQUERDA - FORMULÁRIO */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1a1a1a]/95 rounded-2xl p-8 shadow-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            {isSignUp ? 'Criar Conta' : 'Fazer Login'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Seu nome completo"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-lg py-3 px-4 text-sm font-semibold transition-all"
            >
              {loading ? '⏳ Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setName('');
                setDebugLogs([]);
              }}
              disabled={loading}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA - DEBUG */}
      <div className="w-96 bg-black p-6 overflow-y-auto">
        <h3 className="text-lg font-bold text-emerald-400 mb-4">🐛 Debug Console</h3>
        
        <div className="space-y-2">
          {debugLogs.length === 0 ? (
            <p className="text-zinc-500 text-sm italic">Aguardando ação...</p>
          ) : (
            debugLogs.map((log, index) => (
              <div 
                key={index}
                className="text-xs font-mono text-zinc-300 bg-zinc-900 p-2 rounded border border-zinc-800"
              >
                {log}
              </div>
            ))
          )}
        </div>

        {loading && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm font-semibold">⚠️ PROCESSANDO</p>
            <p className="text-yellow-300 text-xs mt-1">Se demorar mais de 10s, há um problema.</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm font-semibold">❌ ERRO DETECTADO</p>
            <p className="text-red-300 text-xs mt-1">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}