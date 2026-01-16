import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface RendimentoData {
  mesAtual: number;
  mesAnterior: number;
  totalAno: number;
  percentualCrescimento: number;
}

interface CardRendimentoTotalProps {
  dados: RendimentoData;
}

export function CardRendimentoTotal({ dados }: CardRendimentoTotalProps) {
  const crescimentoPositivo = dados.percentualCrescimento >= 0;

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Card className="h-full bg-linear-to-br from-emerald-900/20 to-zinc-800 border-emerald-700/50">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-emerald-400 text-sm md:text-base">Rendimento Total</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-zinc-400 mb-1">Mês Atual</p>
            <p className="text-2xl md:text-3xl font-bold text-zinc-100">
              {formatarMoeda(dados.mesAtual)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              crescimentoPositivo 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              <span>{crescimentoPositivo ? '↑' : '↓'}</span>
              <span>{Math.abs(dados.percentualCrescimento).toFixed(1)}%</span>
            </div>
            <span className="text-xs text-zinc-400">vs mês anterior</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-700">
            <div>
              <p className="text-xs text-zinc-400 mb-1">Mês Anterior</p>
              <p className="text-sm font-semibold text-zinc-100">
                {formatarMoeda(dados.mesAnterior)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">Total no Ano</p>
              <p className="text-sm font-semibold text-zinc-100">
                {formatarMoeda(dados.totalAno)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}