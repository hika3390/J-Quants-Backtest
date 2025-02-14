export type TabType = 'buy' | 'sell' | 'tp' | 'sl';

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
