// src/components/features/admin/forms/FormFuncionarios.tsx
'use client';

// ========================================
// COMPONENTE: Gerenciamento de Funcionários
// ========================================
/**
 * Componente para adicionar, editar e remover funcionários.
 * TODO: Implementar listagem e formulário de funcionários.
 */
export function FormFuncionarios() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-100 mb-4">
        Gerenciar Funcionários
      </h2>
      <p className="text-zinc-400 mb-6">
        Adicione e gerencie os profissionais que atendem em seu estabelecimento.
      </p>
      
      {/* Placeholder para implementação futura */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-8 text-center">
        <p className="text-zinc-500">
          Lista de funcionários em desenvolvimento...
        </p>
        <p className="text-sm text-zinc-600 mt-2">
          Funcionalidades: Adicionar, editar, remover, definir horários, vincular serviços.
        </p>
      </div>
    </div>
  );
}
