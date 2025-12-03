import type { Professional, ProfessionalFormData, CreateProfessionalData, UpdateProfessionalData } from '@/types/professional';

/**
 * Converte um Professional do banco para ProfessionalFormData
 */
export function mapProfessionalToFormData(professional: Professional, email: string, name: string): ProfessionalFormData {
  return {
    name: name,
    email: email,
    password: '', // Senha não é retornada do banco
    specialties: professional.specialties || [],
    bio: professional.bio || '',
    experience_years: professional.experience_years || 0,
  };
}

/**
 * Limpa dados do formulário antes de enviar
 */
export function sanitizeProfessionalFormData(data: ProfessionalFormData): CreateProfessionalData {
  const sanitized: any = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
  };
  
  if (data.specialties && data.specialties.length > 0) {
    sanitized.specialties = data.specialties.map(s => s.trim()).filter(s => s.length > 0);
  }
  
  if (data.bio && data.bio.trim()) {
    sanitized.bio = data.bio.trim();
  }
  
  if (data.experience_years !== undefined && data.experience_years !== null) {
    sanitized.experience_years = Number(data.experience_years);
  }
  
  return sanitized;
}

/**
 * Formata especialidades para exibição
 */
export function formatSpecialties(specialties?: string[]): string {
  if (!specialties || specialties.length === 0) {
    return 'Nenhuma especialidade';
  }
  
  if (specialties.length === 1) {
    return specialties[0];
  }
  
  if (specialties.length === 2) {
    return specialties.join(' e ');
  }
  
  return `${specialties.slice(0, -1).join(', ')} e ${specialties[specialties.length - 1]}`;
}

/**
 * Formata anos de experiência para exibição
 */
export function formatExperience(years?: number): string {
  if (!years || years === 0) {
    return 'Sem experiência informada';
  }
  
  if (years === 1) {
    return '1 ano de experiência';
  }
  
  return `${years} anos de experiência`;
}

/**
 * Gera iniciais do nome
 */
export function getInitials(name: string): string {
  const names = name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
