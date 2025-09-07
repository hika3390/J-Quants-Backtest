'use client';

import { useState, useCallback } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { FormSection } from '../common/FormComponents';
import BasicSettings, { BasicSettingsData } from './BasicSettings';
import FundSettings, { FundSettingsData } from './FundSettings';
import { TabType, ConditionGroup } from '../../types/backtest';
import ConditionGroupForm from './ConditionGroupForm';

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
  const [conditions, setConditions] = useState<Partial<Record<TabType, ConditionGroup>>>({
    buy: {
      operator: 'AND',
      conditions: [{
        indicator: 'rsi',
        period: 14,
        params: { overboughtThreshold: 70, oversoldThreshold: 30 }
      }]
    },
    sell: {
      operator: 'AND',
      conditions: [{
        indicator: 'rsi',
        period: 14,
        params: { overboughtThreshold: 70, oversoldThreshold: 30 }
      }]
    },
    tp: {
      operator: 'AND',
      conditions: [{
        indicator: 'profit_loss_percent',
        period: 1,
        params: { operator: '>', targetValue: 10 }  // デフォルトで10%の利確
      }]
    },
    sl: {
      operator: 'AND',
      conditions: [{
        indicator: 'profit_loss_percent',
        period: 1,
        params: { operator: '<', targetValue: -10 }  // デフォルトで-10%の損切り
      }]
    }
  });

  // useCallbackを使用して関数をメモ化
  const handleBuyConditionChange = useCallback((group: ConditionGroup) => {
    setConditions(prev => ({
      ...prev,
      buy: group
    }));
  }, []);

  const handleSellConditionChange = useCallback((group: ConditionGroup) => {
    setConditions(prev => ({
      ...prev,
      sell: group
    }));
  }, []);

  const handleTpConditionChange = useCallback((group: ConditionGroup) => {
    setConditions(prev => ({
      ...prev,
      tp: group
    }));
  }, []);

  const handleSlConditionChange = useCallback((group: ConditionGroup) => {
    setConditions(prev => ({
      ...prev,
      sl: group
    }));
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState({
    buy: false,
    sell: false,
    tp: true,
    sl: true
  });

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBacktest = async () => {
    if (!basicSettings.code || !basicSettings.startDate || !basicSettings.endDate) {
      setError('銘柄と期間を選択してください');
      return;
    }

    if (!conditions.buy || !conditions.sell || !conditions.tp || !conditions.sl) {
      setError('すべての取引条件を設定してください');
      return;
    }

    // 損切り・利確設定の論理検証
    const slCondition = conditions.sl.conditions.find(c => c.indicator.includes('profit_loss'));
    const tpCondition = conditions.tp.conditions.find(c => c.indicator.includes('profit_loss'));
    
    if (slCondition && slCondition.params.operator !== 'disabled') {
      const slOperator = slCondition.params.operator as string;
      const slValue = Number(slCondition.params.targetValue);
      
      // 損切り設定の論理チェック
      if ((slOperator === '>' && slValue < 0) || (slOperator === '>=' && slValue < 0)) {
        setError('損切り設定が不正です。負の損益率に対して「より大きい」条件は使用できません。「より小さい」を選択してください。');
        return;
      }
    }

    if (tpCondition && tpCondition.params.operator !== 'disabled') {
      const tpOperator = tpCondition.params.operator as string;
      const tpValue = Number(tpCondition.params.targetValue);
      
      // 利確設定の論理チェック
      if ((tpOperator === '<' && tpValue > 0) || (tpOperator === '<=' && tpValue > 0)) {
        setError('利確設定が不正です。正の損益率に対して「より小さい」条件は使用できません。「より大きい」を選択してください。');
        return;
      }
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

      // /api/backtest/run で既にデータベースに保存されているので、
      // 追加のstore呼び出しは不要
      router.push(`/results/${result.id}`);
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">買い条件</h3>
              <button
                onClick={() => toggleSection('buy')}
                className="p-1 hover:bg-slate-600 rounded-full transition-colors"
                aria-label={collapsedSections.buy ? "展開" : "折りたたむ"}
              >
                {collapsedSections.buy ? (
                  <ChevronDownIcon className="w-5 h-5" />
                ) : (
                  <ChevronUpIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className={`transition-all duration-200 ease-in-out ${
              collapsedSections.buy ? 'h-0 opacity-0 overflow-hidden' : 'opacity-100'
            }`}>
              <ConditionGroupForm
                type="buy"
                value={conditions.buy!}
                onChange={handleBuyConditionChange}
                otherConditions={{ sell: conditions.sell?.conditions }}
              />
            </div>
          </div>

          <div className="bg-slate-700/50 rounded p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">売り条件</h3>
              <button
                onClick={() => toggleSection('sell')}
                className="p-1 hover:bg-slate-600 rounded-full transition-colors"
                aria-label={collapsedSections.sell ? "展開" : "折りたたむ"}
              >
                {collapsedSections.sell ? (
                  <ChevronDownIcon className="w-5 h-5" />
                ) : (
                  <ChevronUpIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className={`transition-all duration-200 ease-in-out ${
              collapsedSections.sell ? 'h-0 opacity-0 overflow-hidden' : 'opacity-100'
            }`}>
              <ConditionGroupForm
                type="sell"
                value={conditions.sell!}
                onChange={handleSellConditionChange}
                otherConditions={{ buy: conditions.buy?.conditions }}
              />
            </div>
          </div>

          <div className="bg-slate-700/50 rounded p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">利確条件</h3>
              <button
                onClick={() => toggleSection('tp')}
                className="p-1 hover:bg-slate-600 rounded-full transition-colors"
                aria-label={collapsedSections.tp ? "展開" : "折りたたむ"}
              >
                {collapsedSections.tp ? (
                  <ChevronDownIcon className="w-5 h-5" />
                ) : (
                  <ChevronUpIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className={`transition-all duration-200 ease-in-out ${
              collapsedSections.tp ? 'h-0 opacity-0 overflow-hidden' : 'opacity-100'
            }`}>
              <ConditionGroupForm
                type="tp"
                value={conditions.tp!}
                onChange={handleTpConditionChange}
              />
            </div>
          </div>

          <div className="bg-slate-700/50 rounded p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">損切り条件</h3>
              <button
                onClick={() => toggleSection('sl')}
                className="p-1 hover:bg-slate-600 rounded-full transition-colors"
                aria-label={collapsedSections.sl ? "展開" : "折りたたむ"}
              >
                {collapsedSections.sl ? (
                  <ChevronDownIcon className="w-5 h-5" />
                ) : (
                  <ChevronUpIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className={`transition-all duration-200 ease-in-out ${
              collapsedSections.sl ? 'h-0 opacity-0 overflow-hidden' : 'opacity-100'
            }`}>
              <ConditionGroupForm
                type="sl"
                value={conditions.sl!}
                onChange={handleSlConditionChange}
              />
            </div>
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
          {isLoading ? 'データ取得中...' : '🚀 バックテストを実行'}
        </button>
      </div>
    </div>
  );
}
