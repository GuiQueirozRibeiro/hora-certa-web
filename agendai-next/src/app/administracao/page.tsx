import Header from '@/components/layout/Header';
import { NavBar } from '@/components/layout/NavBar';

export default function AdministracaoPage() {
  return (
    <div className="flex flex-col h-screen bg-zinc-900">
      <Header />
      <NavBar />
      
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-zinc-100 mb-6">Administração</h1>
        <div className="text-zinc-400">
          Módulo de administração em desenvolvimento...
        </div>
      </main>
    </div>
  );
}
