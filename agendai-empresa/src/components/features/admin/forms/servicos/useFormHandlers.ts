/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { serviceService } from '@/services/serviceService';
import type { Service } from '@/types/service';

/**
 * Custom Hook responsável pela lógica de negócio do formulário de serviços
 * Aplica o Princípio da Responsabilidade Única (SRP)
 * 
 * @returns Estados e handlers necessários para o formulário de serviços
 */
export function useFormHandlers() {
  const { business } = useAuth();
  const { success, error: showError } = useToast();

  // ========================================
  // ESTADOS
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

  /**
   * Carrega serviços do banco de dados
   */
  const loadServicos = useCallback(async () => {
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
  }, [business?.id, showError]);

  // ========================================
  // CARREGAMENTO INICIAL
  // ========================================
  useEffect(() => {
    loadServicos();
  }, [loadServicos]);

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
  const handleCloseModalServico = (saved: boolean, message?: string) => {
    setModalServico(false);
    setServicoParaEditar(null);
    if (saved) {
      loadServicos();
      if (message) {
        success(message);
      }
    }
  };

  /**
   * Fecha modal de exclusão
   */
  const handleCloseModalExcluir = () => {
    setModalExcluir(false);
    setServicoParaExcluir(null);
  };

  /**
   * Limpa todos os filtros
   */
  const limparFiltros = () => {
    setFiltroCategoria('todas');
    setFiltroStatus('todos');
    setSearchTerm('');
  };

  // ========================================
  // FILTROS E ESTATÍSTICAS
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

  // Verificar se há filtros ativos
  const hasFiltrosAtivos = filtroCategoria !== 'todas' || filtroStatus !== 'todos' || searchTerm !== '';

  // ========================================
  // RETORNO
  // ========================================
  return {
    // Estados
    business,
    servicos,
    loading,
    searchTerm,
    filtroCategoria,
    filtroStatus,
    servicosFiltrados,
    categorias,
    
    // Estatísticas
    totalServicos,
    servicosAtivos,
    servicosInativos,
    hasFiltrosAtivos,
    
    // Estados dos modais
    modalExcluir,
    modalServico,
    servicoParaExcluir,
    servicoParaEditar,
    
    // Setters
    setSearchTerm,
    setFiltroCategoria,
    setFiltroStatus,
    
    // Handlers
    handleAddServico,
    handleEditServico,
    handleDeleteServico,
    handleToggleStatus,
    handleCloseModalServico,
    handleCloseModalExcluir,
    confirmarExclusao,
    limparFiltros,
  };
}
