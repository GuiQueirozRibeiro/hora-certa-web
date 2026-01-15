import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para produção na Vercel
  poweredByHeader: false,
  
  // Otimização de imagens habilitada (padrão da Vercel)
  images: {
    // Adicione domínios externos se usar imagens de CDNs externas
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wbixazmkpvwjmzddmysp.supabase.co',
      },
    ],
  },
};

export default nextConfig;
