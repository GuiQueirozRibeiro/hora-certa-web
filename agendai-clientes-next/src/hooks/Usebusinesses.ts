import { useState, useEffect } from 'react';
import { supabase } from '../lib/SupabaseClient';
import type { Business } from '../types/types';

interface UseBusinessesReturn {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBusinesses = (filters?: {
  isActive?: boolean;
  businessType?: string;
  searchTerm?: string;
}): UseBusinessesReturn => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.businessType) {
        query = query.eq('business_type', filters.businessType);
      }

      if (filters?.searchTerm) {
        query = query.ilike('name', `%${filters.searchTerm}%`);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setBusinesses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar estabelecimentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [filters?.isActive, filters?.businessType, filters?.searchTerm]);

  return {
    businesses,
    loading,
    error,
    refetch: fetchBusinesses,
  };
};