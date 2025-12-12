import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para produção
  poweredByHeader: false,
  
  // Desabilitar otimização de imagens
  images: {
    unoptimized: true,
  },
  
  // Trailing slash para melhor compatibilidade
  trailingSlash: true,
};

export default nextConfig;
