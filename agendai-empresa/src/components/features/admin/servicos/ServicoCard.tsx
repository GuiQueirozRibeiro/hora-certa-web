// src/components/features/admin/ServicoCard.tsx
'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2, Clock, DollarSign, Scissors, Power } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice, formatDuration } from '@/lib/mappers/serviceMapper';
import type { Service } from '@/types/service';

/* eslint-disable @next/next/no-img-element */

// ========================================
// TIPOS
// ========================================
interface ServicoCardProps {
  servico: Service;
  onEdit: (servico: Service) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
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
export function ServicoCard({ servico, onEdit, onDelete, onToggleStatus }: ServicoCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ========================================
  // HANDLERS
  // ========================================
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cor da categoria
  const getCategoriaColor = (categoria?: string) => {
    if (!categoria) return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
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
          servico.is_active 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {servico.is_active ? 'Ativo' : 'Inativo'}
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

              {/* Opção: Alternar Status */}
              <button
                onClick={() => {
                  onToggleStatus(servico.id, servico.is_active);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  servico.is_active 
                    ? 'text-amber-400 hover:bg-amber-500/10 hover:text-amber-300' 
                    : 'text-green-400 hover:bg-green-500/10 hover:text-green-300'
                }`}
              >
                <Power className="h-4 w-4" />
                <span>{servico.is_active ? 'Desativar serviço' : 'Ativar serviço'}</span>
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
            CABEÇALHO: Ícone/Imagem e Nome
        ======================================== */}
        <div className="flex items-start gap-4 mb-4 mt-8">
          {/* Ícone/Imagem do serviço */}
          <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center overflow-hidden shrink-0">
            {servico.image_url ? (
              <img 
                src={servico.image_url} 
                alt={servico.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<svg class="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"></path></svg>';
                  }
                }}
              />
            ) : (
              <Scissors className="h-6 w-6 text-indigo-400" />
            )}
          </div>

          {/* Nome e Categoria */}
          <div className="flex-1 pr-8">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              {servico.name}
            </h3>
            {servico.category && (
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getCategoriaColor(servico.category)}`}>
                {servico.category}
              </span>
            )}
          </div>
        </div>

        {/* ========================================
            DESCRIÇÃO
        ======================================== */}
        {servico.description && (
          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
            {servico.description}
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
                {formatDuration(servico.duration_minutes)}
              </p>
            </div>
          </div>

          {/* Preço */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Preço</p>
              <p className="text-sm font-semibold text-green-400">
                {formatPrice(servico.price)}
              </p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
