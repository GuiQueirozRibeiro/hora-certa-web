import type { Business } from '@/types/auth';
import type { BusinessFormData } from '@/types/business';

/**
 * Converte um Business do banco para BusinessFormData
 */
export function mapBusinessToFormData(business: Business): BusinessFormData {
  return {
    name: business.name,
    description: business.description || '',
    business_type: business.business_type || '',
    whatsapp_link: business.whatsapp_link || '',
    image_url: business.image_url || '',
    cover_image_url: business.cover_image_url || '',
  };
}

/**
 * Limpa dados antes de enviar para o backend
 */
export function sanitizeBusinessFormData(data: BusinessFormData): Partial<BusinessFormData> {
  const sanitized: Partial<BusinessFormData> = {
    name: data.name.trim(),
  };
  
  if (data.description && data.description.trim()) {
    sanitized.description = data.description.trim();
  }
  
  if (data.business_type && data.business_type.trim()) {
    sanitized.business_type = data.business_type.trim();
  }
  
  if (data.whatsapp_link && data.whatsapp_link.trim()) {
    sanitized.whatsapp_link = data.whatsapp_link.trim();
  }
  
  if (data.image_url && data.image_url.trim()) {
    sanitized.image_url = data.image_url.trim();
  }
  
  if (data.cover_image_url && data.cover_image_url.trim()) {
    sanitized.cover_image_url = data.cover_image_url.trim();
  }
  
  return sanitized;
}

/**
 * Formata o link do WhatsApp para exibição
 */
export function formatWhatsAppForDisplay(link?: string): string {
  if (!link) return '';
  
  const match = link.match(/\/(\d+)$/);
  if (!match) return link;
  
  const number = match[1];
  
  // Formata como +55 (11) 99999-9999
  if (number.length === 13) { // +55 11 999999999
    return `+${number.slice(0, 2)} (${number.slice(2, 4)}) ${number.slice(4, 9)}-${number.slice(9)}`;
  }
  
  return number;
}

/**
 * Converte número de telefone para link do WhatsApp
 */
export function phoneToWhatsAppLink(phone: string): string {
  // Remove tudo exceto números
  const numbers = phone.replace(/\D/g, '');
  
  // Se não começar com 55, adiciona
  const fullNumber = numbers.startsWith('55') ? numbers : `55${numbers}`;
  
  return `https://wa.me/${fullNumber}`;
}
