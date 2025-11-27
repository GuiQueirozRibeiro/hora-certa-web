'use client';

import React, { useState } from 'react';
import { AgendaGrid } from './AgendaGrid';
import { MiniCalendar } from './MiniCalendar';
import { ProfessionalList } from './ProfessionalList';

// Dados mockados de profissionais
const professionals = [
  { id: 1, name: 'Rafael Pereira', color: 'bg-indigo-500' },
  { id: 2, name: 'Miguel Silva', color: 'bg-emerald-500' },
  { id: 3, name: 'João Souza', color: 'bg-purple-500' },
];

// Dados mockados de agendamentos
const mockAppointments = [
  {
    id: 1,
    professionalId: 1,
    professionalName: 'Rafael Pereira',
    clientName: 'Carlos Silva',
    service: 'Corte Masculino',
    startTime: '09:00',
    endTime: '09:45',
    color: 'bg-indigo-600/90',
    date: new Date(),
  },
  {
    id: 2,
    professionalId: 2,
    professionalName: 'Miguel Silva',
    clientName: 'Ana Costa',
    service: 'Coloração',
    startTime: '09:30',
    endTime: '11:00',
    color: 'bg-emerald-600/90',
    date: new Date(),
  },
  {
    id: 3,
    professionalId: 1,
    professionalName: 'Rafael Pereira',
    clientName: 'Pedro Santos',
    service: 'Barba',
    startTime: '10:00',
    endTime: '10:30',
    color: 'bg-indigo-600/90',
    date: new Date(),
  },
  {
    id: 4,
    professionalId: 3,
    professionalName: 'João Souza',
    clientName: 'Maria Oliveira',
    service: 'Hidratação',
    startTime: '10:00',
    endTime: '11:00',
    color: 'bg-purple-600/90',
    date: new Date(),
  },
  {
    id: 5,
    professionalId: 2,
    professionalName: 'Miguel Silva',
    clientName: 'Julia Martins',
    service: 'Corte Feminino',
    startTime: '11:30',
    endTime: '12:30',
    color: 'bg-emerald-600/90',
    date: new Date(),
  },
  {
    id: 6,
    professionalId: 1,
    professionalName: 'Rafael Pereira',
    clientName: 'Roberto Lima',
    service: 'Corte + Barba',
    startTime: '14:00',
    endTime: '15:00',
    color: 'bg-indigo-600/90',
    date: new Date(),
  },
  {
    id: 7,
    professionalId: 3,
    professionalName: 'João Souza',
    clientName: 'Fernanda Souza',
    service: 'Luzes',
    startTime: '14:00',
    endTime: '16:00',
    color: 'bg-purple-600/90',
    date: new Date(),
  },
];

export function AgendaView() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filtra agendamentos pela data selecionada
  const filteredAppointments = mockAppointments.filter((apt) => {
    return (
      apt.date.getDate() === selectedDate.getDate() &&
      apt.date.getMonth() === selectedDate.getMonth() &&
      apt.date.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="flex gap-6 flex-1">
      
      {/* COLUNA ESQUERDA */}
      <aside className="w-80 flex flex-col gap-6 pr-2">
         <MiniCalendar 
           selectedDate={selectedDate}
           onDateSelect={setSelectedDate}
         />
         <ProfessionalList professionals={professionals} />
      </aside>

      {/* COLUNA DIREITA */}
      <div className="flex-1 flex flex-col ml-64">
         <AgendaGrid 
           selectedDate={selectedDate}
           professionals={professionals}
           appointments={filteredAppointments}
         />
      </div>

    </div>
  );
}