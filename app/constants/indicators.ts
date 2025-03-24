import { IndicatorType } from '../types/backtest';

export const indicators: IndicatorType[] = [
  {
    id: 'ma',
    name: '移動平均線 (MA)',
    description: 'トレンドを判断するための指標',
    defaultPeriod: 20,
    parameters: [
      { 
        name: 'タイプ',
        type: 'string',
        default: 'SMA'
      }
    ]
  },
  {
    id: 'rsi',
    name: 'RSI (相対力指数)',
    description: '買われ過ぎ・売られ過ぎを判断',
    defaultPeriod: 14
  },
  {
    id: 'bollinger',
    name: 'ボリンジャーバンド',
    description: '価格変動の範囲を表示',
    defaultPeriod: 20,
    parameters: [{ name: '標準偏差', type: 'number', default: 2 }]
  },
  {
    id: 'macd',
    name: 'MACD',
    description: 'トレンドとモメンタムを判断',
    defaultPeriod: 12,
    parameters: [
      { name: '長期期間', type: 'number', default: 26 },
      { name: 'シグナル期間', type: 'number', default: 9 }
    ]
  }
];
