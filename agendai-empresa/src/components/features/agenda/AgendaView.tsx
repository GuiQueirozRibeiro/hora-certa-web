'use client';

import React from 'react';
import { AgendaGrid } from './AgendaGrid';
import { MiniCalendar } from './MiniCalendar';
import { ProfessionalList } from './ProfessionalList';

export function AgendaView() {
  return (
    <div className="flex gap-6 flex-1">
      
      {/* COLUNA ESQUERDA */}
      <aside className="w-80 flex flex-col gap-6 pr-2">
         <MiniCalendar />
         <ProfessionalList />
      </aside>

      {/* COLUNA DIREITA */}
      <div className="flex-1 flex flex-col ml-64">
         <AgendaGrid />
      </div>

    </div>
  );
}