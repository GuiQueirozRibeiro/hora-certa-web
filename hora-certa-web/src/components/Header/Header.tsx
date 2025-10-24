import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-16 py-5 bg-[#0f0f0f] border-b border-[#2a2a2a]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        <span className="text-[28px] font-bold tracking-tight">
          <span className="text-indigo-500">Hora</span> <span className="text-white">Certa</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-white">Miguel De Silva</span>
          <span className="text-xs text-gray-500 mt-0.5">Segunda-feira, 2 de Fevereiro</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      </div>
    </header>
  );
};

export default Header;