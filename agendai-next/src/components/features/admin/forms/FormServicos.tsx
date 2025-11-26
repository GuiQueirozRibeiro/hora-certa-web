// src/components/features/admin/forms/FormServicos.tsx
'use client';

// ========================================
// COMPONENTE: Gerenciamento de Serviços
// ========================================
/**
 * Componente para cadastrar e gerenciar serviços oferecidos.
 * TODO: Implementar CRUD de serviços.
 */
export function FormServicos() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-100 mb-4">
        Serviços Oferecidos
      </h2>
      <p className="text-zinc-400 mb-6">
        Configure os serviços disponíveis para agendamento.
      </p>
      
      {/* Placeholder para implementação futura */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-8 text-center">
        <p className="text-zinc-500">
          Catálogo de serviços em desenvolvimento...
        </p>
        <p className="text-sm text-zinc-600 mt-2">
          Campos: Nome do serviço, Duração, Preço, Descrição, Profissionais habilitados.
        </p>
      </div>
    </div>
  );
}
