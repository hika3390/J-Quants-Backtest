"use client";

import React, { useState, ReactElement } from 'react';

type TabType = 'buy' | 'sell' | 'tp' | 'sl';

interface FormSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

interface TabButtonProps {
  tab: TabType;
  isActive: boolean;
  onClick: () => void;
}

interface ConditionFormProps {
  type: TabType;
}

interface Indicator {
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

const indicators: Indicator[] = [
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
    parameters: [
      {
        name: '標準偏差',
        type: 'number',
        default: 2
      }
    ]
  },
  {
    id: 'macd',
    name: 'MACD',
    description: 'トレンドとモメンタムを判断',
    defaultPeriod: 12,
    parameters: [
      {
        name: '長期期間',
        type: 'number',
        default: 26
      },
      {
        name: 'シグナル期間',
        type: 'number',
        default: 9
      }
    ]
  },
  {
    id: 'ema',
    name: '指数移動平均（EMA）',
    description: 'トレンドの方向を判断',
    defaultPeriod: 12
  },
  {
    id: 'sma',
    name: '単純移動平均（SMA）',
    description: 'トレンドの方向を判断',
    defaultPeriod: 12
  }
];

const formStyles = {
  section: "bg-white/5 rounded-xl p-8 border border-white/10",
  heading: "text-2xl font-bold mb-6 flex items-center space-x-3",
  headingText: "text-white",
  input: "w-full border border-white/20 bg-white/5 p-3 rounded-lg text-white focus:border-purple-500",
  label: "block mb-2 font-medium text-gray-300",
  select: "w-full border border-white/20 bg-white/5 p-3 rounded-lg text-white focus:border-purple-500 appearance-none cursor-pointer",
  tooltip: "absolute z-50 hidden group-hover:block bg-gray-800 text-sm text-white p-2 rounded shadow-lg max-w-xs"
};

const icons = {
  basic: "📊",
  fund: "💰",
  condition: "⚙️",
  buy: "💰",
  sell: "💱",
  tp: "🎯",
  sl: "🛑"
};

const FormSection = React.memo(({ title, icon, children }: FormSectionProps) => (
  <section className={formStyles.section}>
    <h2 className={formStyles.heading}>
      <span>{icon}</span>
      <span className={formStyles.headingText}>{title}</span>
    </h2>
    {children}
  </section>
));

FormSection.displayName = 'FormSection';

