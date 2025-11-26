// src/components/features/admin/forms/FormHorarios.tsx
'use client';

// ========================================
// COMPONENTE: Horários de Funcionamento
// ========================================
/**
 * Componente para configurar os horários de funcionamento da empresa.
 * TODO: Implementar seletor de horários por dia da semana.
 */
export function FormHorarios() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-100 mb-4">
        Horários de Funcionamento
      </h2>
      <p className="text-zinc-400 mb-6">
        Defina os horários de abertura e fechamento para cada dia da semana.
      </p>
      
      {/* Placeholder para implementação futura */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-8 text-center">
        <p className="text-zinc-500">
          Configuração de horários em desenvolvimento...
        </p>
        <p className="text-sm text-zinc-600 mt-2">
          Funcionalidades: Horário de abertura/fechamento, Dias de funcionamento, Intervalos.
        </p>
      </div>
    </div>
  );
}
