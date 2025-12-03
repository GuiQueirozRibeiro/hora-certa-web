'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { CreateProfessionalData } from '@/types/professional';

export async function createProfessionalAction(data: CreateProfessionalData) {
  console.log('--- Iniciando createProfessionalAction ---');
  
  try {
    const supabase = await createClient();
    
    // 1. Verify current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      return { success: false, error: 'Não autorizado' };
    }
    console.log('Usuário autenticado:', user.id);

    // 2. Get Business ID for this user
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (businessError || !business) {
      console.error('Erro ao buscar empresa:', businessError);
      return { success: false, error: 'Empresa não encontrada' };
    }
    console.log('Empresa encontrada:', business.id);

    // Initialize Admin Client
    let adminSupabase;
    try {
      // Debug environment variable presence
      const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
      console.log('SUPABASE_SERVICE_ROLE_KEY presente:', hasKey);
      
      if (!hasKey) {
        return { success: false, error: 'Chave de serviço não configurada no servidor' };
      }

      adminSupabase = createAdminClient();
    } catch (err: any) {
      console.error('Erro ao criar cliente admin:', err);
      return { success: false, error: 'Erro interno de configuração (Admin Client)' };
    }

    console.log('Tentando criar usuário auth para:', data.email);

    // 3. Create Auth User for Professional
    const password = data.password || Math.random().toString(36).slice(-8) + 'Aa1!';
    
    const { data: newUser, error: createUserError } = await adminSupabase.auth.admin.createUser({
      email: data.email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: data.name
      }
    });

    if (createUserError) {
      console.error('Erro ao criar usuário auth:', createUserError);
      return { success: false, error: `Erro ao criar usuário: ${createUserError.message}` };
    }

    if (!newUser.user) {
      console.error('Usuário criado mas sem dados de retorno');
      return { success: false, error: 'Falha ao criar usuário (sem retorno)' };
    }

    console.log('Usuário auth criado com sucesso:', newUser.user.id);
    console.log('Tentando inserir na tabela professionals...');

    // 4. Create Professional Record
    const { error: createProfError } = await adminSupabase
      .from('professionals')
      .insert({
        user_id: newUser.user.id,
        business_id: business.id,
        specialties: data.specialties,
        bio: data.bio,
        experience_years: data.experience_years,
        is_active: true
      });

    if (createProfError) {
      console.error('Erro ao inserir profissional:', createProfError);
      // Rollback user creation
      await adminSupabase.auth.admin.deleteUser(newUser.user.id);
      return { success: false, error: `Erro ao criar registro profissional: ${createProfError.message}` };
    }

    console.log('Profissional inserido com sucesso');
    return { success: true, userId: newUser.user.id };

  } catch (error: any) {
    console.error('Erro não tratado em createProfessionalAction:', error);
    return { success: false, error: `Erro interno: ${error.message}` };
  }
}

export async function deleteProfessionalAction(professionalId: string) {
  const supabase = await createClient();
  
  // 1. Verify current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Não autorizado');
  }

  // 2. Get Business ID for this user
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (businessError || !business) {
    throw new Error('Empresa não encontrada');
  }

  const adminSupabase = createAdminClient();

  // 3. Get Professional to find User ID
  const { data: professional, error: fetchError } = await adminSupabase
    .from('professionals')
    .select('user_id, business_id')
    .eq('id', professionalId)
    .single();

  if (fetchError || !professional) {
    throw new Error('Profissional não encontrado');
  }

  // Verify ownership
  if (professional.business_id !== business.id) {
    throw new Error('Não autorizado a excluir este profissional');
  }

  // 4. Delete Professional Record
  const { error: deleteProfError } = await adminSupabase
    .from('professionals')
    .delete()
    .eq('id', professionalId);

  if (deleteProfError) {
    throw new Error(`Erro ao excluir registro profissional: ${deleteProfError.message}`);
  }

  // 5. Delete Auth User
  // Note: This is optional, depending on whether we want to keep the user account
  if (professional.user_id) {
    const { error: deleteUserError } = await adminSupabase.auth.admin.deleteUser(professional.user_id);
    if (deleteUserError) {
      console.error('Erro ao excluir usuário auth:', deleteUserError);
      // We don't throw here because the professional record is already deleted
    }
  }

  return { success: true };
}
