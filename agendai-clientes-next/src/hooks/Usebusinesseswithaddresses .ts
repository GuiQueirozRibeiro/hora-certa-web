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
      console.log('🔍 [useBusinessesWithAddresses] Iniciando busca...');
      console.log('📋 [useBusinessesWithAddresses] Filtros:', filters);
      console.log('🔑 [useBusinessesWithAddresses] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('🔑 [useBusinessesWithAddresses] Supabase client existe:', !!supabase);
      
      setLoading(true);
      setError(null);

      // Verificar sessão atual do usuário
      const { data: { session } } = await supabase.auth.getSession();
      console.log('👤 [useBusinessesWithAddresses] Usuário autenticado:', !!session?.user);
      console.log('👤 [useBusinessesWithAddresses] User ID:', session?.user?.id);

      let query = supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('🔨 [useBusinessesWithAddresses] Query base criada');

      // Aplicar filtros
      if (filters?.isActive !== undefined) {
        console.log('🔍 [useBusinessesWithAddresses] Aplicando filtro isActive:', filters.isActive);
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.businessType) {
        console.log('🔍 [useBusinessesWithAddresses] Aplicando filtro businessType:', filters.businessType);
        query = query.eq('business_type', filters.businessType);
      }

      if (filters?.searchTerm) {
        console.log('🔍 [useBusinessesWithAddresses] Aplicando filtro searchTerm:', filters.searchTerm);
        query = query.ilike('name', `%${filters.searchTerm}%`);
      }

      console.log('📡 [useBusinessesWithAddresses] Executando query no Supabase...');
      const { data: businessesData, error: businessesError } = await query;

      console.log('✅ [useBusinessesWithAddresses] Resposta recebida:');
      console.log('  - Error:', businessesError);
      console.log('  - Error details:', JSON.stringify(businessesError, null, 2));
      console.log('  - Data length:', businessesData?.length);
      console.log('  - Data:', businessesData);

      if (businessesError) {
        console.error('❌ [useBusinessesWithAddresses] Erro do Supabase:', businessesError);
        console.error('❌ Código do erro:', businessesError.code);
        console.error('❌ Mensagem do erro:', businessesError.message);
        console.error('❌ Detalhes do erro:', businessesError.details);
        console.error('❌ Hint do erro:', businessesError.hint);
        
        // Verificar se é erro de RLS
        if (businessesError.code === 'PGRST301' || businessesError.message?.includes('policy')) {
          throw new Error('As políticas de segurança (RLS) estão bloqueando o acesso. Verifique as políticas da tabela businesses no Supabase.');
        }
        
        throw new Error(businessesError.message || 'Erro ao buscar estabelecimentos');
      }

      if (!businessesData || businessesData.length === 0) {
        console.warn('⚠️ [useBusinessesWithAddresses] Nenhum estabelecimento encontrado!');
        console.warn('   Verifique:');
        console.warn('   1. Se há dados na tabela "businesses"');
        console.warn('   2. Se is_active=true nos registros');
        console.warn('   3. Se as Row Level Security (RLS) policies permitem leitura');
        setBusinesses([]);
        setLoading(false);
        return;
      }

      console.log(`📦 [useBusinessesWithAddresses] ${businessesData.length} estabelecimentos encontrados`);
      console.log('🔗 [useBusinessesWithAddresses] Buscando endereços...');

      // Buscar endereços para cada negócio (através da tabela addresses_businesses)
      const businessesWithAddresses = await Promise.all(
        businessesData.map(async (business, index) => {
          console.log(`  📍 [${index + 1}/${businessesData.length}] Business: ${business.name}`);
          console.log(`     business_id:`, business.id);
          
          const { data: addressData, error: addressError } = await supabase
            .from('addresses_businesses')
            .select('*')
            .eq('business_id', business.id)
            .eq('is_primary', true)
            .maybeSingle(); // Usa maybeSingle em vez de single para evitar erro 406

          if (addressError) {
            console.warn(`     ⚠️ Erro ao buscar endereço:`, addressError);
          } else if (addressData) {
            console.log(`     ✅ Endereço encontrado:`, addressData.street_address);
            console.log(`     📍 Lat/Long:`, addressData.lat, addressData.long);
          } else {
            console.log(`     ℹ️ Sem endereço cadastrado`);
          }

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
            console.log(`     📏 Distância: ${distance.toFixed(2)} km`);
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
              console.log(`     ⚠️ ${business.name}: Sem coordenadas, não será exibido`);
              return false;
            }
            // Se está fora do raio de 200km, não exibir
            if (business.distance > MAX_DISTANCE_KM) {
              console.log(`     ⚠️ ${business.name}: Fora do raio (${business.distance.toFixed(2)} km), não será exibido`);
              return false;
            }
            return true;
          })
          // Ordenar por distância (mais próximos primeiro)
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        console.log(`📊 [useBusinessesWithAddresses] Filtrados: ${filteredBusinesses.length} de ${businessesWithAddresses.length} estabelecimentos dentro do raio de ${MAX_DISTANCE_KM}km`);
      }

      console.log('✅ [useBusinessesWithAddresses] Processamento concluído!');
      console.log(`📊 [useBusinessesWithAddresses] Total: ${filteredBusinesses.length} estabelecimentos com endereços processados`);
      
      setBusinesses(filteredBusinesses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar estabelecimentos';
      console.error('💥 [useBusinessesWithAddresses] ERRO FATAL:', err);
      console.error('   Mensagem:', errorMessage);
      setError(errorMessage);
    } finally {
      console.log('🏁 [useBusinessesWithAddresses] Busca finalizada (loading = false)');
      setLoading(false);
    }
  }, [filters?.isActive, filters?.businessType, filters?.searchTerm, filters?.userLatitude, filters?.userLongitude]);

  useEffect(() => {
    const filtersKey = JSON.stringify(filters);
    const filtersChanged = filtersRef.current !== filtersKey;
    
    if (!hasFetchedRef.current || filtersChanged) {
      console.log('🔄 [useBusinessesWithAddresses] Fetching - primeira vez ou filtros mudaram');
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