/**
 * Resumo da reserva antes da confirmação.
 */
'use client';

import React from 'react';
import type { ReservationSummaryProps } from './types';

export const ReservationSummary: React.FC<ReservationSummaryProps> = ({
  serviceName,
  servicePrice,
  professionalName,
  selectedDate,
  selectedTime,
}) => {
  const formatDate = (date: Date | null) => {
    if (!date) return '--/--';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-t border-b border-gray-700 py-4 mb-6 space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-400">{serviceName}</span>
        <span className="font-semibold">R$ {servicePrice.toFixed(2)}</span>
      </div>
      {professionalName && (
        <div className="flex justify-between">
          <span className="text-gray-400">Profissional</span>
          <span className="font-semibold">{professionalName}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-gray-400">Data</span>
        <span className="font-semibold">{formatDate(selectedDate)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Hora</span>
        <span className="font-semibold">{selectedTime || '--:--'}</span>
      </div>
    </div>
  );
};
