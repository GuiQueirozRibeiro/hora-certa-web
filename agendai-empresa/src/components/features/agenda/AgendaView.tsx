'use client';

import React from 'react';
import { SchedulerView } from './SchedulerView';

export function AgendaView() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <SchedulerView />
    </div>
  );
}