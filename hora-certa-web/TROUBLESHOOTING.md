# 🔧 Troubleshooting - Formulário de Dados não Salva

## Problema
O formulário de "Meus Dados" não está salvando as informações no banco de dados do Supabase.

## Possíveis Causas e Soluções

### 1. ✅ Políticas RLS (Row Level Security) não configuradas

**Sintoma:** O update não salva e pode aparecer erro no console.

**Solução:**
1. Acesse o Supabase Dashboard
2. Vá em `SQL Editor`
3. Execute o script `SUPABASE_RLS_POLICIES.sql` que está na raiz do projeto
4. Verifique se as políticas foram criadas corretamente

**Como verificar:**
- Abra o console do navegador (F12)
- Tente salvar o formulário
- Veja se aparece algum erro relacionado a "policy" ou "RLS"

---

### 2. ✅ Usuário não autenticado

**Sintoma:** Console mostra "Usuário não autenticado"

**Solução:**
1. Certifique-se de que você está logado
2. Verifique se o `useAuth` está retornando o usuário corretamente
3. No console, execute: `console.log(supabase.auth.getSession())`

**Como verificar:**
```javascript
// No console do navegador
import { supabase } from './src/lib/SupabaseClient'
const { data } = await supabase.auth.getSession()
console.log(data.session?.user)
```

---

### 3. ✅ ID do usuário não corresponde ao ID na tabela users

**Sintoma:** Dados não são atualizados, mas não há erro aparente

**Solução:**
1. Verifique se o `id` do usuário autenticado corresponde ao `id` na tabela `users`
2. Execute no SQL Editor do Supabase:
```sql
SELECT id, email, name FROM public.users;
```
3. Compare com o ID retornado por `auth.uid()`

**Como verificar:**
```sql
-- No SQL Editor do Supabase
SELECT auth.uid() as auth_id, 
       (SELECT id FROM public.users WHERE id = auth.uid()) as user_id;
```

---

### 4. ✅ Campos da tabela não correspondem aos campos do formulário

**Sintoma:** Erro específico sobre campos não existentes

**Solução:**
1. Verifique a estrutura da tabela `users` no Supabase
2. Compare com os campos no `UserProfile` interface
3. Certifique-se de que os campos existem:
   - `id` (uuid)
   - `email` (varchar)
   - `name` (varchar)
   - `phone` (varchar)
   - `birth_date` (date)
   - `gender` (varchar)
   - `image_url` (varchar)
   - `user_type` (varchar)
   - `updated_at` (timestamptz)

---

### 5. ✅ Variáveis de ambiente não configuradas

**Sintoma:** Erro ao conectar com o Supabase

**Solução:**
1. Verifique se o arquivo `.env.local` existe na raiz do projeto
2. Certifique-se de que contém:
```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```
3. Reinicie o servidor de desenvolvimento

---

## 🔍 Debug Passo a Passo

### Passo 1: Verificar logs no console
Abra o console do navegador (F12) e procure por logs:
```
Dados do formulário antes de enviar: {...}
Perfil atual: {...}
Iniciando atualização de perfil para usuário: ...
Dados a serem enviados ao Supabase: {...}
Resposta do Supabase: {...}
```

### Passo 2: Verificar a resposta do Supabase
Se houver erro, ele aparecerá em:
```
Erro retornado pelo Supabase: {...}
```

### Passo 3: Testar update direto no Supabase
No SQL Editor, execute:
```sql
UPDATE public.users 
SET name = 'Teste Manual', updated_at = NOW() 
WHERE id = auth.uid();
```

Se funcionar, o problema é no frontend. Se não funcionar, o problema é nas políticas RLS.

---

## 📝 Checklist de Verificação

- [ ] Usuário está autenticado
- [ ] Políticas RLS estão configuradas
- [ ] ID do usuário corresponde ao ID na tabela
- [ ] Campos da tabela existem e estão corretos
- [ ] Variáveis de ambiente estão configuradas
- [ ] Console mostra os logs de debug
- [ ] Update manual no SQL Editor funciona

---

## 🆘 Ainda não funciona?

Se após todas as verificações o problema persistir:

1. **Compartilhe os logs do console** - Copie todos os logs que aparecem ao tentar salvar
2. **Compartilhe o erro do Supabase** - Se houver erro na resposta do Supabase
3. **Verifique as políticas** - Execute a query de verificação no SQL Editor:
```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

4. **Tente atualizar manualmente** - No SQL Editor:
```sql
UPDATE public.users 
SET name = 'Seu Nome Aqui'
WHERE id = 'seu-user-id-aqui';
```

Se o update manual funcionar, mas o formulário não, pode ser um problema de permissões de API.
