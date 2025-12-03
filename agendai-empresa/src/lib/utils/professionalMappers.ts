import type { ProfessionalWithUser, WorkingHours } from '@/types/professional';
import type { Funcionario } from '@/components/features/admin/professionals/FuncionarioCard';

const DAYS_MAP: Record<string, string> = {
  monday: 'Seg',
  tuesday: 'Ter',
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
  sunday: 'Dom',
};

/**
 * Single Responsibility: Conversão e mapeamento de dados
 * Open/Closed: Fácil de estender com novos mapeamentos
 */
export class ProfessionalMapper {
  /**
   * Calcula o tempo na empresa com base na data de criação
   */
  static calculateTimeInCompany(createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    
    if (years === 0 && months === 0) return 'Menos de 1 mês';
    if (years === 0) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    if (months === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }

  /**
   * Extrai dias de trabalho do working_hours
   */
  static extractWorkingDays(workingHours?: WorkingHours): string[] {
    if (!workingHours) return [];
    
    return Object.entries(workingHours)
      .filter(([_, config]) => config.enabled)
      .map(([day, _]) => DAYS_MAP[day] || day);
  }

  /**
   * Extrai horário de trabalho representativo
   */
  static extractWorkingSchedule(workingHours?: WorkingHours): string {
    if (!workingHours) return 'A definir';
    
    const firstEnabled = Object.values(workingHours).find(config => config.enabled);
    if (!firstEnabled) return 'A definir';
    
    return `${firstEnabled.start} - ${firstEnabled.end}`;
  }

  /**
   * Converte ProfessionalWithUser para Funcionario
   */
  static toFuncionario(professional: ProfessionalWithUser): Funcionario {
    const nome = professional.user?.name || 
                 professional.user?.email?.split('@')[0] || 
                 'Sem nome';
    
    return {
      id: professional.id,
      nome,
      idade: 0, // Campo não disponível no schema
      tempoEmpresa: this.calculateTimeInCompany(professional.created_at),
      tipo: professional.specialties?.[0] || 'Profissional',
      horarioTrabalho: {
        dias: this.extractWorkingDays(professional.working_hours),
        horario: this.extractWorkingSchedule(professional.working_hours),
      },
      avatar: '',
      corAvatar: 'bg-indigo-500',
      isActive: professional.is_active,
    };
  }

  /**
   * Converte lista de profissionais
   */
  static toFuncionarioList(professionals: ProfessionalWithUser[]): Funcionario[] {
    return professionals.map(p => this.toFuncionario(p));
  }
}
