/* eslint-disable @next/next/no-img-element */
// src/components/features/admin/FuncionarioCard.tsx
'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2, Clock, Calendar, Power } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

// ========================================
// TIPOS
// ========================================
export interface Funcionario {
  id: string;
  nome: string;
  idade: number;
  tempoEmpresa: string; // Ex: "2 anos", "6 meses"
  tipo: string; // Ex: "Barbeiro", "Cabeleireiro"
  horarioTrabalho: {
    dias: string[]; // Ex: ["Seg", "Ter", "Qua", "Qui", "Sex"]
    horario: string; // Ex: "09:00 - 18:00"
  };
  avatar?: string; // Iniciais ou URL da foto
  avatar_url?: string; // URL da foto do Supabase
  corAvatar?: string; // Cor de fundo do avatar
  isActive?: boolean; // Status ativo/inativo
}

interface FuncionarioCardProps {
  funcionario: Funcionario;
  onEdit: (funcionario: Funcionario) => void;
  onDelete: (id: string) => void;
  onToggleStatus?: (id: string, currentStatus: boolean) => void;
}

// ========================================
// COMPONENTE: Card de Funcionário
// ========================================
/**
 * Card que exibe informações de um funcionário.
 * Segue os princípios SOLID:
 * - Single Responsibility: Apenas renderiza as informações do funcionário
 * - Open/Closed: Aceita props para customização sem modificar o componente
 * - Dependency Inversion: Recebe callbacks para ações, não conhece a implementação
 */
export function FuncionarioCard({ funcionario, onEdit, onDelete, onToggleStatus }: FuncionarioCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fecha o menu quando clicar fora
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para obter as iniciais do nome
  const getInitials = (nome: string) => {
    if (!nome) return '??';
    const names = nome.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  // Status do funcionário (padrão: ativo se não especificado)
  const isActive = funcionario.isActive !== undefined ? funcionario.isActive : true;

  return (
    <Card className="relative hover:border-zinc-600 transition-all">

      {/* ========================================
          BADGE DE STATUS (Ativo/Inativo)
      ======================================== */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${isActive
          ? 'bg-green-500/30 text-green-400 border border-green-500/30'
          : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
          {isActive ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      {/* ========================================
          MENU KEBAB (Três pontinhos)
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
                  onEdit(funcionario);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Editar funcionário</span>
              </button>

              {/* Opção: Ativar/Desativar */}
              {onToggleStatus && (
                <button
                  onClick={() => {
                    onToggleStatus(funcionario.id, isActive);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isActive
                    ? 'text-amber-400 hover:bg-amber-500/10 hover:text-amber-300'
                    : 'text-green-400 hover:bg-green-500/10 hover:text-green-300'
                    }`}
                >
                  <Power className="h-4 w-4" />
                  <span>{isActive ? 'Desativar' : 'Ativar'}</span>
                </button>
              )}

              {/* Opção: Excluir */}
              <button
                onClick={() => {
                  onDelete(funcionario.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir conta</span>
              </button>
            </div>
          </>
        )}
      </div>

      <CardContent>
        {/* ========================================
            CABEÇALHO: Avatar e Nome
        ======================================== */}
        {/* No FuncionarioCard.tsx */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden ${funcionario.corAvatar || 'bg-indigo-500'
            } ${!isActive ? 'opacity-50' : ''}`}
        >
          {/* Verifique se o nome da propriedade vinda do banco é exatamente avatar_url */}
          {funcionario.avatar_url ? (
            <img
              src={funcionario.avatar_url}
              alt={funcionario.nome}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback caso a imagem dê erro 400 ou 404
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = getInitials(funcionario.nome);
              }}
            />
          ) : (
            getInitials(funcionario.nome)
          )}
        </div>

        {/* ========================================
            INFORMAÇÕES: Idade e Tempo de Empresa
        ======================================== */}
        {(funcionario.idade > 0 || funcionario.tempoEmpresa) && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Idade */}
            {funcionario.idade > 0 && (
              <div>
                <p className="text-xs text-zinc-500 mb-1">Idade</p>
                <p className="text-sm font-medium text-zinc-200">{funcionario.idade} anos</p>
              </div>
            )}

            {/* Tempo na empresa */}
            {funcionario.tempoEmpresa && (
              <div>
                <p className="text-xs text-zinc-500 mb-1">Na empresa há</p>
                <p className="text-sm font-medium text-zinc-200">{funcionario.tempoEmpresa}</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================
            HORÁRIOS DE TRABALHO
        ======================================== */}
        <div className="space-y-3 pt-4 border-t border-zinc-700">

          {/* Dias de trabalho */}
          {funcionario.horarioTrabalho?.dias && funcionario.horarioTrabalho.dias.length > 0 && (
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-zinc-500 mt-0.5" />
              <div>
                <p className="text-xs text-zinc-500 mb-1">Dias de trabalho</p>
                <div className="flex flex-wrap gap-1">
                  {funcionario.horarioTrabalho.dias.map((dia) => (
                    <span
                      key={dia}
                      className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded"
                    >
                      {dia}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Horário */}
          {funcionario.horarioTrabalho?.horario && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              <div>
                <p className="text-xs text-zinc-500 mb-1">Horário</p>
                <p className="text-sm font-medium text-zinc-200">
                  {funcionario.horarioTrabalho.horario}
                </p>
              </div>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}