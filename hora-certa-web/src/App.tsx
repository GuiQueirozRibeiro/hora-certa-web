import React, { useState } from 'react';
import Header from './components/Header/Header';
import Navigation from './components/NavBar/Navigation';
import InicioPage from './pages/InicioPage';
import AgendamentosPage from './pages/AgendamentosPage';
import './index.css';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'agendamentos' | 'perfil'>('inicio');

  const renderPage = () => {
    switch (activeTab) {
      case 'inicio':
        return <InicioPage />;
      case 'agendamentos':
        return <AgendamentosPage />;
      case 'perfil':
        return <ConfiguracoesPage/>
      default:
        return <InicioPage />;
    }
  };

  return (
    <div className="App min-h-screen bg-[#26272B]">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderPage()}
    </div>
  );
}

export default MainApp;