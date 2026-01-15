'use client';

import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/features/auth/RegisterForm';

export default function CadastroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-900 via-purple-900 to-violet-800 flex">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 shadow-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            Criar Conta
          </h2>

          {/* Passamos uma função que navega de volta para o login */}
          <RegisterForm onSwitchToLogin={() => router.push('/login')} />
        </div>
      </div>
    </div>
  );
}