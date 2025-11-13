import { useState } from 'react';
import Header from './components/Header/Header';
import Navigation from './components/NavBar/Navigation';
import InicioPage from './pages/InicioPage';
import AgendamentosPage from './pages/AgendamentosPage';
import TermosPage from './pages/TermosPage';
import './index.css';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'agendamentos' | 'perfil'>('inicio');
  const [termosView, setTermosView] = useState<'termos' | 'privacidade' | null>(null);

  const renderPage = () => {
    // Se estiver visualizando termos ou privacidade, renderiza a página de termos
    if (termosView) {
      return <TermosPage tipo={termosView} onClose={() => setTermosView(null)} />;
    }

    switch (activeTab) {
      case 'inicio':
        return <InicioPage />;
      case 'agendamentos':
        return <AgendamentosPage />;
      case 'perfil':
        return <ConfiguracoesPage onNavigateToTermos={setTermosView} />
      default:
        return <InicioPage />;
    }
  };

  return (
    <div className="App min-h-screen bg-[#26272B]">
      {!termosView && <Header />}
      {!termosView && <Navigation activeTab={activeTab} onTabChange={setActiveTab} />}
      {renderPage()}
    </div>
  );
}

export default MainApp;