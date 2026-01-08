'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/SupabaseClient';

export const SupabaseDiagnostic = () => {
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    const runDiagnostics = async () => {
      const diagnostics: any = {
        timestamp: new Date().toISOString(),
      };

      // 1. Verificar variáveis de ambiente
      diagnostics.envVars = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      };

      // 2. Verificar autenticação
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        diagnostics.auth = {
          isAuthenticated: !!session,
          userId: session?.user?.id || null,
          error: sessionError?.message || null,
        };
      } catch (error) {
        diagnostics.auth = {
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        };
      }

      // 3. Testar acesso à tabela businesses (sem filtros)
      try {
        const { data, error, status, statusText } = await supabase
          .from('businesses')
          .select('*')
          .limit(1);

        diagnostics.businessesTable = {
          success: !error,
          error: error ? {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          } : null,
          status,
          statusText,
          dataCount: data?.length || 0,
          sample: data?.[0] || null,
        };
      } catch (error) {
        diagnostics.businessesTable = {
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        };
      }

      // 4. Testar acesso à tabela addresses
      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .limit(1);

        diagnostics.addressesTable = {
          success: !error,
          error: error?.message || null,
          dataCount: data?.length || 0,
        };
      } catch (error) {
        diagnostics.addressesTable = {
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        };
      }

      // 5. Testar acesso à tabela appointments
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .limit(1);

        diagnostics.appointmentsTable = {
          success: !error,
          error: error?.message || null,
          dataCount: data?.length || 0,
        };
      } catch (error) {
        diagnostics.appointmentsTable = {
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        };
      }

      setResults(diagnostics);
    };

    runDiagnostics();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md max-h-96 overflow-auto text-xs z-50">
      <h3 className="font-bold mb-2">Diagnóstico Supabase</h3>
      <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
};
