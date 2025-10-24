import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="flex justify-center gap-10 py-6 bg-[#1a1a1a]">
      <button className="relative text-indigo-500 text-sm font-medium px-4 py-2 transition-colors">
        Início
      </button>
      <button className="text-gray-500 text-sm font-medium px-4 py-2 hover:text-white transition-colors">
        Agendamentos
      </button>
      <button className="text-gray-500 text-sm font-medium px-4 py-2 hover:text-white transition-colors">
        Perfil
      </button>
    </nav>
  );
};

export default Navigation;