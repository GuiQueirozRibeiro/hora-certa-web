'use client';

import { FormContent } from './FormContent';

/**
 * COMPONENTE ORQUESTRADOR
 * 
 * Aplica o Princípio da Responsabilidade Única (SRP):
 * - Responsabilidade: Servir como ponto de entrada para o formulário de funcionários
 * - Delega toda a lógica para FormContent e useFormHandlers
 * 
 * Arquitetura SOLID:
 * ├── FormFuncionarios.tsx ← Você está aqui (Wrapper/Orquestrador)
 * ├── FormContent.tsx      ← Componente de UI (JSX puro)
 * └── useFormHandlers.ts   ← Lógica de negócio (Estados e Handlers)
 */
export function FormFuncionarios() {
  return <FormContent />;
}
