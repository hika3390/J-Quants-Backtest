import { DailyQuote } from '@/app/lib/jquants/api';

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

export interface IndicatorType {
  id: string;
  name: string;
  description: string;
  defaultPeriod?: number;
  parameters?: {
    name: string;
    type: 'number' | 'string' | 'select';
    default: number | string;
    options?: string[];
  }[];
}

export interface Trade {
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profitLoss: number;
  returnPercent: number;
}

export interface BacktestResult {
  id: string;
  code: string;
  startDate: string;
  endDate: string;
  executedAt: string; // バックテスト実行日時
  initialCash: number;
  trades: Trade[];
  finalEquity: number;
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
  // チャート表示用データ
  priceData: DailyQuote[];
  dates: string[];
  equity: number[];
  // インジケーター設定
  conditions: {
    buy: ConditionGroup;
    sell: ConditionGroup;
    tp: ConditionGroup;
    sl: ConditionGroup;
  };
}
