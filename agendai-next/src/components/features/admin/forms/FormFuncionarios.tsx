// src/components/features/admin/forms/FormFuncionarios.tsx
'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { FuncionarioCard, Funcionario } from '../FuncionarioCard';
import { Button } from '@/components/ui/Button';

// ========================================
// DADOS MOCK (Temporário - substituir por API)
// ========================================
const funcionariosMock: Funcionario[] = [
  {
    id: '1',
    nome: 'Rafael Pereira',
    idade: 28,
    tempoEmpresa: '2 anos e 3 meses',
    tipo: 'Barbeiro',
    horarioTrabalho: {
      dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
      horario: '09:00 - 18:00'
    },
    avatar: 'RP',
    corAvatar: 'bg-indigo-500'
  },
  {
    id: '2',
    nome: 'Miguel Silva',
    idade: 32,
    tempoEmpresa: '4 anos',
    tipo: 'Cabeleireiro',
    horarioTrabalho: {
      dias: ['Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      horario: '10:00 - 19:00'
    },
    avatar: 'MS',
    corAvatar: 'bg-emerald-500'
  },
  {
    id: '3',
    nome: 'João Souza',
    idade: 25,
    tempoEmpresa: '1 ano e 6 meses',
    tipo: 'Esteticista',
    horarioTrabalho: {
      dias: ['Seg', 'Qua', 'Sex'],
      horario: '08:00 - 17:00'
    },
    avatar: 'JS',
    corAvatar: 'bg-purple-500'
  }
];

// ========================================
// COMPONENTE: Formulário de Funcionários
// ========================================
/**
 * Componente para gerenciar funcionários.
 * Segue Clean Code e SOLID:
 * - Single Responsibility: Gerencia apenas a lista de funcionários
 * - Separation of Concerns: Card de funcionário é um componente separado
 */
export function FormFuncionarios() {
  // ========================================
  // ESTADO
  // ========================================
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(funcionariosMock);
  const [searchTerm, setSearchTerm] = useState('');

  // ========================================
  // HANDLERS
  // ========================================
  
  /**
   * Abre modal/formulário para adicionar novo funcionário
   * TODO: Implementar modal de cadastro
   */
  const handleAddFuncionario = () => {
    console.log('Adicionar novo funcionário');
    // TODO: Abrir modal de cadastro
  };

  /**
   * Abre modal/formulário para editar funcionário existente
   * TODO: Implementar modal de edição
   */
  const handleEditFuncionario = (funcionario: Funcionario) => {
    console.log('Editar funcionário:', funcionario);
    // TODO: Abrir modal de edição com dados pré-preenchidos
  };

  /**
   * Remove funcionário após confirmação
   * TODO: Adicionar modal de confirmação
   */
  const handleDeleteFuncionario = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      setFuncionarios(funcionarios.filter(f => f.id !== id));
      // TODO: Chamar API para deletar
    }
  };

  // ========================================
  // FILTRO DE BUSCA
  // ========================================
  const funcionariosFiltrados = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========================================
  // RENDER
  // ========================================
  return (
    <div>
      {/* ========================================
          CABEÇALHO
      ======================================== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 mb-1">
            Gerenciar Funcionários
          </h2>
          <p className="text-sm text-zinc-400">
            {funcionarios.length} profissiona{funcionarios.length === 1 ? 'l' : 'is'} cadastrado{funcionarios.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Botão Adicionar */}
        <Button
          onClick={handleAddFuncionario}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Funcionário</span>
        </Button>
      </div>

      {/* ========================================
          BARRA DE BUSCA
      ======================================== */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* ========================================
          GRID DE FUNCIONÁRIOS
      ======================================== */}
      {funcionariosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funcionariosFiltrados.map((funcionario) => (
            <FuncionarioCard
              key={funcionario.id}
              funcionario={funcionario}
              onEdit={handleEditFuncionario}
              onDelete={handleDeleteFuncionario}
            />
          ))}
        </div>
      ) : (
        // Mensagem quando não há resultados
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-12 text-center">
          <p className="text-zinc-500 mb-2">
            {searchTerm ? 'Nenhum funcionário encontrado' : 'Nenhum funcionário cadastrado'}
          </p>
          <p className="text-sm text-zinc-600">
            {searchTerm 
              ? 'Tente buscar com outros termos' 
              : 'Clique em "Adicionar Funcionário" para começar'}
          </p>
        </div>
      )}
    </div>
  );
}
