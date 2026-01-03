// Utilitários de formatação
// Seguindo o princípio de Single Responsibility (SRP)

/**
 * Formata duração em minutos para texto legível
 */
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
};

/**
 * Formata preço para moeda brasileira
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

/**
 * Formata número de telefone para exibição
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 13) {
    return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Retorna o dia da semana atual em português
 */
export const getDayOfWeek = (): string => {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return days[new Date().getDay()];
};

/**
 * Normaliza string removendo acentos e convertendo para minúsculas
 */
export const normalizeString = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};
