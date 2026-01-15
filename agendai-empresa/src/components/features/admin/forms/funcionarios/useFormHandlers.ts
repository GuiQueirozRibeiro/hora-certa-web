/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { professionalService } from '@/services/professionalService';
import { ProfessionalMapper } from '@/lib/utils/professionalMappers';
import type { ProfessionalWithUser } from '@/types/professional';
import type { Funcionario } from '../../professionals/FuncionarioCard';

/**
 * Custom Hook responsável pela lógica de negócio do formulário de funcionários
 * Aplica o Princípio da Responsabilidade Única (SRP)
 * 
 * @returns Estados e handlers necessários para o formulário de funcionários
 */
export function useFormHandlers() {
  const { business } = useAuth();
  const { success, error: showError } = useToast();

  // ========================================
  // ESTADOS
  // ========================================
  const [professionals, setProfessionals] = useState<ProfessionalWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalExcluir, setModalExcluir] = useState(false);
  const [professionalParaExcluir, setProfessionalParaExcluir] = useState<string | null>(null);
  const [modalProfessional, setModalProfessional] = useState(false);
  const [professionalParaEditar, setProfessionalParaEditar] = useState<ProfessionalWithUser | null>(null);

  /**
   * Carrega profissionais do banco de dados
   */
  const loadProfessionals = useCallback(async () => {
    if (!business?.id) return;
    
    setLoading(true);
    try {
      const data = await professionalService.getProfessionalsByBusinessId(business.id);
      setProfessionals(data);
    } catch (error: any) {
      showError('Erro ao carregar profissionais', error.message);
    } finally {
      setLoading(false);
    }
  }, [business?.id, showError]);

  // ========================================
  // CARREGAMENTO INICIAL
  // ========================================
  useEffect(() => {
    loadProfessionals();
  }, [loadProfessionals]);

  // ========================================
  // HANDLERS
  // ========================================
  
  /**
   * Abre modal para adicionar novo profissional
   */
  const handleAddProfessional = () => {
    setProfessionalParaEditar(null);
    setModalProfessional(true);
  };

  /**
   * Abre modal para editar profissional existente
   */
  const handleEditProfessional = (funcionario: Funcionario) => {
    const professional = professionals.find(p => p.id === funcionario.id);
    if (professional) {
      setProfessionalParaEditar(professional);
      setModalProfessional(true);
    }
  };

  /**
   * Abre modal de confirmação para excluir profissional
   */
  const handleDeleteProfessional = (id: string) => {
    setProfessionalParaExcluir(id);
    setModalExcluir(true);
  };

  /**
   * Confirma exclusão do profissional
   */
  const confirmarExclusao = async () => {
    if (!professionalParaExcluir) return;
    
    try {
      await professionalService.deleteProfessional(professionalParaExcluir);
      setProfessionals(professionals.filter(p => p.id !== professionalParaExcluir));
      success('Profissional excluído com sucesso!');
      setModalExcluir(false);
      setProfessionalParaExcluir(null);
    } catch (error: any) {
      showError('Erro ao excluir profissional', error.message);
    }
  };

  /**
   * Alterna o status do profissional (Ativo/Inativo)
   */
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const updatedProfessional = await professionalService.toggleProfessionalStatus(id, !currentStatus);
      setProfessionals(professionals.map(p => p.id === id ? updatedProfessional : p));
      success(`Profissional ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error: any) {
      showError('Erro ao alterar status', error.message);
    }
  };

  /**
   * Fecha modal de profissional e recarrega dados se necessário
   */
  const handleCloseModalProfessional = (saved: boolean) => {
    setModalProfessional(false);
    setProfessionalParaEditar(null);
    if (saved) {
      loadProfessionals();
    }
  };

  /**
   * Fecha modal de exclusão
   */
  const handleCloseModalExcluir = () => {
    setModalExcluir(false);
    setProfessionalParaExcluir(null);
  };

  // ========================================
  // FILTRO DE BUSCA (Memoizado para performance)
  // ========================================
  const funcionariosFiltrados = useMemo(() => {
    const funcionarios = ProfessionalMapper.toFuncionarioList(professionals);
    
    if (!searchTerm) return funcionarios;
    
    const searchLower = searchTerm.toLowerCase();
    return funcionarios.filter(funcionario =>
      funcionario.nome.toLowerCase().includes(searchLower) ||
      funcionario.tipo.toLowerCase().includes(searchLower)
    );
  }, [professionals, searchTerm]);

  // ========================================
  // RETORNO
  // ========================================
  return {
    // Estados
    business,
    professionals,
    loading,
    searchTerm,
    funcionariosFiltrados,
    
    // Estados dos modais
    modalExcluir,
    modalProfessional,
    professionalParaExcluir,
    professionalParaEditar,
    
    // Setters
    setSearchTerm,
    
    // Handlers
    handleAddProfessional,
    handleEditProfessional,
    handleDeleteProfessional,
    handleToggleStatus,
    handleCloseModalProfessional,
    handleCloseModalExcluir,
    confirmarExclusao,
  };
}
