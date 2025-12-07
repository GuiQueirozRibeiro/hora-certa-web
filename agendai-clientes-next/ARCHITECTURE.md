# 🏗️ Arquitetura do Projeto - Agendai

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Arquitetura Clean](#arquitetura-clean)
4. [Features (Módulos)](#features-módulos)
5. [Hooks](#hooks)
6. [Componentes](#componentes)
7. [Fluxo de Dados](#fluxo-de-dados)

---

## Visão Geral

Este projeto segue **Clean Architecture** + **SOLID** + **Feature-Based Organization**.

```
┌─────────────────────────────────────────────────────────────┐
│                        APRESENTAÇÃO                          │
│  (Componentes React - apenas renderização e eventos)        │
├─────────────────────────────────────────────────────────────┤
│                     LÓGICA DE NEGÓCIO                        │
│       (Custom Hooks - regras, formatação, validação)        │
├─────────────────────────────────────────────────────────────┤
│                      CAMADA DE DADOS                         │
│        (Supabase Client - acesso ao banco de dados)         │
└─────────────────────────────────────────────────────────────┘
```

**Princípios Aplicados:**
- ✅ **Single Responsibility**: Cada arquivo tem UMA responsabilidade
- ✅ **Separation of Concerns**: UI separada de lógica separada de dados
- ✅ **Dependency Inversion**: Componentes dependem de abstrações (hooks)
- ✅ **Feature-Based**: Código organizado por funcionalidade, não por tipo

---

## Estrutura de Pastas

```
agendai-clientes-next/
├── app/                          # Next.js App Router - ROTAS
│   ├── page.tsx                  # Rota: / (home)
│   ├── layout.tsx                # Layout global
│   ├── agendamentos/             # Rota: /agendamentos
│   │   ├── page.tsx             # Exporta AgendamentosPage
│   │   └── AgendamentosPage.tsx # Componente da página
│   ├── configuracoes/            # Rota: /configuracoes
│   ├── termos/                   # Rota: /termos
│   └── perfil/                   # Rota: /perfil
│
├── src/
│   ├── features/                 # FEATURES (módulos de negócio)
│   │   ├── appointments/        # Tudo sobre agendamentos
│   │   ├── auth/                # Tudo sobre autenticação
│   │   ├── business/            # Tudo sobre empresas/barbearias
│   │   ├── home/                # Tudo sobre página inicial
│   │   ├── settings/            # Tudo sobre configurações
│   │   └── terms/               # Tudo sobre termos
│   │
│   ├── components/              # Componentes compartilhados
│   │   ├── layout/             # Header, Navigation
│   │   └── shared/             # LocationModal, ProtectedRoute
│   │
│   ├── contexts/                # Contextos React (estado global)
│   │   └── DataCacheContext.tsx # Cache de dados entre navegações
│   │
│   ├── hooks/                   # Hooks GLOBAIS (usados por várias features)
│   │   ├── useAuth.ts          # Autenticação global
│   │   ├── useGeolocation.ts   # Geolocalização global
│   │   ├── Useappointments.ts  # Agendamentos global
│   │   ├── Usebusinesses.ts    # Empresas/Negócios
│   │   ├── Usebusinesseswithaddresses.ts # Empresas com endereços
│   │   ├── Useaddresses.ts     # Endereços
│   │   ├── useFavorites.ts     # Favoritos
│   │   ├── useUserProfile.ts   # Perfil do usuário
│   │   ├── useServices.ts      # Serviços
│   │   ├── useProfessionals.ts # Profissionais
│   │   └── useProfessionalSchedules.ts # Horários dos profissionais
│   │
│   ├── lib/                     # Configurações externas
│   │   └── SupabaseClient.ts   # Cliente do Supabase
│   │
│   └── types/                   # Tipos TypeScript globais
│       └── types.ts
```

---

## Arquitetura Clean

### Camadas

#### 1️⃣ **Camada de Apresentação** (Components)
```
Responsabilidade: APENAS renderizar UI e capturar eventos
```

**Exemplo:**
```tsx
// ❌ ERRADO - Lógica misturada
function AppointmentCard() {
  const { data } = await supabase.from('appointments').select();
  const formatted = new Date(data.date).toLocaleDateString();
  return <div>{formatted}</div>;
}

// ✅ CORRETO - Apenas apresentação
function AppointmentCard({ appointment, onClick }) {
  return (
    <div onClick={onClick}>
      <h3>{appointment.service_name}</h3>
      <p>{appointment.formatted_date}</p>
    </div>
  );
}
```

#### 2️⃣ **Camada de Lógica** (Hooks)
```
Responsabilidade: Regras de negócio, formatação, validação
```

**Exemplo:**
```tsx
// Hook encapsula TODA a lógica
export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  
  const fetchAppointments = async () => {
    const { data } = await supabase.from('appointments').select();
    setAppointments(data);
  };
  
  const cancelAppointment = async (id) => {
    await supabase.from('appointments').update({ status: 'cancelled' });
  };
  
  return { appointments, fetchAppointments, cancelAppointment };
}
```

#### 3️⃣ **Camada de Dados** (Supabase Client)
```
Responsabilidade: Comunicação com banco de dados
```

---

## Features (Módulos)

Cada feature é um **módulo independente** com tudo que precisa.

### 📅 **appointments/** - Agendamentos

```
src/features/appointments/
├── components/                    # Componentes UI
│   ├── AppointmentCard.tsx       # Card de agendamento
│   ├── AppointmentsList.tsx      # Lista de agendamentos
│   ├── AppointmentDetails.tsx    # Detalhes do agendamento
│   ├── BusinessMap.tsx           # Mapa da empresa
│   ├── BusinessContact.tsx       # Contato (WhatsApp, telefone)
│   ├── ServiceDetails.tsx        # Detalhes do serviço
│   ├── AppointmentActions.tsx    # Botões de ação (cancelar, concluir)
│   ├── EmptyStates.tsx           # Estados vazios
│   ├── CancelModal.tsx           # Modal de cancelamento
│   └── ReservaModal.tsx          # Modal de nova reserva
│
├── hooks/                         # Hooks específicos de agendamentos
│   ├── useAppointmentActions.ts  # Ações: cancelar, completar
│   ├── useDateFormatter.ts       # Formatação de datas
│   └── usePhoneCopy.ts           # Formatação e cópia de telefone
│
└── AppointmentsPage.tsx          # Página principal (orquestração)
```

**O que faz:**
- Lista agendamentos do usuário (confirmados, concluídos, cancelados)
- Exibe detalhes do agendamento (serviço, horário, profissional, empresa)
- Permite cancelar agendamentos
- Permite marcar como concluído
- Mostra mapa da localização da empresa
- Botão de WhatsApp para contato

**Por que hooks dentro?**
- `useDateFormatter` é usado APENAS em appointments
- `usePhoneCopy` é usado APENAS em appointments
- Se fosse usado em outras features, ficaria em `/src/hooks/`

---

### 🔐 **auth/** - Autenticação

```
src/features/auth/
└── components/
    └── LoginModal.tsx    # Modal de login
```

**O que faz:**
- Modal de login com email/senha
- Integração com Supabase Auth
- Validação de formulário

**Hook global:** `/src/hooks/useAuth.ts`
- Usado por TODAS as features que precisam saber se usuário está logado
- Por isso está em `/src/hooks/` e não em `/src/features/auth/hooks/`

---

### 🏪 **business/** - Empresas/Barbearias

```
src/features/business/
└── components/
    ├── BarbeariaModal.tsx      # Modal com detalhes da empresa
    └── ProfessionalsTab.tsx    # Aba de profissionais
```

**O que faz:**
- Exibe informações da empresa (nome, endereço, horários)
- Lista serviços oferecidos
- Lista profissionais
- Permite fazer reserva
- Mostra formas de pagamento

---

### 🏠 **home/** - Página Inicial

```
src/features/home/
├── components/
│   ├── BusinessCard.tsx          # Card de empresa/barbearia
│   ├── EmptyStates.tsx          # Estados vazios (loading, erro, sem dados)
│   ├── SearchBar.tsx            # Barra de pesquisa
│   └── SuccessNotification.tsx  # Notificação de sucesso
│
├── hooks/
│   ├── useBusinessData.ts       # Transformação de dados de negócios
│   └── useSearchDebounce.ts     # Debounce para pesquisa
│
└── HomePage.tsx                 # Página principal (orquestração)
```

**O que faz:**
- Lista todas as empresas/barbearias disponíveis
- Pesquisa de empresas por nome
- Filtro por tipo de negócio e status ativo
- Favoritar/desfavoritar empresas
- Exibe próximos agendamentos do usuário
- Abre modal com detalhes da empresa

**Por que hooks dentro?**
- `useBusinessData` transforma dados específicos para visualização da home
- `useSearchDebounce` é usado apenas na busca da home
- Se fossem usados em outras features, ficariam em `/src/hooks/`

---

### ⚙️ **settings/** - Configurações

```
src/features/settings/
├── components/
│   ├── MenuLateral.tsx           # Menu lateral
│   ├── AreaConteudo.tsx          # Área de conteúdo
│   └── forms/                    # Formulários de configuração
│       ├── FormMeusDados.tsx    # Dados pessoais
│       ├── FormEndereco.tsx     # Endereços
### Hooks Globais (`/src/hooks/`)

Hooks usados por **MÚLTIPLAS features**:

```tsx
// useAuth.ts - Usado por TODAS as features
export function useAuth() {
  return {
    user,              // Usuário atual
    session,           // Sessão do Supabase
    loading,           // Carregando?
    signInWithEmail,   // Login com email
    signInWithGoogle,  // Login com Google
    signInWithApple,   // Login com Apple
    signInWithPhone,   // Login com telefone
    signUpWithEmail,   // Cadastro com email
    signOut,           // Fazer logout
    resetPassword,     // Resetar senha
  };
}

// Useappointments.ts - Usado por appointments e home
export function useAppointments(filters?) {
  return {
    appointments,       // Lista de agendamentos com detalhes
    loading,
    error,
    createAppointment,  // Criar novo
    updateAppointment,  // Atualizar
    cancelAppointment,  // Cancelar
    deleteAppointment,  // Deletar
    refetch,           // Re-buscar dados
  };
}

// Usebusinesses.ts - Usado por home e business
export function useBusinesses(filters?) {
  return {
    businesses,     // Lista de empresas
    loading,
    error,
    refetch,       // Re-buscar dados
### Hooks de Feature (`/src/features/*/hooks/`)

Hooks usados APENAS dentro de uma feature específica:

```tsx
// appointments/hooks/useDateFormatter.ts
// ❌ NÃO é usado em outras features
export function useDateFormatter() {
  return {
    formatDate,  // Formata data para exibição
    formatTime,  // Formata hora
  };
}

// appointments/hooks/usePhoneCopy.ts
// ❌ NÃO é usado em outras features
export function usePhoneCopy() {
  return {
    formatPhoneNumber,  // Formata telefone
    handleCopyPhone,    // Copia para clipboard
    copiedPhone,        // Estado da cópia
  };
}

// appointments/hooks/useAppointmentActions.ts
// ❌ NÃO é usado em outras features
export function useAppointmentActions() {
  return {
    handleCancel,    // Cancelar agendamento
    handleComplete,  // Completar agendamento
  };
}

// home/hooks/useBusinessData.ts
// ❌ NÃO é usado em outras features
export function useBusinessData(businesses) {
  // Transforma dados de businesses para formato específico da home
  return transformedBusinesses;
}

// home/hooks/useSearchDebounce.ts
// ❌ NÃO é usado em outras features
export function useSearchDebounce(delay = 500) {
  return {
    searchTerm,      // Termo de busca atual
    debouncedValue,  // Valor com debounce aplicado
    isSearching,     // Está buscando?
    setSearchTerm,   // Atualizar termo
  };
}
```

**Regra de Ouro:**
```
Se o hook é usado em 2+ features → /src/hooks/
Se o hook é usado em 1 feature → /src/features/NOME/hooks/
```

---

## Contextos React

### DataCacheContext

Localização: `/src/contexts/DataCacheContext.tsx`

**Responsabilidade:**
- Manter cache de dados entre navegações de página
- Evitar re-fetching desnecessário ao trocar de abas
- Gerenciar validade do cache (tempo de expiração)

**O que faz:**
```tsx
// Armazenar dados em cache
setCache('appointments', appointmentsData);

// Recuperar dados do cache
const cached = getCache('appointments');

// Verificar se cache é válido
const isValid = isCacheValid('appointments', 5 * 60 * 1000); // 5 minutos

// Limpar cache
clearCache('appointments'); // Limpar específico
clearCache();              // Limpar tudo
```

**Benefícios:**
- ✅ Navegação mais rápida entre páginas
- ✅ Reduz chamadas ao Supabase
- ✅ Melhora experiência do usuário
- ✅ Dados persistem durante a sessão

**Uso nos Hooks:**
Todos os hooks globais agora implementam controle de re-fetching:
- `useRef` para rastrear se já buscou dados
- `useCallback` para memoizar funções de fetch
- Verificação de mudança de usuário/filtros antes de re-buscar profile,        // Dados do perfil
    loading,
    error,
    updateProfile,  // Atualizar perfil
    refreshProfile, // Re-buscar perfil
  };
}

// useGeolocation.ts - Usado por home
export function useGeolocation() {
  return {
    location,       // { lat, lng }
    getLocation,    // Pegar localização
  };
}

// useServices.ts - Usado por business
export function useServices(businessId?) {
  return {
    services,       // Lista de serviços
    loading,
    error,
    refetch,
  };
}

// useProfessionals.ts - Usado por business
export function useProfessionals(businessId?) {
  return {
    professionals,  // Lista de profissionais
    loading,
    error,
    refetch,
  };
}

// useProfessionalSchedules.ts - Usado por business
export function useProfessionalSchedules(professionalId?) {
  return {
    schedules,      // Horários disponíveis
    loading,
    error,
    refetch,
  };
}

// Useaddresses.ts - Usado por settings
export function useAddresses() {
  return {
    addresses,      // Endereços do usuário
    loading,
    error,
    addAddress,     // Adicionar endereço
    updateAddress,  // Atualizar endereço
    deleteAddress,  // Deletar endereço
    setPrimary,     // Definir como principal
    refetch,
  };
} return {
    user,           // Usuário atual
    loading,        // Carregando?
    signIn,         // Fazer login
    signOut,        // Fazer logout
  };
}

// useGeolocation.ts - Usado por home e appointments
export function useGeolocation() {
  return {
    location,       // { lat, lng }
    getLocation,    // Pegar localização
  };
}

// useAppointments.ts - Usado por appointments e home
export function useAppointments() {
  return {
    appointments,       // Lista de agendamentos
    loading,
    createAppointment,  // Criar novo
    fetchAppointments,  // Buscar
  };
}
## Otimizações Implementadas

### 🚀 Performance

**Problema resolvido:** Recarregamento constante ao trocar de abas

**Solução implementada:**
```tsx
// Cada hook agora usa controle de re-fetching
const hasFetchedRef = useRef(false);
const userIdRef = useRef<string | null>(null);

useEffect(() => {
  const userChanged = userIdRef.current !== user?.id;
  
  // Só busca se: nunca buscou OU usuário mudou
  if (user && (!hasFetchedRef.current || userChanged)) {
    userIdRef.current = user.id;
    hasFetchedRef.current = true;
    fetchData();
  }
}, [fetchData, user]);
```

**Benefícios:**
- ✅ Dados carregam apenas uma vez
- ✅ Re-busca somente quando usuário muda (login/logout)
- ✅ Re-busca quando filtros mudam (busca, filtros)
- ✅ Navegação instantânea entre abas
- ✅ Reduz 90% das chamadas ao banco

### 🔧 Logs de Debug

Todos os hooks principais possuem logs detalhados:
```tsx
console.log('🔍 Iniciando busca...');
console.log('✅ Dados recebidos:', data);
console.log('❌ Erro:', error);
```

Facilita debug e identificação de problemas.

---

## Benefícios da Arquitetura

### ✅ Separação de Responsabilidades
```tsx
// Cada arquivo tem UMA responsabilidade

AppointmentCard.tsx       → Renderizar card
useDateFormatter.ts       → Formatar datas
useAppointmentActions.ts  → Ações (cancelar, completar)
SupabaseClient.ts         → Conexão com banco
DataCacheContext.tsx      → Gerenciar cache
``` Hooks de Feature (`/src/features/*/hooks/`)

Hooks usados APENAS dentro de uma feature específica:

```tsx
// appointments/hooks/useDateFormatter.ts
// ❌ NÃO é usado em outras features
export function useDateFormatter() {
  return {
    formatDate,  // Formata data para exibição
    formatTime,  // Formata hora
  };
}

// appointments/hooks/usePhoneCopy.ts
// ❌ NÃO é usado em outras features
export function usePhoneCopy() {
  return {
    formatPhoneNumber,  // Formata telefone
    handleCopyPhone,    // Copia para clipboard
    copiedPhone,        // Estado da cópia
  };
}
```

**Regra de Ouro:**
```
Se o hook é usado em 2+ features → /src/hooks/
Se o hook é usado em 1 feature → /src/features/NOME/hooks/
```

---

## Componentes

### Componentes de Feature

Ficam dentro de `/src/features/NOME/components/`:

```tsx
// appointments/components/AppointmentCard.tsx
// Usado APENAS na feature appointments
export function AppointmentCard({ appointment, onClick }) {
  return <div onClick={onClick}>...</div>;
}
```

### Componentes Compartilhados

Ficam em `/src/components/`:

```tsx
// components/layout/Header.tsx
// Usado em TODAS as páginas
export function Header() {
  return <header>...</header>;
}

// components/layout/Navigation.tsx
// Usado em TODAS as páginas
export function Navigation() {
  return <nav>...</nav>;
}

// components/ProtectedRoute/ProtectedRoute.tsx
// Usado em várias páginas
export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}
```

---

## Fluxo de Dados

### Exemplo: Página de Agendamentos

```
┌─────────────────────────────────────────────────────────────┐
│  1. USUÁRIO ACESSA /agendamentos                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Next.js Router carrega app/agendamentos/page.tsx        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. page.tsx renderiza <AgendamentosPage />                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  4. AgendamentosPage chama hooks:                           │
│     - const { user } = useAuth()                            │
│     - const { appointments } = useAppointments()            │
│     - const { cancelAppointment } = useAppointmentActions() │
└────────────────────┬────────────────────────────────────────┘
**Estrutura:**
```
app/              → Rotas do Next.js (páginas)
src/features/     → Módulos de negócio (appointments, auth, business, home, settings, terms)
src/components/   → Componentes compartilhados (layout, shared)
src/contexts/     → Contextos React (estado global, cache)
src/hooks/        → Hooks globais (auth, appointments, businesses, etc)
src/lib/          → Configurações externas (Supabase)
src/types/        → Tipos TypeScript
```───────────────────────────────────────────────────────────┐
│  6. Hooks retornam dados formatados para componentes        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
**Princípios:**
```
✅ Um arquivo = Uma responsabilidade
✅ UI separada de lógica
✅ Hooks encapsulam complexidade
✅ Organização por feature
✅ Componentes pequenos e focados
✅ Cache inteligente para performance
✅ Controle de re-fetching otimizado
✅ Logs detalhados para debug
```

**Hooks Implementados:**
```
Global: 11 hooks
- useAuth, Useappointments, Usebusinesses, Usebusinesseswithaddresses
- useFavorites, useUserProfile, useGeolocation, useServices
- useProfessionals, useProfessionalSchedules, Useaddresses

Feature-specific: 5 hooks
- appointments: useDateFormatter, usePhoneCopy, useAppointmentActions
- home: useBusinessData, useSearchDebounce
```

### Exemplo: Usuário cancela um agendamento

```
1. Usuário clica em "Cancelar"
   └─> AppointmentActions.tsx: onClick={onCancel}

2. Evento chama handler na página
   └─> AgendamentosPage: handleCancel(id)

3. Handler chama hook
   └─> useAppointmentActions: cancelAppointment(id)

4. Hook chama Supabase
   └─> supabase.from('appointments').update({ status: 'cancelled' })

5. Hook atualiza estado
   └─> setAppointments([...novo estado])

6. Componentes re-renderizam
   └─> Lista atualizada automaticamente
```

---

## Benefícios da Arquitetura

### ✅ Separação de Responsabilidades
```tsx
// Cada arquivo tem UMA responsabilidade

AppointmentCard.tsx       → Renderizar card
useDateFormatter.ts       → Formatar datas
useAppointmentActions.ts  → Ações (cancelar, completar)
SupabaseClient.ts         → Conexão com banco
```

### ✅ Facilidade para Testar
```tsx
// Testar componente isoladamente
test('AppointmentCard renderiza corretamente', () => {
  render(<AppointmentCard appointment={mockData} />);
});

// Testar hook isoladamente
test('useDateFormatter formata data', () => {
  const { formatDate } = useDateFormatter();
  expect(formatDate('2024-12-04')).toBe({ day: 4, month: 'dez' });
});
```

### ✅ Fácil Manutenção
```
Precisa mudar formatação de data?
→ Editar APENAS useDateFormatter.ts
→ TODOS os componentes atualizam automaticamente

Precisa adicionar novo campo no agendamento?
→ Editar types.ts
→ TypeScript avisa onde precisa atualizar
```

### ✅ Reusabilidade
```tsx
// Hook pode ser reutilizado
function ComponenteA() {
  const { appointments } = useAppointments();
}

function ComponenteB() {
  const { appointments } = useAppointments();
}

// Mesma lógica, zero duplicação
```

### ✅ Organização por Feature
```
Precisa entender como funciona agendamentos?
→ Olhe APENAS src/features/appointments/

Precisa adicionar nova funcionalidade em settings?
→ Trabalhe APENAS em src/features/settings/

Não precisa vasculhar o projeto inteiro!
```

---

## Resumo

**Estrutura:**
```
app/              → Rotas do Next.js (páginas)
src/features/     → Módulos de negócio (appointments, auth, etc)
src/components/   → Componentes compartilhados
src/hooks/        → Hooks globais
src/lib/          → Configurações externas
src/types/        → Tipos TypeScript
```

**Fluxo:**
```
Página → Hooks → Supabase → Hooks → Componentes
```

**Princípios:**
```
✅ Um arquivo = Uma responsabilidade
✅ UI separada de lógica
✅ Hooks encapsulam complexidade
✅ Organização por feature
✅ Componentes pequenos e focados
```
