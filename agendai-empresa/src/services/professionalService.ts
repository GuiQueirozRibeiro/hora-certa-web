import { createClient } from '@/lib/supabase/client';
import type { Professional, ProfessionalWithUser, CreateProfessionalData, UpdateProfessionalData, WorkingHours } from '@/types/professional';

/**
 * Converte working_hours de objeto para array (formato do banco)
 */
function workingHoursToArray(hours?: WorkingHours): any[] {
  if (!hours || typeof hours !== 'object') return [];
  
  return Object.entries(hours).map(([day, schedule]) => ({
    day,
    enabled: schedule.enabled,
    start: schedule.start,
    end: schedule.end,
  }));
}

/**
 * Converte working_hours de array (banco) para objeto
 */
function workingHoursFromArray(hours?: any[]): WorkingHours {
  if (!Array.isArray(hours) || hours.length === 0) {
    return {};
  }
  
  const result: WorkingHours = {};
  for (const item of hours) {
    if (item.day) {
      result[item.day] = {
        enabled: item.enabled ?? false,
        start: item.start ?? '09:00',
        end: item.end ?? '18:00',
      };
    }
  }
  return result;
}

/**
 * Mapeia erros do Supabase Auth para mensagens amigáveis
 */
function mapAuthError(error: any): string {
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code || '';
  
  // Erro de email já registrado
  if (message.includes('user already registered') || 
      message.includes('email already') ||
      code === 'user_already_exists') {
    return 'Este email já está cadastrado no sistema. Use outro email.';
  }
  
  // Erro de senha fraca
  if (message.includes('password') && (message.includes('weak') || message.includes('short'))) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }
  
  // Erro de email inválido
  if (message.includes('invalid') && message.includes('email')) {
    return 'O formato do email é inválido.';
  }
  
  // Rate limiting
  if (message.includes('rate') || message.includes('too many') || code === 'over_request_rate_limit') {
    return 'Muitas tentativas. Aguarde alguns segundos e tente novamente.';
  }
  
  // Signup desabilitado
  if (message.includes('signups not allowed') || message.includes('signup is disabled')) {
    return 'O cadastro de novos usuários está desabilitado no sistema.';
  }
  
  // Erro genérico
  return error?.message || 'Erro desconhecido ao criar conta.';
}

export const professionalService = {
  /**
   * Cria um novo profissional
   */
  async createProfessional(data: CreateProfessionalData): Promise<Professional> {
    const supabase = createClient();

    // Validações básicas antes de enviar
    if (!data.email?.trim()) {
      throw new Error('Email é obrigatório');
    }
    if (!data.password?.trim() || data.password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }
    if (!data.name?.trim()) {
      throw new Error('Nome é obrigatório');
    }

    // 1. Criar conta de autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email.trim(),
      password: data.password,
      options: {
        data: {
          user_type: 'professional',
          name: data.name.trim(),
        },
      },
    });

    if (authError) {
      throw new Error(mapAuthError(authError));
    }

    if (!authData.user) {
      throw new Error('Não foi possível criar o usuário. Verifique se o email já está em uso.');
    }

    // Verificar se o usuário foi criado com identidades (email não duplicado)
    if (authData.user.identities && authData.user.identities.length === 0) {
      throw new Error('Este email já está cadastrado no sistema. Use outro email.');
    }

    // 2. Aguardar trigger criar registro na tabela users
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Criar registro na tabela professionals
    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .insert({
        user_id: authData.user.id,
        business_id: data.business_id,
        specialties: data.specialties || [],
        bio: data.bio,
        experience_years: data.experience_years,
        working_hours: workingHoursToArray(data.working_hours),
        is_active: true,
      })
      .select()
      .single();

    if (professionalError) {
      throw new Error(`Erro ao criar profissional: ${professionalError.message}`);
    }

    return professional;
  },

  /**
   * Busca todos os profissionais de uma empresa com dados do usuário
   */
  async getProfessionalsByBusinessId(businessId: string): Promise<ProfessionalWithUser[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('professionals')
      .select(`
        *,
        user:users!professionals_user_id_fkey (
          id,
          email,
          name
        )
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar profissionais: ${error.message}`);
    }

    // Transformar para tipo correto
    return (data || []).map((item: any) => ({
      ...item,
      user: Array.isArray(item.user) ? item.user[0] : item.user,
      working_hours: workingHoursFromArray(item.working_hours),
    })) as ProfessionalWithUser[];
  },

  /**
   * Busca um profissional por ID com dados do usuário
   */
  async getProfessionalById(professionalId: string): Promise<ProfessionalWithUser> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('professionals')
      .select(`
        *,
        user:users!professionals_user_id_fkey (
          id,
          email,
          name
        )
      `)
      .eq('id', professionalId)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar profissional: ${error.message}`);
    }

    // Transformar para tipo correto
    const professional: any = {
      ...data,
      user: Array.isArray(data.user) ? data.user[0] : data.user,
      working_hours: workingHoursFromArray(data.working_hours),
    };

    return professional as ProfessionalWithUser;
  },

  /**
   * Atualiza um profissional
   */
  async updateProfessional(professionalId: string, data: UpdateProfessionalData): Promise<ProfessionalWithUser> {
    const supabase = createClient();

    // Preparar dados com validação
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Garantir que specialties seja sempre um array
    if ('specialties' in data) {
      updateData.specialties = Array.isArray(data.specialties) ? data.specialties : [];
    }

    // Adicionar outros campos opcionais
    if ('bio' in data) {
      updateData.bio = data.bio;
    }
    if ('experience_years' in data) {
      updateData.experience_years = data.experience_years;
    }
    if ('is_active' in data) {
      updateData.is_active = data.is_active;
    }
    if ('working_hours' in data) {
      updateData.working_hours = workingHoursToArray(data.working_hours);
    }

    const { data: updatedProfessional, error } = await supabase
      .from('professionals')
      .update(updateData)
      .eq('id', professionalId)
      .select(`
        *,
        user:users!professionals_user_id_fkey (
          id,
          email,
          name
        )
      `)
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar profissional: ${error.message}`);
    }

    // Transformar para tipo correto
    const professional: any = {
      ...updatedProfessional,
      user: Array.isArray(updatedProfessional.user) ? updatedProfessional.user[0] : updatedProfessional.user,
      working_hours: workingHoursFromArray(updatedProfessional.working_hours),
    };

    return professional as ProfessionalWithUser;
  },

  /**
   * Deleta um profissional
   */
  async deleteProfessional(professionalId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', professionalId);

    if (error) {
      throw new Error(`Erro ao deletar profissional: ${error.message}`);
    }
  },

  /**
   * Alterna o status ativo/inativo de um profissional
   */
  async toggleProfessionalStatus(professionalId: string, isActive: boolean): Promise<ProfessionalWithUser> {
    return this.updateProfessional(professionalId, { is_active: isActive });
  },

  /**
   * Atualiza o nome do profissional na tabela users
   */
  async updateProfessionalName(userId: string, name: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', userId);

    if (error) {
      throw new Error(`Erro ao atualizar nome: ${error.message}`);
    }
  },
};