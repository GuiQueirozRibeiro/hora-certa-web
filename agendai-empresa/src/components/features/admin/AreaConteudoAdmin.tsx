// src/components/features/admin/AreaConteudoAdmin.tsx
import { AbaAdminAtiva } from '@/app/administracao/page';
import { FormEmpresa } from './forms/empresa/FormEmpresa';
import { FormEndereco } from './forms/FormEndereco';
import { FormFuncionarios } from './forms/funcionarios/FormFuncionarios';
import { FormServicos } from './forms/servicos/FormServicos';
import { FormHorarios } from './forms/horarios/FormHorarios';
import { FormConfiguracoes } from './forms/FormConfiguracoes';


type AreaConteudoAdminProps = {
  abaAtiva: AbaAdminAtiva; // Estado atual da aba selecionada
}

// ========================================
// COMPONENTE DE ÁREA DE CONTEÚDO
// ========================================
/**
 * Componente responsável por renderizar o conteúdo correto
 * baseado na aba ativa selecionada no menu lateral.
 * 
 * Princípios aplicados:
 * - Single Responsibility: Apenas renderiza o componente correto
 * - Open/Closed: Fácil adicionar novas abas sem modificar a estrutura
 */
export function AreaConteudoAdmin({ abaAtiva }: AreaConteudoAdminProps) {
  // Switch para renderização condicional baseada na aba ativa
  switch (abaAtiva) {
    
    // ========================================
    // ABA: Dados da Empresa
    // ========================================
    case 'empresa':
      return <FormEmpresa />;
    
    // ========================================
    // ABA: Endereço
    // ========================================
    case 'endereco':
      return <FormEndereco />;
    
    // ========================================
    // ABA: Funcionários
    // ========================================
    case 'funcionarios':
      return <FormFuncionarios />;
    
    // ========================================
    // ABA: Serviços
    // ========================================
    case 'servicos':
      return <FormServicos />;
    
    // ========================================
    // ABA: Horários de Funcionamento
    // ========================================
    case 'horarios':
      return <FormHorarios />;
    
    // ========================================
    // ABA: Configurações Gerais
    // ========================================
    case 'configuracoes':
      return <FormConfiguracoes />;
    
    // ========================================
    // FALLBACK: Caso padrão (não deveria acontecer)
    // ========================================
    default:
      return <FormEmpresa />;
  }
}
