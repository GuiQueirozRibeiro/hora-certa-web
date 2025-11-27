/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <--- OBRIGATÓRIO
  images: {
    unoptimized: true, // <--- OBRIGATÓRIO (senão as imagens quebram sem servidor)
  },
  // Se der erro de lint chato:
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;