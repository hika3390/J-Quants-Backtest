import { BacktestResult } from '../types/backtest';

export interface IBacktestResultRepository {
  create(data: CreateBacktestResultData): Promise<BacktestResult>;
  findById(id: string, userId: string): Promise<BacktestResult | null>;
  findByUserId(userId: string): Promise<BacktestResultSummary[]>;
  delete(id: string, userId: string): Promise<void>;
}

export interface CreateBacktestResultData {
  userId: string;
  code: string;
  startDate: string;
  endDate: string;
  initialCash: number;
  maxPosition: number;
  finalEquity: number;
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
  priceData: any;
  equity: any;
  dates: any;
  trades: any;
  conditions: any;
}

export interface BacktestResultSummary {
  id: string;
  code: string;
  startDate: string;
  endDate: string;
  executedAt: string;
  initialCash: number;
  maxPosition: number;
  finalEquity: number;
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
}
