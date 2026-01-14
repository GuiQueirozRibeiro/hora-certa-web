import { useState, useEffect } from 'react';
import { supabase } from '../lib/SupabaseClient';

export interface Professional {
  id: string;
  user_id: string | null;
  business_id: string | null;
  specialties: string[] | null;
  bio: string | null;
  experience_years: number | null;
  is_active: boolean;
  average_rating: number;
  total_reviews: number;
  working_hours?: string | number | null;
  created_at: string;
  updated_at: string;
  // Dados do usuário associado
  user_name?: string;
  user_email?: string;
  user_avatar_url?: string;
}

interface UseProfessionalsReturn {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProfessionals = (businessId?: string): UseProfessionalsReturn => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('professionals')
        .select('*, working_hours')
        .eq('is_active', true)
        .order('average_rating', { ascending: false });

      // Se businessId for fornecido, filtrar por ele
      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data: professionalsData, error: professionalsError } = await query;

      if (professionalsError) {
        throw professionalsError;
      }

      // Buscar dados dos usuários associados
      if (professionalsData && professionalsData.length > 0) {
        const professionalsWithUserData = await Promise.all(
          professionalsData.map(async (professional) => {
            if (professional.user_id) {
              // Buscar dados do usuário na tabela auth.users (através de uma query RPC ou metadata)
              const { data: userData } = await supabase
                .from('users')
                .select('name, image_url')
                .eq('id', professional.user_id)
                .single();

              if (userData) {
                return {
                  ...professional,
                  user_name: userData.name || 'Profissional',
                  user_avatar_url: userData.image_url || null,
                };
              }
            }

            // Se não tiver dados do usuário, retornar com valores padrão
            return {
              ...professional,
              user_name: 'Profissional',
              user_avatar_url: null,
            };
          })
        );

        setProfessionals(professionalsWithUserData);
      } else {
        setProfessionals([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar profissionais';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [businessId]);

  return {
    professionals,
    loading,
    error,
    refetch: fetchProfessionals,
  };
};