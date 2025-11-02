import { useState, useEffect } from 'react';
import { supabase } from '../lib/SupabaseClient';
import type { Service } from '../types/types';

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useServices = (filters?: {
  businessId?: string;
  isActive?: boolean;
  category?: string;
}): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      console.log('🔍 [useServices] Buscando serviços...');
      setLoading(true);
      setError(null);

      let query = supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      // Aplicar filtros
      if (filters?.businessId) {
        query = query.eq('business_id', filters.businessId);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error: servicesError } = await query;

      if (servicesError) {
        throw servicesError;
      }

      console.log(`✅ [useServices] ${data?.length || 0} serviços encontrados`);
      setServices(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar serviços';
      console.error('❌ [useServices] Erro:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [filters?.businessId, filters?.isActive, filters?.category]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
};
