'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { businessService } from '@/services/businessService';
import type { User, Business } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  business: Business | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshBusiness: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await authService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        
        if (currentUser.user_type === 'business') {
          const biz = await businessService.getBusinessByOwnerId(currentUser.id);
          setBusiness(biz);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const userData = await authService.signIn(email, password);
    setUser(userData);

    if (userData.user_type === 'business') {
      const biz = await businessService.getBusinessByOwnerId(userData.id);
      setBusiness(biz);
      
      if (biz) {
        router.push('/agenda');
      } else {
        router.push('/administracao/setup');
      }
    } else {
      router.push('/agenda');
    }
  }

  async function signUp(email: string, password: string, name: string) {
    await authService.signUp(email, password, name);
    await signIn(email, password);
  }

  async function signOut() {
    await authService.signOut();
    setUser(null);
    setBusiness(null);
    router.push('/login');
  }

  async function refreshBusiness() {
    if (user) {
      const biz = await businessService.getBusinessByOwnerId(user.id);
      setBusiness(biz);
    }
  }

  return (
    <AuthContext.Provider value={{ user, business, loading, signIn, signUp, signOut, refreshBusiness }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}