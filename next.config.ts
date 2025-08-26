import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_COOKIE_NAME: process.env.NEXTAUTH_COOKIE_NAME,
    JQUANTS_USERNAME: process.env.JQUANTS_USERNAME,
    JQUANTS_PASSWORD: process.env.JQUANTS_PASSWORD,
  },
  // Amplify用の最適化
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
