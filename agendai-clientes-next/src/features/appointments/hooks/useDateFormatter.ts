/**
 * Hook para formatação de datas
 * Single Responsibility: Apenas formatação de datas
 */
'use client';

export function useDateFormatter() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return { day, month };
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  return { formatDate, formatTime };
}
