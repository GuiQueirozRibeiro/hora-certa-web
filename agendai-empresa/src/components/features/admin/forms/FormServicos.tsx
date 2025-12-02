// src/components/features/admin/forms/FormServicos.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { ServiceList } from '../servicos/ServiceList';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ServiceModal } from '../servicos/ServiceModal';
import { serviceService } from '@/services/serviceService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import type { Service } from '@/types/service';

// ========================================
// COMPONENTE: Formulário de Serviços
// ========================================
/**
 * Componente para gerenciar serviços oferecidos.
 * Segue Clean Code e SOLID:
 * - Single Responsibility: Gerencia apenas a lista de serviços
 * - Separation of Concerns: Card de serviço é um componente separado
 */
export function FormServicos() {
  // ========================================
  // ESTADO
  // ========================================
  const [servicos, setServicos] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [modalExcluir, setModalExcluir] = useState(false);
  const [servicoParaExcluir, setServicoParaExcluir] = useState<string | null>(null);
  const [modalServico, setModalServico] = useState(false);
  const [servicoParaEditar, setServicoParaEditar] = useState<Service | null>(null);
  
  const { business } = useAuth();
  const { success, error: showError } = useToast();

  // ========================================
  // CARREGAMENTO INICIAL
  // ========================================
  useEffect(() => {
    if (business?.id) {
      loadServicos();
    }
  }, [business?.id]);

  /**
   * Carrega serviços do banco de dados
   */
  const loadServicos = async () => {
    if (!business?.id) return;
    
    setLoading(true);
    try {
      const data = await serviceService.getServicesByBusinessId(business.id);
      setServicos(data);
    } catch (error: any) {
      showError('Erro ao carregar serviços', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // HANDLERS
  // ========================================
  
  /**
   * Abre modal para adicionar novo serviço
   */
  const handleAddServico = () => {
    setServicoParaEditar(null);
    setModalServico(true);
  };

  /**
   * Abre modal para editar serviço existente
   */
  const handleEditServico = (servico: Service) => {
    setServicoParaEditar(servico);
    setModalServico(true);
  };

  /**
   * Abre modal de confirmação para excluir serviço
   */
  const handleDeleteServico = (id: string) => {
    setServicoParaExcluir(id);
    setModalExcluir(true);
  };

  /**
   * Confirma exclusão do serviço
   */
  const confirmarExclusao = async () => {
    if (!servicoParaExcluir) return;
    
    try {
      await serviceService.deleteService(servicoParaExcluir);
      setServicos(servicos.filter(s => s.id !== servicoParaExcluir));
      success('Serviço excluído com sucesso!');
      setModalExcluir(false);
      setServicoParaExcluir(null);
    } catch (error: any) {
      showError('Erro ao excluir serviço', error.message);
    }
  };

  /**
   * Alterna o status do serviço (Ativo/Inativo)
   */
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const updatedService = await serviceService.toggleServiceStatus(id, !currentStatus);
      setServicos(servicos.map(s => s.id === id ? updatedService : s));
      success(`Serviço ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error: any) {
      showError('Erro ao alterar status', error.message);
    }
  };

  /**
   * Fecha modal de serviço e recarrega dados se necessário
   */
  const handleCloseModalServico = (saved: boolean) => {
    setModalServico(false);
    setServicoParaEditar(null);
    if (saved) {
      loadServicos();
    }
  };

  // ========================================
  // FILTROS
  // ========================================
  
  // Obter categorias únicas
  const categorias = ['todas', ...Array.from(new Set(servicos.map(s => s.category).filter(Boolean)))];

  // Aplicar filtros
  const servicosFiltrados = servicos.filter(servico => {
    // Filtro de busca
    const matchBusca = servico.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (servico.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de categoria
    const matchCategoria = filtroCategoria === 'todas' || servico.category === filtroCategoria;
    
    // Filtro de status
    const matchStatus = filtroStatus === 'todos' || 
                       (filtroStatus === 'ativos' && servico.is_active) ||
                       (filtroStatus === 'inativos' && !servico.is_active);
    
    return matchBusca && matchCategoria && matchStatus;
  });

  // Estatísticas
  const totalServicos = servicos.length;
  const servicosAtivos = servicos.filter(s => s.is_active).length;
  const servicosInativos = servicos.filter(s => !s.is_active).length;

  // Se não há empresa, exibir mensagem
  if (!business) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-12 text-center">
        <p className="text-zinc-500 mb-2">Carregando informações da empresa...</p>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================
  return (
    <div>
      {/* ========================================
          CABEÇALHO COM ESTATÍSTICAS
      ======================================== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">
            Catálogo de Serviços
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-400">
              {totalServicos} serviço{totalServicos !== 1 ? 's' : ''} cadastrado{totalServicos !== 1 ? 's' : ''}
            </span>
            <span className="text-green-400">
              {servicosAtivos} ativo{servicosAtivos !== 1 ? 's' : ''}
            </span>
            <span className="text-red-400">
              {servicosInativos} inativo{servicosInativos !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Botão Adicionar */}
        <Button
          onClick={handleAddServico}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Serviço</span>
        </Button>
      </div>

      {/* ========================================
          BARRA DE BUSCA E FILTROS
      ======================================== */}
      <div className="space-y-4 mb-6">
        {/* Busca */}
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

        {/* Filtros */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span className="text-sm text-zinc-400">Filtrar por:</span>
          </div>

          {/* Filtro Categoria */}
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'todas' ? 'Todas as categorias' : cat}
              </option>
            ))}
          </select>

          {/* Filtro Status */}
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="todos">Todos os status</option>
            <option value="ativos">Apenas ativos</option>
            <option value="inativos">Apenas inativos</option>
          </select>

          {/* Contador de filtros ativos */}
          {(filtroCategoria !== 'todas' || filtroStatus !== 'todos' || searchTerm) && (
            <button
              onClick={() => {
                setFiltroCategoria('todas');
                setFiltroStatus('todos');
                setSearchTerm('');
              }}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* ========================================
          GRID DE SERVIÇOS
      ======================================== */}
      <ServiceList
        services={servicosFiltrados}
        loading={loading}
        onEdit={handleEditServico}
        onDelete={handleDeleteServico}
        onToggleStatus={handleToggleStatus}
      />

      {/* ========================================
          MODAL DE SERVIÇO (Criar/Editar)
      ======================================== */}
      {modalServico && business && (
        <ServiceModal
          businessId={business.id}
          service={servicoParaEditar}
          onClose={handleCloseModalServico}
        />
      )}

      {/* ========================================
          MODAL DE CONFIRMAÇÃO EXCLUSÃO
      ======================================== */}
      <Modal
        isOpen={modalExcluir}
        onClose={() => {
          setModalExcluir(false);
          setServicoParaExcluir(null);
        }}
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

