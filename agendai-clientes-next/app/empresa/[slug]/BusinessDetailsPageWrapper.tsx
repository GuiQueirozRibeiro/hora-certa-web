'use client';

import { useEffect, useState } from 'react';
import { BusinessDetailsPage } from '../../../src/features/business/BusinessDetailsPage';
import { supabase } from '../../../src/lib/SupabaseClient';
import { slugify } from '../../../src/lib/slugify';

interface BusinessDetailsPageWrapperProps {
  slug: string;
}

export function BusinessDetailsPageWrapper({ slug }: BusinessDetailsPageWrapperProps) {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchBusinessId() {
      try {
        setLoading(true);
        
        console.log('Slug recebido:', slug);
        
        // Busca todas as empresas ativas
        const { data: businesses, error: supabaseError } = await supabase
          .from('businesses')
          .select('id, name')
          .eq('is_active', true);
        
        console.log('Empresas encontradas:', businesses?.length);
        
        if (supabaseError) {
          console.error('Erro ao buscar empresas:', supabaseError);
          setError(true);
          return;
        }
        
        // Encontra a empresa cujo nome slugificado corresponde ao slug da URL
        const matchedBusiness = businesses?.find(business => {
          const businessSlug = slugify(business.name);
          console.log('Comparando:', businessSlug, 'com', slug);
          return businessSlug === slug;
        });
        
        if (matchedBusiness) {
          console.log('Empresa encontrada:', matchedBusiness.id);
          setBusinessId(matchedBusiness.id);
        } else {
          console.error('Nenhuma empresa encontrada com slug:', slug);
          setError(true);
        }
      } catch (err) {
        console.error('Erro:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBusinessId();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !businessId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">404</h1>
          <p className="text-gray-600">Empresa não encontrada</p>
        </div>
      </div>
    );
  }

  return <BusinessDetailsPage businessId={businessId} />;
}
