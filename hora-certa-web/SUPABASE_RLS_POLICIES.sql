-- ======================================
-- POLÍTICAS RLS PARA A TABELA USERS
-- ======================================
-- Execute este script no SQL Editor do Supabase para configurar
-- as políticas de segurança (Row Level Security) corretamente

-- 1. Habilitar RLS na tabela users (se ainda não estiver habilitado)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes (se houver conflitos)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- 3. Criar política para VISUALIZAR o próprio perfil
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 4. Criar política para ATUALIZAR o próprio perfil
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. Criar política para INSERIR o próprio perfil (registro inicial)
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ======================================
-- VERIFICAR SE AS POLÍTICAS FORAM CRIADAS
-- ======================================
-- Execute esta query para verificar:
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users';

-- ======================================
-- TESTAR SE O UPDATE FUNCIONA
-- ======================================
-- Você pode testar manualmente com:
-- UPDATE public.users 
-- SET name = 'Teste', updated_at = NOW() 
-- WHERE id = auth.uid();
