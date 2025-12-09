import { useState, useEffect } from 'react';
import { supabase } from '../lib/SupabaseClient';
import type { BusinessWithAddress } from '../types/types';

interface UseBusinessesWithAddressesReturn {
  businesses: BusinessWithAddress[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBusinessesWithAddresses = (filters?: {
  isActive?: boolean;
  businessType?: string;
  searchTerm?: string;
}): UseBusinessesWithAddressesReturn => {
  const [businesses, setBusinesses] = useState<BusinessWithAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinessesWithAddresses = async () => {
    try {
      console.log('🔍 [useBusinessesWithAddresses] Iniciando busca...');
      console.log('📋 [useBusinessesWithAddresses] Filtros:', filters);
      
      setLoading(true);
      setError(null);

      // Verificar se o Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('🔑 [useBusinessesWithAddresses] Verificando credenciais:');
      console.log('  - URL existe:', !!supabaseUrl);
      console.log('  - URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NÃO CONFIGURADO');
      console.log('  - Key existe:', !!supabaseKey);
      console.log('  - Key:', supabaseKey ? supabaseKey.substring(0, 30) + '...' : 'NÃO CONFIGURADO');

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('❌ Credenciais do Supabase não configuradas! Verifique o arquivo .env');
      }

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
      console.log('  - Data length:', businessesData?.length);
      console.log('  - Data:', businessesData);

      if (businessesError) {
        console.error('❌ [useBusinessesWithAddresses] Erro do Supabase:', businessesError);
        throw businessesError;
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

      // Buscar endereços para cada negócio (através do owner_id)
      const businessesWithAddresses = await Promise.all(
        businessesData.map(async (business, index) => {
          console.log(`  📍 [${index + 1}/${businessesData.length}] Business: ${business.name}`);
          console.log(`     owner_id:`, business.owner_id);
          
          if (business.owner_id) {
            const { data: addressData, error: addressError } = await supabase
              .from('addresses')
              .select('*')
              .eq('user_id', business.owner_id)
              .eq('is_primary', true)
              .single();

            if (addressError && addressError.code !== 'PGRST116') { // PGRST116 = not found (ok)
              console.warn(`     ⚠️ Erro ao buscar endereço:`, addressError);
            } else if (addressData) {
              console.log(`     ✅ Endereço encontrado:`, addressData.street_address);
            } else {
              console.log(`     ℹ️ Sem endereço cadastrado`);
            }

            return {
              ...business,
              address: addressData || undefined,
            };
          } else {
            console.log(`     ℹ️ Sem owner_id`);
          }
          return business;
        })
      );

      console.log('✅ [useBusinessesWithAddresses] Processamento concluído!');
      console.log(`📊 [useBusinessesWithAddresses] Total: ${businessesWithAddresses.length} estabelecimentos com endereços processados`);
      
      setBusinesses(businessesWithAddresses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar estabelecimentos';
      console.error('💥 [useBusinessesWithAddresses] ERRO FATAL:', err);
      console.error('   Mensagem:', errorMessage);
      setError(errorMessage);
    } finally {
      console.log('🏁 [useBusinessesWithAddresses] Busca finalizada (loading = false)');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 [useBusinessesWithAddresses] useEffect triggered');
    console.log('   Filters changed:', filters);
    fetchBusinessesWithAddresses();
  }, [filters?.isActive, filters?.businessType, filters?.searchTerm]);

  return {
    businesses,
    loading,
    error,
    refetch: fetchBusinessesWithAddresses,
  };
};