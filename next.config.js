/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'], // quais extensoes de arquivo o next deve considerar como pages para gerar rotas
}

module.exports = nextConfig
