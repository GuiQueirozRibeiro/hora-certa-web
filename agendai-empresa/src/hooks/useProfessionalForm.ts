import { useState, useCallback } from 'react';
import type { ProfessionalFormData, ProfessionalFormState, ProfessionalValidationError } from '@/types/professional';

/**
 * Hook para gerenciar o estado do formulário de profissional
 * Responsabilidade: Gerenciamento de estado e lógica de UI
 */
export function useProfessionalForm(initialData: ProfessionalFormData) {
  const [state, setState] = useState<ProfessionalFormState>({
    data: initialData,
    isLoading: false,
    isSaving: false,
    errors: [],
    isDirty: false,
  });

  const updateField = useCallback((field: keyof ProfessionalFormData, value: string | number | string[]) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      isDirty: true,
      errors: prev.errors.filter(e => e.field !== field),
    }));
  }, []);

  const setErrors = useCallback((errors: ProfessionalValidationError[]) => {
    setState(prev => ({ ...prev, errors }));
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: [] }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setSaving = useCallback((isSaving: boolean) => {
    setState(prev => ({ ...prev, isSaving }));
  }, []);

  const resetForm = useCallback((data: ProfessionalFormData) => {
    setState({
      data,
      isLoading: false,
      isSaving: false,
      errors: [],
      isDirty: false,
    });
  }, []);

  const getFieldError = useCallback((field: string): string | undefined => {
    return state.errors.find(e => e.field === field)?.message;
  }, [state.errors]);

  return {
    state,
    updateField,
    setErrors,
    clearErrors,
    setLoading,
    setSaving,
    resetForm,
    getFieldError,
  };
}
