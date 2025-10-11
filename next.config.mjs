/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Configuração de Domínios Externos para Next/Image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dhqvjxgue/image/upload/**'
      }
    ]
  },
  // 2. Outras Configurações Modernas
  // Opcional: Adicionar strictMode (Next.js 13+)
  reactStrictMode: true
};

export default nextConfig;