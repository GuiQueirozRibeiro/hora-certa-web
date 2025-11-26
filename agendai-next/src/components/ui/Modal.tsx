// src/components/ui/Modal.tsx
'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

// ========================================
// TIPOS
// ========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger' | 'warning';
  children?: React.ReactNode;
}

// ========================================
// COMPONENTE: Modal de Confirmação
// ========================================
/**
 * Modal reutilizável para confirmações e ações importantes.
 * Segue princípios SOLID:
 * - Single Responsibility: Apenas exibe modal e gerencia callbacks
 * - Open/Closed: Extensível via props
 * - Dependency Inversion: Não conhece a lógica de negócio
 */
export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  children
}: ModalProps) {
  
  // ========================================
  // EFEITOS
  // ========================================
  
  // Fecha modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Previne scroll do body quando modal aberto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // ========================================
  // HANDLERS
  // ========================================
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fecha apenas se clicar no backdrop, não no conteúdo
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Não renderiza nada se não estiver aberto
  if (!isOpen) return null;

  // ========================================
  // VARIANTES DE CORES
  // ========================================
  const variantStyles = {
    primary: {
      icon: 'bg-indigo-500/20 text-indigo-400',
      button: 'primary' as const
    },
    danger: {
      icon: 'bg-red-500/20 text-red-400',
      button: 'danger' as const
    },
    warning: {
      icon: 'bg-yellow-500/20 text-yellow-400',
      button: 'primary' as const
    }
  };

  const currentVariant = variantStyles[variant];

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* ========================================
          BACKDROP (Fundo escuro)
      ======================================== */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* ========================================
          CONTEÚDO DO MODAL
      ======================================== */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        
        {/* Botão Fechar (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label="Fechar modal"
        >
          <X className="h-5 w-5 text-zinc-400" />
        </button>

        {/* Corpo do Modal */}
        <div className="p-6">
          
          {/* Ícone de alerta/informação */}
          <div className={`w-12 h-12 rounded-full ${currentVariant.icon} flex items-center justify-center mb-4`}>
            {variant === 'danger' && (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {variant === 'warning' && (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {variant === 'primary' && (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          {/* Título */}
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">
            {title}
          </h2>

          {/* Descrição */}
          <p className="text-sm text-zinc-400 mb-6">
            {description}
          </p>

          {/* Conteúdo adicional (opcional) */}
          {children && (
            <div className="mb-6">
              {children}
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex items-center gap-3 justify-end">
            <Button
              onClick={onClose}
              variant="ghost"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              variant={currentVariant.button}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
