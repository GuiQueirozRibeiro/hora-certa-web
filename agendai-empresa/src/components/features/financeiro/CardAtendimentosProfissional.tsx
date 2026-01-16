import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface AtendimentoProfissional {
  nome: string;
  total: number;
  valor: number;
}

interface CardAtendimentosProfissionalProps {
  dados: AtendimentoProfissional[];
  mesAtual: string;
}

export function CardAtendimentosProfissional({ dados, mesAtual }: CardAtendimentosProfissionalProps) {
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-sm md:text-base">Atendimentos por Profissional - {mesAtual}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="space-y-3">
          {dados.map((profissional, index) => (
            <div 
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-zinc-700/30 rounded-lg hover:bg-zinc-700/50 transition-colors gap-2"
            >
              <div className="flex-1">
                <p className="text-zinc-100 font-medium text-sm">{profissional.nome}</p>
                <p className="text-xs text-zinc-400">{profissional.total} atendimentos</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-emerald-400 font-bold text-base">
                  {formatarMoeda(profissional.valor)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}