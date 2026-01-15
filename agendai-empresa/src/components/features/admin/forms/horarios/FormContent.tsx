'use client';

import { Calendar, Copy, Save, RotateCcw } from 'lucide-react';
import { useFormHandlers } from './useFormHandlers';
import { useToast } from '@/hooks/useToast';
import { DiaFuncionamentoCard } from '../../horarios/DiaFuncionamentoCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ToastContainer } from '@/components/ui/Toast';

/**
 * Componente de apresentação puro que renderiza o formulário de horários
 * 
 * Aplica o Princípio da Responsabilidade Única:
 * - Responsabilidade: Renderização do JSX (UI pura)
 * - Delega toda a lógica de negócio para o hook useFormHandlers
 */
export function FormContent() {
  const { toasts, removeToast } = useToast();

  // Hook contém TODA a lógica de negócio
  const {
    horarios,
    hasChanges,
    diaParaCopiar,
    isLoading,
    diasAbertos,
    diasFechados,
    modalCopiar,
    modalResetar,
    modalSalvar,
    setDiaParaCopiar,
    setModalCopiar,
    setModalResetar,
    setModalSalvar,
    handleSaveDia,
    handleSaveAll,
    handleReset,
    handleCopyToAll,
  } = useFormHandlers();

  return (
    <div>
      {/* ========================================
          CABEÇALHO
      ======================================== */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-zinc-100">
            Horários de Funcionamento
          </h2>
          
          {/* Indicador de alterações */}
          {hasChanges && (
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
              Alterações não salvas
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-400">
            {diasAbertos} dia{diasAbertos !== 1 ? 's' : ''} ativo{diasAbertos !== 1 ? 's' : ''}
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">
            {diasFechados} dia{diasFechados !== 1 ? 's' : ''} fechado{diasFechados !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ========================================
          FERRAMENTAS DE AÇÃO RÁPIDA
      ======================================== */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-zinc-500" />
          <span className="text-sm text-zinc-400">Ações rápidas:</span>
          
          {/* Copiar horário para todos */}
          <div className="flex items-center gap-2">
            <select
              value={diaParaCopiar}
              onChange={(e) => setDiaParaCopiar(e.target.value)}
              className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Selecione um dia</option>
              {horarios.filter(h => h.ativo).map((h) => (
                <option key={h.dia} value={h.dia}>
                  {h.dia}
                </option>
              ))}
            </select>
            
            <Button
              onClick={() => setModalCopiar(true)}
              disabled={!diaParaCopiar}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Copy className="h-3 w-3" />
              <span>Copiar para todos</span>
            </Button>
          </div>

          {/* Separador */}
          <div className="h-6 w-px bg-zinc-700" />

          {/* Resetar */}
          <Button
            onClick={() => setModalResetar(true)}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Resetar</span>
          </Button>
        </div>
      </div>

      {/* ========================================
          LISTA DE DIAS DA SEMANA
      ======================================== */}
      <div className="space-y-4 mb-6">
        {horarios.map((horario) => (
          <DiaFuncionamentoCard
            key={horario.dia}
            horario={horario}
            onSave={handleSaveDia}
          />
        ))}
      </div>

      {/* ========================================
          BOTÃO SALVAR TUDO
      ======================================== */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-700">
        <p className="text-sm text-zinc-500">
          Clique em &quot;Salvar alterações&quot; para aplicar os horários
        </p>
        <Button
          onClick={() => setModalSalvar(true)}
          disabled={!hasChanges || isLoading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Salvando...' : 'Salvar alterações'}</span>
        </Button>
      </div>

      {/* ========================================
          MODAIS DE CONFIRMAÇÃO
      ======================================== */}
      
      {/* Modal: Copiar para todos */}
      <Modal
        isOpen={modalCopiar}
        onClose={() => setModalCopiar(false)}
        onConfirm={handleCopyToAll}
        title="Copiar horário para todos os dias"
        description={`Deseja aplicar o horário de ${diaParaCopiar} para todos os outros dias úteis?`}
        confirmText="Sim, copiar"
        cancelText="Cancelar"
        variant="warning"
      >
        <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
          <p className="text-xs text-zinc-400 mb-2">Horário que será aplicado:</p>
          {diaParaCopiar && (() => {
            const dia = horarios.find(h => h.dia === diaParaCopiar);
            return dia ? (
              <div className="text-sm text-zinc-200">
                <p>• Abertura: {dia.horarioAbertura}</p>
                <p>• Fechamento: {dia.horarioFechamento}</p>
                {dia.intervaloInicio && dia.intervaloFim && (
                  <p>• Intervalo: {dia.intervaloInicio} - {dia.intervaloFim}</p>
                )}
              </div>
            ) : null;
          })()}
        </div>
      </Modal>

      {/* Modal: Resetar */}
      <Modal
        isOpen={modalResetar}
        onClose={() => setModalResetar(false)}
        onConfirm={handleReset}
        title="Resetar horários"
        description="Tem certeza que deseja restaurar todos os horários para o padrão? Esta ação não pode ser desfeita."
        confirmText="Sim, resetar"
        cancelText="Cancelar"
        variant="danger"
      >
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-xs text-red-400">
            ⚠️ Todas as alterações não salvas serão perdidas
          </p>
        </div>
      </Modal>

      {/* Modal: Salvar */}
      <Modal
        isOpen={modalSalvar}
        onClose={() => setModalSalvar(false)}
        onConfirm={handleSaveAll}
        title="Salvar horários de funcionamento"
        description="Confirma as alterações dos horários? Os novos horários entrarão em vigor imediatamente."
        confirmText="Salvar alterações"
        cancelText="Cancelar"
        variant="primary"
      >
        <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
          <p className="text-xs text-zinc-400 mb-2">Resumo das alterações:</p>
          <div className="text-sm text-zinc-200">
            <p>• {diasAbertos} dia(s) ativo(s)</p>
            <p>• {diasFechados} dia(s) fechado(s)</p>
          </div>
        </div>
      </Modal>

      {/* ========================================
          DICAS
      ======================================== */}
      <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">💡 Atenção: Configuração Necessária</h3>
        <p className="text-xs text-zinc-300 mb-3">
          Os horários exibidos abaixo são <strong>sugestões iniciais</strong>. Você precisa ajustá-los para corresponder ao funcionamento real da sua empresa.
        </p>
        <ul className="text-xs text-zinc-400 space-y-1">
          <li>• Clique no ícone de edição (lápis) para definir seus horários reais</li>
          <li>• Se os horários forem iguais, configure um dia e use &quot;Copiar para todos&quot;</li>
          <li>• Lembre-se de clicar em <strong>Salvar alterações</strong> para confirmar</li>
        </ul>
      </div>

      {/* ========================================
          CONTAINER DE NOTIFICAÇÕES
      ======================================== */}
      <ToastContainer 
        toasts={toasts} 
        onClose={removeToast}
        position="top-right"
      />
    </div>
  );
}
