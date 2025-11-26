import React from 'react';

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  userName = 'Miguel Da Silva', 
  userRole = 'Administrador' 
}) => {
  // Formatar data atual
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Formatar para capitalizar primeira letra
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <header className="flex justify-between items-center px-8 py-2 bg-zinc-900">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">
          <span className="text-white">Agend</span>
          <span className="text-indigo-500">ai</span>{' '}
        </h1>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-white">{userName}</span>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
        <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:scale-105 transition-transform">
          {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
      </div>
    </header>
  );
};

export default Header;