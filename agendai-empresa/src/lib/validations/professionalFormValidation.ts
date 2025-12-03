import type { WorkingHours } from '@/types/professional';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Single Responsibility: Validação de formulário de profissional
 * Separa lógica de validação da lógica de UI
 */
export class ProfessionalFormValidator {
  static validateName(name: string): ValidationResult {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return { isValid: false, error: 'Nome é obrigatório' };
    }
    
    if (trimmedName.length < 3) {
      return { isValid: false, error: 'Nome deve ter no mínimo 3 caracteres' };
    }
    
    return { isValid: true };
  }

  static validateEmail(email: string): ValidationResult {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      return { isValid: false, error: 'Email é obrigatório' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { isValid: false, error: 'Email inválido' };
    }
    
    return { isValid: true };
  }

  static validatePassword(password: string, isRequired: boolean = true): ValidationResult {
    const trimmedPassword = password.trim();
    
    if (isRequired && !trimmedPassword) {
      return { isValid: false, error: 'Senha é obrigatória para novos profissionais' };
    }
    
    if (trimmedPassword && trimmedPassword.length < 6) {
      return { isValid: false, error: 'Senha deve ter no mínimo 6 caracteres' };
    }
    
    return { isValid: true };
  }

  static validateWorkingHours(workingHours: WorkingHours): ValidationResult {
    const hasAtLeastOneDay = Object.values(workingHours).some(day => day.enabled);
    
    if (!hasAtLeastOneDay) {
      return { isValid: false, error: 'Selecione pelo menos um dia de trabalho' };
    }
    
    return { isValid: true };
  }

  static validateForm(data: {
    name: string;
    email: string;
    password: string;
    workingHours: WorkingHours;
    isEditing: boolean;
  }): ValidationResult {
    const nameValidation = this.validateName(data.name);
    if (!nameValidation.isValid) return nameValidation;

    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) return emailValidation;

    const passwordValidation = this.validatePassword(data.password, !data.isEditing);
    if (!passwordValidation.isValid) return passwordValidation;

    const workingHoursValidation = this.validateWorkingHours(data.workingHours);
    if (!workingHoursValidation.isValid) return workingHoursValidation;

    return { isValid: true };
  }
}
