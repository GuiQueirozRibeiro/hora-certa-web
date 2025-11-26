// src/components/features/admin/forms/FormServicos.tsx
'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { ServicoCard, Servico } from '../ServicoCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

// ========================================
// DADOS MOCK (Temporário - substituir por API)
// ========================================
const servicosMock: Servico[] = [
  {
    id: '1',
    nome: 'Corte Masculino',
    descricao: 'Corte de cabelo masculino tradicional com acabamento profissional',
    duracao: 30,
    preco: 35.00,
    categoria: 'Corte',
    profissionais: ['Rafael Pereira', 'Miguel Silva'],
    ativo: true
  },
  {
    id: '2',
    nome: 'Barba Completa',
    descricao: 'Aparar, modelar e finalizar a barba com toalha quente',
    duracao: 45,
    preco: 40.00,
    categoria: 'Barba',
    profissionais: ['Rafael Pereira'],
    ativo: true
  },
  {
    id: '3',
    nome: 'Corte + Barba',
    descricao: 'Combo completo de corte de cabelo e barba com desconto especial',
    duracao: 60,
    preco: 65.00,
    categoria: 'Combo',
    profissionais: ['Rafael Pereira', 'Miguel Silva'],
    ativo: true
  },
  {
    id: '4',
    nome: 'Coloração',
    descricao: 'Coloração profissional de cabelo com produtos de qualidade',
    duracao: 90,
    preco: 120.00,
    categoria: 'Coloração',
    profissionais: ['Miguel Silva'],
    ativo: true
  },
  {
    id: '5',
    nome: 'Tratamento Capilar',
    descricao: 'Hidratação profunda e tratamento para cabelos danificados',
    duracao: 45,
    preco: 80.00,
    categoria: 'Tratamento',
    profissionais: ['João Souza'],
    ativo: false
  },
  {
    id: '6',
    nome: 'Corte Infantil',
    descricao: 'Corte de cabelo para crianças até 12 anos',
    duracao: 25,
    preco: 25.00,
    categoria: 'Corte',
    profissionais: ['Rafael Pereira', 'Miguel Silva', 'João Souza'],
    ativo: true
  }
];

// ========================================
// COMPONENTE: Formulário de Serviços
// ========================================
/**
 * Componente para gerenciar serviços oferecidos.
 * Segue Clean Code e SOLID:
 * - Single Responsibility: Gerencia apenas a lista de serviços
 * - Separation of Concerns: Card de serviço é um componente separado
 */
