import { useState, useCallback } from 'react';
import type { ServiceFormData, ServiceFormState, ServiceValidationError } from '@/types/service';

/**
 * Hook para gerenciar o estado do formulário de serviço
 * Responsabilidade: Gerenciamento de estado e lógica de UI
 */
export function useServiceForm(initialData: ServiceFormData) {
  const [state, setState] = useState<ServiceFormState>({
    data: initialData,
    isLoading: false,
    isSaving: false,
    errors: [],
    isDirty: false,
  });

  const updateField = useCallback((field: keyof ServiceFormData, value: string | number | boolean) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      isDirty: true,
      errors: prev.errors.filter(e => e.field !== field),
    }));
  }, []);

  const setErrors = useCallback((errors: ServiceValidationError[]) => {
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

  const resetForm = useCallback((data: ServiceFormData) => {
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
