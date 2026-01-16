import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface AtendimentoMes {
  mes: string;
  total: number;
  valor: number;
}

interface CardTotalAtendimentosProps {
  dados: AtendimentoMes[];
}

export function CardTotalAtendimentos({ dados }: CardTotalAtendimentosProps) {
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">Total de Atendimentos por Mês</CardTitle>
      </CardHeader>
      <CardContent className="p-0 md:p-6 pt-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/50">
                <th className="text-left py-3 px-4 text-zinc-300 font-medium text-xs">Mês</th>
                <th className="text-right py-3 px-4 text-zinc-300 font-medium text-xs">Atendimentos</th>
                <th className="text-right py-3 px-4 text-zinc-300 font-medium text-xs">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-zinc-800 hover:bg-zinc-700/30 transition-colors"
                >
                  <td className="py-3 px-4 text-zinc-100 text-sm font-medium">{item.mes}</td>
                  <td className="py-3 px-4 text-right text-zinc-100 text-sm">{item.total}</td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-semibold text-sm">
                    {formatarMoeda(item.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}