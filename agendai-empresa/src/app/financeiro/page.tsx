'use client';

import Header from '@/components/layout/Header';
import { NavBar } from '@/components/layout/NavBar';
import { CardTotalAtendimentos } from '@/components/features/financeiro/CardTotalAtendimentos';
import { CardAtendimentosProfissional } from '@/components/features/financeiro/CardAtendimentosProfissional';
import { CardRendimentoTotal } from '@/components/features/financeiro/CardRendimentoTotal';
import { CardRelatorioServicos } from '@/components/features/financeiro/CardRelatorioServicos';

export default function FinanceiroPage() {
  // Dados de exemplo - substituir por dados reais da API
  const atendimentosPorMes = [
    { mes: 'Janeiro', total: 145, valor: 8725.00 },
    { mes: 'Fevereiro', total: 132, valor: 7920.00 },
    { mes: 'Março', total: 168, valor: 10080.00 },
    { mes: 'Abril', total: 156, valor: 9360.00 },
    { mes: 'Maio', total: 189, valor: 11340.00 },
    { mes: 'Junho', total: 203, valor: 12180.00 },
  ];

  const atendimentosPorProfissional = [
    { nome: 'João Silva', total: 48, valor: 2880.00 },
    { nome: 'Maria Santos', total: 56, valor: 3360.00 },
    { nome: 'Pedro Costa', total: 42, valor: 2520.00 },
    { nome: 'Ana Oliveira', total: 57, valor: 3420.00 },
  ];

  const rendimentoData = {
    mesAtual: 12180.00,
    mesAnterior: 11340.00,
    totalAno: 59605.00,
    percentualCrescimento: 7.4,
  };

  const servicosRealizados = [
    { servico: 'Corte Masculino', quantidade: 78, valorUnitario: 45.00, valorTotal: 3510.00 },
    { servico: 'Corte Feminino', quantidade: 45, valorUnitario: 80.00, valorTotal: 3600.00 },
    { servico: 'Barba', quantidade: 52, valorUnitario: 35.00, valorTotal: 1820.00 },
    { servico: 'Coloração', quantidade: 12, valorUnitario: 150.00, valorTotal: 1800.00 },
    { servico: 'Luzes', quantidade: 8, valorUnitario: 200.00, valorTotal: 1600.00 },
    { servico: 'Hidratação', quantidade: 18, valorUnitario: 60.00, valorTotal: 1080.00 },
  ];

  const mesAtual = 'Junho 2025';

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
