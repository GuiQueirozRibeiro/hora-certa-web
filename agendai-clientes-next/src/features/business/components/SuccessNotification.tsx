'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface SuccessNotificationProps {
  show: boolean;
  message?: string;
}

/**
 * Notificação flutuante de sucesso exibida no canto inferior direito.
 */
export const SuccessNotification: React.FC<SuccessNotificationProps> = ({ 
  show, 
  message = 'Agendamento realizado com sucesso!' 
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
      <Check size={24} strokeWidth={2} />
      <span>{message}</span>
    </div>
  );
};
