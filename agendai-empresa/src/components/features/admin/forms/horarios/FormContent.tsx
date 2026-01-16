'use client';

import { Calendar, Copy, Save, RotateCcw } from 'lucide-react';
import { useFormHandlers } from './useFormHandlers';
import { useToast } from '@/hooks/useToast';
import { DiaFuncionamentoCard } from '../../horarios/DiaFuncionamentoCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ToastContainer } from '@/components/ui/Toast';

export function FormContent() {
  const { toasts, removeToast } = useToast();

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
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
          <h2 className="text-xl font-semibold text-zinc-100">
            Horários de Funcionamento
          </h2>
          
          {hasChanges && (
            <span className="self-start md:self-auto px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
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

      <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <Calendar className="h-5 w-5 text-zinc-500" />
            <span className="text-sm text-zinc-400">Ações rápidas:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
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
              className="flex items-center justify-center gap-2"
            >
              <Copy className="h-3 w-3" />
              <span>Copiar para todos</span>
            </Button>

            <div className="hidden sm:block h-6 w-px bg-zinc-700 mx-2" />

            <Button
              onClick={() => setModalResetar(true)}
              variant="ghost"
              size="sm"
              className="flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Resetar</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {horarios.map((horario) => (
          <DiaFuncionamentoCard
            key={horario.dia}
            horario={horario}
            onSave={handleSaveDia}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-zinc-700">
        <p className="text-sm text-zinc-500 text-center sm:text-right">
          Clique em &quot;Salvar alterações&quot; para aplicar os horários
        </p>
        <Button
          onClick={() => setModalSalvar(true)}
          disabled={!hasChanges || isLoading}
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Salvando...' : 'Salvar alterações'}</span>
        </Button>
      </div>

      <Modal
        isOpen={modalCopiar}
        onClose={() => setModalCopiar(false)}
        onConfirm={handleCopyToAll}
        title="Copiar horário"
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
              </div>
            ) : null;
          })()}
        </div>
      </Modal>

      <Modal
        isOpen={modalResetar}
        onClose={() => setModalResetar(false)}
        onConfirm={handleReset}
        title="Resetar horários"
        description="Tem certeza que deseja restaurar todos os horários para o padrão?"
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

      <Modal
        isOpen={modalSalvar}
        onClose={() => setModalSalvar(false)}
        onConfirm={handleSaveAll}
        title="Salvar horários"
        description="Confirma as alterações dos horários?"
        confirmText="Salvar alterações"
        cancelText="Cancelar"
        variant="primary"
      >
        <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
          <p className="text-xs text-zinc-400 mb-2">Resumo:</p>
          <div className="text-sm text-zinc-200">
            <p>• {diasAbertos} dia(s) ativo(s)</p>
            <p>• {diasFechados} dia(s) fechado(s)</p>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onClose={removeToast} position="top-right" />
    </div>
  );
}