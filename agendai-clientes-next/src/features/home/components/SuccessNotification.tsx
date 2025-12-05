'use client';

import React from 'react';

interface SuccessNotificationProps {
  show: boolean;
}

export const SuccessNotification: React.FC<SuccessNotificationProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed top-28 right-10 bg-[#1f1f1f] rounded-lg shadow-lg p-3 flex items-center gap-3 z-50 overflow-hidden">
      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <h4 className="font-semibold text-white text-sm">
          Horário agendado
        </h4>
        <p className="text-xs text-gray-400">
          Seu horário foi agendado com suceso!
        </p>
      </div>
      <div 
        className="absolute bottom-0 left-0 h-1 bg-indigo-500"
        style={{
          animation: 'progress-bar-timer 3s linear forwards'
        }}
      />
    </div>
  );
};
