// src/components/ui/Toast.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// ========================================
// TIPOS
// ========================================
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // em milissegundos
  onClose: (id: string) => void;
}

// ========================================
// COMPONENTE: Toast Individual
// ========================================
/**
 * Componente de notificação toast individual.
 * Princípios SOLID:
 * - Single Responsibility: Apenas exibe uma notificação
 * - Open/Closed: Extensível via tipos e props
 */
export function Toast({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000,
  onClose 
}: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  // ========================================
  // EFEITO: Temporizador e Progresso
  // ========================================
  useEffect(() => {
    if (isPaused) return;

    const interval = 50; // Atualiza a cada 50ms
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - decrement;
        if (newProgress <= 0) {
          clearInterval(timer);
          setTimeout(() => onClose(id), 0); // Executa após a renderização
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [id, duration, onClose, isPaused]);

  // ========================================
  // CONFIGURAÇÕES POR TIPO
  // ========================================
  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50',
      textColor: 'text-green-400',
      iconColor: 'text-green-400',
      progressColor: 'bg-green-500'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      textColor: 'text-red-400',
      iconColor: 'text-red-400',
      progressColor: 'bg-red-500'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      textColor: 'text-yellow-400',
      iconColor: 'text-yellow-400',
      progressColor: 'bg-yellow-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
      textColor: 'text-blue-400',
      iconColor: 'text-blue-400',
      progressColor: 'bg-blue-500'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  // ========================================
  // RENDER
  // ========================================
  return (
    <div
      className={`relative flex items-start gap-3 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} backdrop-blur-sm shadow-lg animate-in slide-in-from-right duration-300`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
    >
      {/* Ícone */}
      <div className="shrink-0 mt-0.5">
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-semibold ${config.textColor}`}>
          {title}
        </h4>
        {message && (
          <p className="text-xs text-zinc-400 mt-1">
            {message}
          </p>
        )}
      </div>

      {/* Botão Fechar */}
      <button
        onClick={() => onClose(id)}
        className="shrink-0 p-1 hover:bg-zinc-700/50 rounded transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="h-4 w-4 text-zinc-500" />
      </button>

      {/* Barra de Progresso */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 rounded-b-lg overflow-hidden">
        <div
          className={`h-full ${config.progressColor} transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE: Container de Toasts
// ========================================
/**
 * Container que gerencia múltiplos toasts.
 * Renderiza toasts empilhados no canto da tela.
 */
interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function ToastContainer({ 
  toasts, 
  onClose,
  position = 'top-right'
}: ToastContainerProps) {
  const positionClasses = {
    'top-right': 'top-12 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none`}>
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}
