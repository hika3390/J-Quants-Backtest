import { PrismaClient } from '@prisma/client';
import { BacktestResult } from '../types/backtest';
import {
  IBacktestResultRepository,
  CreateBacktestResultData,
  BacktestResultSummary
} from '../interfaces/backtest-result-repository.interface';

export class BacktestResultRepository implements IBacktestResultRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateBacktestResultData): Promise<BacktestResult> {
    const result = await this.prisma.backtestResult.create({
      data: {
        userId: data.userId,
        code: data.code,
        startDate: data.startDate,
        endDate: data.endDate,
        initialCash: data.initialCash,
        maxPosition: data.maxPosition,
        finalEquity: data.finalEquity,
        totalReturn: data.totalReturn,
        winRate: data.winRate,
        maxDrawdown: data.maxDrawdown,
        sharpeRatio: data.sharpeRatio,
        priceData: data.priceData,
        equity: data.equity,
        dates: data.dates,
        trades: data.trades,
        conditions: data.conditions,
      }
    });

    return {
      id: result.id,
      code: result.code,
      startDate: result.startDate,
      endDate: result.endDate,
      executedAt: result.executedAt.toISOString(),
      initialCash: result.initialCash,
      maxPosition: result.maxPosition,
      finalEquity: result.finalEquity,
      totalReturn: result.totalReturn,
      winRate: result.winRate,
      maxDrawdown: result.maxDrawdown,
      sharpeRatio: result.sharpeRatio,
      priceData: result.priceData as any,
      equity: result.equity as any,
      dates: result.dates as any,
      trades: result.trades as any,
      conditions: result.conditions as any,
    };
  }

  async findById(id: string, userId: string): Promise<BacktestResult | null> {
    const result = await this.prisma.backtestResult.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!result) return null;

    return {
      id: result.id,
      code: result.code,
      startDate: result.startDate,
      endDate: result.endDate,
      executedAt: result.executedAt.toISOString(),
      initialCash: result.initialCash,
      maxPosition: result.maxPosition,
      finalEquity: result.finalEquity,
      totalReturn: result.totalReturn,
      winRate: result.winRate,
      maxDrawdown: result.maxDrawdown,
      sharpeRatio: result.sharpeRatio,
      priceData: result.priceData as any,
      equity: result.equity as any,
      dates: result.dates as any,
      trades: result.trades as any,
      conditions: result.conditions as any,
    };
  }

  async findByUserId(userId: string): Promise<BacktestResultSummary[]> {
    const results = await this.prisma.backtestResult.findMany({
      where: { userId },
      orderBy: { executedAt: 'desc' },
      select: {
        id: true,
        code: true,
        startDate: true,
        endDate: true,
        executedAt: true,
        initialCash: true,
        maxPosition: true,
        finalEquity: true,
        totalReturn: true,
        winRate: true,
        maxDrawdown: true,
        sharpeRatio: true,
      }
    });

    return results.map(result => ({
      id: result.id,
      code: result.code,
      startDate: result.startDate,
      endDate: result.endDate,
      executedAt: result.executedAt.toISOString(),
      initialCash: result.initialCash,
      maxPosition: result.maxPosition,
      finalEquity: result.finalEquity,
      totalReturn: result.totalReturn,
      winRate: result.winRate,
      maxDrawdown: result.maxDrawdown,
      sharpeRatio: result.sharpeRatio,
    }));
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.backtestResult.deleteMany({
      where: {
        id,
        userId
      }
    });
  }
}
