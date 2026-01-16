import type { BusinessFormData, BusinessValidationError } from '@/types/business';

/**
 * Valida o nome da empresa
 */
export function validateBusinessName(name: string): BusinessValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Nome da empresa é obrigatório' };
  }

  if (name.trim().length < 3) {
    return { field: 'name', message: 'Nome deve ter pelo menos 3 caracteres' };
  }

  if (name.length > 100) {
    return { field: 'name', message: 'Nome deve ter no máximo 100 caracteres' };
  }

  return null;
}

/**
 * Valida o link do WhatsApp
 */
export function validateWhatsAppNumber(link?: string): BusinessValidationError | null {
  if (!link || link.trim().length === 0) {
    return null; // WhatsApp é opcional
  }

  // Remove tudo que não for número para validar apenas os dígitos
  const cleanNumber = link.replace(/\D/g, '');

  // Padrão brasileiro: DDD (2 dígitos) + Número (8 ou 9 dígitos)
  // Total de 10 ou 11 caracteres numéricos
  const isPhoneValid = cleanNumber.length >= 10 && cleanNumber.length <= 11;

  if (!isPhoneValid) {
    return {
      field: 'whatsapp_number',
      message: 'Número de WhatsApp inválido. Insira DDD + Número (ex: 33998217341)'
    };
  }

  return null;
}

/**
 * Valida a descrição da empresa
 */
export function validateBusinessDescription(description?: string): BusinessValidationError | null {
  if (!description || description.trim().length === 0) {
    return null; // Descrição é opcional
  }

  if (description.length > 500) {
    return { field: 'description', message: 'Descrição deve ter no máximo 500 caracteres' };
  }

  return null;
}

/**
 * Valida o tipo de negócio
 */
export function validateBusinessType(type?: string): BusinessValidationError | null {
  if (!type || type.trim().length === 0) {
    return null; // Tipo é opcional
  }

  const validTypes = ['barbearia', 'salao_beleza', 'clinica', 'consultorio', 'outro'];

  if (!validTypes.includes(type)) {
    return { field: 'business_type', message: 'Tipo de negócio inválido' };
  }

  return null;
}

/**
 * Valida todos os campos do formulário de empresa
 */
export function validateBusinessForm(data: BusinessFormData): BusinessValidationError[] {
  const errors: BusinessValidationError[] = [];

  const nameError = validateBusinessName(data.name);
  if (nameError) errors.push(nameError);

  const whatsappError = validateWhatsAppNumber(data.whatsapp_number);
  if (whatsappError) errors.push(whatsappError);

  const descriptionError = validateBusinessDescription(data.description);
  if (descriptionError) errors.push(descriptionError);

  const typeError = validateBusinessType(data.business_type);
  if (typeError) errors.push(typeError);

  return errors;
}
