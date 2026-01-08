import { useState, useEffect } from 'react';
import { supabase } from '../lib/SupabaseClient';
import type { Address } from '../types/types';

interface UseAddressesReturn {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAddresses = (userId?: string): UseAddressesReturn => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('addresses')
        .select('*')
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      // Se userId for fornecido, filtrar por ele
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setAddresses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar endereços');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  return {
    addresses,
    loading,
    error,
    refetch: fetchAddresses,
  };
};