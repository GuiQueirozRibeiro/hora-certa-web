/**
 * Hook para formatação de datas
 * Single Responsibility: Apenas formatação de datas
 */
'use client';

export function useDateFormatter() {
  const formatDate = (dateString: string) => {
    // Parse da data no formato YYYY-MM-DD para evitar problemas de timezone
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
    
    const dayNumber = date.getDate();
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
    
    return { day: dayNumber, month: monthName };
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  return { formatDate, formatTime };
}
