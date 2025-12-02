import type { ServiceFormData, ServiceValidationError } from '@/types/service';

/**
 * Valida o nome do serviço
 */
export function validateServiceName(name: string): ServiceValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Nome do serviço é obrigatório' };
  }
  
  if (name.trim().length < 2) {
    return { field: 'name', message: 'Nome deve ter pelo menos 2 caracteres' };
  }
  
  if (name.length > 100) {
    return { field: 'name', message: 'Nome deve ter no máximo 100 caracteres' };
  }
  
  return null;
}

/**
 * Valida a duração do serviço
 */
export function validateServiceDuration(duration: number): ServiceValidationError | null {
  if (!duration || duration <= 0) {
    return { field: 'duration_minutes', message: 'Duração é obrigatória' };
  }
  
  if (duration < 5) {
    return { field: 'duration_minutes', message: 'Duração mínima é 5 minutos' };
  }
  
  if (duration > 480) { // 8 horas
    return { field: 'duration_minutes', message: 'Duração máxima é 480 minutos (8 horas)' };
  }
  
  return null;
}

/**
 * Valida o preço do serviço
 */
export function validateServicePrice(price: number): ServiceValidationError | null {
  if (price === undefined || price === null) {
    return { field: 'price', message: 'Preço é obrigatório' };
  }
  
  if (price < 0) {
    return { field: 'price', message: 'Preço não pode ser negativo' };
  }
  
  if (price > 999999.99) {
    return { field: 'price', message: 'Preço máximo é R$ 999.999,99' };
  }
  
  return null;
}

/**
 * Valida a descrição do serviço
 */
export function validateServiceDescription(description?: string): ServiceValidationError | null {
  if (!description || description.trim().length === 0) {
    return null; // Descrição é opcional
  }
  
  if (description.length > 500) {
    return { field: 'description', message: 'Descrição deve ter no máximo 500 caracteres' };
  }
  
  return null;
}

/**
 * Valida a categoria do serviço
 */
export function validateServiceCategory(category?: string): ServiceValidationError | null {
  if (!category || category.trim().length === 0) {
    return null; // Categoria é opcional
  }
  
  if (category.length > 50) {
    return { field: 'category', message: 'Categoria deve ter no máximo 50 caracteres' };
  }
  
  return null;
}

/**
 * Valida todos os campos do formulário de serviço
 */
export function validateServiceForm(data: ServiceFormData): ServiceValidationError[] {
  const errors: ServiceValidationError[] = [];
  
  const nameError = validateServiceName(data.name);
  if (nameError) errors.push(nameError);
  
  const durationError = validateServiceDuration(data.duration_minutes);
  if (durationError) errors.push(durationError);
  
  const priceError = validateServicePrice(data.price);
  if (priceError) errors.push(priceError);
  
  const descriptionError = validateServiceDescription(data.description);
  if (descriptionError) errors.push(descriptionError);
  
  const categoryError = validateServiceCategory(data.category);
  if (categoryError) errors.push(categoryError);
  
  return errors;
}
