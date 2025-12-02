import { createClient } from '@/lib/supabase/client';
import type { User, UserType } from '@/types/auth';

const APP_TYPE: UserType = 'business'; // Define o tipo deste app

export const authService = {
  /**
   * Realiza login e valida o tipo de usuário
   */
  async signIn(email: string, password: string) {
    console.log('🟢 [authService] signIn iniciado', { email });
    const supabase = createClient();

    // 1. Faz login no Supabase Auth
    console.log('📤 [authService] Chamando supabase.auth.signInWithPassword...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('❌ [authService] Erro no signInWithPassword:', authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      console.error('❌ [authService] authData.user é null');
      throw new Error('Erro ao fazer login');
    }

    console.log('✅ [authService] Login no Auth bem-sucedido, user.id:', authData.user.id);
    console.log('📋 [authService] User metadata:', authData.user.user_metadata);

    // 2. Primeiro tenta pegar do metadata (mais rápido e confiável)
    const userTypeFromMeta = authData.user.user_metadata?.user_type;
    
    if (userTypeFromMeta) {
      console.log('✅ [authService] user_type encontrado no metadata:', userTypeFromMeta);
      
      // Valida o tipo
      if (userTypeFromMeta === 'client') {
        console.warn('⚠️ [authService] Usuário é cliente, não pode acessar');
        await supabase.auth.signOut();
        throw new Error('Conta de cliente não pode acessar área de empresas');
      }

      // Retorna dados do auth + metadata
      const userData: User = {
        id: authData.user.id,
        email: authData.user.email!,
        name: authData.user.user_metadata?.name,
        user_type: userTypeFromMeta as UserType,
        created_at: authData.user.created_at,
      };

      console.log('✅ [authService] signIn concluído com sucesso (via metadata)');
      return userData;
    }

    // 3. Se não tem metadata, tenta buscar da tabela (fallback)
    console.log('⚠️ [authService] Metadata não disponível, buscando da tabela...');
    console.log('📤 [authService] Buscando usuário na tabela public.users...');
    
    try {
      const { data: userData, error: userError } = await Promise.race([
        supabase
          .from('users')
          .select('id, email, user_type, created_at')
          .eq('id', authData.user.id)
          .single(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na consulta')), 5000)
        )
      ]) as any;

      if (userError) {
        console.error('❌ [authService] Erro ao buscar usuário:', userError);
        await supabase.auth.signOut();
        throw new Error('Erro ao buscar dados do usuário');
      }

      if (!userData) {
        console.error('❌ [authService] userData é null');
        await supabase.auth.signOut();
        throw new Error('Dados do usuário não encontrados');
      }

      console.log('✅ [authService] Usuário encontrado na tabela:', userData);

      // Valida tipo
      if (userData.user_type === 'client') {
        console.warn('⚠️ [authService] Usuário é cliente, não pode acessar');
        await supabase.auth.signOut();
        throw new Error('Conta de cliente não pode acessar área de empresas');
      }

      console.log('✅ [authService] signIn concluído com sucesso (via tabela)');
      return userData as User;
      
    } catch (err: any) {
      console.error('❌ [authService] Timeout ou erro na busca:', err);
      await supabase.auth.signOut();
      throw new Error('Tempo esgotado ao buscar dados do usuário. Tente novamente.');
    }

    // 3. Valida se o tipo de usuário pode acessar este app
    if (userData.user_type === 'client') {
      console.warn('⚠️ [authService] Usuário é cliente, não pode acessar');
      await supabase.auth.signOut();
      throw new Error('Conta de cliente não pode acessar área de empresas');
    }

    console.log('✅ [authService] signIn concluído com sucesso');
    return userData as User;
  },

  /**
   * Cria nova conta enviando metadata
   * O Trigger do banco cria automaticamente o registro em public.users
   */
  async signUp(email: string, password: string, name: string, userType: UserType = APP_TYPE) {
    console.log('🟢 [authService] signUp iniciado', { email, name, userType });
    const supabase = createClient();

    // Cria usuário no Supabase Auth com metadata
    // O Trigger do banco vai criar o registro em public.users automaticamente
    console.log('📤 [authService] Chamando supabase.auth.signUp...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          name: name,
        },
      },
    });

    if (authError) {
      console.error('❌ [authService] Erro no signUp:', authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      console.error('❌ [authService] authData.user é null');
      throw new Error('Erro ao criar conta');
    }

    console.log('✅ [authService] Usuário criado no Auth:', authData.user.id);
    console.log('⏳ [authService] Aguardando 2 segundos para trigger processar...');
    
    // Aguarda o trigger processar (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ [authService] signUp concluído');
    return authData.user;
  },

  /**
   * Faz logout
   */
  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Busca dados do usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    const supabase = createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    // Tenta primeiro pegar do metadata
    const userTypeFromMeta = authUser.user_metadata?.user_type;
    const nameFromMeta = authUser.user_metadata?.name;

    if (userTypeFromMeta) {
      if (userTypeFromMeta === 'client') {
        await this.signOut();
        return null;
      }

      return {
        id: authUser.id,
        email: authUser.email!,
        name: nameFromMeta,
        user_type: userTypeFromMeta as UserType,
        created_at: authUser.created_at,
      };
    }

    // Fallback: busca da tabela
    const { data: userData, error } = await supabase
      .from('users')
      .select('id, email, user_type, created_at')
      .eq('id', authUser.id)
      .single();

    if (error || !userData) {
      return null;
    }

    // Valida tipo de usuário
    if (userData.user_type === 'client') {
      await this.signOut();
      return null;
    }

    return {
      ...userData,
      name: nameFromMeta,
    } as User;
  },
};
