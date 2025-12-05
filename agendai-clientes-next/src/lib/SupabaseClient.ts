// Cliente Supabase para Next.js

import { createClient } from '@supabase/supabase-js'

// Pega a URL e a chave do arquivo .env.local (Next.js usa process.env)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('🔧 [SupabaseClient] Inicializando cliente Supabase...');
console.log('🔧 URL:', supabaseUrl);
console.log('🔧 Key existe:', !!supabaseAnonKey);

// Valida se as variáveis estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [SupabaseClient] Variáveis de ambiente não encontradas!');
  throw new Error('Faltam as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

console.log('✅ [SupabaseClient] Cliente Supabase criado com sucesso!');

// Cria e exporta o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})