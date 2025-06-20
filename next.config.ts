import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_COOKIE_NAME: process.env.NEXTAUTH_COOKIE_NAME,
    JQUANTS_USERNAME: process.env.JQUANTS_USERNAME,
    JQUANTS_PASSWORD: process.env.JQUANTS_PASSWORD,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
  // Amplifyでのビルド最適化
  output: 'standalone',
};

export default nextConfig;
