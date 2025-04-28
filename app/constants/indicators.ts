import { IndicatorType } from '../types/backtest';

// 指標のカテゴリ定義
export const indicatorCategories = [
  { id: 'price', name: '価格データ' },
  { id: 'volume', name: '出来高・流動性' },
  { id: 'fundamental', name: 'ファンダメンタル指標' },
  { id: 'financial', name: '財務データ' },
  { id: 'company', name: '企業・市場情報' },
  { id: 'technical', name: 'テクニカル指標' },
  { id: 'position', name: 'ポジション管理' }
];

// 比較演算子の定義
export const comparisonOperators = [
  { value: '>', label: '大きい (>)' },
  { value: '<', label: '小さい (<)' },
  { value: '>=', label: '以上 (>=)' },
  { value: '<=', label: '以下 (<=)' },
  { value: '==', label: '等しい (==)' },
  { value: '!=', label: '等しくない (!=)' },
  { value: 'disabled', label: '無効' }
];

// 時間参照の定義
export const timeReferences = [
  { value: 'current', label: '現在' },
  { value: 'days', label: '日前' },
  { value: 'weeks', label: '週前' },
  { value: 'months', label: '月前' },
  { value: 'quarters', label: '四半期前' },
  { value: 'years', label: '年前' }
];

export const indicators: IndicatorType[] = [
  // ポジション管理指標
  {
    id: 'profit_loss_percent',
    name: 'ポジション損益率',
    description: 'ポジションの損益率(%)に基づく条件判定',
    category: 'position',
    parameters: [
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', 'disabled'],
        default: '>'
      },
      {
        name: '損益率',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'profit_loss_amount',
    name: 'ポジション損益額',
    description: 'ポジションの損益額(円)に基づく条件判定',
    category: 'position',
    parameters: [
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', 'disabled'],
        default: '>'
      },
      {
        name: '損益額',
        type: 'number',
        default: 0
      }
    ]
  },
  // 価格データ指標
  {
    id: 'price',
    name: '価格条件',
    description: '始値・終値・高値・安値による条件判定',
    category: 'price',
    parameters: [
      { 
        name: '価格タイプ',
        type: 'select',
        options: ['open', 'close', 'high', 'low', 'adjustmentClose', 'vwap'],
        default: 'close'
      },
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '価格',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'price_comparison',
    name: '価格比較',
    description: '2つの価格タイプを比較',
    category: 'price',
    parameters: [
      { 
        name: '価格タイプ1',
        type: 'select',
        options: ['open', 'close', 'high', 'low', 'adjustmentClose', 'vwap'],
        default: 'close'
      },
      {
        name: '時間参照1',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間1',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      { 
        name: '価格タイプ2',
        type: 'select',
        options: ['open', 'close', 'high', 'low', 'adjustmentClose', 'vwap'],
        default: 'close'
      },
      {
        name: '時間参照2',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間2',
        type: 'number',
        default: 0
      }
    ]
  },
  // 出来高・流動性データ指標
  {
    id: 'volume',
    name: '出来高',
    description: '出来高に基づく条件判定',
    category: 'volume',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '出来高',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'turnover_value',
    name: '売買代金',
    description: '売買代金に基づく条件判定',
    category: 'volume',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '売買代金',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'shares_outstanding',
    name: '発行済株式数',
    description: '発行済株式数に基づく条件判定',
    category: 'volume',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '発行済株式数',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'market_cap',
    name: '時価総額',
    description: '時価総額に基づく条件判定',
    category: 'volume',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '時価総額',
        type: 'number',
        default: 0
      }
    ]
  },
  
  // ファンダメンタル指標
  {
    id: 'per',
    name: 'PER (株価収益率)',
    description: 'PERに基づく条件判定',
    category: 'fundamental',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '<'
      },
      {
        name: 'PER',
        type: 'number',
        default: 20
      }
    ]
  },
  {
    id: 'pbr',
    name: 'PBR (株価純資産倍率)',
    description: 'PBRに基づく条件判定',
    category: 'fundamental',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '<'
      },
      {
        name: 'PBR',
        type: 'number',
        default: 1
      }
    ]
  },
  {
    id: 'dividend_yield',
    name: '配当利回り',
    description: '配当利回りに基づく条件判定',
    category: 'fundamental',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '配当利回り',
        type: 'number',
        default: 2
      }
    ]
  },
  {
    id: 'eps',
    name: 'EPS (1株あたり利益)',
    description: 'EPSに基づく条件判定',
    category: 'fundamental',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: 'EPS',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'bps',
    name: 'BPS (1株あたり純資産)',
    description: 'BPSに基づく条件判定',
    category: 'fundamental',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: 'BPS',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'roe',
    name: 'ROE (自己資本利益率)',
    description: 'ROEに基づく条件判定',
    category: 'fundamental',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: 'ROE',
        type: 'number',
        default: 10
      }
    ]
  },
  {
    id: 'roa',
    name: 'ROA (総資産利益率)',
    description: 'ROAに基づく条件判定',
    category: 'fundamental',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: 'ROA',
        type: 'number',
        default: 5
      }
    ]
  },
  {
    id: 'equity_ratio',
    name: '自己資本比率',
    description: '自己資本比率に基づく条件判定',
    category: 'fundamental',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '自己資本比率',
        type: 'number',
        default: 40
      }
    ]
  },
  
  // 財務データ指標
  {
    id: 'revenue',
    name: '売上高',
    description: '売上高に基づく条件判定',
    category: 'financial',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '売上高',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'operating_income',
    name: '営業利益',
    description: '営業利益に基づく条件判定',
    category: 'financial',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '営業利益',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'ordinary_income',
    name: '経常利益',
    description: '経常利益に基づく条件判定',
    category: 'financial',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '経常利益',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'net_income',
    name: '純利益',
    description: '純利益に基づく条件判定',
    category: 'financial',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '純利益',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'total_assets',
    name: '総資産',
    description: '総資産に基づく条件判定',
    category: 'financial',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '総資産',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'net_assets',
    name: '純資産',
    description: '純資産に基づく条件判定',
    category: 'financial',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '純資産',
        type: 'number',
        default: 0
      }
    ]
  },
  {
    id: 'cash_flow',
    name: 'キャッシュフロー',
    description: 'キャッシュフローに基づく条件判定',
    category: 'financial',
    parameters: [
      {
        name: '時間参照',
        type: 'select',
        options: ['current', 'days', 'weeks', 'months', 'quarters', 'years'],
        default: 'current'
      },
      {
        name: '参照期間',
        type: 'number',
        default: 0
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: 'キャッシュフロー',
        type: 'number',
        default: 0
      }
    ]
  },
  
  // 企業・市場情報指標
  {
    id: 'market',
    name: '市場区分',
    description: '市場区分に基づく条件判定',
    category: 'company',
    parameters: [
      {
        name: '条件',
        type: 'select',
        options: ['==', '!='],
        default: '=='
      },
      {
        name: '市場区分',
        type: 'select',
        options: ['プライム', 'スタンダード', 'グロース', 'JASDAQ', 'マザーズ', '東証1部', '東証2部'],
        default: 'プライム'
      }
    ]
  },
  {
    id: 'industry',
    name: '業種',
    description: '業種に基づく条件判定',
    category: 'company',
    parameters: [
      {
        name: '条件',
        type: 'select',
        options: ['==', '!='],
        default: '=='
      },
      {
        name: '業種',
        type: 'string',
        default: ''
      }
    ]
  },
  {
    id: 'sector',
    name: 'セクター',
    description: 'セクターに基づく条件判定',
    category: 'company',
    parameters: [
      {
        name: '条件',
        type: 'select',
        options: ['==', '!='],
        default: '=='
      },
      {
        name: 'セクター',
        type: 'string',
        default: ''
      }
    ]
  },
  
  // テクニカル指標
  {
    id: 'ma',
    name: '移動平均線 (MA)',
    description: 'トレンドを判断するための指標',
    category: 'technical',
    defaultPeriod: 20,
    parameters: [
      { 
        name: 'タイプ',
        type: 'select',
        options: ['SMA', 'EMA'],
        default: 'SMA'
      },
      {
        name: '価格タイプ',
        type: 'select',
        options: ['open', 'close', 'high', 'low', 'adjustmentClose', 'vwap'],
        default: 'close'
      },
      {
        name: '条件',
        type: 'select',
        options: ['>', '<', '>=', '<=', '==', '!='],
        default: '>'
      },
      {
        name: '比較対象',
        type: 'select',
        options: ['price', 'ma'],
        default: 'price'
      },
      {
        name: '比較対象期間',
        type: 'number',
        default: 5
      }
    ]
  },
  {
    id: 'rsi',
    name: 'RSI (相対力指数)',
    description: '買われ過ぎ・売られ過ぎを判断',
    category: 'technical',
    defaultPeriod: 14,
    parameters: [
      {
        name: '買われ過ぎ閾値',
        type: 'number',
        default: 70
      },
      {
        name: '売られ過ぎ閾値',
        type: 'number',
        default: 30
      }
    ]
  },
  {
    id: 'bollinger',
    name: 'ボリンジャーバンド',
    description: '価格変動の範囲を表示',
    category: 'technical',
    defaultPeriod: 20,
    parameters: [{ name: '標準偏差', type: 'number', default: 2 }]
  },
  {
    id: 'macd',
    name: 'MACD',
    description: 'トレンドとモメンタムを判断',
    category: 'technical',
    defaultPeriod: 12,
    parameters: [
      { name: '長期期間', type: 'number', default: 26 },
      { name: 'シグナル期間', type: 'number', default: 9 }
    ]
  }
];
