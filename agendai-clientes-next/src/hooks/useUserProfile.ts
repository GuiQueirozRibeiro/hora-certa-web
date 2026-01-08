import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/SupabaseClient';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  birth_date: string | null;
  gender: string | null;
  image_url: string | null;
  user_type: string;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setProfile(data);
    } catch (err) {
      setError('Não foi possível carregar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const userChanged = userIdRef.current !== user?.id;
    
    if (user && (!hasFetchedRef.current || userChanged)) {
      userIdRef.current = user.id;
      hasFetchedRef.current = true;
      refreshProfile();
    } else if (!user) {
      hasFetchedRef.current = false;
      userIdRef.current = null;
    }
  }, [refreshProfile, user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado.' };
    }

    try {
      setLoading(true);
      setError(null);

      // Remove campos que não devem ser atualizados diretamente
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, user_type, ...updateData } = data;

      // Converte strings vazias em null para campos opcionais
      const cleanedData = Object.entries(updateData).reduce((acc, [key, value]) => {
        acc[key] = value === '' ? null : value;
        return acc;
      }, {} as Record<string, unknown>);

      const { error: updateError } = await supabase
        .from('users')
        .update({
          ...cleanedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select();

      if (updateError) {
        throw updateError;
      }

      // Atualizar o estado local
      await refreshProfile();

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Não foi possível atualizar os dados.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };
};
