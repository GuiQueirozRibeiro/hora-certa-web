// src/components/ui/Card.tsx
import React from 'react';

// ========================================
// TIPOS
// ========================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// ========================================
// COMPONENTE: Card Base
// ========================================
/**
 * Componente Card reutilizável seguindo Clean Code e SOLID.
 * Pode ser usado em qualquer parte da aplicação para manter consistência visual.
 */
export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-zinc-800 rounded-xl border border-zinc-700 p-6 ${className}`}>
      {children}
    </div>
  );
}

// ========================================
// SUB-COMPONENTES (Compound Components Pattern)
// ========================================

/**
 * Cabeçalho do Card
 */
export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Título do Card
 */
export function CardTitle({ children, className = '' }: CardProps) {
  return (
    <h3 className={`text-lg font-semibold text-zinc-100 ${className}`}>
      {children}
    </h3>
  );
}

/**
 * Conteúdo do Card
 */
export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

/**
 * Rodapé do Card
 */
export function CardFooter({ children, className = '' }: CardProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-zinc-700 ${className}`}>
      {children}
    </div>
  );
}
