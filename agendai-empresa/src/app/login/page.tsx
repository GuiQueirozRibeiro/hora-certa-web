'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('🚀 [LoginPage] handleSubmit iniciado', { isSignUp, email, name });

    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error('Nome é obrigatório');
        }
        console.log('📝 [LoginPage] Chamando signUp...');
        await signUp(email, password, name);
        console.log('✅ [LoginPage] signUp concluído com sucesso!');
      } else {
        console.log('🔐 [LoginPage] Chamando signIn...');
        await signIn(email, password);
        console.log('✅ [LoginPage] signIn concluído com sucesso!');
      }
    } catch (err: any) {
      console.error('❌ [LoginPage] Erro:', err);
      setError(err.message);
      setLoading(false);
    }
    // Não adiciona finally para manter loading durante redirect
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-zinc-900">
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white">
            Agend<span className="text-indigo-500">ai</span> Business
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
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
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-lg py-3 px-4 text-sm font-semibold transition-all"
            >
              {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setName('');
              }}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}