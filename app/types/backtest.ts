export type TabType = 'buy' | 'sell' | 'tp' | 'sl';

export const TAB_LABELS: Record<TabType, string> = {
  buy: '買い条件',
  sell: '売り条件',
  tp: '利確条件',
  sl: '損切り条件'
} as const;

export interface IndicatorType {
  id: string;
  name: string;
  description: string;
  defaultPeriod: number;
  parameters?: {
    name: string;
    type: 'number' | 'string';
    default: number | string;
  }[];
}
