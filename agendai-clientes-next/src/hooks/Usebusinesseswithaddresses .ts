import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/SupabaseClient';
import type { BusinessWithAddressAndDistance } from '../types/types';
import { calculateDistance } from '../types/types';

const MAX_DISTANCE_KM = 200; // Raio máximo de 200km

interface UseBusinessesWithAddressesReturn {
  businesses: BusinessWithAddressAndDistance[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBusinessesWithAddresses = (filters?: {
  isActive?: boolean;
  businessType?: string;
  searchTerm?: string;
  userLatitude?: number | null;
  userLongitude?: number | null;
}): UseBusinessesWithAddressesReturn => {
  const [businesses, setBusinesses] = useState<BusinessWithAddressAndDistance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  const filtersRef = useRef<string>('');

  const fetchBusinessesWithAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar sessão atual do usuário
      const { data: { session } } = await supabase.auth.getSession();

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

      const { data: businessesData, error: businessesError } = await query;

      if (businessesError) {
        // Verificar se é erro de RLS
        if (businessesError.code === 'PGRST301' || businessesError.message?.includes('policy')) {
          throw new Error('As políticas de segurança (RLS) estão bloqueando o acesso. Verifique as políticas da tabela businesses no Supabase.');
        }
        
        throw new Error(businessesError.message || 'Erro ao buscar estabelecimentos');
      }

      if (!businessesData || businessesData.length === 0) {
        setBusinesses([]);
        setLoading(false);
        return;
      }

      // Buscar endereços para cada negócio (através da tabela addresses_businesses)
      const businessesWithAddresses = await Promise.all(
        businessesData.map(async (business) => {
          const { data: addressData } = await supabase
            .from('addresses_businesses')
            .select('*')
            .eq('business_id', business.id)
            .eq('is_primary', true)
            .maybeSingle();

          // Calcular distância se tivermos as coordenadas do usuário e do estabelecimento
          let distance: number | undefined = undefined;
          if (
            filters?.userLatitude != null &&
            filters?.userLongitude != null &&
            addressData?.lat != null &&
            addressData?.long != null
          ) {
            distance = calculateDistance(
              filters.userLatitude,
              filters.userLongitude,
              addressData.lat,
              addressData.long
            );
          }

          return {
            ...business,
            address: addressData || undefined,
            distance,
          };
        })
      );

      // Filtrar estabelecimentos dentro do raio de 200km e ordenar por distância
      let filteredBusinesses = businessesWithAddresses;

      if (filters?.userLatitude != null && filters?.userLongitude != null) {
        // Filtrar apenas estabelecimentos com distância definida e dentro do raio
        filteredBusinesses = businessesWithAddresses
          .filter((business) => {
            // Se não tem distância (sem coordenadas), não exibir
            if (business.distance === undefined) {
              return false;
            }
            // Se está fora do raio de 200km, não exibir
            if (business.distance > MAX_DISTANCE_KM) {
              return false;
            }
            return true;
          })
          // Ordenar por distância (mais próximos primeiro)
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }
      
      setBusinesses(filteredBusinesses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar estabelecimentos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters?.isActive, filters?.businessType, filters?.searchTerm, filters?.userLatitude, filters?.userLongitude]);

  useEffect(() => {
    const filtersKey = JSON.stringify(filters);
    const filtersChanged = filtersRef.current !== filtersKey;
    
    if (!hasFetchedRef.current || filtersChanged) {
      filtersRef.current = filtersKey;
      hasFetchedRef.current = true;
      fetchBusinessesWithAddresses();
    }
  }, [fetchBusinessesWithAddresses, filters]);

  return {
    businesses,
    loading,
    error,
    refetch: fetchBusinessesWithAddresses,
  };
};