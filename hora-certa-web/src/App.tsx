import React, { useState } from 'react';
import Header from './components/Header/Header';
import Navigation from './components/NavBar/Navigation';
import InicioPage from './pages/InicioPage';
import AgendamentosPage from './pages/AgendamentosPage';
import './index.css';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'agendamentos' | 'perfil'>('inicio');

  const renderPage = () => {
    switch (activeTab) {
      case 'inicio':
        return <InicioPage />;
      case 'agendamentos':
        return <AgendamentosPage />;
      case 'perfil':
        return (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Página de Perfil</h2>
              <p className="text-gray-400">Em desenvolvimento...</p>
            </div>
          </div>
        );
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