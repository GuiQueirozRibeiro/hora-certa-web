// src/components/features/admin/ServicoCard.tsx
'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2, Clock, DollarSign, Scissors } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

// ========================================
// TIPOS
// ========================================
export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  duracao: number; // Em minutos
  preco: number;
  categoria: string; // Ex: "Corte", "Barba", "Coloração"
  profissionais: string[]; // IDs ou nomes dos profissionais habilitados
  ativo: boolean; // Se está disponível para agendamento
}

interface ServicoCardProps {
  servico: Servico;
  onEdit: (servico: Servico) => void;
  onDelete: (id: string) => void;
}

// ========================================
// COMPONENTE: Card de Serviço
// ========================================
/**
 * Card que exibe informações de um serviço.
 * Princípios SOLID:
 * - Single Responsibility: Apenas exibe os dados do serviço
 * - Open/Closed: Extensível via props, sem modificar o componente
 * - Dependency Inversion: Recebe callbacks, não conhece a implementação
 */
export function ServicoCard({ servico, onEdit, onDelete }: ServicoCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ========================================
  // HANDLERS
  // ========================================
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Formatar preço para exibição
  const formatarPreco = (preco: number) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Formatar duração
  const formatarDuracao = (minutos: number) => {
    if (minutos < 60) {
      return `${minutos}min`;
    }
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
  };

  // Cor da categoria
  const getCategoriaColor = (categoria: string) => {
    const cores: Record<string, string> = {
      'Corte': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Barba': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'Coloração': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Tratamento': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Combo': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };
    return cores[categoria] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  };

  return (
    <Card className="relative hover:border-zinc-600 transition-all">
      
      {/* ========================================
          BADGE DE STATUS (Ativo/Inativo)
      ======================================== */}
      <div className="absolute top-4 left-4">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
          servico.ativo 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {servico.ativo ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      {/* ========================================
          MENU KEBAB
      ======================================== */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleMenuToggle}
          className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          aria-label="Menu de opções"
        >
          <MoreVertical className="h-5 w-5 text-zinc-400" />
        </button>

        {/* Menu dropdown */}
        {isMenuOpen && (
          <>
            {/* Overlay para fechar o menu */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu de opções */}
            <div className="absolute right-0 top-12 z-20 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
              
              {/* Opção: Editar */}
              <button
                onClick={() => {
                  onEdit(servico);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Editar serviço</span>
              </button>

              {/* Opção: Excluir */}
              <button
                onClick={() => {
                  onDelete(servico.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir serviço</span>
              </button>
            </div>
          </>
        )}
      </div>

      <CardContent>
        {/* ========================================
            CABEÇALHO: Ícone e Nome
        ======================================== */}
        <div className="flex items-start gap-4 mb-4 mt-8">
          {/* Ícone do serviço */}
          <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Scissors className="h-6 w-6 text-indigo-400" />
          </div>

          {/* Nome e Categoria */}
          <div className="flex-1 pr-8">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              {servico.nome}
            </h3>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getCategoriaColor(servico.categoria)}`}>
              {servico.categoria}
            </span>
          </div>
        </div>

        {/* ========================================
            DESCRIÇÃO
        ======================================== */}
        {servico.descricao && (
          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
            {servico.descricao}
          </p>
        )}

        {/* ========================================
            INFORMAÇÕES: Duração e Preço
        ======================================== */}
        <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-zinc-700">
          {/* Duração */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Duração</p>
              <p className="text-sm font-semibold text-zinc-200">
                {formatarDuracao(servico.duracao)}
              </p>
            </div>
          </div>

          {/* Preço */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Preço</p>
              <p className="text-sm font-semibold text-green-400">
                {formatarPreco(servico.preco)}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================
            PROFISSIONAIS HABILITADOS
        ======================================== */}
        <div className="pt-4 border-t border-zinc-700">
          <p className="text-xs text-zinc-500 mb-2">Profissionais habilitados</p>
          <div className="flex flex-wrap gap-2">
            {servico.profissionais.length > 0 ? (
              servico.profissionais.map((prof, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded"
                >
                  {prof}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-600 italic">
                Nenhum profissional vinculado
              </span>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
