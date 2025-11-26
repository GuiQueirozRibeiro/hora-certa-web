import React from 'react';

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);

export function AgendaGrid() {
  return (
    <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 p-4 overflow-y-auto no-scrollbar ">
      <div className="relative min-w-[600px]">
        
        {/* Cabeçalho da Grade (Dias ou Profissionais se fosse visualização diária) */}
        {/* Por enquanto, vamos focar na linha do tempo vertical */}

        <div className="relative">
          {HOURS.map((hour) => (
            <div key={hour} className="flex h-16 border-b border-zinc-800/50">
              {/* Coluna da Hora */}
              <div className="w-16 -mt-2.5 text-xs font-medium text-zinc-500 text-right pr-4">
                {hour.toString().padStart(2, '0')}:00
              </div>
              
              {/* Linha do Grid */}
              <div className="flex-1 relative group">
                {/* Linha tracejada da meia hora (opcional, para precisão) */}
                <div className="absolute top-10 left-0 right-0 border-t border-zinc-500/30 border-dashed" />
                
                {/* Hover effect na linha */}
                <div className="absolute inset-0 hover:bg-white/5 transition-colors cursor-pointer rounded-sm" />
              </div>
            </div>
          ))}

          {/* AQUI ENTRARÃO OS AGENDAMENTOS (ABSOLUTE) */}
          
        </div>
      </div>
    </div>
  );
}