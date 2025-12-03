// src/components/features/admin/forms/FormFuncionarios.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { FuncionarioCard, Funcionario } from '../FuncionarioCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProfessionalModal } from '../professionals/ProfessionalModal';
import { professionalService } from '@/services/professionalService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import type { ProfessionalWithUser, WorkingHours } from '@/types/professional';

// ========================================
// HELPERS
// ========================================

/**
 * Calcula o tempo na empresa com base na data de criação
 */
function calcularTempoEmpresa(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  
  // Calcula diferença em meses
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  
  if (years === 0 && months === 0) {
    return 'Menos de 1 mês';
  }
  
  if (years === 0) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  
  if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
  
  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
}

/**
 * Extrai dias de trabalho do working_hours JSON
 */
function extrairDiasSemana(workingHours?: WorkingHours): string[] {
  if (!workingHours) return [];
  
  const diasMap: Record<string, string> = {
    monday: 'Seg',
    tuesday: 'Ter',
    wednesday: 'Qua',
    thursday: 'Qui',
    friday: 'Sex',
    saturday: 'Sáb',
    sunday: 'Dom',
  };
  
  return Object.entries(workingHours)
    .filter(([_, config]) => config.enabled)
    .map(([day, _]) => diasMap[day] || day);
}

/**
 * Extrai horário de trabalho representativo
 */
function extrairHorarioTrabalho(workingHours?: WorkingHours): string {
  if (!workingHours) return 'A definir';
  
  // Pega o primeiro dia habilitado para mostrar o horário
  const firstEnabled = Object.values(workingHours).find(config => config.enabled);
  
  if (!firstEnabled) return 'A definir';
  
  return `${firstEnabled.start} - ${firstEnabled.end}`;
}

/**
 * Converte ProfessionalWithUser para Funcionario (compatível com FuncionarioCard)
 */
function professionalToFuncionario(professional: ProfessionalWithUser): Funcionario {
  // Garante que temos um nome válido
  const nome = professional.user?.name || professional.user?.email?.split('@')[0] || 'Sem nome';
  
  // Calcula idade (se não tiver, usa 0)
  const idade = 0; // Não temos campo de idade no schema
  
  // Calcula tempo na empresa
  const tempoEmpresa = calcularTempoEmpresa(professional.created_at);
  
  // Pega primeira especialidade como "tipo"
  const tipo = professional.specialties?.[0] || 'Profissional';
  
  // Extrai horários de trabalho
  const dias = extrairDiasSemana(professional.working_hours);
  const horario = extrairHorarioTrabalho(professional.working_hours);
  
  return {
    id: professional.id,
    nome,
    idade,
    tempoEmpresa,
    tipo,
    horarioTrabalho: {
      dias,
      horario,
    },
    avatar: '', // Será calculado pelas iniciais
    corAvatar: 'bg-indigo-500',
    isActive: professional.is_active,
  };
}

// ========================================
// COMPONENTE: Formulário de Funcionários
// ========================================
export function FormFuncionarios() {
  // ========================================
  // HOOKS
  // ========================================
  const { business } = useAuth();
  const { success, error: showError } = useToast();

  // ========================================
  // ESTADO
  // ========================================
  const [professionals, setProfessionals] = useState<ProfessionalWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalExcluir, setModalExcluir] = useState(false);
  const [professionalParaExcluir, setProfessionalParaExcluir] = useState<string | null>(null);
  const [modalProfessional, setModalProfessional] = useState(false);
  const [professionalParaEditar, setProfessionalParaEditar] = useState<ProfessionalWithUser | null>(null);

  // ========================================
  // CARREGAMENTO INICIAL
  // ========================================
  useEffect(() => {
    if (business?.id) {
      loadProfessionals();
    }
  }, [business?.id]);

  /**
   * Carrega profissionais do banco de dados
   */
  const loadProfessionals = async () => {
    if (!business?.id) return;
    
    setLoading(true);
    try {
      const data = await professionalService.getProfessionalsByBusinessId(business.id);
      console.log('Profissionais carregados:', data);
      setProfessionals(data);
    } catch (error: any) {
      console.error('Erro ao carregar profissionais:', error);
      showError('Erro ao carregar profissionais', error.message);
    } finally {
      setLoading(false);
    }
  };

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

  // ========================================
  // FILTRO DE BUSCA
  // ========================================
  const funcionariosFiltrados = professionals
    .map(professionalToFuncionario)
    .filter(funcionario =>
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          CABEÇALHO
      ======================================== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 mb-1">
            Gerenciar Funcionários
          </h2>
          <p className="text-sm text-zinc-400">
            {professionals.length} profissiona{professionals.length === 1 ? 'l' : 'is'} cadastrado{professionals.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Botão Adicionar */}
        <Button
          onClick={handleAddProfessional}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Funcionário</span>
        </Button>
      </div>

      {/* ========================================
          BARRA DE BUSCA
      ======================================== */}
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

      {/* ========================================
          GRID DE FUNCIONÁRIOS
      ======================================== */}
      {loading ? (
        // Estado de loading
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
        // Mensagem quando não há resultados
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

      {/* ========================================
          MODAL DE PROFISSIONAL (Criar/Editar)
      ======================================== */}
      {modalProfessional && business && (
        <ProfessionalModal
          businessId={business.id}
          professional={professionalParaEditar}
          onClose={handleCloseModalProfessional}
        />
      )}

      {/* ========================================
          MODAL DE CONFIRMAÇÃO EXCLUSÃO
      ======================================== */}
      <Modal
        isOpen={modalExcluir}
        onClose={() => {
          setModalExcluir(false);
          setProfessionalParaExcluir(null);
        }}
        onConfirm={confirmarExclusao}
        title="Excluir funcionário"
        description="Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
      >
        {professionalParaExcluir && (() => {
          const professional = professionals.find(p => p.id === professionalParaExcluir);
          const funcionario = professional ? professionalToFuncionario(professional) : null;
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