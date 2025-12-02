'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/services/authService';
import { businessService } from '@/services/businessService';
import type { User, Business } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  business: Business | null;
  loading: boolean;
  needsBusinessSetup: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshBusiness: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [needsBusinessSetup, setNeedsBusinessSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // Carrega usuário ao montar
  useEffect(() => {
    if (initialized) return;
    
    const supabase = createClient();
    
    loadUser();
    setInitialized(true);

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await loadUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setBusiness(null);
        setNeedsBusinessSetup(false);
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized]);

  async function loadUser() {
    console.log('👤 [useAuth.loadUser] Iniciando...');
    try {
      console.log('📤 [useAuth.loadUser] Chamando authService.getCurrentUser...');
      const currentUser = await authService.getCurrentUser();
      console.log('📊 [useAuth.loadUser] CurrentUser retornado:', currentUser);
      setUser(currentUser);
      
      if (!currentUser) {
        console.warn('⚠️ [useAuth.loadUser] Usuário não autenticado, redirecionando...');
        router.push('/login');
        return;
      }

      console.log('✅ [useAuth.loadUser] Usuário carregado:', { id: currentUser.id, type: currentUser.user_type, name: currentUser.name });

      // Se for usuário business, verifica se tem empresa
      if (currentUser.user_type === 'business') {
        console.log('🏢 [useAuth.loadUser] Tipo business detectado, carregando empresa...');
        await loadBusiness(currentUser.id);
      } else {
        console.log('👥 [useAuth.loadUser] Não é business, pulando loadBusiness');
      }
    } catch (error) {
      console.error('❌ [useAuth.loadUser] Erro ao carregar usuário:', error);
      setUser(null);
      setBusiness(null);
    } finally {
      console.log('🏁 [useAuth.loadUser] Finalizando (setLoading(false))');
      setLoading(false);
    }
  }

  async function loadBusiness(userId: string) {
    console.log('🏢 [useAuth.loadBusiness] Iniciando para userId:', userId);
    try {
      console.log('📤 [useAuth.loadBusiness] Chamando businessService.getBusinessByOwnerId...');
      const userBusiness = await businessService.getBusinessByOwnerId(userId);
      console.log('📊 [useAuth.loadBusiness] Business retornado:', userBusiness);
      
      if (userBusiness) {
        console.log('✅ [useAuth.loadBusiness] Empresa encontrada:', { id: userBusiness.id, name: userBusiness.name });
        setBusiness(userBusiness);
        setNeedsBusinessSetup(false);
      } else {
        console.warn('⚠️ [useAuth.loadBusiness] Empresa não encontrada');
        setBusiness(null);
        setNeedsBusinessSetup(true);
      }
    } catch (error) {
      console.error('❌ [useAuth.loadBusiness] Erro ao carregar empresa:', error);
      setBusiness(null);
      setNeedsBusinessSetup(true);
    }
  }

  async function signIn(email: string, password: string) {
    console.log('🔐 [useAuth] signIn iniciado', { email });
    try {
      console.log('📤 [useAuth] Chamando authService.signIn...');
      const userData = await authService.signIn(email, password);
      console.log('✅ [useAuth] authService.signIn retornou:', userData);
      setUser(userData);

      // Se for business, verifica empresa e redireciona
      if (userData.user_type === 'business') {
        console.log('🏢 [useAuth] Usuário é business, buscando empresa...');
        const userBusiness = await businessService.getBusinessByOwnerId(userData.id);
        
        if (userBusiness) {
          console.log('✅ [useAuth] Empresa encontrada, redirecionando para /agenda');
          setBusiness(userBusiness);
          setNeedsBusinessSetup(false);
          router.push('/agenda');
        } else {
          console.log('⚠️ [useAuth] Empresa não encontrada, redirecionando para /setup');
          setBusiness(null);
          setNeedsBusinessSetup(true);
          router.push('/administracao/setup');
        }
      } else {
        console.log('👤 [useAuth] Usuário não é business, redirecionando para /agenda');
        router.push('/agenda');
      }
    } catch (error: any) {
      console.error('❌ [useAuth] Erro no signIn:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }

  async function signUp(email: string, password: string, name: string) {
    console.log('🔵 [useAuth] signUp iniciado', { email, name });
    try {
      // Cria a conta
      console.log('📤 [useAuth] Chamando authService.signUp...');
      await authService.signUp(email, password, name);
      console.log('✅ [useAuth] authService.signUp concluído');
      
      // Aguarda um pouco antes de fazer login
      console.log('⏳ [useAuth] Aguardando 500ms...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Faz login automático
      console.log('🔄 [useAuth] Fazendo login...');
      const userData = await authService.signIn(email, password);
      console.log('✅ [useAuth] Login bem-sucedido');
      
      setUser(userData);
      
      // Redireciona DIRETO para criar estabelecimento (sem verificar se existe)
      console.log('➡️ [useAuth] Redirecionando para /administracao/setup');
      router.push('/administracao/setup');
      
    } catch (error: any) {
      console.error('❌ [useAuth] Erro no signUp:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    }
  }

  async function signOut() {
    try {
      await authService.signOut();
      setUser(null);
      setBusiness(null);
      setNeedsBusinessSetup(false);
      router.push('/login');
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer logout');
    }
  }

  async function refreshBusiness() {
    if (user) {
      await loadBusiness(user.id);
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        business, 
        loading, 
        needsBusinessSetup,
        signIn, 
        signUp, 
        signOut,
        refreshBusiness
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
}
