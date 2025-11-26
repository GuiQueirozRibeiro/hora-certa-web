import React from 'react';

// Dados Falsos (Mock) para ver o visual
const professionals = [
  { id: 1, name: 'Rafael Pereira', role: 'Barbeiro', avatar: 'RP', color: 'bg-indigo-500' },
  { id: 2, name: 'Miguel Silva', role: 'Cabelereiro', avatar: 'MS', color: 'bg-emerald-500' },
  { id: 3, name: 'João Souza', role: 'Esteticista', avatar: 'JS', color: 'bg-purple-500' },
];

export function ProfessionalList() {
  return (
    <div className="mt-2">
      <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-4 px-1">
        Atendendo hoje
      </h3>
      
      <div className="space-y-2">
        {professionals.map((prof) => (
          <div 
            key={prof.id} 
            className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group"
          >
            {/* Avatar (Bola colorida com Iniciais) */}
            <div className={`w-10 h-10 rounded-full ${prof.color} flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-zinc-900 group-hover:ring-zinc-700 transition-all`}>
              {prof.avatar}
            </div>
            
            {/* Informações */}
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                {prof.name}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500">{prof.role}</p>
                <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded border border-green-500/20">
                  09:00 - 18:00
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}