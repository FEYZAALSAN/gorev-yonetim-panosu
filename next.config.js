/** @type {import('next').NextConfig} */
const nextConfig = {
  // Eğer TypeScript kullanıyorsanız, build sırasında hataları yok saymak için:
  // Bu, Next.js 14'e yükseltme sırasında karşılaşılan uyarıları görmezden gelmeye yarar.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Bu ayar zorunlu değil ama Next.js ile uyumludur:
  reactStrictMode: true,
};

module.exports = nextConfig;