// src/hooks/useToast.ts
'use client';

import { useState, useCallback } from 'react';
import { ToastType } from '@/components/ui/Toast';

// ========================================
// TIPOS
// ========================================
interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface AddToastParams {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// ========================================
// HOOK: useToast
// ========================================
/**
 * Hook para gerenciar notificações toast.
 * 
 * @example
 * const { toasts, addToast, removeToast } = useToast();
 * 
 * addToast({
 *   type: 'success',
 *   title: 'Salvo com sucesso!',
 *   message: 'As alterações foram salvas.'
 * });
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // ========================================
  // ADICIONAR TOAST
  // ========================================
  const addToast = useCallback(({ type, title, message, duration = 5000 }: AddToastParams) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newToast: ToastData = {
      id,
      type,
      title,
      message,
      duration
    };

    setToasts((prev) => [...prev, newToast]);

    return id;
  }, []);

  // ========================================
  // REMOVER TOAST
  // ========================================
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // ========================================
  // HELPERS (Atalhos para tipos específicos)
  // ========================================
  const success = useCallback((title: string, message?: string, duration?: number) => {
    return addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    return addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    return addToast({ type: 'warning', title, message, duration });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    return addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
}
