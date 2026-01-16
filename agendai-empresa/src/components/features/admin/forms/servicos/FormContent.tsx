'use client';

import { Plus, Search, Filter } from 'lucide-react';
import { useFormHandlers } from './useFormHandlers';
import { useToast } from '@/hooks/useToast';
import { ServiceList } from '../../servicos/ServiceList';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ServiceModal } from '../../servicos/ServiceModal';
import { ToastContainer } from '@/components/ui/Toast';

export function FormContent() {
  const { toasts, removeToast } = useToast();

  const {
    business,
    servicos,
    loading,
    searchTerm,
    filtroCategoria,
    filtroStatus,
    servicosFiltrados,
    categorias,
    totalServicos,
    servicosAtivos,
    servicosInativos,
    hasFiltrosAtivos,
    modalExcluir,
    modalServico,
    servicoParaExcluir,
    servicoParaEditar,
    setSearchTerm,
    setFiltroCategoria,
    setFiltroStatus,
    handleAddServico,
    handleEditServico,
    handleDeleteServico,
    handleToggleStatus,
    handleCloseModalServico,
    handleCloseModalExcluir,
    confirmarExclusao,
    limparFiltros,
  } = useFormHandlers();

  if (!business) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-8 md:p-12 text-center">
        <p className="text-zinc-500 mb-2">Carregando informações da empresa...</p>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer 
        toasts={toasts} 
        onClose={removeToast}
        position="top-right"
      />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">
            Catálogo de Serviços
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-zinc-400">
              {totalServicos} serviço{totalServicos !== 1 ? 's' : ''}
            </span>
            <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded text-xs">
              {servicosAtivos} ativos
            </span>
            <span className="text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs">
              {servicosInativos} inativos
            </span>
          </div>
        </div>

        <Button
          onClick={handleAddServico}
          className="flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Serviço</span>
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 mb-1 md:mb-0">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span className="text-sm text-zinc-400">Filtrar:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'todas' ? 'Todas as categorias' : cat}
                </option>
              ))}
            </select>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="todos">Todos os status</option>
              <option value="ativos">Apenas ativos</option>
              <option value="inativos">Apenas inativos</option>
            </select>
          </div>

          {hasFiltrosAtivos && (
            <button
              onClick={limparFiltros}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors text-right md:text-left pt-2 md:pt-0"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      <ServiceList
        services={servicosFiltrados}
        loading={loading}
        onEdit={handleEditServico}
        onDelete={handleDeleteServico}
        onToggleStatus={handleToggleStatus}
      />

      {modalServico && business && (
        <ServiceModal
          businessId={business.id}
          service={servicoParaEditar}
          onClose={handleCloseModalServico}
        />
      )}

      <Modal
        isOpen={modalExcluir}
        onClose={handleCloseModalExcluir}
        onConfirm={confirmarExclusao}
        title="Excluir serviço"
        description="Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita e afetará os agendamentos futuros."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
      >
        {servicoParaExcluir && (() => {
          const servico = servicos.find(s => s.id === servicoParaExcluir);
          return servico ? (
            <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
              <p className="text-sm text-zinc-200 font-medium mb-1">{servico.name}</p>
              <p className="text-xs text-zinc-500">
                {servico.category} • R$ {servico.price.toFixed(2)}
              </p>
            </div>
          ) : null;
        })()}
      </Modal>
    </div>
  );
}