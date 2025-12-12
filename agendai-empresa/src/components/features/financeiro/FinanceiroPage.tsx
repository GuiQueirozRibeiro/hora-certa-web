'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { NavBar } from '@/components/layout/NavBar';
import { CardTotalAtendimentos } from './CardTotalAtendimentos';
import { CardAtendimentosProfissional } from './CardAtendimentosProfissional';
import { CardRendimentoTotal } from './CardRendimentoTotal';
import { CardRelatorioServicos } from './CardRelatorioServicos';
import { useFinancialData } from '@/hooks/useFinancialData';
import { authService } from '@/services/authService';
import { businessService } from '@/services/businessService';

export function FinanceiroPage() {
  const [businessId, setBusinessId] = useState<string>('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const {
    isLoading,
    atendimentosPorProfissional,
    atendimentosPorMes,
    servicosRealizados,
    rendimentoData,
  } = useFinancialData(businessId);

  useEffect(() => {
    async function loadBusinessId() {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          const business = await businessService.getBusinessByOwnerId(user.id);
          if (business) {
            setBusinessId(business.id);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do negócio:', error);
      } finally {
        setIsLoadingAuth(false);
      }
    }

    loadBusinessId();
  }, []);

  const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  if (isLoadingAuth || isLoading) {
    return (
      <div className="flex flex-col h-screen bg-zinc-900">
        <Header />
        <NavBar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-xl font-bold text-zinc-100 mb-4">Financeiro</h1>
            <div className="flex items-center justify-center h-64">
              <p className="text-zinc-400">Carregando dados financeiros...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-900">
      <Header />
      <NavBar />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-xl font-bold text-zinc-100 mb-4">Financeiro</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Card de Rendimento - destaque maior */}
            <div className="lg:col-span-1">
              <CardRendimentoTotal dados={rendimentoData} />
            </div>

            {/* Card de Atendimentos por Profissional */}
            <div className="lg:col-span-2">
              <CardAtendimentosProfissional
                dados={atendimentosPorProfissional}
                mesAtual={mesAtual}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Card de Total de Atendimentos por Mês */}
            <CardTotalAtendimentos dados={atendimentosPorMes} />

            {/* Card de Relatório de Serviços */}
            <CardRelatorioServicos
              dados={servicosRealizados}
              mesAtual={mesAtual}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
