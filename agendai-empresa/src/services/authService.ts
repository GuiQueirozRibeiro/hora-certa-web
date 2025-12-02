import { createClient } from '@/lib/supabase/client';
import type { User, UserType } from '@/types/auth';

const APP_TYPE: UserType = 'business';

export const authService = {
  /**
   * Realiza login e valida o tipo de usuário
   */
  async signIn(email: string, password: string): Promise<User> {
    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Erro ao fazer login');
    }

    const userType = authData.user.user_metadata?.user_type as UserType;
    
    if (!userType) {
      await supabase.auth.signOut();
      throw new Error('Tipo de usuário não encontrado');
    }

    if (userType === 'client') {
      await supabase.auth.signOut();
      throw new Error('Conta de cliente não pode acessar área de empresas');
    }

    return {
      id: authData.user.id,
      email: authData.user.email!,
      name: authData.user.user_metadata?.name,
      user_type: userType,
      created_at: authData.user.created_at,
    };
  },

  /**
   * Cria nova conta
   */
  async signUp(email: string, password: string, name: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: APP_TYPE,
          name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  /**
   * Faz logout
   */
  async signOut(): Promise<void> {
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

    const userType = authUser.user_metadata?.user_type as UserType;

    if (!userType || userType === 'client') {
      return null;
    }

    return {
      id: authUser.id,
      email: authUser.email!,
      name: authUser.user_metadata?.name,
      user_type: userType,
      created_at: authUser.created_at,
    };
  },
};
