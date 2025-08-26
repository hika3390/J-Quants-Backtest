import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// DATABASE_URL環境変数のチェック
function checkDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set')
    // デプロイ環境では適切なエラーを投げる
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL environment variable is required in production')
    }
    // 開発環境ではデフォルト値を使用（存在する場合）
    return 'postgresql://localhost:5432/trick_db'
  }

  return databaseUrl
}

// Prismaクライアント初期化関数
function createPrismaClient(): PrismaClient {
  try {
    // DATABASE_URLの確認
    const databaseUrl = checkDatabaseUrl()

    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma