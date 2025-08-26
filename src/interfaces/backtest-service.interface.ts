import { BacktestRequest, BacktestResult } from '../types/backtest';

export interface IBacktestService {
  executeBacktest(request: BacktestRequest, userId: string): Promise<BacktestResult>;
  getBacktestById(id: string, userId: string): Promise<BacktestResult | null>;
  getBacktestsByUser(userId: string): Promise<BacktestResult[]>;
  deleteBacktest(id: string, userId: string): Promise<void>;
}
