import { DailyQuote } from '../utils/jquants-types';

export type TabType = 'buy' | 'sell' | 'tp' | 'sl';

export const TAB_LABELS: Record<TabType, string> = {
  buy: '買い条件',
  sell: '売り条件',
  tp: '利確条件',
  sl: '損切り条件'
} as const;

export interface Condition {
  indicator: string;
  period: number;
  params: Record<string, number | string>;
}

export type LogicalOperator = 'AND' | 'OR';

export interface ConditionGroup {
  conditions: Condition[];
  operator: LogicalOperator;
}

export interface Trade {
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profitLoss: number;
  returnPercent: number;
  exitReason: 'sell' | 'stop_loss' | 'take_profit';
}

export interface BacktestResult {
  id: string;
  code: string;
  startDate: string;
  endDate: string;
  executedAt: string;
  initialCash: number;
  maxPosition?: number;
  trades: Trade[];
  finalEquity: number;
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
  priceData: DailyQuote[];
  dates: string[];
  equity: number[];
  conditions: {
    buy: ConditionGroup;
    sell: ConditionGroup;
    tp: ConditionGroup;
    sl: ConditionGroup;
  };
}

export interface BacktestRequest {
  code: string;
  startDate: string;
  endDate: string;
  initialCash: number;
  maxPosition: number;
  conditions: Record<TabType, ConditionGroup>;
  priceData: DailyQuote[];
}

// エンジンパラメータ型
export interface BacktestEngineParams {
  initialCash: number;
  maxPosition: number;
  buyConditions: ConditionGroup;
  sellConditions: ConditionGroup;
  tpConditions: ConditionGroup;
  slConditions: ConditionGroup;
}
