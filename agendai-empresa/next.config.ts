import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // OBRIGATÓRIO para build estática
  trailingSlash: true, // Para compatibilidade com hospedagem estática
  images: {
    unoptimized: true, // OBRIGATÓRIO (senão as imagens quebram sem servidor)
  },
};

export default nextConfig;