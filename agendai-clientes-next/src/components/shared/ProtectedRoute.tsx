'use client';

import React, { useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../../features/auth/components/LoginModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente para proteger rotas que requerem autenticação
 * 
 * Uso:
 * <ProtectedRoute>
 *   <ComponenteProtegido />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    }
  }, [user, loading]);

  // Enquanto está carregando
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado
  if (!user) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCircle size={32} className="text-indigo-500" fill="#6366f1" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Acesso Restrito
              </h3>
              <p className="text-gray-400 mb-6">
                Você precisa estar logado para acessar esta página
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Fazer Login
              </button>
            </div>
          </div>
        )}
        
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => setShowLoginModal(false)}
        />
      </>
    );
  }

  // Se estiver autenticado, renderiza o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
