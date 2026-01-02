import Header from '@/components/layout/Header';
import { NavBar } from '@/components/layout/NavBar';
import { AgendaView } from '@/components/features/agenda/AgendaView';

export default function AgendaPage() {
  return (
    <div className="flex flex-col h-screen bg-zinc-900">
      <Header />
      <NavBar />
      
      <main className="flex-1 p-6 overflow-auto flex flex-col">
        <AgendaView />
      </main>
    </div>
  );
}