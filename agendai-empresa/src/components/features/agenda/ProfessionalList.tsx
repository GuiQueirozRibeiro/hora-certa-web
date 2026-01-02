import React from 'react';

interface Professional {
  id: string;
  name: string;
  color: string;
}

interface ProfessionalListProps {
  professionals: Professional[];
}

// Dados adicionais para os profissionais (mock)
const professionalDetails: { [key: string]: { role: string; avatar: string } } = {};

// Função para gerar iniciais do nome
function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function ProfessionalList({ professionals }: ProfessionalListProps) {
  return (
    <div className="mt-2">
      <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-4 px-1">
        Atendendo hoje
      </h3>
      
      <div className="space-y-2">
        {professionals.map((prof) => {
          const avatar = getInitials(prof.name);
          return (
            <div 
              key={prof.id} 
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group"
            >
              {/* Avatar (Bola colorida com Iniciais) */}
              <div className={`w-10 h-10 rounded-full ${prof.color} flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-zinc-900 group-hover:ring-zinc-700 transition-all`}>
                {avatar}
              </div>
              
              {/* Informações */}
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  {prof.name}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500">Profissional</p>
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded border border-green-500/20">
                    Ativo
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}