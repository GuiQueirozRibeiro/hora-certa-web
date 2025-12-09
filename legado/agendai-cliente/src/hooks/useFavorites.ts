import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/SupabaseClient';
import { useAuth } from './useAuth';
import type { Favorite } from '../types/types';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setFavorites(data || []);
    } catch (err) {
      console.error('Erro ao buscar favoritos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar favoritos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorited = (businessId: string) => {
    return favorites.some(f => f.business_id === businessId);
  };

  const addFavorite = async (businessId: string) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, business_id: businessId })
        .select();

      if (insertError) throw insertError;

      // Atualiza lista
      await fetchFavorites();

      return { success: true, data };
    } catch (err) {
      console.error('Erro ao adicionar favorito:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro' };
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteIdOrBusinessId: string, byBusinessId = false) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('favorites').delete();

      if (byBusinessId) {
        query = query.eq('business_id', favoriteIdOrBusinessId).eq('user_id', user.id);
      } else {
        query = query.eq('id', favoriteIdOrBusinessId).eq('user_id', user.id);
      }

      const { error: deleteError } = await query;

      if (deleteError) throw deleteError;

      await fetchFavorites();

      return { success: true };
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro' };
    } finally {
      setLoading(false);
    }
  };

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    isFavorited,
    addFavorite,
    removeFavorite,
  };
};
