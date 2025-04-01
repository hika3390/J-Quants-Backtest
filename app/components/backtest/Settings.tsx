'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormSection } from '../common/FormComponents';
import BasicSettings, { BasicSettingsData } from './BasicSettings';
import FundSettings, { FundSettingsData } from './FundSettings';
import ConditionForm from './ConditionForm';
import { TabType, Condition } from '../../types/backtest';

export default function BacktestSettings() {
  const router = useRouter();
  const [basicSettings, setBasicSettings] = useState<BasicSettingsData>({
    code: '',
    startDate: '',
    endDate: '',
  });
  const [fundSettings, setFundSettings] = useState<FundSettingsData>({
    initialCash: 1000000,
    maxPosition: 100
  });
  const [conditions, setConditions] = useState<Partial<Record<TabType, Condition>>>({
    buy: {
      indicator: 'rsi',
      period: 14,
      params: { overboughtThreshold: 70, oversoldThreshold: 30 }
    },
    sell: {
      indicator: 'rsi',
      period: 14,
      params: { overboughtThreshold: 70, oversoldThreshold: 30 }
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBacktest = async () => {
    if (!basicSettings.code || !basicSettings.startDate || !basicSettings.endDate) {
      setError('銘柄と期間を選択してください');
      return;
    }

    if (!conditions.buy || !conditions.sell) {
      setError('買い条件と売り条件を設定してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 株価データを取得
      const priceResponse = await fetch(
        `/api/stock/${basicSettings.code}?from=${basicSettings.startDate}&to=${basicSettings.endDate}`
      );

      if (!priceResponse.ok) {
        throw new Error('株価データの取得に失敗しました');
      }

      const priceData = await priceResponse.json();

      // バックテストを実行
      const response = await fetch('/api/backtest/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...basicSettings,
          ...fundSettings,
          conditions,
          priceData: priceData.data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'バックテストの実行に失敗しました');
      }

      const result = await response.json();

      // 結果を一時保存
      const storeResponse = await fetch('/api/backtest/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      if (!storeResponse.ok) {
        throw new Error('バックテスト結果の保存に失敗しました');
      }

      const { id } = await storeResponse.json();
      router.push(`/results/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {error && (
        <div className="flex items-center justify-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-[fadeIn_0.2s_ease-out]">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white-500/90 font-medium">
            {error}
          </span>
        </div>
      )}

      <FormSection title="基本設定">
        <BasicSettings onChange={setBasicSettings} />
      </FormSection>

      <FormSection title="資金・ポジション設定">
        <FundSettings onChange={setFundSettings} />
      </FormSection>

      <FormSection title="インジケーター設定">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-700/50 rounded p-4">
            <h3 className="text-lg font-medium mb-4">買い条件</h3>
            <ConditionForm 
              type="buy"
              currentValue={conditions.buy}
              onChange={(condition) => {
                if (condition) {
                  setConditions(prev => ({
                    ...prev,
                    buy: condition
                  }));
                }
              }}
            />
          </div>
          <div className="bg-slate-700/50 rounded p-4">
            <h3 className="text-lg font-medium mb-4">売り条件</h3>
            <ConditionForm 
              type="sell"
              currentValue={conditions.sell}
              onChange={(condition) => {
                if (condition) {
                  setConditions(prev => ({
                    ...prev,
                    sell: condition
                  }));
                }
              }}
            />
          </div>
        </div>
      </FormSection>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={handleBacktest}
          disabled={isLoading}
          className="h-10 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'データ取得中...' : 'バックテストを実行'}
        </button>
      </div>
    </div>
  );
}
