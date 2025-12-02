import { useState, useCallback } from 'react';
import type { BusinessFormData, BusinessFormState, BusinessValidationError } from '@/types/business';

/**
 * Hook para gerenciar o estado do formulário de empresa
 * Responsabilidade: Gerenciamento de estado e lógica de UI
 */
export function useBusinessForm(initialData: BusinessFormData) {
  const [state, setState] = useState<BusinessFormState>({
    data: initialData,
    isLoading: false,
    isSaving: false,
    errors: [],
    isDirty: false,
  });

  const updateField = useCallback((field: keyof BusinessFormData, value: string) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      isDirty: true,
      errors: prev.errors.filter(e => e.field !== field), // Remove erro do campo ao editar
    }));
  }, []);

  const setErrors = useCallback((errors: BusinessValidationError[]) => {
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

  const resetForm = useCallback((data: BusinessFormData) => {
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
