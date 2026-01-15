'use client';

import { useAuth } from '@/hooks/useAuth';
import { FormContent } from './FormContent';
import { FormLayout } from '@/components/ui/FormLayout';

/**
 * COMPONENTE ORQUESTRADOR
 * 
 * Aplica o Princípio da Responsabilidade Única (SRP):
 * - Responsabilidade: Gerenciar o estado de autenticação e renderização condicional
 * - Orquestra o reset automático do formulário via key composition
 * 
 * Arquitetura SOLID:
 * ├── FormEmpresa.tsx    ← Você está aqui (Wrapper/Orquestrador)
 * ├── FormContent.tsx    ← Componente de UI (JSX puro)
 * └── useFormHandlers.ts ← Lógica de negócio (Handlers e Uploads)
 */
export function FormEmpresa() {
  const { business, loading: authLoading } = useAuth();

  // Estado de carregamento
  if (authLoading) {
    return (
      <FormLayout title="Dados da Empresa" description="Carregando informações...">
        <div className="text-zinc-400 flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          Carregando...
        </div>
      </FormLayout>
    );
  }

  if (!business) return null;

  // A MÁGICA: A 'key' faz o formulário resetar sozinho quando os dados do banco mudam
  // Sem precisar de useEffect no hook!
  return (
    <FormContent 
      key={business.id + (business.updated_at || '')} 
      business={business} 
    />
  );
}