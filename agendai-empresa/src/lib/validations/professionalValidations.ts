import type { ProfessionalFormData, ProfessionalValidationError } from '@/types/professional';

/**
 * Valida o nome do profissional
 */
export function validateProfessionalName(name: string): ProfessionalValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Nome é obrigatório' };
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
 * Valida o email do profissional
 */
export function validateProfessionalEmail(email: string): ProfessionalValidationError | null {
  if (!email || email.trim().length === 0) {
    return { field: 'email', message: 'Email é obrigatório' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Email inválido' };
  }
  
  return null;
}

/**
 * Valida a senha do profissional
 */
export function validateProfessionalPassword(password: string): ProfessionalValidationError | null {
  if (!password || password.length === 0) {
    return { field: 'password', message: 'Senha é obrigatória' };
  }
  
  if (password.length < 6) {
    return { field: 'password', message: 'Senha deve ter pelo menos 6 caracteres' };
  }
  
  if (password.length > 72) {
    return { field: 'password', message: 'Senha deve ter no máximo 72 caracteres' };
  }
  
  return null;
}

/**
 * Valida as especialidades do profissional
 */
export function validateProfessionalSpecialties(specialties?: string[]): ProfessionalValidationError | null {
  if (!specialties || specialties.length === 0) {
    return null; // Especialidades são opcionais
  }
  
  if (specialties.length > 10) {
    return { field: 'specialties', message: 'Máximo de 10 especialidades permitidas' };
  }
  
  for (const specialty of specialties) {
    if (specialty.length > 50) {
      return { field: 'specialties', message: 'Cada especialidade deve ter no máximo 50 caracteres' };
    }
  }
  
  return null;
}

/**
 * Valida a bio do profissional
 */
export function validateProfessionalBio(bio?: string): ProfessionalValidationError | null {
  if (!bio || bio.trim().length === 0) {
    return null; // Bio é opcional
  }
  
  if (bio.length > 500) {
    return { field: 'bio', message: 'Bio deve ter no máximo 500 caracteres' };
  }
  
  return null;
}

/**
 * Valida os anos de experiência
 */
export function validateProfessionalExperience(experience?: number): ProfessionalValidationError | null {
  if (experience === undefined || experience === null) {
    return null; // Experiência é opcional
  }
  
  if (experience < 0) {
    return { field: 'experience_years', message: 'Anos de experiência não pode ser negativo' };
  }
  
  if (experience > 70) {
    return { field: 'experience_years', message: 'Anos de experiência não pode ser maior que 70' };
  }
  
  return null;
}

/**
 * Valida todos os campos do formulário de profissional
 */
export function validateProfessionalForm(data: ProfessionalFormData): ProfessionalValidationError[] {
  const errors: ProfessionalValidationError[] = [];
  
  const nameError = validateProfessionalName(data.name);
  if (nameError) errors.push(nameError);
  
  const emailError = validateProfessionalEmail(data.email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validateProfessionalPassword(data.password);
  if (passwordError) errors.push(passwordError);
  
  const specialtiesError = validateProfessionalSpecialties(data.specialties);
  if (specialtiesError) errors.push(specialtiesError);
  
  const bioError = validateProfessionalBio(data.bio);
  if (bioError) errors.push(bioError);
  
  const experienceError = validateProfessionalExperience(data.experience_years);
  if (experienceError) errors.push(experienceError);
  
  return errors;
}
