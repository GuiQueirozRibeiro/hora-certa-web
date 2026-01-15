import type { Service, ServiceFormData, CreateServiceData } from '@/types/service';

/**
 * Converte um Service do banco para ServiceFormData
 */
export function mapServiceToFormData(service: Service): ServiceFormData {
  return {
    name: service.name,
    description: service.description || '',
    duration_minutes: service.duration_minutes,
    price: service.price,
    category: service.category || '',
    image_url: service.image_url || '',
    is_active: service.is_active,
  };
}

/**
 * Limpa dados antes de enviar para o backend
 */
export function sanitizeServiceFormData(data: ServiceFormData): CreateServiceData {
  const sanitized: CreateServiceData = {
    name: data.name.trim(),
    duration_minutes: Number(data.duration_minutes),
    price: Number(data.price),
    is_active: data.is_active,
  };
  
  if (data.description && data.description.trim()) {
    sanitized.description = data.description.trim();
  }
  
  if (data.category && data.category.trim()) {
    sanitized.category = data.category.trim();
  }
  
  if (data.image_url && data.image_url.trim()) {
    sanitized.image_url = data.image_url.trim();
  }
  
  return sanitized;
}

/**
 * Formata o preço para exibição (R$ 99,99)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/**
 * Formata a duração para exibição
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Parse de string de preço para número
 */
export function parsePrice(value: string): number {
  // Remove tudo exceto números, vírgula e ponto
  const cleaned = value.replace(/[^\d,.-]/g, '');
  // Substitui vírgula por ponto
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
}