const ConditionForm = React.memo(({ type }: ConditionFormProps) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const indicator = indicators.find(ind => ind.id === selectedIndicator);

  const titles = {
    buy: '買い条件の設定',
    sell: '売り条件の設定',
    tp: '利確条件の設定',
    sl: '損切り条件の設定'
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-white">{titles[type as keyof typeof titles]}</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative">
            <label className={formStyles.label}>インジケーター</label>
            <select 
              className={formStyles.select}
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
            >
              <option value="" className="bg-gray-900">--選択してください--</option>
              {indicators.map(ind => (
                <option key={ind.id} value={ind.id} className="bg-gray-900">
                  {ind.name}
                </option>
              ))}
            </select>
            {indicator && (
              <div className={formStyles.tooltip}>
                {indicator.description}
              </div>
            )}
          </div>
          <div>
            <label className={formStyles.label}>期間</label>
            <input 
              type="number" 
              placeholder={indicator ? `例: ${indicator.defaultPeriod}` : "期間を入力"}
              defaultValue={indicator?.defaultPeriod}
              className={formStyles.input}
            />
          </div>
          <div>
            <label className={formStyles.label}>条件</label>
            <select className={formStyles.select}>
              <option value="" className="bg-gray-900">--選択してください--</option>
              {indicator?.id === 'rsi' && (
                <>
                  <option value="oversold" className="bg-gray-900">30以下（売られ過ぎ）</option>
                  <option value="overbought" className="bg-gray-900">70以上（買われ過ぎ）</option>
                </>
              )}
              {(indicator?.id === 'sma' || indicator?.id === 'ema') && (
                <>
                  <option value="crossover" className="bg-gray-900">ゴールデンクロス（上向き）</option>
                  <option value="crossunder" className="bg-gray-900">デッドクロス（下向き）</option>
                </>
              )}
            </select>
          </div>
        </div>
        {indicator?.parameters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {indicator.parameters.map(param => (
              <div key={param.name}>
                <label className={formStyles.label}>{param.name}</label>
                <input 
                  type={param.type === 'number' ? 'number' : 'text'}
                  placeholder={`例: ${param.default}`}
                  defaultValue={param.default}
                  className={formStyles.input}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

ConditionForm.displayName = 'ConditionForm';

const TabButton = React.memo(({ tab, isActive, onClick }: TabButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-6 py-3 rounded-lg flex items-center space-x-2 ${
      isActive 
        ? 'bg-purple-500 text-white' 
        : 'bg-white/5 text-gray-300'
    }`}
  >
    <span>{icons[tab]}</span>
    <span>
      {tab === 'buy' && '買い条件'}
      {tab === 'sell' && '売り条件'}
      {tab === 'tp' && '利確条件'}
      {tab === 'sl' && '損切り条件'}
    </span>
  </button>
));

TabButton.displayName = 'TabButton';

const BasicSettingsForm = React.memo(() => (
  <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <label className={formStyles.label}>開始日</label>
      <input 
        type="date" 
        className={formStyles.input}
        placeholder="開始日を選択"
      />
    </div>
    <div>
      <label className={formStyles.label}>終了日</label>
      <input 
        type="date" 
        className={formStyles.input}
        placeholder="終了日を選択"
      />
    </div>
    <div>
      <label className={formStyles.label}>銘柄</label>
      <select className={formStyles.select}>
        <option value="" className="text-gray-400 bg-gray-900">--選択してください--</option>
        <option value="AAPL" className="text-white bg-gray-900">AAPL</option>
        <option value="GOOGL" className="text-white bg-gray-900">GOOGL</option>
        <option value="AMZN" className="text-white bg-gray-900">AMZN</option>
      </select>
    </div>
  </form>
));

const FundSettingsForm = React.memo(() => (
  <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <label className={formStyles.label}>初期資金</label>
      <input 
        type="number" 
        placeholder="例: 1000000" 
        className={formStyles.input}
      />
    </div>
    <div>
      <label className={formStyles.label}>最大保有銘柄数</label>
      <input 
        type="number" 
        placeholder="例: 5" 
        className={formStyles.input}
      />
    </div>
    <div>
      <label className={formStyles.label}>レバレッジ</label>
      <input 
        type="number" 
        placeholder="例: 1" 
        className={formStyles.input}
      />
    </div>
  </form>
));

BasicSettingsForm.displayName = 'BasicSettingsForm';
FundSettingsForm.displayName = 'FundSettingsForm';

export default function BacktestSettings(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('buy');

  return (
    <div className="space-y-8">
      <FormSection title="基本設定" icon={icons.basic}>
        <BasicSettingsForm />
      </FormSection>

      <FormSection title="資金・ポジション設定" icon={icons.fund}>
        <FundSettingsForm />
      </FormSection>

      <FormSection title="条件式の設定" icon={icons.condition}>
        <div>
          <div className="flex flex-wrap gap-4 mb-6">
            {(['buy', 'sell', 'tp', 'sl'] as const).map((tab) => (
              <TabButton
                key={tab}
                tab={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ConditionForm type={activeTab} />
          </div>
        </div>
      </FormSection>

      <div className="text-center">
        <button
          type="button"
          className="px-12 py-4 bg-purple-500 text-white font-bold rounded-xl"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>🚀</span>
            <span>バックテストを実行する</span>
          </span>
        </button>
      </div>
    </div>
  );
}
