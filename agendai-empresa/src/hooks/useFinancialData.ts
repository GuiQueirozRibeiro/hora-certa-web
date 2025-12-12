import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointmentService';
import type { AppointmentWithDetails } from '@/types/appointment';

interface AtendimentoProfissional {
  nome: string;
  total: number;
  valor: number;
}

interface AtendimentoMes {
  mes: string;
  total: number;
  valor: number;
}

interface ServicoRealizado {
  servico: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

interface RendimentoData {
  mesAtual: number;
  mesAnterior: number;
  totalAno: number;
  percentualCrescimento: number;
}

export function useFinancialData(businessId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [atendimentosPorProfissional, setAtendimentosPorProfissional] = useState<AtendimentoProfissional[]>([]);
  const [atendimentosPorMes, setAtendimentosPorMes] = useState<AtendimentoMes[]>([]);
  const [servicosRealizados, setServicosRealizados] = useState<ServicoRealizado[]>([]);
  const [rendimentoData, setRendimentoData] = useState<RendimentoData>({
    mesAtual: 0,
    mesAnterior: 0,
    totalAno: 0,
    percentualCrescimento: 0,
  });

  useEffect(() => {
    async function fetchData() {
      if (!businessId) return;

      try {
        setIsLoading(true);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const startOfYear = `${currentYear}-01-01`;
        const endOfYear = `${currentYear}-12-31`;

        const appointments = await appointmentService.getCompletedAppointments(
          businessId,
          startOfYear,
          endOfYear
        );

        processFinancialData(appointments, currentDate);
      } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [businessId]);

  function processFinancialData(appointments: AppointmentWithDetails[], currentDate: Date) {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calcular atendimentos por profissional (mês atual)
    const profissionaisMap = new Map<string, { total: number; valor: number }>();

    appointments.forEach((apt) => {
      const aptDate = new Date(apt.appointment_date);
      if (aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear) {
        const profName = apt.professional_name || 'Profissional';
        const current = profissionaisMap.get(profName) || { total: 0, valor: 0 };

        profissionaisMap.set(profName, {
          total: current.total + 1,
          valor: current.valor + (apt.total_price || apt.service_price || 0),
        });
      }
    });

    const profissionais = Array.from(profissionaisMap.entries()).map(([nome, data]) => ({
      nome,
      ...data,
    }));

    setAtendimentosPorProfissional(profissionais);

    // Calcular atendimentos por mês
    const mesesMap = new Map<number, { total: number; valor: number }>();

    appointments.forEach((apt) => {
      const aptDate = new Date(apt.appointment_date);
      if (aptDate.getFullYear() === currentYear) {
        const month = aptDate.getMonth();
        const current = mesesMap.get(month) || { total: 0, valor: 0 };

        mesesMap.set(month, {
          total: current.total + 1,
          valor: current.valor + (apt.total_price || apt.service_price || 0),
        });
      }
    });

    const meses = Array.from(mesesMap.entries()).map(([monthIndex, data]) => ({
      mes: new Date(currentYear, monthIndex).toLocaleDateString('pt-BR', { month: 'long' }),
      ...data,
    }));

    setAtendimentosPorMes(meses);

    // Calcular serviços realizados (mês atual)
    const servicosMap = new Map<string, { quantidade: number; valorUnitario: number }>();

    appointments.forEach((apt) => {
      const aptDate = new Date(apt.appointment_date);
      if (aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear) {
        const serviceName = apt.service_name || 'Serviço';
        const servicePrice = apt.total_price || apt.service_price || 0;
        const current = servicosMap.get(serviceName) || { quantidade: 0, valorUnitario: servicePrice };

        servicosMap.set(serviceName, {
          quantidade: current.quantidade + 1,
          valorUnitario: servicePrice,
        });
      }
    });

    const servicos = Array.from(servicosMap.entries()).map(([servico, data]) => ({
      servico,
      quantidade: data.quantidade,
      valorUnitario: data.valorUnitario,
      valorTotal: data.quantidade * data.valorUnitario,
    }));

    setServicosRealizados(servicos);

    // Calcular rendimento
    const mesAtualValor = mesesMap.get(currentMonth)?.valor || 0;

    const mesAnteriorIndex = currentMonth === 0 ? 11 : currentMonth - 1;
    const mesAnteriorValor = mesesMap.get(mesAnteriorIndex)?.valor || 0;

    const totalAno = meses.reduce((acc, mes) => acc + mes.valor, 0);

    // Calcular percentual de crescimento em relação ao mês anterior
    let percentualCrescimento = 0;
    if (mesAnteriorValor > 0) {
      percentualCrescimento = ((mesAtualValor - mesAnteriorValor) / mesAnteriorValor) * 100;
    } else if (mesAtualValor > 0) {
      // Se não havia faturamento no mês anterior mas há no atual, crescimento de 100%
      percentualCrescimento = 100;
    }

    setRendimentoData({
      mesAtual: mesAtualValor,
      mesAnterior: mesAnteriorValor,
      totalAno,
      percentualCrescimento,
    });
  }

  return {
    isLoading,
    atendimentosPorProfissional,
    atendimentosPorMes,
    servicosRealizados,
    rendimentoData,
  };
}