export function FormServicos() {
  // ========================================
  // ESTADO
  // ========================================
  const [servicos, setServicos] = useState<Servico[]>(servicosMock);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [modalExcluir, setModalExcluir] = useState(false);
  const [servicoParaExcluir, setServicoParaExcluir] = useState<string | null>(null);

  // ========================================
  // HANDLERS
  // ========================================
  
  /**
   * Abre modal/formulário para adicionar novo serviço
   * TODO: Implementar modal de cadastro
   */
  const handleAddServico = () => {
    console.log('Adicionar novo serviço');
    // TODO: Abrir modal de cadastro
  };

  /**
   * Abre modal/formulário para editar serviço existente
   * TODO: Implementar modal de edição
   */
  const handleEditServico = (servico: Servico) => {
    console.log('Editar serviço:', servico);
    // TODO: Abrir modal de edição com dados pré-preenchidos
  };

  /**
   * Abre modal de confirmação para excluir serviço
   */
  const handleDeleteServico = (id: string) => {
    setServicoParaExcluir(id);
    setModalExcluir(true);
  };

  /**
   * Confirma exclusão do serviço
   */
  const confirmarExclusao = () => {
    if (servicoParaExcluir) {
      setServicos(servicos.filter(s => s.id !== servicoParaExcluir));
      setServicoParaExcluir(null);
      // TODO: Chamar API para deletar
    }
  };

  // ========================================
  // FILTROS
  // ========================================
  
  // Obter categorias únicas
  const categorias = ['todas', ...Array.from(new Set(servicos.map(s => s.categoria)))];

  // Aplicar filtros
  const servicosFiltrados = servicos.filter(servico => {
    // Filtro de busca
    const matchBusca = servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       servico.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de categoria
    const matchCategoria = filtroCategoria === 'todas' || servico.categoria === filtroCategoria;
    
    // Filtro de status
    const matchStatus = filtroStatus === 'todos' || 
                       (filtroStatus === 'ativos' && servico.ativo) ||
                       (filtroStatus === 'inativos' && !servico.ativo);
    
    return matchBusca && matchCategoria && matchStatus;
  });

  // Estatísticas
  const totalServicos = servicos.length;
  const servicosAtivos = servicos.filter(s => s.ativo).length;
  const servicosInativos = servicos.filter(s => !s.ativo).length;

  // ========================================
  // RENDER
  // ========================================
  return (
    <div>
      {/* ========================================
          CABEÇALHO COM ESTATÍSTICAS
      ======================================== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">
            Catálogo de Serviços
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-400">
              {totalServicos} serviço{totalServicos !== 1 ? 's' : ''} cadastrado{totalServicos !== 1 ? 's' : ''}
            </span>
            <span className="text-green-400">
              {servicosAtivos} ativo{servicosAtivos !== 1 ? 's' : ''}
            </span>
            <span className="text-red-400">
              {servicosInativos} inativo{servicosInativos !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Botão Adicionar */}
        <Button
          onClick={handleAddServico}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Serviço</span>
        </Button>
      </div>

      {/* ========================================
          BARRA DE BUSCA E FILTROS
      ======================================== */}
      <div className="space-y-4 mb-6">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span className="text-sm text-zinc-400">Filtrar por:</span>
          </div>

          {/* Filtro Categoria */}
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className=" px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'todas' ? 'Todas as categorias' : cat}
              </option>
            ))}
          </select>

          {/* Filtro Status */}
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="todos">Todos os status</option>
            <option value="ativos">Apenas ativos</option>
            <option value="inativos">Apenas inativos</option>
          </select>

          {/* Contador de filtros ativos */}
          {(filtroCategoria !== 'todas' || filtroStatus !== 'todos' || searchTerm) && (
            <button
              onClick={() => {
                setFiltroCategoria('todas');
                setFiltroStatus('todos');
                setSearchTerm('');
              }}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* ========================================
          GRID DE SERVIÇOS
      ======================================== */}
      {servicosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicosFiltrados.map((servico) => (
            <ServicoCard
              key={servico.id}
              servico={servico}
              onEdit={handleEditServico}
              onDelete={handleDeleteServico}
            />
          ))}
        </div>
      ) : (
        // Mensagem quando não há resultados
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-12 text-center">
          <p className="text-zinc-500 mb-2">
            {searchTerm || filtroCategoria !== 'todas' || filtroStatus !== 'todos'
              ? 'Nenhum serviço encontrado com os filtros aplicados'
              : 'Nenhum serviço cadastrado'}
          </p>
          <p className="text-sm text-zinc-600">
            {searchTerm || filtroCategoria !== 'todas' || filtroStatus !== 'todos'
              ? 'Tente ajustar os filtros de busca'
              : 'Clique em "Adicionar Serviço" para começar'}
          </p>
        </div>
      )}

      {/* ========================================
          MODAL DE CONFIRMAÇÃO
      ======================================== */}
      <Modal
        isOpen={modalExcluir}
        onClose={() => {
          setModalExcluir(false);
          setServicoParaExcluir(null);
        }}
        onConfirm={confirmarExclusao}
        title="Excluir serviço"
        description="Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita e afetará os agendamentos futuros."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
      >
        {servicoParaExcluir && (() => {
          const servico = servicos.find(s => s.id === servicoParaExcluir);
          return servico ? (
            <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
              <p className="text-sm text-zinc-200 font-medium mb-1">{servico.nome}</p>
              <p className="text-xs text-zinc-500">
                {servico.categoria} • R$ {servico.preco.toFixed(2)}
              </p>
            </div>
          ) : null;
        })()}
      </Modal>
    </div>
  );
}

