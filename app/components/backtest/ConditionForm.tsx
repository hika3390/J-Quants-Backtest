'use client';

import { memo, useState } from 'react';
import { FormField } from '../common/FormComponents';
import { TabType } from '../../types/backtest';
import { indicators, indicatorCategories } from '@/app/constants/indicators';
import RSISettings, { RSISettingsData } from './RSISettings';
import MASettings, { MASettingsData } from './MASettings';
import PriceSettings, { PriceSettingsData } from './PriceSettings';
import ProfitLossSettings from './ProfitLossSettings';
import PriceDataSettings from './PriceDataSettings';
import CompanyInfoSettings from './CompanyInfoSettings';

interface Condition {
  indicator: string;
  period: number;
  params: Record<string, number | string>;
}

interface ConditionFormProps {
  type: TabType;
  currentValue?: Condition;
  onChange: (condition: Condition | null) => void;
}

const ConditionForm = memo(({ type, currentValue, onChange }: ConditionFormProps) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>(
    currentValue?.indicator || (type === 'tp' || type === 'sl' ? 'profit_loss_percent' : 'rsi')
  );

  // インジケーター選択が変更されたときの処理
  const handleIndicatorChange = (indicatorId: string) => {
    setSelectedIndicator(indicatorId);
    // デフォルト値で新しい条件を作成
    const indicator = indicators.find(i => i.id === indicatorId);
    if (indicator) {
      const defaultCondition: Condition = {
        indicator: indicatorId,
        period: indicator.defaultPeriod || 1,
        params: {}
      };
      onChange(defaultCondition);
    }
  };

  // RSI設定が変更されたときの処理
  const handleRSIChange = (settings: RSISettingsData) => {
    const condition: Condition = {
      indicator: 'rsi',
      period: settings.period,
      params: {
        'overboughtThreshold': settings.overboughtThreshold,
        'oversoldThreshold': settings.oversoldThreshold
      }
    };
    onChange(condition);
  };

  // MA設定が変更されたときの処理
  const handleMAChange = (settings: MASettingsData) => {
    const condition: Condition = {
      indicator: 'ma',
      period: settings.period,
      params: {
        'type': settings.type
      }
    };
    onChange(condition);
  };

  // 価格設定が変更されたときの処理
  const handlePriceChange = (settings: PriceSettingsData) => {
    const condition: Condition = {
      indicator: 'price',
      period: 1,
      params: {
        'priceType': settings.priceType,
        'operator': settings.operator,
        'targetValue': settings.targetValue
      }
    };
    onChange(condition);
  };

  return (
    <div className="space-y-4">
      <FormField label="インジケーター">
        <select
          value={selectedIndicator}
          onChange={(e) => handleIndicatorChange(e.target.value)}
          className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
        >
          {/* 利確/損切り条件の場合のみポジション管理カテゴリを表示 */}
          {(type === 'tp' || type === 'sl') && (
            <optgroup label="ポジション管理">
              {indicators
                .filter(indicator => indicator.category === 'position')
                .map((indicator) => (
                  <option key={indicator.id} value={indicator.id}>
                    {indicator.name}
                  </option>
                ))}
            </optgroup>
          )}

          {/* カテゴリごとにインジケーターをグループ化（ポジション管理カテゴリは除外） */}
          {indicatorCategories
            .filter(category => category.id !== 'position') // ポジション管理カテゴリは上部で別途表示するため除外
            .map(category => {
              const categoryIndicators = indicators.filter(
                indicator => indicator.category === category.id
              );
              
              if (categoryIndicators.length === 0) return null;
              
              return (
                <optgroup key={category.id} label={category.name}>
                  {categoryIndicators.map(indicator => (
                    <option key={indicator.id} value={indicator.id}>
                      {indicator.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}
        </select>
      </FormField>

      {selectedIndicator === 'rsi' && (
        <RSISettings
          onChange={handleRSIChange}
        />
      )}

      {selectedIndicator === 'ma' && (
        <MASettings
          onChange={handleMAChange}
        />
      )}

      {selectedIndicator === 'price' && (
        <PriceSettings
          onChange={handlePriceChange}
        />
      )}

      {selectedIndicator === 'profit_loss_percent' && (
        <ProfitLossSettings
          type="percent"
          onChange={(settings) => {
            const condition: Condition = {
              indicator: 'profit_loss_percent',
              period: 1,
              params: {
                operator: settings.operator,
                targetValue: settings.targetValue
              }
            };
            onChange(condition);
          }}
        />
      )}

      {selectedIndicator === 'profit_loss_amount' && (
        <ProfitLossSettings
          type="amount"
          onChange={(settings) => {
            const condition: Condition = {
              indicator: 'profit_loss_amount',
              period: 1,
              params: {
                operator: settings.operator,
                targetValue: settings.targetValue
              }
            };
            onChange(condition);
          }}
        />
      )}

      {/* 価格データ関連のインジケーター */}
      {['price_comparison', 'volume', 'turnover_value', 'market_cap', 
        'per', 'pbr', 'dividend_yield', 'eps', 'bps', 'roe', 'roa', 'equity_ratio',
        'revenue', 'operating_income', 'ordinary_income', 'net_income', 
        'total_assets', 'net_assets', 'cash_flow'].includes(selectedIndicator) && (
        <PriceDataSettings
          indicatorId={selectedIndicator}
          onChange={(settings) => {
            const condition: Condition = {
              indicator: selectedIndicator,
              period: 1,
              params: {
                priceType: settings.priceType,
                timeReference: settings.timeReference,
                refPeriod: settings.refPeriod,
                operator: settings.operator,
                targetValue: settings.targetValue
              }
            };
            onChange(condition);
          }}
        />
      )}

      {/* 企業・市場情報関連のインジケーター */}
      {['market', 'industry', 'sector'].includes(selectedIndicator) && (
        <CompanyInfoSettings
          indicatorId={selectedIndicator}
          onChange={(settings) => {
            const condition: Condition = {
              indicator: selectedIndicator,
              period: 1,
              params: {
                operator: settings.operator,
                targetValue: settings.targetValue
              }
            };
            onChange(condition);
          }}
        />
      )}
    </div>
  );
});

ConditionForm.displayName = 'ConditionForm';

export default ConditionForm;
