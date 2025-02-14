'use client';

import { useState, memo } from 'react';

// 型定義
type TabType = 'buy' | 'sell' | 'tp' | 'sl';

interface IndicatorType {
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

// 定数
const indicators: IndicatorType[] = [
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

// 共通のフォームコンポーネント
const FormField = memo(({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-slate-300">{label}</label>
    {children}
  </div>
));

FormField.displayName = 'FormField';

const FormSection = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-slate-800/50 rounded-lg p-6">
    <h2 className="text-lg font-medium text-slate-200 mb-4">{title}</h2>
    {children}
  </section>
));

FormSection.displayName = 'FormSection';

// タブボタンコンポーネント
const TabButton = memo(({ tab, isActive, onClick }: { tab: TabType; isActive: boolean; onClick: () => void }) => {
  const labels = {
    buy: '買い条件',
    sell: '売り条件',
    tp: '利確条件',
    sl: '損切り条件'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 h-10 rounded text-sm font-medium transition-colors ${
        isActive ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {labels[tab]}
    </button>
  );
});

TabButton.displayName = 'TabButton';

// 基本設定フォーム
const BasicSettings = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormField label="開始日">
      <input
        type="date"
        className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
      />
    </FormField>
    <FormField label="終了日">
      <input
        type="date"
        className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
      />
    </FormField>
    <FormField label="銘柄">
      <select className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500">
        <option value="" className="bg-slate-800">選択してください</option>
        <option value="USDJPY" className="bg-slate-800">USD/JPY</option>
        <option value="EURJPY" className="bg-slate-800">EUR/JPY</option>
        <option value="GBPJPY" className="bg-slate-800">GBP/JPY</option>
      </select>
    </FormField>
  </div>
));

BasicSettings.displayName = 'BasicSettings';

// 資金設定フォーム
const FundSettings = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormField label="初期資金">
      <input
        type="number"
        placeholder="例: 1000000"
        className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
      />
    </FormField>
    <FormField label="最大保有銘柄数">
      <input
        type="number"
        placeholder="例: 5"
        className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
      />
    </FormField>
    <FormField label="レバレッジ">
      <input
        type="number"
        placeholder="例: 1"
        className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
      />
    </FormField>
  </div>
));

FundSettings.displayName = 'FundSettings';

// 条件設定フォーム
const ConditionForm = memo(({}: { type: TabType }) => {
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const indicator = indicators.find(ind => ind.id === selectedIndicator);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="インジケーター">
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
          >
            <option value="" className="bg-slate-800">選択してください</option>
            {indicators.map(ind => (
              <option key={ind.id} value={ind.id} className="bg-slate-800">
                {ind.name}
              </option>
            ))}
          </select>
        </FormField>
        {selectedIndicator && (
          <>
            <FormField label="期間">
              <input
                type="number"
                defaultValue={indicator?.defaultPeriod}
                className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
              />
            </FormField>
            <FormField label="条件">
              <select className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500">
                <option value="" className="bg-slate-800">選択してください</option>
                {indicator?.parameters?.map(param => (
                  <option key={param.name} value={param.name} className="bg-slate-800">
                    {param.name}
                  </option>
                ))}
              </select>
            </FormField>
          </>
        )}
      </div>
    </div>
  );
});

ConditionForm.displayName = 'ConditionForm';

// メインコンポーネント
export default function BacktestSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('buy');

  return (
    <div className="space-y-6">
      <FormSection title="基本設定">
        <BasicSettings />
      </FormSection>

      <FormSection title="資金・ポジション設定">
        <FundSettings />
      </FormSection>

      <FormSection title="条件式の設定">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['buy', 'sell', 'tp', 'sl'] as const).map((tab) => (
              <TabButton
                key={tab}
                tab={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
          <div className="bg-slate-700/50 rounded p-4">
            <ConditionForm type={activeTab} />
          </div>
        </div>
      </FormSection>

      <div className="text-center pt-4">
        <button
          type="button"
          className="h-10 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
        >
          バックテストを実行
        </button>
      </div>
    </div>
  );
}
