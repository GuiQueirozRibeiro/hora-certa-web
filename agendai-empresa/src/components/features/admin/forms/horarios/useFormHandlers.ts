/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { businessService } from '@/services/businessService';
import { HorarioFuncionamento } from '../../horarios/DiaFuncionamentoCard';

// ========================================
// DADOS PADRÃO
// ========================================
const horariosPadrao: HorarioFuncionamento[] = [
  {
    dia: 'Segunda-feira',
    diaAbreviado: 'SEG',
    ativo: true,
    horarioAbertura: '09:00',
    horarioFechamento: '18:00',
    intervaloInicio: '12:00',
    intervaloFim: '13:00'
  },
  {
    dia: 'Terça-feira',
    diaAbreviado: 'TER',
    ativo: true,
    horarioAbertura: '09:00',
    horarioFechamento: '18:00',
    intervaloInicio: '12:00',
    intervaloFim: '13:00'
  },
  {
    dia: 'Quarta-feira',
    diaAbreviado: 'QUA',
    ativo: true,
    horarioAbertura: '09:00',
    horarioFechamento: '18:00',
    intervaloInicio: '12:00',
    intervaloFim: '13:00'
  },
  {
    dia: 'Quinta-feira',
    diaAbreviado: 'QUI',
    ativo: true,
    horarioAbertura: '09:00',
    horarioFechamento: '18:00',
    intervaloInicio: '12:00',
    intervaloFim: '13:00'
  },
  {
    dia: 'Sexta-feira',
    diaAbreviado: 'SEX',
    ativo: true,
    horarioAbertura: '09:00',
    horarioFechamento: '18:00',
    intervaloInicio: '12:00',
    intervaloFim: '13:00'
  },
  {
    dia: 'Sábado',
    diaAbreviado: 'SÁB',
    ativo: true,
    horarioAbertura: '09:00',
    horarioFechamento: '14:00',
    intervaloInicio: '',
    intervaloFim: ''
  },
  {
    dia: 'Domingo',
    diaAbreviado: 'DOM',
    ativo: false,
    horarioAbertura: '09:00',
    horarioFechamento: '18:00',
    intervaloInicio: '',
    intervaloFim: ''
  }
];

/**
 * Custom Hook responsável pela lógica de negócio do formulário de horários
 * Aplica o Princípio da Responsabilidade Única (SRP)
 * 
 * @returns Estados e handlers necessários para o formulário de horários
 */
export function useFormHandlers() {
  const { business, refreshBusiness } = useAuth();
  const { success, warning, info, error: showError } = useToast();

  // ========================================
  // ESTADOS
  // ========================================
  const [horarios, setHorarios] = useState<HorarioFuncionamento[]>(horariosPadrao);
  const [hasChanges, setHasChanges] = useState(false);
  const [diaParaCopiar, setDiaParaCopiar] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados dos modais
  const [modalCopiar, setModalCopiar] = useState(false);
  const [modalResetar, setModalResetar] = useState(false);
  const [modalSalvar, setModalSalvar] = useState(false);

  // ========================================
  // EFEITOS
  // ========================================
  useEffect(() => {
    if (business) {
      console.log('[FormHorarios] Dados da empresa carregados:', {
        id: business.id,
        opening_hours: business.opening_hours
      });

      if (business.opening_hours && Array.isArray(business.opening_hours) && business.opening_hours.length > 0) {
        console.log('[FormHorarios] Aplicando horários do banco de dados');
        setHorarios(business.opening_hours as HorarioFuncionamento[]);
      } else {
        console.log('[FormHorarios] Usando horários padrão (sem dados no banco)');
      }
    }
  }, [business]);

  // ========================================
  // HANDLERS
  // ========================================

  /**
   * Salva alteração de um dia específico
   */
  const handleSaveDia = (horarioAtualizado: HorarioFuncionamento) => {
    setHorarios(horarios.map(h => 
      h.dia === horarioAtualizado.dia ? horarioAtualizado : h
    ));
    setHasChanges(true);
    
    // Notificação de alteração
    info(
      'Alteração registrada',
      `Horário de ${horarioAtualizado.dia} foi atualizado. Clique em "Salvar alterações" para confirmar.`,
      3000
    );
  };

  /**
   * Salva todas as alterações (chamada da API)
   */
  const handleSaveAll = async () => {
    if (!business) return;

    setIsLoading(true);
    try {
      await businessService.updateBusiness(business.id, {
        opening_hours: horarios
      });
      
      await refreshBusiness();
      setHasChanges(false);
      setModalSalvar(false);
      
      // Notificação de sucesso
      success(
        'Horários salvos com sucesso!',
        'Os horários de funcionamento foram atualizados e já estão em vigor.',
        4000
      );
    } catch (error: any) {
      showError('Erro ao salvar horários', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reseta para os horários padrão
   */
  const handleReset = () => {
    setHorarios(horariosPadrao);
    setHasChanges(false);
    setModalResetar(false);
    
    // Notificação de reset
    warning(
      'Horários resetados',
      'Os horários foram restaurados para o padrão.',
      3000
    );
  };

  /**
   * Copia horário de um dia para todos os outros dias úteis
   */
  const handleCopyToAll = () => {
    if (!diaParaCopiar) return;

    const diaOrigem = horarios.find(h => h.dia === diaParaCopiar);
    if (!diaOrigem) return;

    const diasAfetados = horarios.filter(h => h.ativo && h.dia !== diaParaCopiar).length;

    setHorarios(horarios.map(h => {
      // Não copia para o próprio dia ou dias inativos
      if (h.dia === diaParaCopiar || !h.ativo) return h;
      
      return {
        ...h,
        horarioAbertura: diaOrigem.horarioAbertura,
        horarioFechamento: diaOrigem.horarioFechamento,
        intervaloInicio: diaOrigem.intervaloInicio,
        intervaloFim: diaOrigem.intervaloFim
      };
    }));
    setHasChanges(true);
    setDiaParaCopiar('');
    setModalCopiar(false);
    
    // Notificação de cópia
    success(
      'Horários copiados!',
      `O horário de ${diaOrigem.dia} foi aplicado em ${diasAfetados} dia(s).`,
      4000
    );
  };

  // ========================================
  // ESTATÍSTICAS
  // ========================================
  const diasAbertos = horarios.filter(h => h.ativo).length;
  const diasFechados = horarios.filter(h => !h.ativo).length;

  return {
    // Estados
    horarios,
    hasChanges,
    diaParaCopiar,
    isLoading,
    diasAbertos,
    diasFechados,
    
    // Estados dos modais
    modalCopiar,
    modalResetar,
    modalSalvar,
    
    // Setters
    setDiaParaCopiar,
    setModalCopiar,
    setModalResetar,
    setModalSalvar,
    
    // Handlers
    handleSaveDia,
    handleSaveAll,
    handleReset,
    handleCopyToAll,
  };
}
