import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import { professionalService } from '@/services/professionalService';
import { ProfessionalFormValidator } from '@/lib/validations/professionalFormValidation';
import type { ProfessionalWithUser, WorkingHours } from '@/types/professional';

const DEFAULT_WORKING_HOURS: WorkingHours = {
  monday: { enabled: true, start: '09:00', end: '18:00' },
  tuesday: { enabled: true, start: '09:00', end: '18:00' },
  wednesday: { enabled: true, start: '09:00', end: '18:00' },
  thursday: { enabled: true, start: '09:00', end: '18:00' },
  friday: { enabled: true, start: '09:00', end: '18:00' },
  saturday: { enabled: false, start: '09:00', end: '14:00' },
  sunday: { enabled: false, start: '09:00', end: '18:00' },
};

interface UseProfessionalModalProps {
  professional: ProfessionalWithUser | null;
  businessId: string;
  onSuccess: () => void;
}

/**
 * Custom Hook: Separação de lógica de negócio da UI
 * Single Responsibility: Gerencia estado e operações do modal de profissional
 */
export function useProfessionalModal({ professional, businessId, onSuccess }: UseProfessionalModalProps) {
  const { success, error: showError } = useToast();
  const isEditing = !!professional;

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(DEFAULT_WORKING_HOURS);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Load data when editing
  useEffect(() => {
    if (professional) {
      setName(professional.user?.name || '');
      setEmail(professional.user?.email || '');
      setSpecialties(professional.specialties || []);
      setBio(professional.bio || '');
      setExperienceYears(professional.experience_years || 0);
      setAvatarUrl(professional.avatar_url || '');
      
      const loadedHours = professional.working_hours && typeof professional.working_hours === 'object'
        ? { ...DEFAULT_WORKING_HOURS, ...professional.working_hours }
        : DEFAULT_WORKING_HOURS;
      
      setWorkingHours(loadedHours);
    }
  }, [professional]);

  // Specialty management
  const addSpecialty = useCallback(() => {
    const trimmed = specialtyInput.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties(prev => [...prev, trimmed]);
      setSpecialtyInput('');
    }
  }, [specialtyInput, specialties]);

  const removeSpecialty = useCallback((specialty: string) => {
    setSpecialties(prev => prev.filter(s => s !== specialty));
  }, []);

  // Form submission
  const handleSubmit = useCallback(async () => {
    // Evitar múltiplos cliques
    if (isSaving) {
      return false;
    }

    // Validate form
    const validation = ProfessionalFormValidator.validateForm({
      name,
      email,
      password,
      workingHours,
      isEditing,
    });

    if (!validation.isValid) {
      showError('Erro de validação', validation.error!);
      return false;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        // Update existing professional
        await professionalService.updateProfessional(professional.id, {
          name: name.trim(),
          specialties: Array.isArray(specialties) ? specialties : [],
          bio: bio.trim() || undefined,
          experience_years: experienceYears,
          working_hours: workingHours,
          avatar_url: avatarUrl,
        });

        // Update user name if changed
        if (name.trim() !== professional.user?.name) {
          await professionalService.updateProfessionalName(professional.user_id, name.trim());
        }

        success('Profissional atualizado com sucesso!');
      } else {
        // Create new professional
        await professionalService.createProfessional({
          email: email.trim(),
          password: password.trim(),
          name: name.trim(),
          business_id: businessId,
          specialties: Array.isArray(specialties) ? specialties : [],
          bio: bio.trim() || undefined,
          experience_years: experienceYears,
          working_hours: workingHours,
          avatar_url: avatarUrl,
        });

        success('Profissional criado com sucesso!');
      }

      onSuccess();
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showError('Erro ao salvar', err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    name, email, password, specialties, bio, experienceYears, workingHours,
    isEditing, professional, businessId, success, showError, onSuccess, isSaving, avatarUrl
  ]);

  return {
    // State
    isEditing,
    name,
    email,
    password,
    specialties,
    specialtyInput,
    bio,
    experienceYears,
    workingHours,
    isSaving,
    avatarUrl,
    
    // Setters
    setName,
    setEmail,
    setPassword,
    setSpecialtyInput,
    setBio,
    setExperienceYears,
    setWorkingHours,
    setAvatarUrl,
    
    // Actions
    addSpecialty,
    removeSpecialty,
    handleSubmit,
  };
}
