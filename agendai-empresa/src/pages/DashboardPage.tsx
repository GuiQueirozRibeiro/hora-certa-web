import { useState } from 'react';
import MainHeader from '../components/layout/MainHeader';
import MainNavBar from '../components/layout/NavBar';

type NavTab = 'financeiro' | 'agenda' | 'administracao';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('agenda');

  return (
    <div className="min-h-screen bg-[#18181B] flex flex-col">
      {/* Header */}
      <MainHeader userName="Miguel Da Silva" userRole="Administrador" />
      
      {/* Navigation */}
      <MainNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Conteúdo será adicionado aqui */}
          <div className="text-center text-gray-400 mt-20">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {activeTab === 'financeiro' && 'Financeiro'}
              {activeTab === 'agenda' && 'Agenda'}
              {activeTab === 'administracao' && 'Administração'}
            </h2>
            <p>Conteúdo em desenvolvimento...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
