import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

interface ServicoRealizado {
  servico: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

interface CardRelatorioServicosProps {
  dados: ServicoRealizado[];
  mesAtual: string;
}

export function CardRelatorioServicos({ dados, mesAtual }: CardRelatorioServicosProps) {
  const totalGeral = dados.reduce((acc, item) => acc + item.valorTotal, 0);
  const quantidadeTotal = dados.reduce((acc, item) => acc + item.quantidade, 0);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">Relatório de Serviços - {mesAtual}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 md:p-6 pt-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/50">
                <th className="text-left py-3 px-4 text-zinc-300 font-medium text-xs">Serviço</th>
                <th className="text-center py-3 px-4 text-zinc-300 font-medium text-xs">Qtd.</th>
                <th className="text-right py-3 px-4 text-zinc-300 font-medium text-xs">Valor Unit.</th>
                <th className="text-right py-3 px-4 text-zinc-300 font-medium text-xs">Total</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-zinc-800 hover:bg-zinc-700/30 transition-colors"
                >
                  <td className="py-3 px-4 text-zinc-100 text-sm font-medium">{item.servico}</td>
                  <td className="py-3 px-4 text-center text-zinc-100 text-sm">{item.quantidade}</td>
                  <td className="py-3 px-4 text-right text-zinc-300 text-sm">
                    {formatarMoeda(item.valorUnitario)}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-semibold text-sm">
                    {formatarMoeda(item.valorTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="p-4 md:p-6 bg-zinc-800/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          <div>
            <p className="text-xs text-zinc-400">Total de Serviços</p>
            <p className="text-base font-bold text-zinc-100">{quantidadeTotal}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-zinc-400">Valor Total</p>
            <p className="text-lg font-bold text-emerald-400">
              {formatarMoeda(totalGeral)}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}