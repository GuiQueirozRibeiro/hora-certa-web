'use client';

import { Plus, Search } from 'lucide-react';
import { useFormHandlers } from './useFormHandlers';
import { FuncionarioCard } from '../../professionals/FuncionarioCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProfessionalModal } from '../../professionals/ProfessionalModal';
import { ProfessionalMapper } from '@/lib/utils/professionalMappers';

export function FormContent() {
  const {
    business,
    professionals,
    loading,
    searchTerm,
    funcionariosFiltrados,
    modalExcluir,
    modalProfessional,
    professionalParaExcluir,
    professionalParaEditar,
    setSearchTerm,
    handleAddProfessional,
    handleEditProfessional,
    handleDeleteProfessional,
    handleToggleStatus,
    handleCloseModalProfessional,
    handleCloseModalExcluir,
    confirmarExclusao,
  } = useFormHandlers();

  if (!business) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-12 text-center">
        <p className="text-zinc-500 mb-2">Carregando informações da empresa...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 mb-1">
            Gerenciar Funcionários
          </h2>
          <p className="text-sm text-zinc-400">
            {professionals.length} profissiona{professionals.length === 1 ? 'l' : 'is'} cadastrado{professionals.length === 1 ? '' : 's'}
          </p>
        </div>

        <Button
          onClick={handleAddProfessional}
          className="flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Funcionário</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-3 bg-zinc-800 rounded mb-2"></div>
              <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : funcionariosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funcionariosFiltrados.map((funcionario) => (
            <FuncionarioCard
              key={funcionario.id}
              funcionario={funcionario}
              onEdit={handleEditProfessional}
              onDelete={handleDeleteProfessional}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-12 text-center">
          <p className="text-zinc-500 mb-2">
            {searchTerm ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado'}
          </p>
          <p className="text-sm text-zinc-600">
            {searchTerm 
              ? 'Tente buscar com outros termos' 
              : 'Clique em "Adicionar Funcionário" para começar'}
          </p>
        </div>
      )}

      {modalProfessional && business && (
        <ProfessionalModal
          businessId={business.id}
          professional={professionalParaEditar}
          onClose={handleCloseModalProfessional}
        />
      )}

      <Modal
        isOpen={modalExcluir}
        onClose={handleCloseModalExcluir}
        onConfirm={confirmarExclusao}
        title="Excluir funcionário"
        description="Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
      >
        {professionalParaExcluir && (() => {
          const professional = professionals.find(p => p.id === professionalParaExcluir);
          const funcionario = professional ? ProfessionalMapper.toFuncionario(professional) : null;
          return funcionario ? (
            <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
              <p className="text-sm text-zinc-200 font-medium mb-1">{funcionario.nome}</p>
              <p className="text-xs text-zinc-500">{funcionario.tipo}</p>
            </div>
          ) : null;
        })()}
      </Modal>
    </div>
  );
}