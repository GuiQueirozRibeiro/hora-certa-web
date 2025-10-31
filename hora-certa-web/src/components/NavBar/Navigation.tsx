import React from 'react';

interface NavigationProps {
  activeTab: 'inicio' | 'agendamentos' | 'perfil';
  onTabChange: (tab: 'inicio' | 'agendamentos' | 'perfil') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="flex justify-center gap-10 py-6 bg-[#1a1a1a]">
      <button
        onClick={() => onTabChange('inicio')}
        className={`relative text-sm font-medium px-4 py-2 transition-colors ${
          activeTab === 'inicio' ? 'text-indigo-500' : 'text-gray-500 hover:text-white'
        }`}
      >
        Início
        {activeTab === 'inicio' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
        )}
      </button>
      <button
        onClick={() => onTabChange('agendamentos')}
        className={`relative text-sm font-medium px-4 py-2 transition-colors ${
          activeTab === 'agendamentos' ? 'text-indigo-500' : 'text-gray-500 hover:text-white'
        }`}
      >
        Agendamentos
        {activeTab === 'agendamentos' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
        )}
      </button>
      <button
        onClick={() => onTabChange('perfil')}
        className={`relative text-sm font-medium px-4 py-2 transition-colors ${
          activeTab === 'perfil' ? 'text-indigo-500' : 'text-gray-500 hover:text-white'
        }`}
      >
        Perfil
        {activeTab === 'perfil' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
        )}
      </button>
    </nav>
  );
};

export default Navigation;